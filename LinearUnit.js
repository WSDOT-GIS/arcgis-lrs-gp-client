(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.LinearUnit = factory();
    }
}(this, function () {
    /**
     * A module for calling the LRS geoprocessing service.
     * @module LinearUnit
     */

    var unitValues = {};

    Object.defineProperties(unitValues, {
        FEET: { value: "esriFeet", enumerable: true },
        CENTIMETERS: { value: "esriCentimeters", enumerable: true },
        DECIMAL_DEGREES: { value: "esriDecimalDegrees", enumerable: true },
        DECIMETERS: { value: "esriDecimeters", enumerable: true },
        INCHES: { value: "esriInches", enumerable: true },
        KILOMETERS: { value: "esriKilometers", enumerable: true },
        METERS: { value: "esriMeters", enumerable: true },
        MILES: { value: "esriMiles", enumerable: true },
        MILLIMETERS: { value: "esriMillimeters", enumerable: true },
        NAUTICAL_MILES: { value: "esriNauticalMiles", enumerable: true },
        POINTS: { value: "esriPoints", enumerable: true },
        UNKNOWN: { value: "esriUnknown", enumerable: true },
        YARDS: { value: "esriYards", enumerable: true }
    });

    var unitValuesRe = (function () {
        var rePrefix = "^esri(?:";
        var reSuffix = ")$";
        var reBuilder = [];
        for (var propName in unitValues) {
            reBuilder.push('(?:' + unitValues[propName].replace(/^esri/, "") + ')');
        }
        return new RegExp([rePrefix, reBuilder.join("|"), reSuffix].join(""));
    }());

    /**
     * @alias module:LinearUnit
     * @constructor
     * @param {number} distance - The numeric distance.
     * @param {string} units - The linear unit name. @see {LinearUnit.UNIT_VALUES} constants.
     * @property {number} distance - Numeric distance
     * @property {string} units - Unit type
     */
    function LinearUnit(distance, units) {
        var _distance = 0;
        var _units = "esriFeet";

        var self = this;

        Object.defineProperties(this, {
            distance: {
                enumerable: true,
                get: function () {
                    return _distance;
                },
                set: function (v) {
                    if (typeof v !== "number") {
                        throw new TypeError("distance must be a number");
                    } else if (v < 0) {
                        throw new Error("The distance not must be less than 0.");
                    } else {
                        _distance = v;
                    }
                }
            },
            units: {
                enumerable: true,
                get: function () {
                    return _units;
                },
                set: function (v) {
                    if (typeof v !== "string") {
                        throw new TypeError("units value must be a string.");
                    }
                    else if (!unitValuesRe.test(v)) {
                        throw new Error("Invalid value for units.");
                    } else {
                        _units = v;
                    }
                }
            }
        });

        // Initialize the properties if they were provided to constructor.
        if (arguments.length === 1 && typeof distance === "object") {
            self.distance = distance.distance;
            self.units = distance.units;
        } else if (distance != null) { // eslint-disable-line
            self.distance = distance;
        }
        if (units) {
            self.units = units;
        }
    }

    /**
     * List of the valid linear unit types.
     * @type {Object.<string, string>}
     */
    Object.defineProperty(LinearUnit, "UNIT_VALUES", { value: unitValues });

    return LinearUnit;

}));