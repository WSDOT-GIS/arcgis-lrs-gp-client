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
    "esri/toolbars/draw",
    "LrsGP/arcGisRestApiUtils",
    "LrsGP/LrsGPParameters",
    "dojo/text!./webmap/data.json",
    "dojo/text!./webmap/description.json"
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
    Draw,
    arcGisRestApiUtils,
    LrsGPParameters,
    webmapData,
    webmapDesc
) {
    "use strict";

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

    // TODO: Update to production URL once the service has been pushed to production.
    var lrsGPUrl = "http://hqolymgis98d:6080/arcgis/rest/services/Shared/LinearReferencing/GPServer/";

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
    ["www.wsdot.wa.gov", "data.wsdot.wa.gov", "hqolymgis98d"].forEach(function (server) {
        esriConfig.defaults.io.corsEnabledServers.push(server);
    });

    // Parse the JSON web map description.
    webmapData = JSON.parse(webmapData);
    webmapDesc = JSON.parse(webmapDesc);

    /**
     * Returns a boolean value indicating if the drawing tools should be enabled or disabled.
     * Sets a class on the body: either in-range or out-of-range.
     * @returns {Boolean} Returns true if route layers are visible at the current map scale, false otherwise
     */
    function anySnapLayersVisibleAtCurrentScale() {
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

    /**
     * Queries all of the layers that are used for snapping for the specified geometry.
     * @param {esri/geometry/Geometry} geometry - A geometry that the user has drawn. This will be in the same SR as the map.
     * @param {esri/layer/FeatureLayer[]} snapLayers - An array of feature layers.
     * @returns {dojo/promises/Promise} - The results of {@see dojo/promises/all} on
     * multiple feature layer queries. The result will be an object with properties
     * matching the layers' names (or ids if names aren't available).
     */
    function querySnapLayers(geometry, snapLayers) {
        var promises = [];
        if (!(snapLayers && snapLayers.length)) {
            throw new TypeError("snapLayers must be an array with more than one object");
        }
        snapLayers.forEach(function (layer) {
            var query;
            if (layer.visibleAtMapScale) {
                query = new Query();
                query.geometry = geometry;
                ////query.spatialRelationship = /multipoint/i.test(geometry.type) ? Query.SPATIAL_REL_CROSSES : Query.SPATIAL_REL_INTERSECTS;
                promises.push(layer.queryFeatures(query));
            }
            layer.on("visibility-change", anySnapLayersVisibleAtCurrentScale);
        });
        //return Promise.all(promises);
        return new Promise(function (resolve, reject) {
            all(promises).then(function (queryResults) {
                var features = [];
                for (var i = 0; i < queryResults.length; i++) {
                    features = features.concat(queryResults[i].features);
                }
                resolve(features);
            }, function (err) {
                reject(err);
            });
        });

    }

    var pointCount = 0;
    var pointLimit = 0;

    var snapLayers = [];

    arcgisUtils.createMap({
        item: webmapDesc,
        itemData: webmapData
    }, "map").then(function (response) {
        var map = response.map;
        anySnapLayersVisibleAtCurrentScale();
        map.on("extent-change", anySnapLayersVisibleAtCurrentScale);

        // Get the layers that will be "snapped" to.
        map.graphicsLayerIds.forEach(function (layerId) {
            var layer = map.getLayer(layerId);
            var re = /(WAPR)/i;
            if (re.test(layer.url)) {
                snapLayers.push(layer);
            }
            layer.setAutoGeneralize(false);
        });

        // Setup symbology for layers.
        // TODO: Use different symbols for points the user just drew and
        // ones that have been located along the route using GP tool.
        var pointSymbol = new SimpleMarkerSymbol();
        pointSymbol.setColor("#00ffff");
        var lineSymbol = new SimpleLineSymbol();
        lineSymbol.setWidth(4);
        lineSymbol.setColor("#00ffff");
        var pointRenderer = new SimpleRenderer(pointSymbol);
        var lineRenderer = new SimpleRenderer(lineSymbol);
        var linesLayer, pointsLayer;

        var drawToolbar = new Draw(map);

        (function () {
            var infoTemplate = new InfoTemplate("", "${*}");
            linesLayer = new GraphicsLayer({ id: "lines" });
            linesLayer.setInfoTemplate(infoTemplate);
            linesLayer.setRenderer(lineRenderer);
            pointsLayer = new GraphicsLayer({ id: "points" });
            pointsLayer.setRenderer(pointRenderer);
            pointsLayer.setInfoTemplate(infoTemplate);
        }());



        map.addLayers(snapLayers);

        map.addLayers([pointsLayer, linesLayer]);

        map.enableSnapping({
            alwaysSnap: true,
            layerInfos: snapLayers.map(function (layer) {
                return {
                    layer: layer,
                    snapToEdge: layer.geometryType === "esriGeometryPolyline" || layer.geometryType === "esriGeometryPolygon",
                    snapToPoint: layer.geometryType === "esriGeometryPoint",
                    snapToVertex: false
                };
            })
        });

        /**
         * @typedef {Event} DrawCompleteEvent
         * @property {Geometry} geometry - geometry
         * @property {Geometry} geographicGeometry - geometry in WGS84 (only available if map is WGS84 or Web Mercator Aux. Sphere)
         * @property {Draw} target - The Draw toolbar that generated the event
         */

        /**
         *
         * @param {DrawCompleteEvent} e - draw event information.
         */
        drawToolbar.on("draw-complete", function (e) {
            pointCount++;

            var geometry = e.geometry;
            var graphic = new Graphic(geometry, null, { temp: true });
            var drawnPoints;

            pointsLayer.add(graphic);

            if (pointCount >= pointLimit) {
                e.target.deactivate();

                // Get the temp drawn points
                var tempPointGraphics = pointsLayer.graphics.filter(function (g) {
                    return g.attributes.temp;
                });


                if (tempPointGraphics.length > 1) {
                    // Combine the two drawn points into a multipoint.

                    geometry = new Multipoint(geometry.spatialReference);
                    tempPointGraphics.forEach(function (g) {
                        geometry.addPoint(g.geometry);
                        var output = g.geometry;
                        pointsLayer.remove(g);
                    });
                } // else, there clicked point just drawn will remain the geometry.

                querySnapLayers(geometry, snapLayers.filter(function (layer) {
                    return layer.visible;
                })).then(function (routeFeatures) {

                    console.debug("route features", routeFeatures);

                    /**
                     * Runs the LRS GP feature.
                     * @param {(esri/geometry/Point|esri/geometry/Polyline)} tempPointGraphics - A point or a polyline.
                     * @param {string} route - Route ID.
                     * @returns {Promise} - A promise. Result feature set from LRS GP service.
                     */
                    function runGP(tempPointGraphics, route) {

                        return new Promise(function (resolve, reject) {
                            // TODO: Route is currently unused. It will be passed to GP tool once it allows filtering the routes that are searched.
                            var gpParams = new LrsGPParameters({
                                Input_Features: arcGisRestApiUtils.createFeatureSet(tempPointGraphics.map(function (g) {
                                    return g.geometry;
                                })),
                                Search_Radius: { distance: 50, units: "esriFeet" },
                                // By default, the features will be returned as 2927.
                                // Specify that they should be returned in the map's spatial reference instead.
                                "env:outSR": 3857
                            });
                            var worker = new Worker("../LrsGPWorker.js");
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
                                task: tempPointGraphics.length > 1 ? "Points to Route Segments" : "Points to Route Events",
                                gpParameters: gpParams
                            });
                        });
                    }

                    var gpComplete = function (e) {
                        var layer;
                        console.debug("GP Message FeatureSet", e);
                        var resultGraphic;
                        if (e.length === 1) {
                            resultGraphic = new Graphic(e[0]);
                            resultGraphic.geometry.setSpatialReference(map.spatialReference);
                            layer = resultGraphic.geometry.paths ? linesLayer : pointsLayer;
                            console.log("result graphic", resultGraphic);
                            if (layer === pointsLayer) {
                                pointsLayer.remove(graphic);
                            }
                            layer.add(resultGraphic);
                        } else if (e.length > 1) {
                            alert("More than one match was found.");
                        } else {
                            alert("No matches found.");
                        }
                    };
                    var gpFail = function (err) {
                        console.error("GP Fail", err);
                    };

                    if (routeFeatures.length === 1) {
                        runGP(tempPointGraphics, routeFeatures[0].attributes.RouteID).then(gpComplete, gpFail);
                    } else if (routeFeatures.length > 1) {
                        showRouteSelectDialog(routeFeatures).then(function (route) {
                            runGP(tempPointGraphics, route.attributes.RouteID).then(gpComplete, gpFail);
                        });
                    } else {
                        alert("No matching routes were returned.");
                        pointsLayer.remove(graphic);
                    }
                });
            }
        });

        function activateDraw(e) {
            var button = e.currentTarget;
            drawToolbar.activate("point");
            // Reset the point count.
            pointCount = 0;
            // Set the point limit to either 1 or 2
            // depending on which button was clicked.
            pointLimit = button.value;
        }

        Array.from(document.getElementById("toolbar").querySelectorAll("button"), function (button) {
            button.addEventListener("click", activateDraw, true);
        });
    });
});