declare type UnitValue =
"esriFeet" |
"esriCentimeters" |
"esriDecimalDegrees" |
"esriDecimeters" |
"esriInches" |
"esriKilometers" |
"esriMeters" |
"esriMiles" |
"esriMillimeters" |
"esriNauticalMiles" |
"esriPoints" |
"esriUnknown" |
"esriYards";

interface LinearUnit {
    constructor(distance?:number, units?:UnitValue);
    distance: number;
    units: UnitValue;
}