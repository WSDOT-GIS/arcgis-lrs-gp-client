/// <reference path="arcgisServer.d.ts" />

declare module "arcGisRestApiUtils" {

    type UnprefixedGeometryType = "Point" | "Multipoint" | "Polyline" | "Polygon" | "Envelope"

    /**
     * A module with ArcGIS REST API utility functions.
     * @exports arcGisRestApiUtils
     */
    class arcGisRestApiUtils {
        /**
         * Gets the type of the geometry based on its properties.
         * @param {external:Geometry} geometry - a geometry.
         * @param {Boolean} [useEsriPrefix=false] - If true, the output name will be prefixed with "esri". E.g., "point" vs. "esriPoint".
         * @returns {string} The type of geometry: point, multipoint, polyline, polygon, or envelope.
         */
        static getGeometryType(geometry: arcgisServer.Geometry, useEsriPrefix?: boolean): arcgisServer.GeometryType | UnprefixedGeometryType;

        /**
         * Creates a feature set using the specified geometry
         * @param {external:Geometry[]} geometries - Geometries
         * @param {(external:SpatialReference|number)} [spatialReference] - Defines the spatial reference for the feature set. Unneeded if the geometries have spatialReference properties defined.
         * @returns {external:FeatureSet} a feature set
         */
        static createFeatureSet(geometries: arcgisServer.Geometry[], spatialReference: number): arcgisServer.FeatureSet;

        /**
         * Gets the geometry type of a {@link external:FeatureSet}.
         * @param {external:FeatureSet} featureSet - A feature set.
         * @returns {string} A string with an "esri"-prefixed geometry type name.
         * @throws {Error} Throws an error if there is neither a geometryType property
         * on the featureSet object nor any features with geometry.
         */
        static getFeatureSetGeometryType(featureSet: arcgisServer.FeatureSet): arcgisServer.GeometryType;
    }

    export = arcGisRestApiUtils;
}

declare module "EventTableProperties" {

    type EventType = "POINT" | "LINE";

    /**
     * @alias module:EventTableProperties
     * @param {string} [routeIdField] - route ID field.
     * @param {string} [eventType="POINT"] - Valid values are "POINT" and "LINE".
     * @param {string} [fromMeasureField] - from measure field. Defaults to "MEAS" if event type is "POINT", "FMEAS" if event type is "LINE".
     * @param {?string} [toMeasureField] - to measure field. Defaults to null if event type is "POINT", "TMEAS" if event type is "LINE".
     * @constructor
     */
    class EventTableProperties {
        constructor(routeIdField?: string, eventType?: EventType, fromMeasureField?: string, toMeasureField?: string);
        /**
         * @member {string} - The name of the field in the route layer that uniquely identifies a route.
         */
        routeIdField: string;
        /**
         * @member {string} - Valid values are 'POINT' and 'LINE'.
         */
        eventType: EventType;
        /**
         * @member {string} - The name of the "from" measure field.
         */
        fromMeasureField: string;
        /**
         * @member {string} - The name of the "to" measure field. Only used when {@link module:EventTableProperties~eventType} is "LINE".
         */
        toMeasureField: string;

        /**
         * Returns a string representation of the EventTableProperties.
         * @returns {string} string representation of EventTableProperties.
         * @example
         * var etp = new EventTableProperties("RID", "POINT", "MEAS");
         * var s = etp.toString(); // s === "RID POINT MEAS"
         */
        toString(): string;

        /**
         * This function will return the string representation of this object
         * when serialized to JSON.
         * @returns {string} Returns the string representation of the EventTableProperties.
         * @see {@link module:EventTableProperties#toString}
         */
        toJSON(): string;
    }

    export = EventTableProperties
}

declare module "LinearUnit" {

    type UnitValue =
        "esriFeet" |
        "esriCentimeters" |
        "esriDecimalDegrees" |
        "esriDecimeters" |
        "esriInches" |
        "esriKilometers" |
        "esriMeters" |
        "esriMiles" |
        "esriMillimeters" |
        "esriNauticalMiles" |
        "esriPoints" |
        "esriUnknown" |
        "esriYards";

    class LinearUnit {
        constructor(distance?: number, units?: UnitValue);
        distance: number;
        units: UnitValue;
    }

    export = LinearUnit
}

declare module "LrsGP" {

    import LrsGPParameters = require("LrsGPParameters");

    // execute(url: string): Promise<arcgisServer.FeatureSet>
    interface LrsGPOptions {
        url: string;
        async?: boolean;
        pointTaskName?: string;
        linesTaskName?: string
    }

    class LrsGP {
        constructor(options: LrsGPOptions);
        url: string;
        pointTaskUrl: string;
        linesTaskUrl: string;

