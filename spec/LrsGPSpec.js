objectUtils = require('../objectUtils.js');
arcGisRestApiUtils = require('../arcGisRestApiUtils.js');
EventTableProperties = require('../EventTableProperties.js');
LinearUnit = require('../LinearUnit.js');
LrsGPParameters = require('../LrsGPParameters.js');
LrsGP = require('../LrsGP.js');

var serviceUrl = "http://data.wsdot.wa.gov/arcgis/rest/services/Shared/LinearReferencing/GPServer";

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
            for (name in LinearUnit.UNIT_VALUES) {
                lu.units = LinearUnit.UNIT_VALUES[name];
            }
        }).not.toThrow();

    });

});

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

describe("arcGisRestApiUtils", function () {
    /*
        {
        "geometryType": "esriGeometryPoint",
        "spatialReference": {
            "wkid": 2927
        },
        "features": [{
            "geometry": {
                "x": 1138873.899,
                "y": 665643.561
            }
        }]
    }
     */
    var point = {
        "x": 1138873.899,
        "y": 665643.561,
        "spatialReference": {
            "wkid": 2927
        }
    };

    var polyline = {
        "paths": [[[-13698738.461152328, 5960865.213789493], [-13690177.513984391, 5924175.440212619], [-13659602.702670328, 5924175.440212619], [-13629027.891356267, 5959642.221336931], [-13596007.09513708, 5992663.017556118]]],
        spatialReference: {
            "wkid": 3857
        }
    };

    var polygon = {
        "rings": [
          [
            [
              -13718306.340393329,
              5974318.130767681
            ],
            [
              -13646149.785692142,
              5964534.191147181
            ],
            [
              -13663271.680028018,
              5920506.462854931
            ],
            [
              -13706076.415867705,
              5905830.553424181
            ],
            [
              -13718306.340393329,
              5974318.130767681
            ]
          ]
        ]
    };

    var multipoint = {
        "points": [
          [
            -13460254.932902642,
            6143091.089221305
          ],
          [
            -13386875.385748893,
            6114962.262812368
          ],
          [
            -13396659.325369393,
            6058704.6099944925
          ],
          [
            -13465146.902712893,
            6034244.760943243
          ],
          [
            -13503059.668742329,
            5979210.100577931
          ],
          [
            -13496944.706479518,
            5904607.560971619
          ],
          [
            -13461477.925355205,
            5870363.772299869
          ]
        ]
    };


    it("should detect geometry type correctly", function () {
        expect(arcGisRestApiUtils.getGeometryType(point)).toEqual("point");
        expect(arcGisRestApiUtils.getGeometryType(polyline)).toEqual("polyline");
        expect(arcGisRestApiUtils.getGeometryType(polygon)).toEqual("polygon");
        expect(arcGisRestApiUtils.getGeometryType(multipoint)).toEqual("multipoint");
    });
    describe("FeatureSet test", function () {
        var pointFeatureSet = arcGisRestApiUtils.createFeatureSet([point]);
        var polylineFeatureSet = arcGisRestApiUtils.createFeatureSet([polyline]);
        var polygonFeatureSet = arcGisRestApiUtils.createFeatureSet([polygon], 3857);
        var multipointFeatureSet = arcGisRestApiUtils.createFeatureSet([multipoint], { wkid: 3857 });

        it("feature set type should match geometry", function () {
            expect(pointFeatureSet.geometryType).toEqual("esriGeometryPoint");
            expect(polylineFeatureSet.geometryType).toEqual("esriGeometryPolyline");
            expect(polygonFeatureSet.geometryType).toEqual("esriGeometryPolygon");
            expect(multipointFeatureSet.geometryType).toEqual("esriGeometryMultipoint");

        });
        it("feature set spatial reference should match first input geometry.", function () {
            expect(pointFeatureSet.spatialReference.wkid).toEqual(2927);
            expect(polylineFeatureSet.spatialReference.wkid).toEqual(3857);
            expect(polygonFeatureSet.spatialReference.wkid).toEqual(3857);
            expect(multipointFeatureSet.spatialReference.wkid).toEqual(3857);
        });
        it("feature set should have same number of features as number input geometries used to create it.", function () {
            expect(pointFeatureSet.features.length).toEqual(1);
            expect(polylineFeatureSet.features.length).toEqual(1);
            expect(polygonFeatureSet.features.length).toEqual(1);
            expect(multipointFeatureSet.features.length).toEqual(1);
        });
    });
});

