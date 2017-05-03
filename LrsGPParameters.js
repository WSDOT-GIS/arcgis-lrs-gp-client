(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["./LinearUnit", "./objectUtils"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./LinearUnit.js'), require('./objectUtils.js'));
    } else {
        // Browser globals
        root.LrsGPParameters = factory(root.LinearUnit, root.objectUtils);
    }
}(this, function (LinearUnit, objectUtils) {
    /**
     * A module defining parameters object for the LRS geoprocessing service.
     * @module LrsGPParameters
     */

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
     * @property {?number} [env:outSR] - env:outSR
     * @property {?number} [env:processSR] - env:processSR
     * @property {?Boolean} returnM - returnM
     * @property {?Boolean} returnZ - returnZ
     */

    /**
     * Creates a new object that specifies parameters for {@link module:LrsGP}. For any properties that are not set or are set to null, the geoprocessing service will use its predefined defaults.
     * @class
     * @alias module:LrsGPParameters
     * @param {LrsGPConstructorOptions} options - Options used to initialize property values.
     * @see {@link http://desktop.arcgis.com/en/arcmap/latest/tools/linear-ref-toolbox/locate-features-along-routes.htm Locate Features Along Routes}
     * @see {@link http://desktop.arcgis.com/en/arcmap/latest/tools/linear-ref-toolbox/make-route-event-layer.htm Make Route Event Layer}
     */
    function LrsGPParameters(options) {
        var Input_Features = null;
        var Route_Features = null;
        //var Filter_Expression = null;
        var Search_Radius = null;
        var Keep_only_the_closest_route_location = null;
        var Include_distance_field_on_output_table = null;
        var Use_M_Direction_Offsetting = null;
        var Generate_an_angle_field = null;
        var Calculated_Angle_Type = null;
        var Write_the_complement_of_the_angle_to_the_angle_field = null;
        var f = "json";

        Object.defineProperties(this, {
            /**
             * @member {external:FeatureSet} - feature set
             * This value must be set prior to execution.
             */
            Input_Features: {
                enumerable: true,
                get: function () {
                    return Input_Features;
                }, set: function (v) {
                    Input_Features = v;
                }
            },
            /**
             * @member {string} - Valid values are "WAPR" and "WAPR with FT and TB".
             */
            Route_Features: {
                enumerable: true,
                get: function () {
                    return Route_Features;
                }, set: function (v) {
                    if (v === null || typeof v === "string" && /WAPR( with FT and TB)?/.test(v)) {
                        Route_Features = v;
                    } else {
                        throw new Error("Invalid value.");
                    }
                }
            },
            ////Filter_Expression: {
            ////    enumerable: true,
            ////    get: function () {
            ////        return Filter_Expression;
            ////    },
            ////    set: function (value) {
            ////        if (value === null) {
            ////            Filter_Expression = null;
            ////        } else if (Array.isArray(value)) {
            ////            if (value.length < 1) {
            ////                Filter_Expression = null;
            ////            } else if (value.length === 1) {
            ////                Filter_Expression = "RouteID = '" + value + "'";
            ////            } else {
            ////                Filter_Expression = "RouteID IN (" + value.map(function (routeId) {
            ////                    return "'" + routeId + "'";
            ////                }).join(",") + ")";
            ////            }
            ////        } else if (typeof value === "string") {
            ////            Filter_Expression = value;
            ////        }
            ////    }
            ////},

            /**
             * @member {module:LinearUnit} - The distance to search around each input feature for a nearby route.
             * @example
             * var params = new LrsGPParameters();
             * params.Search_Radius = new LinearUnit(50, LinearUnit.UNIT_VALUES.FEET);
             */
            Search_Radius: {
                enumerable: true,
                get: function () {
                    return Search_Radius;
                }, set: function (v) {
                    if (typeof value === "number") {
                        new LinearUnit(v);
                    }
                    Search_Radius = v;
                }
            },
            /**
             * @member {Boolean} - Keeps only the closest route location if set to true.
             */
            Keep_only_the_closest_route_location: {
                enumerable: true,
                get: function () {
                    return Keep_only_the_closest_route_location;
                }, set: function (v) {
                    Keep_only_the_closest_route_location = v;
                }
            },
            /**
             * @member {Boolean}
             */
            Include_distance_field_on_output_table: {
                enumerable: true,
                get: function () { return Include_distance_field_on_output_table; },
                set: function (v) { Include_distance_field_on_output_table = v; }
            },
            /**
             * @member {Boolean}
             */
            Use_M_Direction_Offsetting: {
                enumerable: true,
                get: function () { return Use_M_Direction_Offsetting; },
                set: function (v) { Use_M_Direction_Offsetting = v; }
            },
            /**
             * @member {Boolean}
             */
            Generate_an_angle_field: {
                enumerable: true,
                get: function () { return Generate_an_angle_field; },
                set: function (v) { Generate_an_angle_field = v; }
            },
            /**
             * @member {string} - Valid values are "NORMAL" and "TANGENT"
             */
            Calculated_Angle_Type: {
                enumerable: true,
                get: function () { return Calculated_Angle_Type; },
                set: function (v) {
                    if (v === null || typeof v === "string" && /^(?:(?:NORMAL)|(?:TANGENT))$/) {
                        Calculated_Angle_Type = v;
                    } else {
                        throw new Error("Invalid value.");
                    }
                }
            },
            /**
             * @member {Boolean}
             */
            Write_the_complement_of_the_angle_to_the_angle_field: {
                enumerable: true,
                get: function () {
                    return Write_the_complement_of_the_angle_to_the_angle_field;
                }, set: function (v) {
                    Write_the_complement_of_the_angle_to_the_angle_field = v;
                }
            },
            f: {
                enumerable: true,
                value: f
            },
            /**
             * @member {Boolean}
             */
            returnM: {
                enumerable: true,
                writeable: true,
                value: true
            },
            /**
             * @member {Boolean}
             */
            returnZ: {
                enumerable: true,
                writeable: true,
                value: true
            },
            /**
             * @member {number} - Set this value to change the output spatial reference.
             * By default, the service will return the data in {@link http://epsg.io/2927 EPSG:2927}.
             */
            "env:outSR": {
                enumerable: true,
                writable: true,
                value: null
            },
            /**
             * @member {number} - You should not ever need to set this.
             */
            "env:processSR": {
                enumerable: true,
                writable: true,
                value: null
            }

        });

        // var validOptionsRe = /^((?:Input_Features)|(?:Route_Features)|(?:Filter_Expression)|(?:Search_Radius)|(?:Keep_only_the_closest_route_location)|(?:Include_distance_field_on_output_table)|(?:Use_M_Direction_Offsetting)|(?:Generate_an_angle_field)|(?:Calculated_Angle_Type)|(?:Write_the_complement_of_the_angle_to_the_angle_field)|(?:f)|(?:env\:outSR)|(?:env\:processSR)|(?:returnM)|(?:returnZ))$/;
        var validOptionsRe = /^((?:Input_Features)|(?:Route_Features)|(?:Search_Radius)|(?:Keep_only_the_closest_route_location)|(?:Include_distance_field_on_output_table)|(?:Use_M_Direction_Offsetting)|(?:Generate_an_angle_field)|(?:Calculated_Angle_Type)|(?:Write_the_complement_of_the_angle_to_the_angle_field)|(?:f)|(?:env\:outSR)|(?:env\:processSR)|(?:returnM)|(?:returnZ))$/;

        for (var name in options) {
            if (options.hasOwnProperty(name) && validOptionsRe.test(name)) {
                this[name] = options[name];
            }
        }
    }

    /**
     * Converts to JSON
     * @returns {string} - JSON string representation of object.
     */
    LrsGPParameters.prototype.toJSON = function () {
        var output = {};
        for (var name in this) {
            if (this.hasOwnProperty(name) && this[name] != null) { // eslint-disable-line eqeqeq
                output[name] = this[name];
            }
        }
        return JSON.stringify(output);
    };

    /**
     * Converts to a URL search string.
     * @returns {string} - URL search string.
     */
    LrsGPParameters.prototype.toUrlSearch = function () {
        return objectUtils.toUrlSearch(this, true);
    };

    return LrsGPParameters;

}));