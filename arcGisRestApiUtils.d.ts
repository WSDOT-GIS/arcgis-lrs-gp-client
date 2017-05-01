import { esriGeometryType, FeatureSet, Geometry } from "arcgis-rest-api";

export type UnprefixedGeometryType = "Point" | "Multipoint" | "Polyline" | "Polygon" | "Envelope";

/**
 * A module with ArcGIS REST API utility functions.
 * @exports arcGisRestApiUtils
 */
// tslint:disable-next-line:class-name
export class arcGisRestApiUtils {
    /**
     * Gets the type of the geometry based on its properties.
     * @param geometry - a geometry.
     * @param [useEsriPrefix=false] - If true, the output name will be prefixed with "esri".
     * E.g., "point" vs. "esriPoint".
     * @returns The type of geometry: point, multipoint, polyline, polygon, or envelope.
     */
    public static getGeometryType(geometry: Geometry, useEsriPrefix?: boolean):
        esriGeometryType | UnprefixedGeometryType;

    /**
     * Creates a feature set using the specified geometry
     * @param  geometries - Geometries
     * @param [spatialReference] - Defines the spatial reference for the feature set. Unneeded if the geometries have
     * spatialReference properties defined.
     * @returns a feature set
     */
    public static createFeatureSet(geometries: Geometry[], spatialReference: number): FeatureSet;

    /**
     * Gets the geometry type of a {@link external:FeatureSet}.
     * @param {external:FeatureSet} featureSet - A feature set.
     * @returns {string} A string with an "esri"-prefixed geometry type name.
     * @throws {Error} Throws an error if there is neither a geometryType property
     * on the featureSet object nor any features with geometry.
     */
    public static getFeatureSetGeometryType(featureSet: FeatureSet): esriGeometryType;
}
