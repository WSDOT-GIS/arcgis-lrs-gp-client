/// <reference path="objectUtils.js" />
/// <reference path="arcGisRestApiUtils.js" />
/// <reference path="LinearUnit.js" />
/// <reference path="LrsGPParameters.js" />
/// <reference path="LrsGP.js" />

/**
 * For use with a Web Worker to runs a {@link module:LrsGP} process on a separate thread.
 * @module LrsGPWorker
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers|Using web workers}
 */

/*eslint-env worker*/
importScripts(
    'bower_components/core.js/client/core.min.js',
    'bower_components/fetch/fetch.js',
    'objectUtils.js',
    'arcGisRestApiUtils.js',
    'LinearUnit.js',
    'LrsGPParameters.js',
    'LrsGP.js');

self.addEventListener("message", function (message) {
    // Exit if the expected parameters are not provided.
    if (!(message.data && message.data.url && message.data.gpParameters)) {
        self.postMessage("Not provided: 'url' and 'gpParameters' properties.");
        self.close();
        return;
    }

    var gp = new LrsGP({
        url: message.data.url
    });

    var gpParams = new LrsGPParameters(message.data.gpParameters);

    var task = message.data.task;

    var geometryType = arcGisRestApiUtils.getFeatureSetGeometryType(gpParams.Input_Features);

    var responseHandler = function (gpResults) {
        self.postMessage(gpResults);
        self.close();
    };

    var errorHandler = function (error) {
        self.postMessage(error);
        self.close();
    };

    if (task && /Route\s?Segment/i.test(task)) {
        gp.pointsToRouteSegments(gpParams).then(responseHandler, errorHandler);
    } else {
        gp.pointsToRouteEvents(gpParams).then(responseHandler, errorHandler);
    }
}, true);