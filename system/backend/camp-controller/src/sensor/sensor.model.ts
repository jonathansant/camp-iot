import {CampModel} from "../shared/model/common.model";
import {NotEmpty} from "validator.ts/decorator/Validation";

export class Sensor extends CampModel {

    @NotEmpty()
    name: string;

    variables: string[];

    jobs: string[];

}