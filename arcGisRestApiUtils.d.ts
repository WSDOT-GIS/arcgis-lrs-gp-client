/// <reference path="arcgisServer.d.ts" />

type UnprefixedGeometryType = "Point" | "Multipoint" | "Polyline" | "Polygon" | "Envelope"

/**
 * A module with ArcGIS REST API utility functions.
 * @exports arcGisRestApiUtils
 */
interface arcGisRestApiUtils {
    /**
     * Gets the type of the geometry based on its properties.
     * @param {external:Geometry} geometry - a geometry.
     * @param {Boolean} [useEsriPrefix=false] - If true, the output name will be prefixed with "esri". E.g., "point" vs. "esriPoint".
     * @returns {string} The type of geometry: point, multipoint, polyline, polygon, or envelope.
     */
    getGeometryType(geometry:arcgisServer.Geometry, useEsriPrefix?:boolean): arcgisServer.GeometryType | UnprefixedGeometryType;

    /**
     * Creates a feature set using the specified geometry
     * @param {external:Geometry[]} geometries - Geometries
     * @param {(external:SpatialReference|number)} [spatialReference] - Defines the spatial reference for the feature set. Unneeded if the geometries have spatialReference properties defined.
     * @returns {external:FeatureSet} a feature set
     */
    createFeatureSet(geometries:arcgisServer.Geometry[], spatialReference:number): arcgisServer.FeatureSet

    /**
     * Gets the geometry type of a {@link external:FeatureSet}.
     * @param {external:FeatureSet} featureSet - A feature set.
     * @returns {string} A string with an "esri"-prefixed geometry type name.
     * @throws {Error} Throws an error if there is neither a geometryType property
     * on the featureSet object nor any features with geometry.
     */
    getFeatureSetGeometryType(featureSet:arcgisServer.FeatureSet): arcgisServer.GeometryType
}