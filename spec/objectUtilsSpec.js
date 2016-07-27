/*eslint-env jasmine*/
/*global objectUtils*/
if (typeof require !== "undefined") {
    objectUtils = require('../objectUtils.js'); //eslint-disable-line no-native-reassign
}

describe("objectUtils", function () {
    // Create test object.
    var o = {
        a: 1,
        b: 2,
        c: 3
    };

    // Add properties to test object.
    Object.defineProperties(o, {
        d: {
            enumerable: true,
            value: "dee"
        },
        e: {
            enumerable: false,
            value: "ee"
        }
    });

    it("hasAllProperties and hasAnyProperties functions should return expected values", function () {
        expect(objectUtils.hasAllProperties(o, "a", "b", "c", "d", "e")).toBe(true);
        expect(objectUtils.hasAllProperties(o, "a", "b", "wrong")).toBe(false);
        expect(objectUtils.hasAllProperties(o, "a", "b", "c", "d", "wrong")).toBe(false);
        expect(objectUtils.hasAnyProperties(o, "a", "b", "wrong")).toBe(true);
        expect(objectUtils.hasAnyProperties(o, "nope", "nada", "wrong")).toBe(false);
    });

});