        /**
         * Locates points along routes.
         * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
         * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
         */
        pointsToRouteEvents(lrsGpParams: LrsGPParameters): Promise<arcgisServer.FeatureSet>
        /**
         * Locates line segments along routes.
         * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
         * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
         */
        pointsToRouteSegments(lrsGpParams: LrsGPParameters): Promise<arcgisServer.FeatureSet>
    }

    export = LrsGP;
}

declare module "LrsGPParameters" {

    type CalculatedAngleType = "NORMAL" | "TANGENT"

    import LinearUnit = require("LinearUnit");

    interface _LrsGPParametersCommon {
        Input_Features: arcgisServer.FeatureSet,
        Route_Features?: string,
        Search_Radius?: LinearUnit
        Keep_only_the_closest_route_location?: Boolean
        Include_distance_field_on_output_table?: Boolean
        Use_M_Direction_Offsetting?: Boolean
        Generate_an_angle_field?: Boolean
        Calculated_Angle_Type?: CalculatedAngleType
        Write_the_complement_of_the_angle_to_the_angle_field?: Boolean
        returnM?: Boolean
        returnZ?: Boolean
    }

    /**
     * LrsGP contstructor options
     * @typedef {Object} LrsGPConstructorOptions
     * @property {external:FeatureSet} Input_Features - Input_Features
     * @property {?string} Route_Features - Route_Features
     * @property {?module:LinearUnit} Search_Radius - Search_Radius
     * @property {?Boolean} Keep_only_the_closest_route_location - Keep_only_the_closest_route_location
     * @property {?Boolean} Include_distance_field_on_output_table - Include_distance_field_on_output_table
     * @property {?Boolean} Use_M_Direction_Offsetting - Use_M_Direction_Offsetting
     * @property {?Boolean} Generate_an_angle_field - Generate_an_angle_field
     * @property {?string} Calculated_Angle_Type - Calculated Angle Type. Valid values are "NORMAL" and "TANGENT".
     * @property {?Boolean} Write_the_complement_of_the_angle_to_the_angle_field - Write_the_complement_of_the_angle_to_the_angle_field
     * @property {?number} env_outSR - env:outSR
     * @property {?number} env_processSR - env:processSR
     * @property {?Boolean} returnM - returnM
     * @property {?Boolean} returnZ - returnZ
     */
    interface LrsGPConstructorOptions extends _LrsGPParametersCommon {
        env_outSR?: number
        env_processSR?: number
    }

    /**
     * A module defining parameters object for the LRS geoprocessing service.
     * @module LrsGPParameters
     */


    /**
     * Creates a new object that specifies parameters for {@link module:LrsGP}. For any properties that are not set or are set to null, the geoprocessing service will use its predefined defaults.
     * @class
     * @alias module:LrsGPParameters
     * @param {LrsGPConstructorOptions} options - Options used to initialize property values.
     * @see {@link http://desktop.arcgis.com/en/arcmap/latest/tools/linear-ref-toolbox/locate-features-along-routes.htm Locate Features Along Routes}
     * @see {@link http://desktop.arcgis.com/en/arcmap/latest/tools/linear-ref-toolbox/make-route-event-layer.htm Make Route Event Layer}
     */
    class LrsGPParameters implements _LrsGPParametersCommon {
        constructor(options: LrsGPConstructorOptions)
        Input_Features: arcgisServer.FeatureSet
        Route_Features: string
        Search_Radius: LinearUnit
        Keep_only_the_closest_route_location: Boolean
        Include_distance_field_on_output_table: Boolean
        Use_M_Direction_Offsetting: Boolean
        Generate_an_angle_field: Boolean
        Calculated_Angle_Type: CalculatedAngleType
        Write_the_complement_of_the_angle_to_the_angle_field: Boolean
        returnM: Boolean
        returnZ: Boolean
        "env:outSR": number
        "env:processSR": number
        toJSON(): string;
        toUrlSearch(): string;
    }

    export = LrsGPParameters
}

declare module "objectUtils" {
    class objectUtils {
        /**
         * Checks to see if an object contains ALL of the specified named properties.
         * @param {Object} o - An object
         * @param {...string} names - Property names
         * @returns {Boolean} Returns true if the object has properties for each of the names, false otherwise.
         */
        static hasAllProperties(o: Object, ...names: string[]): boolean;
        /**
         * Checks to see if an object contains at least one of the specified named properties.
         * @param {Object} o - An object
         * @param {...string} names - Property names
         * @returns {Boolean} Returns true if the object has properties for one of the names, false otherwise.
         */
        static hasAnyProperties(o: Object, ...names: string[]): boolean;
        /**
         * Converts an object into a URL search string (AKA query string).
         * @param {Object} o - An object.
         * @param {Boolean} [omitNulls=false] - If true, null values will be omitted from the output.
         * @returns {string} A URL query string.
         */
        static toUrlSearch(o: Object, omitNulls: boolean): string;
    }

    export = objectUtils
}