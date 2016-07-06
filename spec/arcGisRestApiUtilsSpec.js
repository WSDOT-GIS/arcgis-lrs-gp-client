if (typeof require !== "undefined") {
    arcGisRestApiUtils = require('../arcGisRestApiUtils.js');
}

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