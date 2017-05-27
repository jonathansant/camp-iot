import {Job, ParameterValues} from "./job.model";
import {IJobService} from "./job.service";
import {ISensorService, Sensor} from "../sensor/sensor";
import {IMessagingService} from "../messaging/messaging";
import {Logger} from "bunyan";

export interface IJobProvider {
    createJob(job: Job, sensorId: string): Promise<Job>;
    validateJob(job: Job): Promise<Job>;
    getAllJobs(sensorId: string): Promise<Job[]>;
    deleteJob(sensorId: string, jobId: string): Promise<void>;
    getJob(jobId: string): Promise<Job>;
    deleteJobs(jobIds: string[]): Promise<void>;
    invokeJob(sensorId: string, jobId: string, parameters: ParameterValues): Promise<void>;
}

export class JobProvider implements IJobProvider {

    static $inject = [
        "IJobService",
        "ISensorService",
        "IMessagingService",
        "Logger"
    ];

    constructor(private jobService: IJobService,
                private sensorService: ISensorService,
                private messagingService: IMessagingService,
                private logger: Logger) {
    }

    createJob(job: Job, sensorId: string): Promise<Job> {
        return this.jobService
            .createJob(job)
            .then((createdJob: Job) => {
                return this.sensorService
                    .addJobToSensor(sensorId, createdJob._id)
                    .then(() => {
                        return createdJob;
                    });
            })
            .then((createdJob: Job) => {
                this.registerJobWithBroker(sensorId, createdJob);
                return createdJob;
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    validateJob(job: Job): Promise<Job> {
        return this.jobService.validateJob(job);
    }

    getAllJobs(sensorId: string): Promise<Job[]> {
        return this.sensorService.getSensor(sensorId)
            .then((sensor: Sensor) => {
                return this.jobService.getAllJobs(sensor.jobs);
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    deleteJob(sensorId: string, jobId: string): Promise<void> {
        return this.jobService
            .deleteJob(jobId)
            .then(() => {
                this.sensorService
                    .removeJobFromSensor(sensorId, jobId);
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    getJob(jobId: string): Promise<Job> {
        return this.jobService
            .getJob(jobId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    deleteJobs(jobIds: string[]): Promise<void> {
        return this.jobService
            .deleteJobs(jobIds)
            .then(() => {
                return;
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    invokeJob(sensorId: string, jobId: string, parameters: ParameterValues): Promise<void> {
        return this.messagingService
            .publishMessage(sensorId, jobId, parameters)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    private registerJobWithBroker(sensorId: string, createdJob: Job) {
        return this.messagingService
            .registerJob(sensorId, createdJob._id)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }
}