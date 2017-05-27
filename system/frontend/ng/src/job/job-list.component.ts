import {IComponentOptions} from "angular";
import {JobController} from "./job.controller";

export class JobListComponent {
    static id = "jobList";

    static component(): IComponentOptions {
        return {
            bindings: {
                jobs: "=",
                sensorId: "<"
            },
            templateUrl: "templates/job-list.html",
            controller: JobController,
            controllerAs: "vm"
        };
    }
}