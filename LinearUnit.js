(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
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
     * @param {number} [distance=0] - The numeric distance.
     * @param {string} [units="esriFeet"] - The linear unit name.
     * @see {@link module:LinearUnit.UNIT_VALUES} constants.
     * @throws {TypeError} Thrown if caller attempts to set distance to a non-number value or units to non-string.
     * @throws {Error} Thrown if caller attempts to set distance to a number that is less than zero or units to an invalid value.
     */
    function LinearUnit(distance, units) {
        var _distance = 0;
        var _units = "esriFeet";

        var self = this;

        /**
         * List of the valid linear unit types.
         * @member {Object.<string, string>} UNIT_VALUES
         * @constant
         * @property {string} FEET - "esriFeet"
         * @property {string} CENTIMETERS - "esriCentimeters"
         * @property {string} DECIMAL_DEGREES - "esriDecimalDegrees"
         * @property {string} DECIMETERS - "esriDecimeters"
         * @property {string} INCHES - "esriInches"
         * @property {string} KILOMETERS - "esriKilometers"
         * @property {string} METERS - "esriMeters"
         * @property {string} MILES - "esriMiles"
         * @property {string} MILLIMETERS - "esriMillimeters"
         * @property {string} NAUTICAL_MILES - "esriNauticalMiles"
         * @property {string} POINTS - "esriPoints"
         * @property {string} UNKNOWN - "esriUnknown"
         * @property {string} YARDS - "esriYards"
         * @static
         */

        Object.defineProperties(this, {
            /**
             * @member {number} - A number greater than or equal to zero.
             */
            distance: {
                enumerable: true,
                get: function () {
                    return _distance;
                },
                /**
                 * @param {number} v - A number greater than zero.

                 */
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
            /**
             * @member {string}
             */
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


    Object.defineProperty(LinearUnit, "UNIT_VALUES", { value: unitValues });

    return LinearUnit;

}));