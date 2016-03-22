(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.objectUtils = factory();
    }
}(this, function () {

    /**
     * A utility module for manipulating objects.
     * @exports objectUtils
     */

    /**
     * Checks to see if an object contains ALL of the specified named properties.
     * @param {Object} o - An object
     * @param {...string} names - Property names
     * @returns {Boolean} Returns true if the object has properties for each of the names, false otherwise.
     */
    function hasAllProperties() {
        var o = arguments[0];
        var name;
        var allMatch;
        for (var i = 1; i < arguments.length; i++) {
            name = arguments[i];
            if (!o.hasOwnProperty(name)) {
                allMatch = false;
                break;
            }
        }
        return allMatch !== false;
    }


    /**
     * Checks to see if an object contains at least one of the specified named properties.
     * @param {Object} o - An object
     * @param {...string} names - Property names
     * @returns {Boolean} Returns true if the object has properties for one of the names, false otherwise.
     */
    function hasAnyProperties() {
        var o = arguments[0];
        var name;
        var matchFound;
        for (var i = 1; i < arguments.length; i++) {
            name = arguments[i];
            if (o.hasOwnProperty(name)) {
                matchFound = true;
                break;
            }
        }
        return matchFound || false;
    }

    /**
     * Converts an object into a URL search string (AKA query string).
     * @param {Object} o - An object.
     * @param {Boolean} [omitNulls=false] - If true, null values will be omitted from the output.
     * @returns {string} A URL query string.
     */
    function toUrlSearch(o, omitNulls) {
        var output = [], value;
        for (var propName in o) {
            value = o[propName];
            if (typeof value === "function" || !omitNulls && value == null) { // eslint-disable-line
                continue;
            } else if (typeof value === "object" && value) {
                value = value.toJSON ? value.toJSON() : JSON.stringify(value);
            }

            if (value != null || !omitNulls) { // eslint-disable-line
                output.push([encodeURIComponent(propName), encodeURIComponent(value)].join("="));
            }
        }
        return output.join("&");
    }

    return {
        hasAllProperties: hasAllProperties,
        hasAnyProperties: hasAnyProperties,
        toUrlSearch: toUrlSearch
    };

}));