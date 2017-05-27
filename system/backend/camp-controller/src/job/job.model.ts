import {NotEmpty} from "validator.ts/decorator/Validation";
import {CampModel} from "../shared/model/common.model";

export class Job extends CampModel {

    @NotEmpty()
    name: string;

    parameters: string[];
}

export interface ParameterValues {
    [parameterName:string]: string;
}