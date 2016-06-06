declare namespace arcgisServer {
    interface Geometry {
        spatialReference?: SpatialReference
    }
    interface Point extends Geometry {
        x: number,
        y: number
    }
    interface Feature {
        attributes: Object
        geometry: Geometry
    }
    interface SpatialReference {
        wkid?: number,
        wkt?: number,
    }
    interface FeatureSet {
        features: Geometry[]
        spatialReference: SpatialReference
    }
    type GeometryType = "esriPoint" | "esriMultipoint" | "esriPolyline" | "esriPolygon" | "esriEnvelope"; 
}