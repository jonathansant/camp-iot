import {Sensor} from "./sensor.model";
import {Logger} from "bunyan";
import {ISensorModelRepository} from "../storage/storage.service";
import {IValidator} from "../shared/service/validator.service";
import {IMessagingService} from "../messaging/messaging.service";

export interface ISensorService {
    createSensor(sensor: Sensor, userId: string): Promise<Sensor>;
    updateSensor(sensor: Sensor): Promise<void>;
    deleteSensor(userId: string, sensorId: string): Promise<void>;
    getAllSensors(sensorIds: string[]): Promise<Sensor[]>;
    getSensor(sensorId: string): Promise<Sensor>;
    validateSensor(sensor: Sensor): Promise<Sensor>;
    addVariableToSensor(id: string, variableId: string): Promise<Sensor>;
    removeVariableFromSensor(sensorId: string, variableId: string): Promise<Sensor>;
    addJobToSensor(sensorId: string, jobId: string): Promise<Sensor>;
    removeJobFromSensor(sensorId: string, jobId: string): Promise<Sensor>;
}

export class SensorService implements ISensorService {

    static $inject = [
        "ISensorModelRepository",
        "IValidator",
        "Logger",
        "IMessagingService"
    ];

    constructor(private sensorRepository: ISensorModelRepository,
                private validator: IValidator,
                private logger: Logger,
                private messagingService: IMessagingService) {
    }

    createSensor(sensor: Sensor, userId: string): Promise<Sensor> {
        return this.sensorRepository.save(sensor)
            .then((sensor: Sensor) => {
                return Promise.all<void, Sensor>([
                    this.registerSensorWithBroker(sensor),
                    sensor
                ]);
            })
            .then((values: any[]) => {
                return <Sensor>values[1];
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    getAllSensors(sensorIds: string[]): Promise<Sensor[]> {
        return this.sensorRepository
            .findMany(sensorIds)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    getSensor(sensorId: string): Promise<Sensor> {
        return this.sensorRepository.find(sensorId)
            .then((sensor: Sensor) => {
                return sensor;
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    updateSensor(sensor: Sensor): Promise<void> {
        return undefined;
    }

    deleteSensor(userId: string, sensorId: string): Promise<void> {
        return this.sensorRepository
            .delete(sensorId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    validateSensor(sensor: Sensor): Promise<Sensor> {
        let validate = (resolve: Function, reject: Function) => {
            let errors = this.validator.validate(sensor);
            if (errors && errors.length > 0) {
                reject(errors);
                return;
            }

            resolve(sensor);
        };

        return new Promise<Sensor>(validate);
    }

    addVariableToSensor(id: string, variableId: string): Promise<Sensor> {
        return this.sensorRepository.addVariable(id, [variableId])
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    removeVariableFromSensor(sensorId: string, variableId: string): Promise<Sensor> {
        return this.sensorRepository
            .deleteVariable(sensorId, variableId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    addJobToSensor(sensorId: string, jobId: string): Promise<Sensor> {
        return this.sensorRepository.addJob(sensorId, [jobId])
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    removeJobFromSensor(sensorId: string, jobId: string): Promise<Sensor> {
        return this.sensorRepository
            .deleteJob(sensorId, jobId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    private registerSensorWithBroker(sensor: Sensor): Promise<void> {
        return this.messagingService.registerSensor(sensor._id);
    }
}