describe("LrsGP", function () {
    var lrsGPp = new LrsGPParameters();
    lrsGPp.Input_Features = {
        "features": [
          {
              "geometry": {
                  "x": 1034134.1931349911,
                  "y": 609157.1349060073
              }
          },
          {
              "geometry": {
                  "x": 1034204.3276094339,
                  "y": 609281.1763405111
              }
          },
          {
              "geometry": {
                  "x": 1034252.8444374842,
                  "y": 609355.803311986
              }
          },
          {
              "geometry": {
                  "x": 1034280.8710717263,
                  "y": 609308.8665703869
              }
          },
          {
              "geometry": {
                  "x": 1034213.5783627806,
                  "y": 609190.079426622
              }
          },
          {
              "geometry": {
                  "x": 1034270.8238385819,
                  "y": 609134.8971338108
              }
          }
        ],
        "spatialRefernence": {
            "wkid": 2927
        }
    };
    lrsGPp.Search_Radius = new LinearUnit(10, LinearUnit.UNIT_VALUES.FEET);

    lineFeatures = {
        "displayFieldName": "",
        "fieldAliases": {
            "OBJECTID": "OBJECTID"
        },
        "geometryType": "esriGeometryPoint",
        "spatialReference": {
            "wkid": 2927,
            "latestWkid": 2927
        },
        "fields": [
          {
              "name": "OBJECTID",
              "type": "esriFieldTypeOID",
              "alias": "OBJECTID"
          }
        ],
        "features": [
          {
              "attributes": {
                  "OBJECTID": 1
              },
              "geometry": {
                  "x": 1108486.9299805611,
                  "y": 647781.35678572953
              }
          },
          {
              "attributes": {
                  "OBJECTID": 2
              },
              "geometry": {
                  "x": 1109214.2005076408,
                  "y": 648022.67913772166
              }
          },
          {
              "attributes": {
                  "OBJECTID": 3
              },
              "geometry": {
                  "x": 1108667.1773234755,
                  "y": 647889.60263222456
              }
          },
          {
              "attributes": {
                  "OBJECTID": 4
              },
              "geometry": {
                  "x": 1109297.0641870499,
                  "y": 648103.32562997937
              }
          },
          {
              "attributes": {
                  "OBJECTID": 5
              },
              "geometry": {
                  "x": 1108501.9860528111,
                  "y": 648109.32004055381
              }
          },
          {
              "attributes": {
                  "OBJECTID": 6
              },
              "geometry": {
                  "x": 1109387.3245052248,
                  "y": 648402.71413880587
              }
          },
          {
              "attributes": {
                  "OBJECTID": 7
              },
              "geometry": {
                  "x": 1107630.4313654751,
                  "y": 647335.03582797945
              }
          },
          {
              "attributes": {
                  "OBJECTID": 8
              },
              "geometry": {
                  "x": 1107124.07640706,
                  "y": 646798.25540547073
              }
          },
          {
              "attributes": {
                  "OBJECTID": 9
              },
              "geometry": {
                  "x": 1107391.9010026455,
                  "y": 648346.83006422222
              }
          },
          {
              "attributes": {
                  "OBJECTID": 10
              },
              "geometry": {
                  "x": 1107344.7836427987,
                  "y": 648060.01600530744
              }
          },
          {
              "attributes": {
                  "OBJECTID": 11
              },
              "geometry": {
                  "x": 1107353.3190588057,
                  "y": 647560.91398514807
              }
          },
          {
              "attributes": {
                  "OBJECTID": 12
              },
              "geometry": {
                  "x": 1106741.0292728841,
                  "y": 647603.10123673081
              }
          }
        ]
    };

    it("should not contain null valued properties when converted to JSON.", function () {
        // Ensure properties with null values are not returned in JSON output.
        var json = JSON.stringify(lrsGPp);
        json = JSON.parse(json);
        expect((function () {
            var output;
            for (var name in json) {
                if (json[name] === null) {
                    output = true;
                    break;
                }
            }
            return output || false;
        }())).toBe(false);
    });

    describe("Calling GP Service", function () {
        var lrs = new LrsGP({
            url: serviceUrl
        });


        function getElapsedSeconds(startTime) {
            var endTime = new Date();
            return (endTime - startTime) / 1000;
        }

        function runTests() {
            it("should successfully call point GP Service", function (done) {
                var startTime = new Date();


                lrs.pointsToRouteEvents(lrsGPp).then(function (results) {
                    console.log("get point GP service", {
                        GPResults: results,
                        elapsedTime: [getElapsedSeconds(startTime), "seconds"].join(" ")
                    });
                    expect(results).not.toEqual(null);
                    expect(results.features.length).toEqual(6);
                    done();
                }, function (err) {
                    console.error(err);
                    done.fail(err);
                });
            }, 10000);

            it("should successfully call line GP Service", function (done) {
                var startTime = new Date();
                var gpParams = new LrsGPParameters();
                gpParams.Input_Features = lineFeatures;
                gpParams.Search_Radius = new LinearUnit(10, LinearUnit.UNIT_VALUES.FEET);
                lrs.pointsToRouteSegments(gpParams).then(function (results) {
                    console.log("get line GP service", {
                        GPResults: results,
                        elapsedTime: [getElapsedSeconds(startTime), "seconds"].join(" ")
                    });
                    expect(results).not.toEqual(null);
                    expect(results.features.length).toEqual(6);
                    done();
                }, function (error) {
                    console.error(error);
                    done.fail(error);
                });
            }, 20000);
        }

        describe("Using spies", function () {
            // Setup spies, which simulate the output of the GP services without actually calling them.

            beforeEach(function () {
                spyOn(LrsGP.prototype, "pointsToRouteEvents").and.returnValue(new Promise(function (resolve, reject) {
                    resolve({ "displayFieldName": "", "hasZ": true, "hasM": true, "geometryType": "esriGeometryPoint", "spatialReference": { "wkid": 2927, "latestWkid": 2927 }, "fields": [{ "name": "OID", "type": "esriFieldTypeOID", "alias": "OID" }, { "name": "RouteId", "type": "esriFieldTypeString", "alias": "RouteId", "length": 60 }, { "name": "Measure", "type": "esriFieldTypeDouble", "alias": "Measure" }, { "name": "Distance", "type": "esriFieldTypeDouble", "alias": "Distance" }, { "name": "INPUTOID", "type": "esriFieldTypeInteger", "alias": "INPUTOID" }, { "name": "LOC_ANGLE", "type": "esriFieldTypeDouble", "alias": "LOC_ANGLE" }], "features": [{ "attributes": { "OID": 0, "RouteId": "005d", "Measure": 101.150670424, "Distance": 4.7334890861199996, "INPUTOID": 0, "LOC_ANGLE": 149.76929959010377 }, "geometry": { "x": 1034138.2828935471, "y": 609154.75167417957, "z": 0, "m": 101.15067042400001 } }, { "attributes": { "OID": 5, "RouteId": "005P110093", "Measure": 0.160699999993, "Distance": -2.9174165737900002, "INPUTOID": 5, "LOC_ANGLE": 140.82763971479287 }, "geometry": { "x": 1034266.8110326381, "y": 609134.87403947115, "z": 0, "m": 0.16069999999308493 } }, { "attributes": { "OID": 2, "RouteId": "005d", "Measure": 101.19429331400001, "Distance": 3.54992942822, "INPUTOID": 2, "LOC_ANGLE": 148.31765317849641 }, "geometry": { "x": 1034255.8653325734, "y": 609353.9388571434, "z": 0, "m": 101.19429331400001 } }, { "attributes": { "OID": 1, "RouteId": "005d", "Measure": 101.177554679, "Distance": 6.5896930865199996, "INPUTOID": 1, "LOC_ANGLE": 149.76929959010377 }, "geometry": { "x": 1034210.0211383119, "y": 609277.85854245583, "z": 0, "m": 101.177554679 } }, { "attributes": { "OID": 3, "RouteId": "005", "Measure": 101.192220053, "Distance": 1.4474583407399999, "INPUTOID": 3, "LOC_ANGLE": 148.63420570127357 }, "geometry": { "x": 1034282.1070023198, "y": 609308.11317058734, "z": 0, "m": 101.192220053 } }, { "attributes": { "OID": 4, "RouteId": "005", "Measure": 101.167201464, "Distance": -0.91399544795900001, "INPUTOID": 4, "LOC_ANGLE": 150.34993828801464 }, "geometry": { "x": 1034212.7840441919, "y": 609190.53158329602, "z": 0, "m": 101.16720146399999 } }], "exceededTransferLimit": false });
                }));
                spyOn(LrsGP.prototype, "pointsToRouteSegments").and.returnValue(new Promise(function (resolve, reject) {
                    resolve({
                                "displayFieldName": "",
                                "hasM": true,
                                "geometryType": "esriGeometryPolyline",
                                "spatialReference": {
                                    "wkid": 2927,
                                    "latestWkid": 2927
                                },
                                "fields": [
                                 {
                                     "name": "OBJECTID",
                                     "type": "esriFieldTypeOID",
                                     "alias": "OBJECTID"
                                 },
                                 {
                                     "name": "RouteID",
                                     "type": "esriFieldTypeString",
                                     "alias": "RouteID",
                                     "length": 60
                                 },
                                 {
                                     "name": "Measure",
                                     "type": "esriFieldTypeDouble",
                                     "alias": "Measure"
                                 },
                                 {
                                     "name": "Distance",
                                     "type": "esriFieldTypeDouble",
                                     "alias": "Distance"
                                 },
                                 {
                                     "name": "INPUTOID",
                                     "type": "esriFieldTypeInteger",
                                     "alias": "INPUTOID"
                                 },
                                 {
                                     "name": "PairID",
                                     "type": "esriFieldTypeInteger",
                                     "alias": "PairID"
                                 },
                                 {
                                     "name": "IsStart",
                                     "type": "esriFieldTypeInteger",
                                     "alias": "Is Start"
                                 },
                                 {
                                     "name": "EndRouteId",
                                     "type": "esriFieldTypeString",
                                     "alias": "EndRouteId",
                                     "length": 60
                                 },
                                 {
                                     "name": "EndMeasure",
                                     "type": "esriFieldTypeDouble",
                                     "alias": "EndMeasure"
                                 },
                                 {
                                     "name": "EndDistance",
                                     "type": "esriFieldTypeDouble",
                                     "alias": "EndDistance"
                                 },
                                 {
                                     "name": "End_InputOID",
                                     "type": "esriFieldTypeInteger",
                                     "alias": "End_InputOID"
                                 },
                                 {
                                     "name": "PairID_1",
                                     "type": "esriFieldTypeInteger",
                                     "alias": "PairID"
                                 },
                                 {
                                     "name": "IsStart_1",
                                     "type": "esriFieldTypeInteger",
                                     "alias": "Is Start"
                                 },
                                 {
                                     "name": "LOC_ERROR",
                                     "type": "esriFieldTypeString",
                                     "alias": "LOC_ERROR",
                                     "length": 50
                                 },
                                 {
                                     "name": "Shape_Length",
                                     "type": "esriFieldTypeDouble",
                                     "alias": "Shape_Length"
                                 }
                                ],
                                "features": [
                                 {
                                     "attributes": {
                                         "OBJECTID": 1,
                                         "RouteID": "005R111840",
                                         "Measure": 0.20010000000183936,
                                         "Distance": -9.025954625688805E-5,
                                         "INPUTOID": 11,
                                         "PairID": 6,
                                         "IsStart": 1,
                                         "EndRouteId": "005R111840",
                                         "EndMeasure": 0.3196228138866892,
                                         "EndDistance": -6.659335449297746E-5,
                                         "End_InputOID": 12,
                                         "PairID_1": 6,
                                         "IsStart_1": 0,
                                         "LOC_ERROR": "NO ERROR",
                                         "Shape_Length": 620.6703813621311
                                     },
                                     "geometry": {
                                         "hasM": true,
                                         "paths": [[
                                          [
                                           1107353.3190588057,
                                           647560.9139851481,
                                           0.20010000000183936
                                          ],
                                          [
                                           1107220.9659770578,
                                           647543.7568672299,
                                           0.22580000000016298
                                          ],
                                          [
                                           1107106.9950763881,
                                           647542.5311478972,
                                           0.247799999997369
                                          ],
                                          [
                                           1107073.1831361353,
                                           647540.3569396436,
                                           0.2543000000005122
                                          ],
                                          [
                                           1106949.4839084744,
                                           647551.2069835663,
                                           0.2782000000006519
                                          ],
                                          [
                                           1106836.6370213032,
                                           647572.9090398997,
                                           0.3003000000026077
                                          ],
                                          [
                                           1106741.0292728841,
                                           647603.1012367308,
                                           0.31960000000253785
                                          ]
                                         ]]
                                     }
                                 },
                                 {
                                     "attributes": {
                                         "OBJECTID": 2,
                                         "RouteID": "005Q111831",
                                         "Measure": 0.29766751925351276,
                                         "Distance": 8.676755206837745E-5,
                                         "INPUTOID": 7,
                                         "PairID": 4,
                                         "IsStart": 1,
                                         "EndRouteId": "005Q111831",
                                         "EndMeasure": 0.15722720275795418,
                                         "EndDistance": 7.290422501352133E-6,
                                         "End_InputOID": 8,
                                         "PairID_1": 4,
                                         "IsStart_1": 0,
                                         "LOC_ERROR": "NO ERROR",
                                         "Shape_Length": 737.9251724429316
                                     },
                                     "geometry": {
                                         "hasM": true,
                                         "paths": [[
                                          [
                                           1107124.07640706,
                                           646798.2554054707,
                                           0.15720000000146683
                                          ],
                                          [
                                           1107400.8760503083,
                                           647093.3079649806,
                                           0.23420000000623986
                                          ],
                                          [
                                           1107630.431365475,
                                           647335.0358279794,
                                           0.29769999999552965
                                          ]
                                         ]]
                                     }
                                 },
                                 {
                                     "attributes": {
                                         "OBJECTID": 3,
                                         "RouteID": "620000533i",
                                         "Measure": 0.0834000000031665,
                                         "Distance": -1.8440727324708906E-5,
                                         "INPUTOID": 9,
                                         "PairID": 5,
                                         "IsStart": 1,
                                         "EndRouteId": "620000533i",
                                         "EndMeasure": 0.02833070139859125,
                                         "EndDistance": -8.455366743865083E-5,
                                         "End_InputOID": 10,
                                         "PairID_1": 5,
                                         "IsStart_1": 0,
                                         "LOC_ERROR": "NO ERROR",
                                         "Shape_Length": 290.7052126151459
                                     },
                                     "geometry": {
                                         "hasM": true,
                                         "paths": [[
                                          [
                                           1107344.7836427987,
                                           648060.0160053074,
                                           0.02830000000540167
                                          ],
                                          [
                                           1107371.9866723865,
                                           648241.1314567327,
                                           0.0629999999946449
                                          ],
                                          [
                                           1107391.9010026455,
                                           648346.8300642222,
                                           0.0834000000031665
                                          ]
                                         ]]
                                     }
                                 },
                                 {
                                     "attributes": {
                                         "OBJECTID": 4,
                                         "RouteID": "005d",
                                         "Measure": 118.51855614817246,
                                         "Distance": 1.8322293804306852E-4,
                                         "INPUTOID": 3,
                                         "PairID": 2,
                                         "IsStart": 1,
                                         "EndRouteId": "005d",
                                         "EndMeasure": 118.64089222517293,
                                         "EndDistance": 9.357124006254257E-6,
                                         "End_InputOID": 4,
                                         "PairID_1": 2,
                                         "IsStart_1": 0,
                                         "LOC_ERROR": "NO ERROR",
                                         "Shape_Length": 665.1578614681482
                                     },
                                     "geometry": {
                                         "hasM": true,
                                         "paths": [[
                                          [
                                           1108667.1773234755,
                                           647889.6026322246,
                                           118.51859999999579
                                          ],
                                          [
                                           1109297.0641870499,
                                           648103.3256299794,
                                           118.64089999999851
                                          ]
                                         ]]
                                     }
                                 },
                                 {
                                     "attributes": {
                                         "OBJECTID": 5,
                                         "RouteID": "620000474i",
                                         "Measure": 0.5208288720410703,
                                         "Distance": 1.8762953064268172E-5,
                                         "INPUTOID": 5,
                                         "PairID": 3,
                                         "IsStart": 1,
                                         "EndRouteId": "620000474i",
                                         "EndMeasure": 0.6974204253102007,
                                         "EndDistance": 7.412973253470411E-5,
                                         "End_InputOID": 6,
                                         "PairID_1": 3,
                                         "IsStart_1": 0,
                                         "LOC_ERROR": "NO ERROR",
                                         "Shape_Length": 932.6954503049425
                                     },
                                     "geometry": {
                                         "hasM": true,
                                         "paths": [[
                                          [
                                           1108501.9860528111,
                                           648109.3200405538,
                                           0.5207999999984168
                                          ],
                                          [
                                           1109127.0067843944,
                                           648314.4941708893,
                                           0.6453999999939697
                                          ],
                                          [
                                           1109387.3245052248,
                                           648402.7141388059,
                                           0.6974000000045635
                                          ]
                                         ]]
                                     }
                                 },
                                 {
                                     "attributes": {
                                         "OBJECTID": 6,
                                         "RouteID": "005",
                                         "Measure": 118.47211332411231,
                                         "Distance": 2.4308871652421743E-4,
                                         "INPUTOID": 1,
                                         "PairID": 1,
                                         "IsStart": 1,
                                         "EndRouteId": "005",
                                         "EndMeasure": 118.61699227740803,
                                         "EndDistance": -6.446613940325974E-5,
                                         "End_InputOID": 2,
                                         "PairID_1": 1,
                                         "IsStart_1": 0,
                                         "LOC_ERROR": "NO ERROR",
                                         "Shape_Length": 766.2630458808693
                                     },
                                     "geometry": {
                                         "hasM": true,
                                         "paths": [[
                                          [
                                           1108486.9299805611,
                                           647781.3564576358,
                                           118.47209999999905
                                          ],
                                          [
                                           1109214.2005076408,
                                           648022.6791377217,
                                           118.61699999999837
                                          ]
                                         ]]
                                     }
                                 }
                                ],
                                "exceededTransferLimit": false
                            }
                       );
                }));
            });

            runTests();
        });

        describe("Actually call GP service and await response", function () {
            it("GP Service URL should be valid", function (done) {
                fetch(serviceUrl + "?f=json", {
                    method: "GET"
                }).then(function (result) {
                    expect(result.ok).toBe(true);
                    done();
                });
            });

            runTests();
        });
    });
});