import { Feature, FeatureSet, Point, Polyline } from "arcgis-rest-api";
import { LrsGPParameters } from "./LrsGPParameters";

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

export class LrsGP {
    public url: string;
    public pointTaskUrl: string;
    public linesTaskUrl: string;
    constructor(options: ILrsGPOptions);

    /**
     * Locates points along routes.
     * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
     * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
     */
    public pointsToRouteEvents(lrsGpParams: LrsGPParameters): Promise<IRoutePointFeatureSet>;
    /**
     * Locates line segments along routes.
     * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
     * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
     */
    public pointsToRouteSegments(lrsGpParams: LrsGPParameters): Promise<IRouteSegmentFeatureSet>;
}
