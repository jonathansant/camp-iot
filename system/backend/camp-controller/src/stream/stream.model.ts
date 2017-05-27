import {CampModel} from "../shared/model/common.model";
import {NotEmpty, } from "validator.ts/decorator/Validation";

export class Stream extends CampModel {

    //todo create custom validator for 'value' when 0 (because javascript is stupid and
    // thinks it is empty)

    value: any;

    @NotEmpty()
    variableId: string;

    timeStamp: Date;
}