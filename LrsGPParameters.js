(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["./LinearUnit", "./objectUtils"], factory);
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
     * Creates a new object that specifies parameters for {@link:LrsGP}.
     * @param {Object} options - Options used to initialize property values.
     * @alias module:LrsGPParameters
     */
    function LrsGPParameters(options) {
        var Input_Features = null;
        var Route_Features = null;
        var Search_Radius = null;
        var Keep_only_the_closest_route_location = null;
        var Include_distance_field_on_output_table = null;
        var Use_M_Direction_Offsetting = null;
        var Generate_an_angle_field = null;
        var Calculated_Angle_Type = null;
        var Write_the_complement_of_the_angle_to_the_angle_field = null;
        var f = "json";
        var env_outSR = null;
        var env_processSR = null;
        var returnM = true;
        var returnZ = true;

        Object.defineProperties(this, {
            Input_Features: {
                enumerable: true,
                get: function () {
                    return Input_Features;
                }, set: function (v) {
                    Input_Features = v;
                }
            },
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
            Keep_only_the_closest_route_location: {
                enumerable: true,
                get: function () {
                    return Keep_only_the_closest_route_location;
                }, set: function (v) {
                    Keep_only_the_closest_route_location = v;
                }
            },
            Include_distance_field_on_output_table: {
                enumerable: true,
                get: function () { return Include_distance_field_on_output_table; },
                set: function (v) { Include_distance_field_on_output_table = v; }
            },
            Use_M_Direction_Offsetting: {
                enumerable: true,
                get: function () { return Use_M_Direction_Offsetting; },
                set: function (v) { Use_M_Direction_Offsetting = v; }
            },
            Generate_an_angle_field: {
                enumerable: true,
                get: function () { return Generate_an_angle_field; },
                set: function (v) { Generate_an_angle_field = v; }
            },
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
            returnM: {
                enumerable: true,
                writeable: true,
                value: true
            },
            returnZ: {
                enumerable: true,
                writeable: true,
                value: true
            },
            "env:outSR": {
                enumerable: true,
                writable: true,
                value: null
            },
            "env:processSR": {
                enumerable: true,
                writable: true,
                value: null
            }

        });

        var validOptionsRe = /^((?:Input_Features)|(?:Route_Features)|(?:Search_Radius)|(?:Keep_only_the_closest_route_location)|(?:Include_distance_field_on_output_table)|(?:Use_M_Direction_Offsetting)|(?:Generate_an_angle_field)|(?:Calculated_Angle_Type)|(?:Write_the_complement_of_the_angle_to_the_angle_field)|(?:f)|(?:env\:outSR)|(?:env\:processSR)|(?:returnM)|(?:returnZ))$/;
        for (var name in options) {
            if (options.hasOwnProperty(name) && validOptionsRe.test(name)) {
                this[name] = options[name];
            }
        }
    }

    LrsGPParameters.prototype.toJSON = function () {
        var output = {};
        for (var name in this) {
            if (this.hasOwnProperty(name) && this[name] != null) { // eslint-disable-line eqeqeq
                output[name] = this[name];
            }
        }
        return JSON.stringify(output);
    };

    LrsGPParameters.prototype.toUrlSearch = function () {
        return objectUtils.toUrlSearch(this, true);
    };

    return LrsGPParameters;

}));