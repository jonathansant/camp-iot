import {ISensorService} from "./sensor.service";
import {Sensor} from "./sensor.model";
import {IFormController, IPromise} from "angular";
import * as _ from "lodash";
import {IEntityListControlable} from "../entity-list/entity-list.controller";
import {BaseController} from "../shared/controllers/base.controller";

export class SensorController extends BaseController implements IEntityListControlable {
    sensors: Sensor[];
    name: string;

    constructor(private sensorService: ISensorService,
                protected FoundationApi: any) {
        "ngInject";
        super(FoundationApi);

        this.getAllSensors();
    }

    addSensor(form: IFormController): void {
        if (form.$valid) {
            this.sensorService.addSensor(this.name)
                .then((sensor: Sensor) => {
                    this.sensors.push(sensor);
                })
                .catch(() => {
                    this.genericErrorNotification();
                });
        } else {
            this.FoundationApi.publish("main-notifications", {
                title: "Missing data",
                content: "Please fill in the name of the sensor",
                color: "warning",
            });
        }
    }

    remove(sensorId: string): IPromise<void> {
        return this.sensorService.removeSensor(sensorId)
            .then(() => {
                _.remove(this.sensors, (sensor: Sensor) => {
                    return sensor._id === sensorId;
                });
            })
            .catch(() => {
                this.genericErrorNotification();
            });
    }

    private getAllSensors(): void {
        this.sensorService.getAllSensors()
            .then((sensors: Sensor[]) => {
                this.sensors = sensors;
            })
            .catch(() => {
                this.genericErrorNotification();
            });
    }
}