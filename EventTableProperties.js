(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.EventTableProperties = factory();
    }
}(this, function () {
    /**
     * A module that defines event table properties.
     * @module EventTableProperties
     */

    /**
     * @alias module:EventTableProperties
     * @property {string} routeIdField - route ID field.
     * @property {string} eventType - Valid values are "POINT" and "LINE".
     * @property {string} fromMeasureField - from measure field.
     * @property {string} toMeasureField - to measure field.
     * @param {string} [routeIdField] - route ID field.
     * @param {string} [eventType="POINT"] - Valid values are "POINT" and "LINE".
     * @param {string} [fromMeasureField] - from measure field.
     * @param {string} [toMeasureField] - to measure field.
     * @constructor
     */
    function EventTableProperties(routeIdField, eventType, fromMeasureField, toMeasureField) {
        var self = this;
        var _eventType = "POINT"

        Object.defineProperties(this, {
            routeIdField: {
                enumerable: true,
                writable: true,
                value: "RID"
            },
            eventType: {
                enumerable: true,
                get: function () {
                    return _eventType;
                },
                set: function (value) {
                    var validValuesRe = /^(?:(?:POINT)|(?:LINE))$/;
                    if (!(typeof value === "string" && validValuesRe.test(value))) {
                        throw new Error("Only valid values are 'POINT' and 'LINE'.");
                    } else {
                        _eventType = value;
                    }
                }
            },
            fromMeasureField: {
                enumerable: true,
                writable: true,
                value: "MEAS"
            },
            toMeasureField: {
                enumerable: true,
                writable: true,
                value: null
            }
        });

        if (routeIdField) {
            this.routeIdField = routeIdField;
        }
        if (eventType) {
            this.eventType = eventType;
        }
        if (fromMeasureField) {
            this.fromMeasureField = fromMeasureField;
        } else if (this.eventType) {
            this.fromMeasureField = this.eventType === "LINE" ? "FMEAS" : "MEAS";
        }
        if (toMeasureField) {
            this.toMeasureField = toMeasureField;
        } else if (this.eventType === "LINE") {
            this.toMeasureField = "TMEAS";
        }
    }

    /**
     * Returns a string representation of the EventTableProperties.
     * @returns {string} string representation of EventTableProperties.
     */
    EventTableProperties.prototype.toString = function () {
        var output;
        if (this.eventType === "LINE") {
            output = [this.routeIdField, this.eventType, this.fromMeasureField, this.toMeasureField].join(" ");
        } else {
            output = [this.routeIdField, this.eventType, this.fromMeasureField].join(" ");
        }
        return output;
    }

    /**
     * This function will return the string representation of this object
     * when serialized to JSON.
     * @returns {string} Returns the string representation of the EventTableProperties.
     */
    EventTableProperties.prototype.toJSON = function () {
        return this.toString();
    }

    return EventTableProperties;

}));