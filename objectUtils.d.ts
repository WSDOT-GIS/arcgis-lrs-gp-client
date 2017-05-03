// tslint:disable-next-line:class-name
declare class objectUtils {
    /**
     * Checks to see if an object contains ALL of the specified named properties.
     * @param {Object} o - An object
     * @param {...string} names - Property names
     * @returns {Boolean} Returns true if the object has properties for each of the names, false otherwise.
     */
    public static hasAllProperties(o: object, ...names: string[]): boolean;
    /**
     * Checks to see if an object contains at least one of the specified named properties.
     * @param {Object} o - An object
     * @param {...string} names - Property names
     * @returns {Boolean} Returns true if the object has properties for one of the names, false otherwise.
     */
    public static hasAnyProperties(o: object, ...names: string[]): boolean;
    /**
     * Converts an object into a URL search string (AKA query string).
     * @param {Object} o - An object.
     * @param {Boolean} [omitNulls=false] - If true, null values will be omitted from the output.
     * @returns {string} A URL query string.
     */
    public static toUrlSearch(o: object, omitNulls: boolean): string;
}

export = objectUtils;
