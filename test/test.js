/// <reference path="../bower_components/jasmine-core/lib/jasmine-core/jasmine.js" />
/// <reference path="../bower_components/jasmine-core/lib/jasmine-core/jasmine-html.js" />
/// <reference path="../bower_components/jasmine-core/lib/jasmine-core/boot.js" />
/// <reference path="../objectUtils.js" />
/// <reference path="../arcGisRestApiUtils.js" />
/// <reference path="../LinearUnit.js" />
/// <reference path="../LrsGPParameters.js" />
/// <reference path="../LrsGP.js" />

var serviceUrl = "http://hqolymgis98d:6080/arcgis/rest/services/Shared/LinearReferencing/GPServer/";

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

describe("LrsGPParameters", function () {
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
        "features": [
          {
              "geometry": {
                  "paths": [
                    [
                      [
                        -13681859.61267988,
                        5945571.239325366
                      ],
                      [
                        -13681885.887908356,
                        5945453.000797221
                      ]
                    ]
                  ]
              }
          },
          {
              "geometry": {
                  "paths": [
                    [
                      [
                        -13681838.711929955,
                        5945558.698875411
                      ],
                      [
                        -13681862.001337014,
                        5945415.379447357
                      ]
                    ]
                  ]
              }
          }
        ],
        "spatialReference": {
            "wkid": 3857
        }
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
                lrs.linesToRouteEvents(gpParams).then(function (results) {
                    console.log("get point GP service", {
                        GPResults: results,
                        elapsedTime: [getElapsedSeconds(startTime), "seconds"].join(" ")
                    });
                    expect(results).not.toEqual(null);
                    expect(results.features.length).toEqual(2);
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
                spyOn(LrsGP.prototype, "linesToRouteEvents").and.returnValue(new Promise(function (resolve, reject) {
                    resolve({ "displayFieldName": "", "hasZ": true, "hasM": true, "geometryType": "esriGeometryPolyline", "spatialReference": { "wkid": 2927, "latestWkid": 2927 }, "fields": [{ "name": "OID", "type": "esriFieldTypeOID", "alias": "OID" }, { "name": "RID", "type": "esriFieldTypeString", "alias": "RID", "length": 60 }, { "name": "FMEAS", "type": "esriFieldTypeDouble", "alias": "FMEAS" }, { "name": "TMEAS", "type": "esriFieldTypeDouble", "alias": "TMEAS" }, { "name": "INPUTOID", "type": "esriFieldTypeInteger", "alias": "INPUTOID" }, { "name": "Shape_Length", "type": "esriFieldTypeDouble", "alias": "Shape_Length" }], "features": [{ "attributes": { "OID": 1, "RID": "005d", "FMEAS": 104.33839999999999, "TMEAS": 104.39870000000001, "INPUTOID": 0, "Shape_Length": 270.70900547526969 }, "geometry": { "hasZ": true, "hasM": true, "paths": [[[1040303.9813729674, 624485.6546895653, 0, 104.33839999999327], [1040305.868836388, 624501.05885823071, 0, 104.34130000000005], [1040314.5689502209, 624546.72412122786, 0, 104.35000000000582], [1040322.3858637214, 624587.75291055441, 0, 104.357600000003], [1040337.9652288854, 624654.91616205871, 0, 104.36999999999534], [1040345.5669197142, 624687.68906238675, 0, 104.38999999999942], [1040367.6810487211, 624748.11643497646, 0, 104.39870000000519]]] } }, { "attributes": { "OID": 2, "RID": "005", "FMEAS": 104.3287, "TMEAS": 104.3861, "INPUTOID": 1, "Shape_Length": 325.07907576262068 }, "geometry": { "hasZ": true, "hasM": true, "paths": [[[1040346.2017609775, 624401.32185298204, 0, 104.32869999999821], [1040351.2378401309, 624446.92609247565, 0, 104.33759999999893], [1040360.6640023887, 624509.86887997389, 0, 104.35000000000582], [1040366.8329533041, 624544.35306297243, 0, 104.35599999999977], [1040374.4379249662, 624578.39203689992, 0, 104.36190000000352], [1040387.2433455586, 624624.24201080203, 0, 104.36999999999534], [1040402.6478423029, 624676.30588306487, 0, 104.37889999999607], [1040415.4496539682, 624718.13421148062, 0, 104.38610000000335]]] } }], "exceededTransferLimit": false });
                }));
            });

            runTests();
        });

        describe("Actually call GP service and await response", function () {
            it("GP Service URL should be valid", function (done) {
                var request = new XMLHttpRequest();
                request.open("get", serviceUrl + "?f=json");
                request.onloadend = function () {
                    expect(this.status).toEqual(200);
                    done();
                };
                request.send();
            });

            runTests()
        });



    });
});