import {CampModel} from "../shared/models/camp.model";

export interface Job extends CampModel {
    name: string;
    parameters: string[];
}

export interface JobRequest {
    job: Job;
    sensorId: string;
}

export interface Invocation {
    jobId: string;
    parameterValues: ParameterValues;
}

export interface ParameterValues {
    [parameterName:string]: string;
}