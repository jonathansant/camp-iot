import {IWorkerService} from "../worker/worker.service";
import {Logger} from "bunyan";
import {WorkerMessage, Command, WorkerMessageData} from "./messaging.model";
import {ParameterValues} from "../job/job";

export interface IMessagingService {
    registerIOSubscription(sensorId: string,
                           topicId: string,
                           taskKey: string,
                           isRemovableHandler?: boolean): Promise<string>;

    registerSensor(sensorId: string): Promise<void>;
    unsubscribeIO(handlerId: string): Promise<void>;
    publishMessage(sensorId: string, jobId: string, parameters: ParameterValues): Promise<void>;
    registerJob(sensorId: string, jobId: string): Promise<void>;
    brokerPid: number;
}

export class MessagingService implements IMessagingService {
    static $inject = ["IWorkerService", "Logger"];

    private _brokerPid: number;

    constructor(private workerService: IWorkerService,
                private logger: Logger) {
    }

    set brokerPid(pid: number) {
        this._brokerPid = pid;
    }

    registerIOSubscription(sensorId: string,
                           topicId: string,
                           taskKey: string,
                           isRemovableHandler: boolean = false): Promise<string> {

        if (this._brokerPid) {
            this.workerService
                .sendMessage(this._brokerPid, <WorkerMessage>{
                    command: Command.subscribe,
                    payload: {
                        topic: topicId,
                        sensor: sensorId,
                        taskKey: taskKey,
                        isRemovableHandler: isRemovableHandler
                    }
                })
                .catch((err: Error) => {
                    this.logger.error(err);
                    return Promise.reject(err);
                });

            let promise = (resolve: Function) => {
                this.workerService.onMessage(this._brokerPid, Command.handlerRegistered, (data: WorkerMessageData) => {
                    resolve(data.handlerId);
                });
            };

            return new Promise<string>(promise);

        } else {
            this.logger.warn("_brokerPid was empty!");
            Promise.resolve();
        }
    }

    registerSensor(sensorId: string): Promise<void> {
        if (this._brokerPid) {
            return this.workerService
                .sendMessage(this._brokerPid, <WorkerMessage>{
                    command: Command.registerSensor,
                    payload: {
                        sensor: sensorId
                    }
                })
                .catch((err: Error) => {
                    this.logger.error(err);
                    return Promise.reject(err);
                });
        } else {
            this.logger.warn("_brokerPid was empty!");
            Promise.resolve();
        }
    }

    registerJob(sensorId: string, jobId: string): Promise<void> {
        if (this._brokerPid) {
            return this.workerService
                .sendMessage(this._brokerPid, <WorkerMessage>{
                    command: Command.registerJob,
                    payload: {
                        sensor: sensorId,
                        topic: jobId
                    }
                })
                .catch((err: Error) => {
                    this.logger.error(err);
                    return Promise.reject(err);
                });
        } else {
            this.logger.warn("_brokerPid was empty!");
            Promise.resolve();
        }
    }

    unsubscribeIO(handlerId: string): Promise<void> {
        if (this._brokerPid) {
            return Promise.resolve(
                this.workerService.sendMessage(this._brokerPid, <WorkerMessage>{
                    command: Command.unsubscribe,
                    payload: {
                        handlerId: handlerId
                    }
                })
            );

        } else {
            this.logger.warn("_brokerPid was empty!");
            Promise.resolve();
        }
    }

    publishMessage(sensorId: string, jobId: string, parameters: ParameterValues): Promise<void> {
        if (this._brokerPid) {
            return this.workerService.sendMessage(this._brokerPid, <WorkerMessage>{
                command: Command.publish,
                payload: {
                    data: parameters,
                    sensor: sensorId,
                    topic: jobId
                }
            });

        } else {
            this.logger.warn("_brokerPid was empty!");
            Promise.resolve();
        }
    }
}