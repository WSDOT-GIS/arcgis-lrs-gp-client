import Graphic = require("esri/graphic");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Draw = require("esri/toolbars/draw");

import esri = require("esri");
import Layer = require("esri/layers/layer");
import Map = require("esri/map");
import Geometry = require("esri/geometry/Geometry");

export interface RouteDrawConstructorOptions {
    routeLayers: GraphicsLayer[] | string[]
}


export class RouteDraw extends Draw {
    snapLayers: Layer[];
    pointsLayer: GraphicsLayer
    activatePointDraw(options?: esri.DrawOptions): void;
    activateLineDraw(options?: esri.DrawOptions): void;
    querySnapLayers(geometry: Geometry): Promise<Graphic[]>;
    /**
     * @constructs RouteDraw
     * @param {external:esri/Map} map - Map object.
     * @param {Object} options - Options object.
     * @param {(external:GraphicsLayer[]|string[])} routeLayers - An array of either graphics layers or their IDs.
     */
    constructor(map: Map, options: RouteDrawConstructorOptions);
    on(type: "geometry-drawn", listener: (event: { geometry: Geometry }) => void): esri.Handle;
    on(type: "route-query-complete", listener: (event: {
        routeFeatures: Graphic[],
        pointGraphics: Graphic[],
        queryGeometry: Geometry
    }) => void): esri.Handle;
    on(type: "route-query-error", listener: (event: {
        queryGeometry: Geometry,
        pointGraphics: Graphic[],
        error: Error
    }) => void): esri.Handle;
    on(type: string, listener: (event: any) => void): esri.Handle;
}