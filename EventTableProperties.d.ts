declare type EventType = "POINT" | "LINE";

/**
 * @alias module:EventTableProperties
 * @param {string} [routeIdField] - route ID field.
 * @param {string} [eventType="POINT"] - Valid values are "POINT" and "LINE".
 * @param {string} [fromMeasureField] - from measure field. Defaults to "MEAS" if event type is "POINT", "FMEAS" if event type is "LINE".
 * @param {?string} [toMeasureField] - to measure field. Defaults to null if event type is "POINT", "TMEAS" if event type is "LINE".
 * @constructor
 */
interface EventTableProperties {
    constructor(routeIdField?: string, eventType?: EventType, fromMeasureField?: string, toMeasureField?: string);
    /**
     * @member {string} - The name of the field in the route layer that uniquely identifies a route.
     */
    routeIdField: string;
    /**
     * @member {string} - Valid values are 'POINT' and 'LINE'.
     */
    eventType: EventType;
    /**
     * @member {string} - The name of the "from" measure field.
     */
    fromMeasureField: string;
    /**
     * @member {string} - The name of the "to" measure field. Only used when {@link module:EventTableProperties~eventType} is "LINE".
     */
    toMeasureField: string;

    /**
     * Returns a string representation of the EventTableProperties.
     * @returns {string} string representation of EventTableProperties.
     * @example
     * var etp = new EventTableProperties("RID", "POINT", "MEAS");
     * var s = etp.toString(); // s === "RID POINT MEAS"
     */
    toString(): string;

    /**
     * This function will return the string representation of this object
     * when serialized to JSON.
     * @returns {string} Returns the string representation of the EventTableProperties.
     * @see {@link module:EventTableProperties#toString}
     */
    toJSON(): string;
}