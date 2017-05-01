import { FeatureSet } from "arcgis-rest-api";
import { LrsGPParameters } from "./LrsGPParameters";

export interface ILrsGPOptions {
    url: string;
    async?: boolean;
    pointTaskName?: string;
    linesTaskName?: string;
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
    public pointsToRouteEvents(lrsGpParams: LrsGPParameters): Promise<FeatureSet>;
    /**
     * Locates line segments along routes.
     * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
     * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
     */
    public pointsToRouteSegments(lrsGpParams: LrsGPParameters): Promise<FeatureSet>;
}
