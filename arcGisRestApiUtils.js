(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["./objectUtils"], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('objectUtils'));
    } else {
        // Browser globals
        root.arcGisRestApiUtils = factory(root.objectUtils);
    }
}(this, function (objectUtils) {

    /**
     * A module with ArcGIS REST API utility functions.
     * @exports arcGisRestApiUtils
     */

    /**
     * ArcGIS REST API feature set.
     * @external FeatureSet
     * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/FeatureSet_object/02r3000002mn000000/|FeatureSet object}
     */

    /**
     * ArcGIS REST API geometry definitions.
     * @external Geometry
     * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Geometry_objects/02r3000000n1000000/|Geometry objects}
     */

    /**
     * ArcGIS REST API spatial reference
     * @external SpatialReference
     * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Geometry_objects/02r3000000n1000000/|Geometry objects}
     */

    /**
     * Gets the type of the geometry based on its properties.
     * @param {external:Geometry} geometry - a geometry.
     * @param {Boolean} [useEsriPrefix=false] - If true, the output name will be prefixed with "esri". E.g., "point" vs. "esriPoint".
     * @returns {string} The type of geometry: point, multipoint, polyline, polygon, or envelope.
     */
    function getGeometryType(geometry, useEsriPrefix) {
        if (!geometry) {
            throw new TypeError("The geometry parameter cannot be null or undefined.");
        }

        var output;
        var esriPrefix = "esriGeometry";

        if (objectUtils.hasAllProperties(geometry, "x", "y")) {
            output = useEsriPrefix ? esriPrefix + "Point" : "point";
        } else if (geometry.points) {
            output = useEsriPrefix ? esriPrefix + "Multipoint" : "multipoint";
        } else if (objectUtils.hasAnyProperties(geometry, "paths", "curvePaths")) {
            output = useEsriPrefix ? esriPrefix + "Polyline" : "polyline";
        } else if (objectUtils.hasAnyProperties(geometry, "rings", "curveRings")) {
            output = useEsriPrefix ? esriPrefix + "Polygon" : "polygon";
        } else if (objectUtils.hasAllProperties(geometry, "xmin", "ymin", "xmax", "ymax")) {
            output = useEsriPrefix ? esriPrefix + "Envelope" : "envelope";
        }

        return output;
    }

    /**
     * Creates a feature set using the specified geometry
     * @param {external:Geometry[]} geometries - Geometries
     * @param {(external:SpatialReference|number)} [spatialReference] - Defines the spatial reference for the feature set. Unneeded if the geometries have spatialReference properties defined.
     * @returns {external:FeatureSet} a feature set
     */
    function createFeatureSet(geometries, spatialReference) {
        if (!geometries) {
            throw new TypeError("Input cannot be null or undefined.");
        }
        else if (!Array.isArray(geometries)) {
            // Force single input geometry into an array.
            geometries = [geometries];
        } else if (!geometries.length) {
            throw new Error("geometries array has no elements.");
        }

        // If spatial reference is a number, convert it to a spatial reference object.
        if (spatialReference && typeof spatialReference === "number") {
            spatialReference = {
                wkid: spatialReference
            };
        }

        var output = {};

        output.geometryType = getGeometryType(geometries[0], true);
        output.spatialReference = spatialReference || geometries[0].spatialReference;
        if (!output.spatialReference) {
            delete output.spatialReference;
        }
        output.features = geometries.map(function (g) {
            if (g.spatialReference) {
                delete g.spatialReference;
            }
            var feature = {
                geometry: g
            };
            return feature;
        });

        return output;
    }

    /**
     * Gets the geometry type of a {@link external:FeatureSet}.
     * @param {external:FeatureSet} featureSet - A feature set.
     * @returns {string} A string with an "esri"-prefixed geometry type name.
     * @throws {Error} Throws an error if there is neither a geometryType property
     * on the featureSet object nor any features with geometry.
     */
    function getFeatureSetGeometryType(featureSet) {
        if (featureSet.geometryType) {
            return featureSet.geometryType;
        } else if (featureSet.features && featureSet.features.length > 0) {
            return getGeometryType(featureSet.features[0].geometry, true);
        } else {
            throw new Error("Unable to determine geometry type");
        }
    }

    return {
        getGeometryType: getGeometryType,
        getFeatureSetGeometryType: getFeatureSetGeometryType,
        createFeatureSet: createFeatureSet
    };

}));