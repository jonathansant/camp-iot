import {CampModel} from "../shared/model/common.model";
import {NotEmpty} from "validator.ts/decorator/Validation";

export class Variable extends CampModel {

    @NotEmpty()
    name: string;

    type: VariableType;

    isStream: boolean;

    value: boolean | number;
}

// export type VariableType = "boolean" | "number";

export enum VariableType {
    Boolean = 0,
    Number = 1
}

export interface SocketBindingProperties {
    url: string;
    eventName: string;
    handlerId: string;
}