define([], function () {
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
                value: []
            }
        });

        // var drawnPoints = 0;
        var pointCount = 0;

        function triggerDrawStartEvent(e) {
            var button = e.target;
            // drawnPoints = 0;
            pointCount = button.value === "line" ? 2 : 1;
            points = [];

            var evt = new CustomEvent("draw-start", {
                detail: {
                    geometryType: button.value
                }
            })
        }

        [pointButton, lineButton].forEach(function (button) {
            button.addEventListener("click", triggerDrawStartEvent);
        });
    }

    return DrawButtons;
});