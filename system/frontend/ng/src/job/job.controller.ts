import {BaseController} from "../shared/controllers/base.controller";
import {IEntityListControlable} from "../entity-list/entity-list.controller";
import * as _ from "lodash";
import {IFormController} from "angular";
import {IJobService} from "./job.service";
import {Job} from "./job.model";

export class JobController extends BaseController implements IEntityListControlable {
    static id = "jobController";

    newJob: Job = {
        name: "",
        parameters: []
    };

    jobTypes: any[];

    private currentParamIndex = 0;

    constructor(private jobService: IJobService,
                protected FoundationApi: any,
                private $stateParams: any,
                private $scope: any) {
        "ngInject";

        super(FoundationApi);

        this.loadJobs();
    }

    remove(jobId: string): angular.IPromise<void> {
        return this.jobService.removeJob(this.$stateParams.id, jobId)
            .then(() => {
                _.remove((<any>this).jobs, (job: Job) => {
                    return job._id === jobId;
                });
            })
            .catch(() => {
                this.genericErrorNotification();
            });
    }

    addJob(form: IFormController): void {
        if (form.$valid) {
            this.jobService.addJob(this.newJob, this.$stateParams.id)
                .then((job: Job) => {
                    (<any>this).jobs.push(job);
                    this.clearForm();
                    form.$setPristine();
                })
                .catch(() => {
                    this.genericErrorNotification();
                });
        } else {
            this.FoundationApi.publish("main-notifications", {
                title: "Missing data",
                content: "Please fill in the name of the Job",
                color: "warning",
            });
        }
    }

    addBlankParam(): void {
        this.newJob.parameters[this.currentParamIndex++] = "";
    }

    clearForm(): void {
        this.newJob = {
            name: "",
            parameters: []
        };

        this.currentParamIndex = 0;
    }

    private loadJobs(): void {
        this.jobService.getAllJobs(this.$stateParams.id)
            .then((jobs: Job[]) => {
                (<any>this).jobs = jobs;
            })
            .catch((err: Error) => {
                this.genericErrorNotification(err.message);
            });
    }
}