Linear Referencing Geoprocessing Service Client
===============================================

Development Environment
-----------------------
* [Visual Studio 2015]
    * [Web Extension Pack]

LrsGP module
------------
The main module is the `LrsGP` module. These are [UMD] modules that can be used in [Node], [AMD], or browser globals.

### Browser ###

#### AMD ####

See `demo/index.html` for an [AMD] example.

#### Browser global scope ####

If loading via HTML `script` tags, the modules must be loaded in this order.

1. `objectUtils.js`
2. `arcGisRestApiUtils.js`
3. `LinearUnit.js`
3. `EventTableProperties.js`
4. `LrsGPParameters.js`
5. `LrsGP.js`


Unit Tests
----------

There are [Jasmine] tests for both browser and [Node] environments.

* Node tests are in the `spec` folder
* Browser tests are in the `tests` folder. Test is run by opening the `SpecRunner.html` file.

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

API Reference
-------------

## Modules

<dl>
<dt><a href="#module_LrsGP">LrsGP</a></dt>
<dd><p>A module for calling the LRS geoprocessing service.</p>
</dd>
<dt><a href="#module_LrsGPParameters">LrsGPParameters</a></dt>
<dd><p>A module defining parameters object for the LRS geoprocessing service.</p>
</dd>
<dt><a href="#module_LinearUnit">LinearUnit</a></dt>
<dd><p>A module for calling the LRS geoprocessing service.</p>
</dd>
<dt><a href="#module_RouteDraw">RouteDraw</a></dt>
<dd><p>Extension of <a href="#external_Draw">Draw</a></p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#RouteDraw">RouteDraw</a></dt>
<dd></dd>
</dl>

## External

<dl>
<dt><a href="#external_FeatureSet">FeatureSet</a></dt>
<dd><p>ArcGIS REST API feature set.</p>
</dd>
<dt><a href="#external_Geometry">Geometry</a></dt>
<dd><p>ArcGIS REST API geometry definitions.</p>
</dd>
<dt><a href="#external_SpatialReference">SpatialReference</a></dt>
<dd><p>ArcGIS REST API spatial reference</p>
</dd>
<dt><a href="#external_GPResult">GPResult</a></dt>
<dd><p>Geoprocessing result.</p>
</dd>
<dt><a href="#external_Draw">Draw</a></dt>
<dd><p>Draw toolbar</p>
</dd>
<dt><a href="#external_GraphicsLayer">GraphicsLayer</a></dt>
<dd><p>Graphics Layer</p>
</dd>
</dl>

<a name="module_LrsGP"></a>

## LrsGP
A module for calling the LRS geoprocessing service.


