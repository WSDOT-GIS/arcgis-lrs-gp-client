define([
    "dojo/_base/declare",
    "dojo/promise/all",
    "esri/graphic",
    "esri/geometry/Multipoint",
    "esri/tasks/query",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/InfoTemplate",
    "esri/toolbars/draw"
], function (
    declare,
    all,
    Graphic,
    Multipoint,
    Query,
    GraphicsLayer,
    SimpleMarkerSymbol,
    SimpleRenderer,
    InfoTemplate,
    Draw
) {

    /**
     * Extension of {@link external:Draw}
     * @module RouteDraw
     */

    /**
     * Queries all of the layers that are used for snapping for the specified geometry.
     * @param {esri/geometry/Geometry} geometry - A geometry that the user has drawn. This will be in the same SR as the map.
     * @param {esri/layer/FeatureLayer[]} snapLayers - An array of feature layers.
     * @returns {Promise.<external:Graphic[]>} - The results of multiple feature layer queries.
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

    /**
     * @class
     * @augments {external:Draw}
     * @alias module:RouteDraw
     */
    return declare(Draw, {
        snapLayers: [],
        _pointLimit: 0,
        _pointCount: 0,
        /**
         * @member {external:GraphicsLayer} - Point graphics layer.
         */
        pointsLayer: null,
        /**
         * Activates the toolbar to draw route points.
         * @param {Object} options - Draw toolbar options
         * @see {external:esri/toolbars/draw}
         */
        activatePointDraw: function (options) {
            this._pointLimit = 1;
            this._pointCount = 0;
            this.activate(Draw.POINT, options);
        },
        /**
         * Activates the toolbar to draw a route segment.
         * @param {Object} options - Draw toolbar options
         * @see {external:esri/toolbars/draw}
         */
        activateLineDraw: function (options) {
            this._pointLimit = 2;
            this._pointCount = 0;
            this.activate(Draw.POINT, options);
        },
        /**
         * Queries all of the layers that are used for snapping for the specified geometry.
         * @param {esri/geometry/Geometry} geometry - A geometry that the user has drawn. This will be in the same SR as the map.
         * @returns {Promise.<external:Graphic[]>} - The results of multiple feature layer queries.
         */
        querySnapLayers: function (geometry) {
            var layers = this.snapLayers.filter(function (layer) {
                return layer.visible;
            });
            return querySnapLayers(geometry, layers);
        },
        /**
         * @constructs RouteDraw
         * @param {external:esri/Map} map - Map object.
         * @param {Object} options - Options object.
         * @param {(external:GraphicsLayer[]|string[])} routeLayers - An array of either graphics layers or their IDs.
         */
        constructor: function (map, options) {
            var self = this;

            if (!(options.routeLayers && Array.isArray(options.routeLayers))) {
                throw new Error("No route layers were provided. routeLayers options must have at least on element.");
            }

            // Setup the snap layers.
            self.snapLayers = options.routeLayers.map(function (item) {
                if (typeof item === "string") {
                    item = map.getLayer(item);
                    if (!item) {
                        throw new Error("Invalid layer ID");
                    }
                }

                if (item.isInstanceOf && item.isInstanceOf(GraphicsLayer)) {
                    item.setAutoGeneralize(false);
                    return item;
                } else {
                    throw new TypeError("Invalid route layer.");
                }
            });

            // Enable snapping on map using snap layers.
            map.enableSnapping({
                alwaysSnap: true,
                layerInfos: self.snapLayers.map(function (layer) {
                    return {
                        layer: layer,
                        snapToEdge: layer.geometryType === "esriGeometryPolyline" || layer.geometryType === "esriGeometryPolygon",
                        snapToPoint: layer.geometryType === "esriGeometryPoint",
                        snapToVertex: false
                    };
                })
            });

            this.pointsLayer = new GraphicsLayer({
                id: "route-draw-points"
            });

            (function () {
                // Setup symbology for layers.
                // TODO: allow parameter options for custom renderer and/or info template.
                var pointSymbol = new SimpleMarkerSymbol();
                pointSymbol.setColor("#00ffff");
                var pointRenderer = new SimpleRenderer(pointSymbol);
                var infoTemplate = new InfoTemplate("", "${*}");

                self.pointsLayer.setRenderer(pointRenderer);
                self.pointsLayer.setInfoTemplate(infoTemplate);
            }());

            map.addLayer(self.pointsLayer);

            this.on("draw-complete", function (e) {
                var geometry = e.geometry;
                var pointGraphics;

                self.pointsLayer.add(new Graphic(geometry));
                self._pointCount++;

                if (self._pointCount >= self._pointLimit) {
                    self.deactivate();
                    // Put the points from the layer into a new array.
                    pointGraphics = self.pointsLayer.graphics.map(function (g) {
                        return g;
                    });

                    self.pointsLayer.clear();

                    if (pointGraphics.length > 1) {
                        // Combine the two drawn points into a multipoint.

                        geometry = new Multipoint(geometry.spatialReference);
                        pointGraphics.forEach(function (g) {
                            geometry.addPoint(g.geometry);
                        });
                    } // else, there clicked point just drawn will remain the geometry.

                    self.emit("geometry-drawn", {
                        geometry: geometry
                    });

                    self.querySnapLayers(geometry).then(function (graphics) {
                        self.emit("route-query-complete", {
                            routeFeatures: graphics,
                            pointGraphics: pointGraphics,
                            queryGeometry: geometry
                        });
                    }, function (error) {
                        self.emit("route-query-error", {
                            queryGeometry: geometry,
                            pointGraphics: pointGraphics,
                            error: error
                        });
                    });
                }


            });
        }
    });
});