require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Home",
    "esri/widgets/Search",
    "appRoot/ui/DrawButtons",
    "dojo/text!../webmap/data.json"
], function (
    WebMap,
    MapView,
    Home,
    Search,
    DrawButtons,
    webmapJson
) {
    var map = WebMap.fromJSON(JSON.parse(webmapJson));

    var view = new MapView({
        container: "mapView",
        map: map,
        scale: 4622324.434309, // Required in order to set zoom level.
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

    view.on("click", function (evt) {
        console.debug("map click", evt);
        view.hitTest(evt.screenPoint).then(function (response) {
            console.debug("view.hitTest", response);
        });
    });

    var home = new Home({ view: view });
    home.startup();
    view.ui.add(home, "top-left");

    var search = new Search({ view: view });
    search.startup();
    view.ui.add(search, "top-right");
});