* [LrsGP](#module_LrsGP)
    * [LrsGP](#exp_module_LrsGP--LrsGP) ⏏
        * [new LrsGP(options)](#new_module_LrsGP--LrsGP_new)
        * _instance_
            * [.pointsToRouteEvents(lrsGpParams)](#module_LrsGP--LrsGP+pointsToRouteEvents) ⇒ <code>[Promise.&lt;FeatureSet&gt;](#external_FeatureSet)</code>
            * [.pointsToRouteSegments(lrsGpParams)](#module_LrsGP--LrsGP+pointsToRouteSegments) ⇒ <code>[Promise.&lt;FeatureSet&gt;](#external_FeatureSet)</code>
        * _inner_
            * [~url](#module_LrsGP--LrsGP..url) : <code>string</code>
            * [~pointTaskUrl](#module_LrsGP--LrsGP..pointTaskUrl) : <code>string</code>
            * [~linesTaskUrl](#module_LrsGP--LrsGP..linesTaskUrl) : <code>string</code>

<a name="exp_module_LrsGP--LrsGP"></a>

### LrsGP ⏏
**Kind**: Exported class
<a name="new_module_LrsGP--LrsGP_new"></a>

#### new LrsGP(options)
**Throws**:

- <code>TypeError</code> Thrown if either no options are provided or no "url" is provided within the options.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Constructor options. |
| options.url | <code>string</code> |  | The URL of the linear referencing GP service. |
| [options.async] | <code>Boolean</code> | <code>false</code> | Specifies that the GP service is asynchronous. |
| [options.pointTaskName] | <code>string</code> | <code>&quot;\&quot;Points to Route Events\&quot;&quot;</code> | Name of the task that converts points to route events. |
| [options.linesTaskName] | <code>string</code> | <code>&quot;\&quot;Points to Route Segments\&quot;&quot;</code> | Name of the task that converts polylines to route events. |

**Example**
```js
var lrs = new LrsGP({url: "http://example.com/arcgis/rest/services/OptionalFolderLevel/LinearReferencing/GPServer" });
```
<a name="module_LrsGP--LrsGP+pointsToRouteEvents"></a>

#### lrsGP.pointsToRouteEvents(lrsGpParams) ⇒ <code>[Promise.&lt;FeatureSet&gt;](#external_FeatureSet)</code>
Locates points along routes.

**Kind**: instance method of <code>[LrsGP](#exp_module_LrsGP--LrsGP)</code>
**Returns**: <code>[Promise.&lt;FeatureSet&gt;](#external_FeatureSet)</code> - - Returns a promise with a Feature Set.

| Param | Type | Description |
| --- | --- | --- |
| lrsGpParams | <code>[LrsGPParameters](#module_LrsGPParameters)</code> | LRS GP Parameters. |

**Example**
```js
var inFeatures = {
 "geometryType": "esriGeometryPoint",
 "spatialReference": {
     "wkid": 2927
 },
 "features": [
   {
       "geometry": {
           "x": 1108486.9299805611,
           "y": 647781.35678572953
       }
   },
   {
       "geometry": {
           "x": 1109214.2005076408,
           "y": 648022.67913772166
       }
   }
  ]
 };

 var lrsParams = new LrsGPParameters({
     Input_Features = inFeatures,
     Search_Radius = new LinearUnit(50, LinearUnit.UNIT_VALUES.FEET)
 });
 var gp = new LrsGP(new LrsGP({
     url: "http://example.com/arcgis/rest/services/OptionalFolderLevel/LinearReferencing/GPServer"
 });
 gp.pointsToRouteEvents(lrsParams).then(function(featureSet) {
     // Do something with the feature set.
     console.debug(featureSet);
 });
```
<a name="module_LrsGP--LrsGP+pointsToRouteSegments"></a>

#### lrsGP.pointsToRouteSegments(lrsGpParams) ⇒ <code>[Promise.&lt;FeatureSet&gt;](#external_FeatureSet)</code>
Locates line segments along routes.

**Kind**: instance method of <code>[LrsGP](#exp_module_LrsGP--LrsGP)</code>
**Returns**: <code>[Promise.&lt;FeatureSet&gt;](#external_FeatureSet)</code> - - Returns a promise with a Feature Set.

| Param | Type | Description |
| --- | --- | --- |
| lrsGpParams | <code>[LrsGPParameters](#module_LrsGPParameters)</code> | LRS GP Parameters. |

**Example**
```js
var inFeatures = {
 "geometryType": "esriGeometryPoint",
 "spatialReference": {
     "wkid": 2927
 },
 "features": [
   {
       "geometry": {
           "x": 1108486.9299805611,
           "y": 647781.35678572953
       }
   },
   {
       "geometry": {
           "x": 1109214.2005076408,
           "y": 648022.67913772166
       }
   }
  ]
 };

 var lrsParams = new LrsGPParameters({
     Input_Features = inFeatures,
     Search_Radius = new LinearUnit(50, LinearUnit.UNIT_VALUES.FEET)
 });
 var gp = new LrsGP(new LrsGP({
     url: "http://example.com/arcgis/rest/services/OptionalFolderLevel/LinearReferencing/GPServer"
 });
 gp.pointsToRouteSegements(lrsParams).then(function(featureSet) {
     // Do something with the feature set.
     console.debug(featureSet);
 });
```
<a name="module_LrsGP--LrsGP..url"></a>

#### LrsGP~url : <code>string</code>
The geoprocessing service URL.

**Kind**: inner property of <code>[LrsGP](#exp_module_LrsGP--LrsGP)</code>
<a name="module_LrsGP--LrsGP..pointTaskUrl"></a>

#### LrsGP~pointTaskUrl : <code>string</code>
URL for the point location task.

**Kind**: inner property of <code>[LrsGP](#exp_module_LrsGP--LrsGP)</code>
<a name="module_LrsGP--LrsGP..linesTaskUrl"></a>

#### LrsGP~linesTaskUrl : <code>string</code>
URL for the line segment location task.

**Kind**: inner property of <code>[LrsGP](#exp_module_LrsGP--LrsGP)</code>
<a name="module_LrsGPParameters"></a>

## LrsGPParameters
A module defining parameters object for the LRS geoprocessing service.

<a name="exp_module_LrsGPParameters--LrsGPParameters"></a>

### LrsGPParameters ⏏
**Kind**: Exported class
**See**

- [Locate Features Along Routes](http://desktop.arcgis.com/en/arcmap/latest/tools/linear-ref-toolbox/locate-features-along-routes.htm)
- [Make Route Event Layer](http://desktop.arcgis.com/en/arcmap/latest/tools/linear-ref-toolbox/make-route-event-layer.htm)

<a name="module_LinearUnit"></a>

## LinearUnit
A module for calling the LRS geoprocessing service.


* [LinearUnit](#module_LinearUnit)
    * [LinearUnit](#exp_module_LinearUnit--LinearUnit) ⏏
        * [new LinearUnit([distance], [units])](#new_module_LinearUnit--LinearUnit_new)
        * _static_
            * [.UNIT_VALUES](#module_LinearUnit--LinearUnit.UNIT_VALUES) : <code>Object.&lt;string, string&gt;</code>
        * _inner_
            * [~distance](#module_LinearUnit--LinearUnit..distance) : <code>number</code>
                * [.set(v)](#module_LinearUnit--LinearUnit..distance.set)
            * [~units](#module_LinearUnit--LinearUnit..units) : <code>string</code>

<a name="exp_module_LinearUnit--LinearUnit"></a>

### LinearUnit ⏏
**Kind**: Exported class
**See**: [UNIT_VALUES](#module_LinearUnit--LinearUnit.UNIT_VALUES) constants.
<a name="new_module_LinearUnit--LinearUnit_new"></a>

#### new LinearUnit([distance], [units])
**Throws**:

- <code>TypeError</code> Thrown if caller attempts to set distance to a non-number value or units to non-string.
- <code>Error</code> Thrown if caller attempts to set distance to a number that is less than zero or units to an invalid value.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [distance] | <code>number</code> | <code>0</code> | The numeric distance. |
| [units] | <code>string</code> | <code>&quot;\&quot;esriFeet\&quot;&quot;</code> | The linear unit name. |

<a name="module_LinearUnit--LinearUnit.UNIT_VALUES"></a>

#### LinearUnit.UNIT_VALUES : <code>Object.&lt;string, string&gt;</code>
List of the valid linear unit types.

**Kind**: static constant of <code>[LinearUnit](#exp_module_LinearUnit--LinearUnit)</code>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| FEET | <code>string</code> | "esriFeet" |
| CENTIMETERS | <code>string</code> | "esriCentimeters" |
| DECIMAL_DEGREES | <code>string</code> | "esriDecimalDegrees" |
| DECIMETERS | <code>string</code> | "esriDecimeters" |
| INCHES | <code>string</code> | "esriInches" |
| KILOMETERS | <code>string</code> | "esriKilometers" |
| METERS | <code>string</code> | "esriMeters" |
| MILES | <code>string</code> | "esriMiles" |
| MILLIMETERS | <code>string</code> | "esriMillimeters" |
| NAUTICAL_MILES | <code>string</code> | "esriNauticalMiles" |
| POINTS | <code>string</code> | "esriPoints" |
| UNKNOWN | <code>string</code> | "esriUnknown" |
| YARDS | <code>string</code> | "esriYards" |

<a name="module_LinearUnit--LinearUnit..distance"></a>

#### LinearUnit~distance : <code>number</code>
A number greater than or equal to zero.

**Kind**: inner property of <code>[LinearUnit](#exp_module_LinearUnit--LinearUnit)</code>
<a name="module_LinearUnit--LinearUnit..distance.set"></a>

##### distance.set(v)
**Kind**: static method of <code>[distance](#module_LinearUnit--LinearUnit..distance)</code>

| Param | Type | Description |
| --- | --- | --- |
| v | <code>number</code> | A number greater than zero. |

<a name="module_LinearUnit--LinearUnit..units"></a>

#### LinearUnit~units : <code>string</code>
**Kind**: inner property of <code>[LinearUnit](#exp_module_LinearUnit--LinearUnit)</code>
<a name="module_RouteDraw"></a>

## RouteDraw
Extension of [Draw](#external_Draw)


* [RouteDraw](#module_RouteDraw)
    * [~pointsLayer](#module_RouteDraw..pointsLayer) : <code>[GraphicsLayer](#external_GraphicsLayer)</code>
    * [~querySnapLayers(geometry)](#module_RouteDraw..querySnapLayers) ⇒ <code>Promise.&lt;Array.&lt;external:Graphic&gt;&gt;</code>

<a name="module_RouteDraw..pointsLayer"></a>

### RouteDraw~pointsLayer : <code>[GraphicsLayer](#external_GraphicsLayer)</code>
Point graphics layer.

**Kind**: inner property of <code>[RouteDraw](#module_RouteDraw)</code>
<a name="module_RouteDraw..querySnapLayers"></a>

### RouteDraw~querySnapLayers(geometry) ⇒ <code>Promise.&lt;Array.&lt;external:Graphic&gt;&gt;</code>
Queries all of the layers that are used for snapping for the specified geometry.

**Kind**: inner method of <code>[RouteDraw](#module_RouteDraw)</code>
**Returns**: <code>Promise.&lt;Array.&lt;external:Graphic&gt;&gt;</code> - - The results of multiple feature layer queries.

| Param | Type | Description |
| --- | --- | --- |
| geometry | <code>esri/geometry/Geometry</code> | A geometry that the user has drawn. This will be in the same SR as the map. |

<a name="RouteDraw"></a>

## RouteDraw
**Kind**: global class
<a name="new_RouteDraw_new"></a>

### new constructor(map, options, routeLayers)

| Param | Type | Description |
| --- | --- | --- |
| map | <code>external:esri/Map</code> | Map object. |
| options | <code>Object</code> | Options object. |
| routeLayers | <code>[Array.&lt;GraphicsLayer&gt;](#external_GraphicsLayer)</code> &#124; <code>Array.&lt;string&gt;</code> | An array of either graphics layers or their IDs. |

<a name="external_FeatureSet"></a>

## FeatureSet
ArcGIS REST API feature set.

**Kind**: global external
**See**: [FeatureSet object](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/FeatureSet_object/02r3000002mn000000/)
<a name="external_Geometry"></a>

## Geometry
ArcGIS REST API geometry definitions.

**Kind**: global external
**See**: [Geometry objects](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Geometry_objects/02r3000000n1000000/)
<a name="external_SpatialReference"></a>

## SpatialReference
ArcGIS REST API spatial reference

**Kind**: global external
**See**: [Geometry objects: Spatial Reference](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Geometry_objects/02r3000000n1000000/#GUID-DFF0E738-5A42-40BC-A811-ACCB5814BABC)
<a name="external_GPResult"></a>

## GPResult
Geoprocessing result.

**Kind**: global external
**See**: [GP Result](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/GP_Result/02r3000000q7000000/)
<a name="external_Draw"></a>

## Draw
Draw toolbar

**Kind**: global external
**See**: [Draw](https://developers.arcgis.com/javascript/3/jsapi/draw-amd.html)
<a name="external_GraphicsLayer"></a>

## GraphicsLayer
Graphics Layer

**Kind**: global external
**See**: [GraphicsLayer](https://developers.arcgis.com/javascript/3/jsapi/graphicslayer-amd.html)

[AMD]:https://github.com/amdjs/amdjs-api/wiki
[Jasmine]:https://jasmine.github.io/
[Node]:https://nodejs.org/
[UMD]:https://github.com/umdjs/umd
[Visual Studio 2015]:https://www.visualstudio.com/
[Web Extension Pack]:https://visualstudiogallery.msdn.microsoft.com/f3b504c6-0095-42f1-a989-51d5fc2a8459