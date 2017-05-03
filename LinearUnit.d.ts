import { IUnitValueTypes, UnitValue  } from "./index";

declare class LinearUnit {
    constructor(distance?: number, units?: UnitValue);
    public distance: number;
    public units: UnitValue;
    public static UNIT_VALUES: IUnitValueTypes;
}

export = LinearUnit;
