
import { ILrsGPOptions, IRoutePointFeatureSet, IRouteSegmentFeatureSet } from "./index";
import LrsGPParameters = require("./LrsGPParameters");


declare class LrsGP {
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

export = LrsGP;
