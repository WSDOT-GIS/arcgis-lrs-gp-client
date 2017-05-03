import { Feature, FeatureSet, Point, Polyline } from "arcgis-rest-api";
import LinearUnit = require("./LinearUnit");

export type UnprefixedGeometryType = "Point" | "Multipoint" | "Polyline" | "Polygon" | "Envelope";
export type EventType = "POINT" | "LINE";
export interface IUnitValueTypes {
    FEET: "esriFeet";
    CENTIMETERS: "esriCentimeters";
    DECIMAL_DEGREES: "esriDecimalDegrees";
    DECIMETERS: "esriDecimeters";
    INCHES: "esriInches";
    KILOMETERS: "esriKilometers";
    METERS: "esriMeters";
    MILES: "esriMiles";
    MILLIMETERS: "esriMillimeters";
    NAUTICAL_MILES: "esriNauticalMiles";
    POINTS: "esriPoints";
    UNKNOWN: "esriUnknown";
    YARDS: "esriYards";
}

export type UnitValue =
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

export interface ILrsGPOptions {
    url: string;
    async?: boolean;
    pointTaskName?: string;
    linesTaskName?: string;
}

export interface IRoutePointFeatureAttributes {
    OBJECTID: string;
    RouteId: string;
    Measure: number;
    Distance: number;
    INPUTOID: number;
    LOC_ANGLE: number;
}

export interface IRouteSegmentFeatureAttributes {
    OBJECTID: string;
    RouteID: string;
    Measure: string;
    Distance: number;
    INPUTOID: number;
    PairID: number;
    IsStart: number;
    EndRouteId: number;
    EndMeasure: number;
    EndDistance: number;
    End_InputOID: number;
    PairID_1: number;
    IsStart_1: number;
    LOC_ERROR: string;
    Shape_Length: number;
}

export interface IRoutePointFeature extends Feature {
    attributes: IRoutePointFeatureAttributes;
    geometry: Point;
}

export interface IRouteSegmentFeature extends Feature {
    attributes: IRouteSegmentFeatureAttributes;
    geometry: Polyline;
}

export interface IRoutePointFeatureSet extends FeatureSet {
    features: IRoutePointFeature[];
}

export interface IRouteSegmentFeatureSet extends FeatureSet {
    features: IRouteSegmentFeature[];
}

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
 * @property {?number} env:outSR - env:outSR
 * @property {?number} env:processSR - env:processSR
 * @property {?Boolean} returnM - returnM
 * @property {?Boolean} returnZ - returnZ
 */
export interface ILrsGPConstructorOptions extends ILrsGPParametersCommon {
    "env:outSR"?: number;
    "env:processSR"?: number;
}
