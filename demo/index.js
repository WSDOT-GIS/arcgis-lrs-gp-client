require([
    "dojo/promise/all",
    "esri/config",
    "esri/arcgis/utils",
    "esri/geometry/Multipoint",
    "esri/graphic",
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/query",
    "esri/toolbars/draw",
    "LrsGP",
    "dojo/text!./webmap/data.json",
    "dojo/text!./webmap/description.json"
], function (
    all,
    esriConfig,
    arcgisUtils,
    Multipoint,
    Graphic,
    Map,
    FeatureLayer,
    GraphicsLayer,
    SimpleRenderer,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    Query,
    Draw,
    LrsGP,
    webmapData,
    webmapDesc
) {
    "use strict";

    // Setup route select dialog.
    (function () {
        var routeSelectButton = document.getElementById("routeSelectButton");
        routeSelectButton.addEventListener("click", function () {
            var dialog = document.getElementById("dialog");
            var select = dialog.querySelector("select");
            dialog.dataset.selectedRouteIndex = select.value;
        });
    }());

    function showRouteSelectDialog(routeFeatures) {
        return new Promise(function (resolve, reject) {
            var dialog = document.getElementById("dialog");
            delete dialog.dataset.selectedRoute;
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
            var modal = $(dialog).modal('show');
            var routeIndex = dialog.dataset.selectedRouteIndex;
            var selectedRoute = routeFeatures[routeIndex];
            resolve(selectedRoute);
        });
    }


    // Add WSDOT servers to those that are known to support CORS.
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

        var pointSymbol = new SimpleMarkerSymbol();
        pointSymbol.setColor("#00ffff");
        var lineSymbol = new SimpleLineSymbol();
        lineSymbol.setWidth(4);
        lineSymbol.setColor("#00ffff");
        var pointRenderer = new SimpleRenderer(pointSymbol);
        var lineRenderer = new SimpleRenderer(lineSymbol);
        var linesLayer, pointsLayer;

        var drawToolbar = new Draw(map);

        linesLayer = new GraphicsLayer({ id: "lines" });
        linesLayer.setRenderer(lineRenderer);
        pointsLayer = new GraphicsLayer({ id: "points" });
        pointsLayer.setRenderer(pointRenderer);
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
                    tempPointGraphics.forEach(function (pg) {
                        geometry.addPoint(pg.geometry);
                        pointsLayer.remove(pg);
                    });
                } // else, there clicked point just drawn will remain the geometry.
                console.debug("geometry", geometry);

                querySnapLayers(geometry, snapLayers).then(function (routeFeatures) {
                    console.debug("feature query results", {
                        drawnGeometry: e.geometry,
                        drawnGeometryGeographic: e.geographicGeometry,
                        matchingRoutes: routeFeatures
                    });

                    if (routeFeatures.length === 1) {
                        console.debug("only one route matched drawn feature", routeFeatures[0]);
                    } else if (routeFeatures.length > 1) {
                        showRouteSelectDialog(routeFeatures).then(function (route) {
                            console.debug("selected route", route);
                        });
                    } else {
                        alert("No matching routes were returned.");
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