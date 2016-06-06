/// <reference path="./typings/globals/es6-promise/index.d.ts" />
/// <reference path="./arcGisRestApiUtils.d.ts" />
/// <reference path="./LrsGPParameters.d.ts" />

// execute(url: string): Promise<arcgisServer.FeatureSet>

interface LrsGPOptions {
    url: string;
    async?: boolean;
    pointTaskName?: string;
    linesTaskName?: string
}

interface LrsGP {
    constructor(options:LrsGPOptions);
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