import {CampModel} from "../shared/models/camp.model";

export enum VariableType {
    Boolean = 0,
    Number = 1
}

export interface Variable extends CampModel {
    type: VariableType;
    isStream: boolean;
    value: boolean|number;
}

export interface Stream extends CampModel {
    value: any;
    variableId: string;
    timeStamp: Date;
}

export class StreamSeries {
    x: Date;
    y: number;

    toCoordinate(): Array<string|number> {
        let yValue = this.y;
        if (typeof  this.y === "boolean") {
            yValue = yValue ? 1 : 0;
        }

        return [this.x.toLocaleString("en-GB"), yValue];
    }
}

export interface SocketBindingProperties {
    url: string;
    eventName: string;
    handlerId: string;
}

export interface VariableRequest {
    variable: Variable;
    sensorId: string;
}