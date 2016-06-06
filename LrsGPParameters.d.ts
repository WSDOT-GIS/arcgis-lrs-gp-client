/// <reference path="arcgisServer.d.ts" />
/// <reference path="LinearUnit.d.ts" />

type CalculatedAngleType = "NORMAL" | "TANGENT" 

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
interface LrsGPParameters extends _LrsGPParametersCommon {
    constructor(options:LrsGPConstructorOptions),
    "env:outSR"?: number
    "env:processSR"?: number
    toJSON(): string;
    toUrlSearch(): string;
}