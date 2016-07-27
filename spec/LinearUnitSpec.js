/*eslint-env jasmine*/
/*global LinearUnit*/
if (typeof require !== "undefined") {
    LinearUnit = require('../LinearUnit.js'); //eslint-disable-line no-native-reassign
}

describe("LinearUnit", function () {
    it("default value should be '0 esriFeet'", function () {
        var lu = new LinearUnit();

        // Test default values.
        expect(lu.distance).toEqual(0);
        expect(lu.units).toEqual(LinearUnit.UNIT_VALUES.FEET);
    });
    it("should reject invalid values assigned to properties", function () {
        var lu = new LinearUnit();

        // Invalid values should throw errors on assignment attempt.
        expect(function () { lu.distance = "0"; }).toThrowError(TypeError);
        expect(function () { lu.distance = -4; }).toThrow();
        expect(function () { lu.units = "esriHogsHeads"; }).toThrow();
    });
    it("Any of the UNIT_VALUES constant values should not throw an error.", function () {
        var lu = new LinearUnit();

        // Any of the constant values should not throw an error.
        expect(function () {
            var name;
            for (name in LinearUnit.UNIT_VALUES) {
                lu.units = LinearUnit.UNIT_VALUES[name];
            }
        }).not.toThrow();

    });

});
