define([
    "esri/core/Collection"
], function (Collection) {
    function DrawButtons() {

        var self = this;

        var div = document.createElement("div");

        var pointButton = document.createElement("button");
        pointButton.type = "button";
        pointButton.innerText = "Point";
        pointButton.value = "point";
        div.appendChild(pointButton);

        var lineButton = document.createElement("button");
        lineButton.type = "button";
        lineButton.innerText = "Line";
        lineButton.value = "line";
        div.appendChild(lineButton);

        Object.defineProperties(this, {
            domNode: {
                value: div
            },
            view: {
                value: view
            },
            points: {
                value: new Collection()
            }
        });

        var drawnPointsCount = 0;
        var pointCount = 0;

        function triggerDrawStartEvent(e) {
            var button = e.target;
            // drawnPoints = 0;
            pointCount = button.value === "line" ? 2 : 1;
            self.points.removeAll();

            var evt = new CustomEvent("draw-start", {
                detail: {
                    geometryType: button.value
                }
            });

            div.dispatchEvent(evt);
        }

        [pointButton, lineButton].forEach(function (button) {
            button.addEventListener("click", triggerDrawStartEvent);
        });
    }

    return DrawButtons;
});