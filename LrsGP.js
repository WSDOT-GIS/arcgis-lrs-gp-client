(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["./arcGisRestApiUtils", "./LrsGPParameters"], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./arcGisRestApiUtils.js'), require('./LrsGPParameters.js'), require('node-fetch'));
    } else {
        // Browser globals
        root.LrsGP = factory(root.arcGisRestApiUtils, root.LrsGPParameters, root.fetch);
    }
} (this, function (arcGisRestApiUtils, LrsGPParameters, fetchFunction) {
    if (fetchFunction) {
        fetch = fetchFunction;
    }

    const DEFAULT_MAX_URL_LENGTH = 2000;

    /**
     * A module for calling the LRS geoprocessing service.
     * @module LrsGP
     */

    /**
     * Executes a synchronous GP tool.
     * @param {string} url - The URL to execute the GP tool.
     * @returns {Promise.<external:FeatureSet>} A promise with the results of the GP tool.
     */
    function execute(url, maxUrlLength) {
        maxUrlLength = maxUrlLength || DEFAULT_MAX_URL_LENGTH;
        return new Promise(function (resolve, reject) {
            var promise, options;
            if (url.length > maxUrlLength) {
                var parts = url.split("?", 2);
                promise = fetch(parts[0], {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    options: 'POST',
                    body: parts[1]
                });
            } else {
                promise = fetch(url);
            }
            promise.then(function (response) {
                if (response.ok) {
                    response.json().then(function (j) {
                        if (j.error) {
                            reject(j.error);
                        } else {
                            resolve(j.results[0].value);
                        }
                    });
                } else {
                    reject({
                        url: url,
                        status: response.status,
                        statusText: response.statusText
                    });
                }
            });
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
     * @param {number} [options.maxUrlLength=255] - Maximum URL length before switching from GET to POST.
     * @example
     * var lrs = new LrsGP({url: "http://example.com/arcgis/rest/services/OptionalFolderLevel/LinearReferencing/GPServer" });
     * @throws {TypeError} Thrown if either no options are provided or no "url" is provided within the options.
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
        var maxUrlLength = DEFAULT_MAX_URL_LENGTH;
        if (options.maxUrlLength) {
            if (typeof options.maxUrlLength === "number") {
                maxUrlLength = options.maxUrlLength;
            } else {
                throw new TypeError("maxUrlLength must be a number");
            }
        }

        // TODO: Implement Async support.
        if (async) {
            throw new Error("Async support has not been implemented yet.");
        }

        Object.defineProperties(this, {
            /**
             * @member {string} - The geoprocessing service URL.
             */
            url: {
                value: url
            },
            /**
             * @member {string} - URL for the point location task.
             */
            pointTaskUrl: {
                get: function () {
                    return [url, encodeURIComponent(pointTaskName), async ? "submitJob" : "execute"].join("/");
                }
            },
            /**
             * @member {string} - URL for the line segment location task.
             */
            linesTaskUrl: {
                get: function () {
                    return [url, encodeURIComponent(linesTaskName), async ? "submitJob" : "execute"].join("/");
                }
            },
            /**
             * @member {number} - Maximum URL length before switching from GET to POST.
             */
            maxUrlLength: {
                get: function () {
                    return maxUrlLength;
                },
                set: function (value) {
                    if (typeof value === number) {
                        maxUrlLength = value;
                    } else {
                        throw new TypeError("maxUrlLength must be a number.");
                    }
                }
            }
        });
    }

    /**
     * Locates points along routes.
     * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
     * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
     * @example
     * var inFeatures = {
     *  "geometryType": "esriGeometryPoint",
     *  "spatialReference": {
     *      "wkid": 2927
     *  },
     *  "features": [
     *    {
     *        "geometry": {
     *            "x": 1108486.9299805611,
     *            "y": 647781.35678572953
     *        }
     *    },
     *    {
     *        "geometry": {
     *            "x": 1109214.2005076408,
     *            "y": 648022.67913772166
     *        }
     *    }
     *   ]
     *  };
     *
     *  var lrsParams = new LrsGPParameters({
     *      Input_Features = inFeatures,
     *      Search_Radius = new LinearUnit(50, LinearUnit.UNIT_VALUES.FEET)
     *  });
     *  var gp = new LrsGP(new LrsGP({
     *      url: "http://example.com/arcgis/rest/services/OptionalFolderLevel/LinearReferencing/GPServer"
     *  });
     *  gp.pointsToRouteEvents(lrsParams).then(function(featureSet) {
     *      // Do something with the feature set.
     *      console.debug(featureSet);
     *  });
     */
    LrsGP.prototype.pointsToRouteEvents = function (lrsGpParams) {
        var url = this.pointTaskUrl;
        url += "?" + lrsGpParams.toUrlSearch();
        return execute(url, this.maxUrlLength);
    };

    /**
     * Locates line segments along routes.
     * @param {module:LrsGPParameters} lrsGpParams - LRS GP Parameters.
     * @returns {Promise.<external:FeatureSet>} - Returns a promise with a Feature Set.
     * @example
     * var inFeatures = {
     *  "geometryType": "esriGeometryPoint",
     *  "spatialReference": {
     *      "wkid": 2927
     *  },
     *  "features": [
     *    {
     *        "geometry": {
     *            "x": 1108486.9299805611,
     *            "y": 647781.35678572953
     *        }
     *    },
     *    {
     *        "geometry": {
     *            "x": 1109214.2005076408,
     *            "y": 648022.67913772166
     *        }
     *    }
     *   ]
     *  };
     *
     *  var lrsParams = new LrsGPParameters({
     *      Input_Features = inFeatures,
     *      Search_Radius = new LinearUnit(50, LinearUnit.UNIT_VALUES.FEET)
     *  });
     *  var gp = new LrsGP(new LrsGP({
     *      url: "http://example.com/arcgis/rest/services/OptionalFolderLevel/LinearReferencing/GPServer"
     *  });
     *  gp.pointsToRouteSegements(lrsParams).then(function(featureSet) {
     *      // Do something with the feature set.
     *      console.debug(featureSet);
     *  });
     */
    LrsGP.prototype.pointsToRouteSegments = function (lrsGpParams) {
        var url = this.linesTaskUrl;
        url += "?" + lrsGpParams.toUrlSearch();
        return execute(url, this.maxUrlLength);
    };

    return LrsGP;

}));