/// <reference path="objectUtils.js" />
/// <reference path="arcGisRestApiUtils.js" />
/// <reference path="LinearUnit.js" />
/// <reference path="LrsGPParameters.js" />
/// <reference path="LrsGP.js" />

/*eslint-env worker*/
importScripts('objectUtils.js',
    'arcGisRestApiUtils.js',
    'LinearUnit.js',
    'LrsGPParameters.js',
    'LrsGP.js');

self.addEventListener("message", function (message) {
    // Exit if the expected parameters are not provided.
    console.debug("worker message from worker", message);
    if (!(message.data && message.data.url && message.data.gpParameters)) {
        self.postMessage("Not provided: 'url' and 'gpParameters' properties.");
        self.close();
        return;
    }

    var gp = new LrsGP({
        url: message.data.url
    });

    var gpParams = new LrsGPParameters(message.data.gpParameters);

    var geometryType = arcGisRestApiUtils.getFeatureSetGeometryType(gpParams.Input_Features);

    var responseHandler = function (gpResults) {
        self.postMessage(gpResults);
        self.close();
    };

    var errorHandler = function (error) {
        self.postMessage(error);
        self.close();
    };

    if (/line/.test(geometryType)) {
        gp.linesToRouteEvents(gpParams).then(responseHandler, errorHandler);
    } else {
        gp.pointsToRouteEvents(gpParams).then(responseHandler, errorHandler);
    }
}, true);