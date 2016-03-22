(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["./arcGisRestApiUtils", "./LrsGPParameters"], factory);
    } else {
        // Browser globals
        root.LrsGP = factory(root.arcGisRestApiUtils, root.LrsGPParameters);
    }
}(this, function (arcGisRestApiUtils, LrsGPParameters) {
    /**
     * A module for calling the LRS geoprocessing service.
     * @module LrsGP
     */

    /**
     * @external GPResult
     * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/GP_Result/02r3000000q7000000/|GP Result}
     */

    /**
     * @external FeatureSet
     * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/FeatureSet_object/02r3000002mn000000/|FeatureSet object}
     */

    /**
     * Executes a synchronous GP tool.
     * @param {string} url - The URL to execute the GP tool.
     * @returns {Promise.<external:FeatureSet>} A promise with the results of the GP tool.
     */
    function execute(url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("get", url);
            request.onloadend = function () {
                if (this.status !== 200) {
                    reject({ status: this.status, statusText: this.statusText });
                    return;
                }

                var response = JSON.parse(this.response);
                if (response.error) {
                    reject(response);
                } else {
                    resolve(response.results[0].value);
                }
            };
            request.send();
        });
    }

    /**
     * @constructor
     * @alias module:LrsGP
     * @param {Object} options - Constructor options.
     * @param {string} options.url - The URL of the linear referencing GP service.
     * @param {Boolean} [options.async=false] - Specifies that the GP service is asynchronous.
     * @param {string} [options.pointTaskName="Points to Route Events"] - Name of the task that converts points to route events.
     * @param {string} [options.linesTaskName="Points to Route Segments"] - Name of the task that converts polylines to route events.
     * @example http://example.com/arcgis/rest/services/OptionalFolderLevel/LinearReferencing/GPServer
     */
    function LrsGP(options) {
        if (!options) {
            throw new TypeError("No options were provided.");
        } else if (!options.url) {
            throw new TypeError("No url option was provided.");
        }
        // Set the url variable and trim trailing
        var url = options.url.replace(/\/$/, "");
        var pointTaskName = options.pointTaskName || "Points to Route Events";
        var linesTaskName = options.linesTaskName || "Points to Route Segments";
        var async = options.async || false;

        // TODO: Implement Async support.
        if (async) {
            throw new Error("Async support has not been implemented yet.");
        }

        Object.defineProperties(this, {
            url: {
                value: url
            },
            pointTaskUrl: {
                get: function () {
                    return [url, pointTaskName, async ? "submitJob" : "execute"].join("/");
                }
            },
            linesTaskUrl: {
                get: function () {
                    return [url, linesTaskName, async ? "submitJob" : "execute"].join("/");
                }
            }
        });
    }

    /**
     * Locates points along routes.
     * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
     * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
     */
    LrsGP.prototype.pointsToRouteEvents = function (lrsGpParams) {
        var url = this.pointTaskUrl;
        url += "?" + lrsGpParams.toUrlSearch();
        return execute(url);
    };

    /**
     * Locates line segments along routes.
     * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
     * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
     */
    LrsGP.prototype.pointsToRouteSegments = function (lrsGpParams) {
        var url = this.linesTaskUrl;
        url += "?" + lrsGpParams.toUrlSearch();
        return execute(url);
    };

    return LrsGP;

}));