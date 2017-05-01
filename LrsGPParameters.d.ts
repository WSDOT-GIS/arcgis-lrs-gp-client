import { FeatureSet } from "arcgis-rest-api";
import { LinearUnit } from "./LinearUnit";

// tslint:disable:variable-name
// Property names need to match those expected by service. Ignore linting complaints
// tslint:disable:max-line-length


export type CalculatedAngleType = "NORMAL" | "TANGENT";


export interface ILrsGPParametersCommon {
    Input_Features: FeatureSet;
    Route_Features?: string;
    Search_Radius?: LinearUnit;
    Keep_only_the_closest_route_location?: boolean;
    Include_distance_field_on_output_table?: boolean;
    Use_M_Direction_Offsetting?: boolean;
    Generate_an_angle_field?: boolean;
    Calculated_Angle_Type?: CalculatedAngleType;
    Write_the_complement_of_the_angle_to_the_angle_field?: boolean;
    returnM?: boolean;
    returnZ?: boolean;
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
export interface ILrsGPConstructorOptions extends ILrsGPParametersCommon {
    env_outSR?: number;
    env_processSR?: number;
}

/**
 * A module defining parameters object for the LRS geoprocessing service.
 * @module LrsGPParameters
 */

/**
 * Creates a new object that specifies parameters for {@link module:LrsGP}. For any properties that are not set or are
 *  set to null, the geoprocessing service will use its predefined defaults.
 * @class
 * @alias module:LrsGPParameters
 * @param {LrsGPConstructorOptions} options - Options used to initialize property values.
 * @see {@link http://desktop.arcgis.com/en/arcmap/latest/tools/linear-ref-toolbox/locate-features-along-routes.htm Locate Features Along Routes}
 * @see {@link http://desktop.arcgis.com/en/arcmap/latest/tools/linear-ref-toolbox/make-route-event-layer.htm Make Route Event Layer}
 */
export class LrsGPParameters implements ILrsGPParametersCommon {
    public Input_Features: FeatureSet;
    public Route_Features: string;
    public Search_Radius: LinearUnit;
    public Keep_only_the_closest_route_location: boolean;
    public Include_distance_field_on_output_table: boolean;
    public Use_M_Direction_Offsetting: boolean;
    public Generate_an_angle_field: boolean;
    public Calculated_Angle_Type: CalculatedAngleType;
    public Write_the_complement_of_the_angle_to_the_angle_field: boolean;
    public returnM: boolean;
    public returnZ: boolean;
    public "env:outSR": number;
    public "env:processSR": number;
    constructor(options: ILrsGPConstructorOptions)
    public toJSON(): string;
    public toUrlSearch(): string;
}
