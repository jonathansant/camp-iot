import {BaseController} from "../shared/controllers/base.controller";
import {IJobService} from "./job.service";
import {Job, ParameterValues} from "./job.model";

export class JobDetailController extends BaseController {

    job: Job;
    paramValues: ParameterValues = {};

    constructor(private jobService: IJobService,
                protected FoundationApi: any,
                private $stateParams: any) {
        "ngInject";

        super(FoundationApi);

        this.loadJob();
    }

    invokeJob(): void {
        this.jobService
            .invokeJob(this.$stateParams.parentId, this.job._id, this.paramValues)
            .catch(() => {
                this.genericErrorNotification();
            });
    }

    private loadJob(): void {
        this.jobService
            .getJob(this.$stateParams.id)
            .then((job: Job) => {
                this.job = job;
            })
            .catch((err: Error) => {
                this.genericErrorNotification(err.message);
            });
    }
}