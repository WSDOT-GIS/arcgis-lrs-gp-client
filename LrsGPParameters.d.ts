import { FeatureSet } from "arcgis-rest-api";
import { CalculatedAngleType, ILrsGPConstructorOptions, ILrsGPParametersCommon } from "./index";
import LinearUnit = require("./LinearUnit");

// tslint:disable:variable-name
// Property names need to match those expected by service. Ignore linting complaints
// tslint:disable:max-line-length

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
declare class LrsGPParameters implements ILrsGPParametersCommon {
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

export = LrsGPParameters;
