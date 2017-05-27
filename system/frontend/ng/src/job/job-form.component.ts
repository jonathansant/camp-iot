import {IComponentOptions} from "angular";
import {JobController} from "./job.controller";

export class JobFormComponent {
    static id = "jobForm";

    static component(): IComponentOptions {
        return {
            bindings: {
                jobs: "="
            },
            templateUrl: "templates/job-form.html",
            controller: JobController,
            controllerAs: "vm"
        };
    }
}