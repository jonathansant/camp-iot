import {IHttpService, IPromise} from "angular";
import {Sensor} from "./sensor.model";
import {Config} from "../config/config.model";
import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;

export interface ISensorService {
    getAllSensors(): IPromise<Sensor[]>;
    addSensor(name: string): IPromise<Sensor>;
    removeSensor(id: string): IPromise<void>;
    getSensor(id: string): IPromise<Sensor>;
    //addVariable(variable: Variable, sensorId: string): IPromise<Variable>;
}

export class SensorService implements ISensorService {
    static id = "sensorService";

    constructor(private $http: IHttpService,
                private config: Config) {
        "ngInject";
    }

    getAllSensors(): IPromise<Sensor[]> {
        return this.$http.get(`${this.config.apiEndpointUrl}/api/sensor`)
            .then((response: IHttpPromiseCallbackArg<Sensor[]>) => {
                return response.data;
            });
    }

    addSensor(name: string): IPromise<Sensor> {
        return this.$http.post(`${this.config.apiEndpointUrl}/api/sensor`, {
                name: name
            })
            .then((response: IHttpPromiseCallbackArg<Sensor>) => {
                return response.data;
            });
    }

    removeSensor(id: string): IPromise<void> {
        return this.$http.delete(`${this.config.apiEndpointUrl}/api/sensor`, {
                params: {
                    id: id
                }
            })
            .then(() => {
                return;
            });
    }

    getSensor(id: string): IPromise<Sensor> {
        return this.$http.get(`${this.config.apiEndpointUrl}/api/sensor/${id}`)
            .then((response: IHttpPromiseCallbackArg<Sensor>) => {
                return response.data;
            });
    }

    // addVariable(variable: Variable, sensorId: string): IPromise<Variable> {
    //
    //     let request: VariableRequest = {
    //         variable: variable,
    //         sensorId: sensorId
    //     };
    //
    //     return this.$http.post(`${this.config.apiEndpointUrl}/api/variable`, request)
    //         .then((response: IHttpPromiseCallbackArg<Variable>) => {
    //             return response.data;
    //         });
    // }
}