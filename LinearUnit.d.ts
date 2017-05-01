export interface IUnitValueTypes {
    FEET: "esriFeet";
    CENTIMETERS: "esriCentimeters";
    DECIMAL_DEGREES: "esriDecimalDegrees";
    DECIMETERS: "esriDecimeters";
    INCHES: "esriInches";
    KILOMETERS: "esriKilometers";
    METERS: "esriMeters";
    MILES: "esriMiles";
    MILLIMETERS: "esriMillimeters";
    NAUTICAL_MILES: "esriNauticalMiles";
    POINTS: "esriPoints";
    UNKNOWN: "esriUnknown";
    YARDS: "esriYards";
}

export type UnitValue =
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

export class LinearUnit {
    constructor(distance?: number, units?: UnitValue);
    public distance: number;
    public units: UnitValue;
    public static UNIT_VALUES: IUnitValueTypes;
}
