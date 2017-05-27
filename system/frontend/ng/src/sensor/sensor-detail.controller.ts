import {Sensor} from "./sensor.model";
import {ISensorService} from "./sensor.service";
import {ClipBoard} from "angular-clipboard";
import {BaseController} from "../shared/controllers/base.controller";
import {Variable} from "../variable/variable";
import {Job} from "../job/job.model";


export class SensorDetailController extends BaseController {
    sensor: Sensor;
    newVariable: Variable;
    newJob: Job;
    variables: Variable[];
    jobs: Job[];

    constructor(private $stateParams: any,
                private sensorService: ISensorService,
                private clipboard: ClipBoard,
                protected FoundationApi: any) {
        "ngInject";

        super(FoundationApi);

        let sensorId = $stateParams.id;

        this.loadSensor(sensorId);
    }

    copyToClipboard(data: string): void {
        this.clipboard.copyText(data);
    }

    get sensorId(): string {
        return this.$stateParams.id;
    }

    private loadSensor(sensorId: string): void {
        this.sensorService.getSensor(sensorId)
            .then((sensor: Sensor) => {
                this.sensor = sensor;
            })
            .catch((err: Error) => {
                this.genericErrorNotification(err.message);
            });
    }
}