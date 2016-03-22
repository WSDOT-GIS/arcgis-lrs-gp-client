Linear Referencing Geoprocessing Service Client
===============================================

Development Environment
-----------------------
* [Visual Studio 2015]
    * [Web Extension Pack]

LrsGP module
------------
The main module is the `LrsGP` module. These are [UMD] modules that can be used in either AMD or browser globals.

### AMD ###

See `demo/index.html` for an [AMD] example.

### Browser global scope ###

If loading via HTML `script` tags, the modules must be loaded in this order.

1. `objectUtils.js`
2. `arcGisRestApiUtils.js`
3. `LinearUnit.js`
3. `EventTableProperties.js`
4. `LrsGPParameters.js`
5. `LrsGP.js`


Unit Test
---------
There is a [Jasmine] test in the `test` folder.

Demo
----

There is a demo application in the `demo` folder.

### What the demo does ###

* A route feature layer is present on the map which is used for snapping.
* User zooms to a location, close enough to make route feature layer visible. Drawing tools will become available once the user has zoomed in close enough.
* User draws either a single point or two points defining a start and an end point.
* The route feature layer is queried for routes at the user specified location.
* If more than one matching route is found, a dialog appears and the user must choose one.
* A geoprocessing service is called to locate the route events.
* When the GP service has completed, the located feature is drawn (if successful).

[Jasmine]:https://jasmine.github.io/
[UMD]:https://github.com/umdjs/umd
[Visual Studio 2015]:https://www.visualstudio.com/
[Web Extension Pack]:https://visualstudiogallery.msdn.microsoft.com/f3b504c6-0095-42f1-a989-51d5fc2a8459