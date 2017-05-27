import {IHttpService, IPromise, IHttpPromiseCallbackArg} from "angular";
import {Config} from "../config/config.model";
import {Job, JobRequest, ParameterValues} from "./job.model";

export interface IJobService {
    removeJob(sensorId: string, id: string): IPromise<void>;
    getAllJobs(sensorId: string): IPromise<Job[]>;
    addJob(Job: Job, sensorId: string): IPromise<Job>;
    getJob(id: string): IPromise<Job>;
    invokeJob(sensorId: string,
              jobId: string,
              invocationParams: ParameterValues): IPromise<void>;
}

export class JobService implements IJobService {

    static id = "jobService";

    constructor(private $http: IHttpService,
                private config: Config) {
        "ngInject";
    }

    getAllJobs(sensorId: string): IPromise<Job[]> {
        return this.$http
            .get(`${this.config.apiEndpointUrl}/api/job`, {
                params: {sensorId: sensorId}
            })
            .then((response: IHttpPromiseCallbackArg<Job[]>) => {
                return response.data;
            });
    }

    removeJob(sensorId: string, id: string): IPromise<void> {
        return this.$http
            .delete(`${this.config.apiEndpointUrl}/api/job`, {
                params: {
                    jobId: id,
                    sensorId: sensorId
                }
            })
            .then(() => {
                return;
            });
    }

    addJob(job: Job, sensorId: string): IPromise<Job> {
        let request: JobRequest = {
            job: job,
            sensorId: sensorId
        };

        return this.$http
            .post(`${this.config.apiEndpointUrl}/api/job`, request)
            .then((response: IHttpPromiseCallbackArg<Job>) => {
                return response.data;
            });
    }

    getJob(id: string): IPromise<Job> {
        return this.$http
            .get(`${this.config.apiEndpointUrl}/api/job/${id}`)
            .then((response: IHttpPromiseCallbackArg<Job>) => {
                return response.data;
            });
    }

    invokeJob(sensorId: string,
              jobId: string,
              invocationParams: ParameterValues): IPromise<void> {

        return this.$http
            .post(`${this.config.apiEndpointUrl}/api/job/${jobId}/invoke`, {
                sensorId: sensorId,
                parameters: invocationParams
            })
            .then((response: IHttpPromiseCallbackArg<any>) => {
                return;
            });
    }
}