define([
    "esri/graphic",
    "esri/geometry/jsonUtils",
    "proj4"
], function (
    Graphic,
    geometryJsonUtils,
    proj4
) {

    WA_PRJ_NAME = "EPSG:2927";
    proj4.defs(WA_PRJ_NAME, "+proj=lcc +lat_1=47.33333333333334 +lat_2=45.83333333333334 +lat_0=45.33333333333334 +lon_0=-120.5 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs");
    MAP_PRJ_NAME = "EPSG:3857";

    function projectPoints(pointsOrCoords, inPrj, outPrj) {
        var re = /^(?:(?:points)|(?:rings)|(?:paths))$/, match, output;
        if (pointsOrCoords.hasOwnProperty("x") && pointsOrCoords.hasOwnProperty("y") || Array.isArray(pointsOrCoords) && pointsOrCoords.length >= 2 && typeof pointsOrCoords[0] === "number") {
            return proj4(inPrj, outPrj, pointsOrCoords);
        } else {
            for (var propName in pointsOrCoords) {
                match = propName.match(re);
                if (match) {
                    break;
                }
            }
            if (match) {
                output = {};
                output[match[0]] = projectPoints(pointsOrCoords[match[0]]);
                return output;
            } else {
                return pointsOrCoords.map(function (a) {
                    proj4(inPrj, outPrj, a);
                });
            }
        }
    }

    var exports = {
        projectGeometryStatePlaneToMap: function (geometry) {
            var o = geometry.toJson ? geometry.toJson() : geometry;
            delete o.spatialReference;
            o = projectPoints(o, WA_PRJ_NAME, MAP_PRJ_NAME);
            o.spatialReference = { wkid: 3856 };
            return geometryJsonUtils.fromJson(o);
        },
        projectGraphicStatePlaneToMap: function (g) {
            var o = g.toJson ? g.toJson() : g;
            delete o.symbol;
            o.geometry = this.projectGeometryStatePlaneToMap(o.geometry, WA_PRJ_NAME, MAP_PRJ_NAME);
            return new Graphic(o);
        }
    };

    return exports;

});