declare namespace arcgisServer {
    interface Geometry {
        spatialReference?: SpatialReference;
    }
    interface Point extends Geometry {
        x: number;
        y: number;
    }
    interface Feature {
        attributes: Object;
        geometry: Geometry;
    }
    interface SpatialReference {
        wkid?: number;
        wkt?: number;
    }
    interface Field {
        name: string;
        alias?: string;
        type: FieldType;
        length?: number;
    }
    interface FeatureSet {
        displayFieldName?: string;
        hasZ?: boolean;
        hasM?: boolean;
        geometryType?: GeometryType;
        fields?: Array<Object>;
        features: Geometry[];
        spatialReference: SpatialReference;
        exceededTransferLimit?: boolean;
    }
    type GeometryType = "esriPoint" | "esriMultipoint" | "esriPolyline" | "esriPolygon" | "esriEnvelope";
    type FieldType =
        "esriFieldTypeInteger" |
        "esriFieldTypeSmallInteger" |
        "esriFieldTypeDouble" |
        "esriFieldTypeSingle" |
        "esriFieldTypeString" |
        "esriFieldTypeDate" |
        "esriFieldTypeGeometry" |
        "esriFieldTypeOID" |
        "esriFieldTypeBlob" |
        "esriFieldTypeGlobalID" |
        "esriFieldTypeRaster" |
        "esriFieldTypeGUID" |
        "esriFieldTypeXML";
}