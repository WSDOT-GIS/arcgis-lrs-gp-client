Linear Referencing Geoprocessing Service Client
===============================================

Development Environment
-----------------------
* [Visual Studio 2015]
    * [Web Extension Pack]

LrsGP module
------------
The main module is the `LrsGP` module. If loading via HTML `script` tags, the modules must be loaded in this order.

1. `objectUtils.js`
2. `arcGisRestApiUtils.js`
3. `LinearUnit.js`
4. `LrsGPParameters.js`
5. `LrsGP.js`


Unit Test
---------
There is a [Jasmine] test in the `test` folder.

Demo
----

There is a demo application in the `demo` folder.

[Jasmine]:https://jasmine.github.io/
[Visual Studio 2015]:https://www.visualstudio.com/
[Web Extension Pack]:https://visualstudiogallery.msdn.microsoft.com/f3b504c6-0095-42f1-a989-51d5fc2a8459