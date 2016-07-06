EventTableProperties = require('../EventTableProperties.js');

describe("EventTableProperties", function () {
    it("test default constructor values", function () {
        var etp = new EventTableProperties();
        expect(etp.routeIdField).toEqual("RID");
        expect(etp.eventType).toEqual("POINT");
        expect(etp.fromMeasureField).toEqual("MEAS");
        expect(etp.toMeasureField).toBeNull();
        expect(etp.toString()).toEqual("RID POINT MEAS");
        etp = new EventTableProperties("RID", "LINE");
        expect(etp.fromMeasureField).toEqual("FMEAS");
        expect(etp.toMeasureField).toEqual("TMEAS");
        expect(etp.toString()).toEqual("RID LINE FMEAS TMEAS");
        expect(function () {
            etp.eventType = "DIAGONAL";
        }).toThrow();
    });
});

