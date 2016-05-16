require([
    "esri/Map",
    "esri/Basemap",
    "esri/layers/Layer",
    "esri/layers/FeatureLayer",
    "esri/layers/MapImageLayer",
    "esri/layers/TileLayer",
    "esri/layers/VectorTileLayer",
    "esri/views/MapView",
    "esri/widgets/Home",
    "esri/widgets/Search",
    "dojo/text!../webmap/data.json"
], function (
    EsriMap,
    Basemap,
    Layer,
    FeatureLayer,
    MapImageLayer,
    TileLayer,
    VectorTileLayer,
    MapView,
    Home,
    Search,
    webmapJson
) {
    // Create mapping of layer types.
    var layerTypesMapping = new Map();
    [
        ["ArcGISFeatureLayer", FeatureLayer],
        ["ArcGISTiledMapServiceLayer", TileLayer],
        ["ArcGISMapServiceLayer", MapImageLayer],
        ["VectorTileLayer", VectorTileLayer]
    ].forEach(function (kvp) {
        layerTypesMapping.set(kvp[0], kvp[1]);
    });

    var reviver = function (k, v) {
        if (v && typeof v === "object" && v.layerType && layerTypesMapping.has(v.layerType)) {
            // Move layer definiton properties to parent.
            if (v.layerDefinition) {
                for (var n in v.layerDefinition) {
                    v[n] = v.layerDefinition[n];
                }
                delete v.layerDefinition;
            }
            // Rename the visibility property.
            if (v.hasOwnProperty("visibility")) {
                v.visible = v.visibility;
                delete v.visibility;
            }
            // Delete the "mode" property, which will cause a failure.
            if (v.mode) {
                delete v.mode;
            }
            if (v.styleUrl && !v.url) {
                v.url = v.styleUrl;
            }
            // Construct the layer object.
            v = new (layerTypesMapping.get(v.layerType))(v);
        }
        return v;
    };

    var webmapJson = JSON.parse(webmapJson, reviver);
    webmapJson.baseMap.baseLayers = webmapJson.baseMap.baseMapLayers;
    delete webmapJson.baseMapLayers;

    var map = new EsriMap({
        layers: webmapJson.operationalLayers,
        basemap: new Basemap(webmapJson.baseMap)
    });
    var view = new MapView({
        container: "mapView",
        map: map,
        zoom: 7,
        center: [-120.85, 47.295],
        ui: {
            components: [
                "zoom",
                "compass",
                "attribution"
            ]
        }
    });

    var home = new Home({ view: view });
    home.startup();
    view.ui.add(home, "top-left");

    var search = new Search({ view: view });
    search.startup();
    view.ui.add(search, "top-right");
});
