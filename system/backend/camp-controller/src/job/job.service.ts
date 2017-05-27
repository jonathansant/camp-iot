import {Job} from "./job.model";
import {Logger} from "bunyan";
import {IValidator} from "../shared/service/validator.service";
import {IJobRepository} from "../storage/storage";
import * as _ from "lodash";

export interface IJobService {
    createJob(job: Job): Promise<Job>;
    validateJob(job: Job): Promise<Job>;
    getAllJobs(jobIds: string[]): Promise<Job[]>;
    deleteJob(jobId: string): Promise<void>;
    getJob(jobId: string): Promise<Job>;
    deleteJobs(jobIds: string[]): Promise<void[]>;
}

export class JobService implements IJobService {

    static $inject = [
        "IJobRepository",
        "IValidator",
        "Logger"
    ];

    constructor(private jobRepository: IJobRepository,
                private validator: IValidator,
                private logger: Logger) {
    }

    createJob(job: Job): Promise<Job> {
        job.parameters = _.compact(job.parameters);

        return this.jobRepository
            .save(job)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    validateJob(job: Job): Promise<Job> {
        let validate = (resolve: Function, reject: Function) => {
            let errors = this.validator.validate(job);
            if (errors && errors.length > 0) {
                reject(errors);
                return;
            }

            resolve(job);
        };

        return new Promise(validate);
    }

    getAllJobs(jobIds: string[]): Promise<Job[]> {
        return this.jobRepository
            .findMany(jobIds)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    deleteJob(jobId: string): Promise<void> {
        return this.jobRepository
            .delete(jobId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    getJob(jobId: string): Promise<Job> {
        return this.jobRepository
            .find(jobId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    deleteJobs(jobIds: string[]): Promise<void[]> {
        return this.jobRepository
            .deleteMany(jobIds)
            .then(() => {
                return [];
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }
}