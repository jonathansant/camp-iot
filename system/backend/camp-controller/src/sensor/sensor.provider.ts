import {ISensorService} from "./sensor.service";
import {IVariableProvider} from "../variable/variable";
import {Sensor} from "./sensor.model";
import {IUserService, User} from "../user/user";
import {IJobProvider} from "../job/job";

export interface ISensorProvider {
    createSensor(sensor: Sensor, userId: string): Promise<Sensor>;
    updateSensor(sensor: Sensor): Promise<void>;
    deleteSensor(userId: string, sensorId: string): Promise<void>;
    getAllSensors(userId: string): Promise<Sensor[]>;
    getSensor(sensorId: string): Promise<Sensor>;
    validateSensor(sensor: Sensor): Promise<Sensor>;
}

export class SensorProvider implements ISensorProvider {

    static $inject = ["ISensorService", "IUserService", "IVariableProvider", "IJobProvider"];

    constructor(private sensorService: ISensorService,
                private userService: IUserService,
                private variableProvider: IVariableProvider,
                private jobProvider: IJobProvider) {
    }

    createSensor(sensor: Sensor, userId: string): Promise<Sensor> {
        return this.sensorService
            .createSensor(sensor, userId)
            .then((sensor: Sensor) => {
                return this.userService
                    .addSensorToUser(userId, sensor._id)
                    .then(() => {
                        return sensor;
                    });
            });
    }

    updateSensor(sensor: Sensor): Promise<void> {
        return this.sensorService.updateSensor(sensor);
    }

    deleteSensor(userId: string, sensorId: string): Promise<void> {
        return this.sensorService
            .getSensor(sensorId)
            .then((sensor: Sensor) => {
                this.sensorService.deleteSensor(userId, sensorId);
                return sensor;
            })
            .then((sensor: Sensor) => {
                return this.userService
                    .removeSensorFromUser(userId, sensorId)
                    .then(() => {
                        return sensor;
                    });
            })
            .then((sensor: Sensor) => {
                this.variableProvider.deleteVariables(sensor.variables);
                this.jobProvider.deleteJobs(sensor.jobs);
            });
    }

    getAllSensors(userId: string): Promise<Sensor[]> {
        return this.userService
            .findUserById(userId)
            .then((user: User) => {
                return this.sensorService.getAllSensors(user.sensors);
            });
    }

    getSensor(sensorId: string): Promise<Sensor> {
        return this.sensorService.getSensor(sensorId);
    }

    validateSensor(sensor: Sensor): Promise<Sensor> {
        return this.sensorService.validateSensor(sensor);
    }
}