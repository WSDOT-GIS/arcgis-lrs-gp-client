require([
    "dojo/promise/all",
    "esri/InfoTemplate",
    "esri/config",
    "esri/arcgis/utils",
    "esri/geometry/Multipoint",
    "esri/geometry/Polyline",
    "esri/graphic",
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/query",
    "LrsGP/arcGisRestApiUtils",
    "LrsGP/LrsGPParameters",
    "LrsGP/RouteDraw",
    "dojo/text!../webmap/data.json",
    "dojo/text!../webmap/description.json"
], function (
    all,
    InfoTemplate,
    esriConfig,
    arcgisUtils,
    Multipoint,
    Polyline,
    Graphic,
    Map,
    FeatureLayer,
    GraphicsLayer,
    SimpleRenderer,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    Query,
    arcGisRestApiUtils,
    LrsGPParameters,
    RouteDraw,
    webmapData,
    webmapDesc
) {
    "use strict";

    var drawToolbar;
    var loadingDialog;

    // The dialog polyfill requires a registration step.
    // Register the dialogs with the polyfill if the browser
    // does not natively support the dialog element.
    if (window.needsDialogPolyfill) {
        (function () {
            var dialogs = document.querySelectorAll('dialog');
            for (var i = 0; i < dialogs.length; i++) {
                dialogPolyfill.registerDialog(dialogs[i]);
            }
        }());
    }

    loadingDialog = document.getElementById("loadingDialog");

    // TODO: Update to production URL once the service has been pushed to production.
    var lrsGPUrl = "http://data.wsdot.wa.gov/arcgis/rest/services/Shared/LinearReferencing/GPServer/";

    /**
     * Shows the route select dialog.
     * @param {esri/Graphic[]} routeFeatures - An array of one or two point graphics.
     * @returns {Promise.<esri/Graphic>} - A promise is returned with the selected route
     * graphic once the user has made a selection.
     */
    function showRouteSelectDialog(routeFeatures) {

        return new Promise(function (resolve, reject) {
            var select = dialog.querySelector("select");
            select.innerHTML = "";
            var frag = document.createDocumentFragment();
            routeFeatures.forEach(function (feature, i) {
                var option = document.createElement("option");
                option.value = i;
                option.textContent = feature.attributes.RouteID.replace(/d$/, " (decrease)");
                frag.appendChild(option);
            });
            select.appendChild(frag);
            dialog.showModal();
            var listener = function (e) {
                var selectedRoute = routeFeatures[select.selectedIndex];
                dialog.removeEventListener("close", listener);
                resolve(selectedRoute);
            };
            dialog.addEventListener("close", listener);
        });
    }


    // Add WSDOT servers to those that are known to support CORS.
    // TODO: Remove test server once GP service is in production.
    ["www.wsdot.wa.gov", "data.wsdot.wa.gov", "hqolymgis98d", "hqolymgis98d:6080"].forEach(function (server) {
        esriConfig.defaults.io.corsEnabledServers.push(server);
    });

    // Parse the JSON web map description.
    webmapData = JSON.parse(webmapData);
    webmapDesc = JSON.parse(webmapDesc);

    /**
     * Returns a boolean value indicating if the drawing tools should be enabled or disabled.
     * Sets a class on the body: either in-range or out-of-range.
     * @param {external:esri/layers/Layer} snapLayers - Layers to check for visibility.
     * @returns {Boolean} Returns true if route layers are visible at the current map scale, false otherwise
     */
    function anyLayersVisibleAtCurrentScale(snapLayers) {
        var currentLayer;
        var inRange = false;

        for (var i = 0; i < snapLayers.length; i++) {
            currentLayer = snapLayers[i];
            if (currentLayer.visible && currentLayer.visibleAtMapScale) {
                inRange = true;
                break;
            }
        }
        var classList = document.body.classList;
        if (!inRange) {
            classList.add("out-of-range");
            classList.remove("in-range");
        } else {
            classList.add("in-range");
            classList.remove("out-of-range");
        }
        return inRange;
    }

    arcgisUtils.createMap({
        item: webmapDesc,
        itemData: webmapData
    }, "map").then(function (response) {
        var map = response.map;


        // TODO: programatically create radio buttons from layers in data.json.

        // Setup route layer radio buttons.
        (function (radioButtons) {
            function toggleRouteLayer() {
                radioButtons.forEach(function (rb) {
                    var layer = map.getLayer(rb.value);
                    layer.visible = rb.checked;
                });
            }

            // Attach the event handler.
            radioButtons.forEach(function (rb) {
                rb.addEventListener("click", toggleRouteLayer);
            });
        }(Array.from(document.getElementById("routeRadioButtons").querySelectorAll("input[type=radio]"))));

        var snapLayers = [];
        // Get the layers that will be "snapped" to.
        map.graphicsLayerIds.forEach(function (layerId) {
            var layer = map.getLayer(layerId);
            var re = /(WAPR)/i;
            if (re.test(layer.url)) {
                snapLayers.push(layer);
            }
            layer.setAutoGeneralize(false);
            layer.on("visibility-change", anyLayersVisibleAtCurrentScale);
        });

        drawToolbar = new RouteDraw(map, {
            routeLayers: snapLayers
        });

        anyLayersVisibleAtCurrentScale(snapLayers);
        map.on("extent-change", function () {
            anyLayersVisibleAtCurrentScale(snapLayers);
        });

        // Setup symbology for layers.
        // TODO: Use different symbols for points the user just drew and
        // ones that have been located along the route using GP tool.
        var pointSymbol = new SimpleMarkerSymbol();
        pointSymbol.setColor("#00ff00");
        var lineSymbol = new SimpleLineSymbol();
        lineSymbol.setWidth(4);
        lineSymbol.setColor("#00ff00");
        var pointRenderer = new SimpleRenderer(pointSymbol);
        var lineRenderer = new SimpleRenderer(lineSymbol);
        var linesLayer, pointsLayer;

        (function () {
            var infoTemplate = new InfoTemplate("", "${*}");
            linesLayer = new GraphicsLayer({ id: "lines" });
            linesLayer.setInfoTemplate(infoTemplate);
            linesLayer.setRenderer(lineRenderer);
            pointsLayer = new GraphicsLayer({ id: "points" });
            pointsLayer.setRenderer(pointRenderer);
            pointsLayer.setInfoTemplate(infoTemplate);
        }());





        drawToolbar.on("geometry-drawn", function (e) {
            console.debug("geometry-drawn", e);
        });
        drawToolbar.on("route-query-complete", function (e) {
            console.debug("route-query-complete", e);

            /**
             * Runs the LRS GP feature.
             * @param {(esri/geometry/Point|esri/geometry/Polyline)} pointGraphics - A point or a polyline.
             * @param {string} route - Route ID.
             * @returns {Promise} - A promise. Result feature set from LRS GP service.
             */
            function runGP(pointGraphics, route) {
                loadingDialog.showModal();
                return new Promise(function (resolve, reject) {
                    // TODO: Route is currently unused. It will be passed to GP tool once it allows filtering the routes that are searched.
                    var gpParams = new LrsGPParameters({
                        Input_Features: arcGisRestApiUtils.createFeatureSet(pointGraphics.map(function (g) {
                            return g.geometry;
                        })),
                        Search_Radius: { distance: 50, units: "esriFeet" },
                        // By default, the features will be returned as 2927.
                        // Specify that they should be returned in the map's spatial reference instead.
                        "env:outSR": 3857
                    });
                    var worker = new Worker("../../LrsGPWorker.js");
                    worker.onmessage = function (e) {
                        var features = e.data.features;
                        // Filter the features so that only the ones that match the "route" parameter are returned.
                        features = features.filter(function (feature) {
                            return feature.attributes.RouteId === route || feature.attributes.RouteID === route;
                        });
                        resolve(features);
                    };
                    worker.onerror = function (err) {
                        reject(err);
                    };
                    worker.postMessage({
                        url: lrsGPUrl,
                        task: pointGraphics.length > 1 ? "Points to Route Segments" : "Points to Route Events",
                        gpParameters: gpParams
                    });
                });
            }

            var gpComplete = function (e) {
                var layer;
                loadingDialog.close();
                console.debug("GP Message FeatureSet", e);
                var resultGraphic;
                if (e.length === 1) {
                    resultGraphic = new Graphic(e[0]);
                    resultGraphic.geometry.setSpatialReference(map.spatialReference);
                    layer = resultGraphic.geometry.paths ? linesLayer : pointsLayer;
                    layer.add(resultGraphic);
                } else if (e.length > 1) {
                    alert("More than one match was found.");
                } else {
                    alert("No matches found.");
                }
            };
            var gpFail = function (err) {
                loadingDialog.close();
                console.error("GP Fail", err);
            };

            if (e.routeFeatures.length === 1) {
                runGP(e.pointGraphics, e.routeFeatures[0].attributes.RouteID).then(gpComplete, gpFail);
            } else if (e.routeFeatures.length > 1) {
                showRouteSelectDialog(e.routeFeatures).then(function (route) {
                    runGP(e.pointGraphics, route.attributes.RouteID).then(gpComplete, gpFail);
                });
            } else {
                alert("No matching routes were returned.");
                pointsLayer.remove(graphic);
            }
        });
        drawToolbar.on("route-query-error", function (e) {
            console.error("route-query-error", e);

        });

        map.addLayers([pointsLayer, linesLayer]);

        /**
         * Activates the drawing toolbar for drawing either points or line segments.
         * @param {Event} e - button click event.
         */
        function activateDraw(e) {
            var button = e.currentTarget;
            if (button.value === "point") {
                drawToolbar.activatePointDraw();
            } else if (button.value === "line") {
                drawToolbar.activateLineDraw();
            }
        }

        Array.from(document.getElementById("toolbar").querySelectorAll("button"), function (button) {
            button.addEventListener("click", activateDraw, true);
        });
    });
});