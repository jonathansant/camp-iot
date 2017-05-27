import {fork} from "child_process";
import {Logger} from "bunyan";
import {WorkerMessage, Command} from "../messaging/messaging";
import {ChildProcess} from "child_process";
import {WorkerMessageData} from "../messaging/messaging.model";

export interface IWorkerService {
    createProcess(processPath: string): Promise<ChildProcess>;
    sendMessage(pid: string|number, msg: any): Promise<void>;
    terminate(pid: string): void;
    onMessage(pid: string|number, command: Command, handler: (data: WorkerMessageData) => void): void;
}

export class WorkerService implements IWorkerService {
    static $inject = ["Logger"];

    private _workers: Map<string, ChildProcess>;

    constructor(private logger: Logger) {
        this._workers = new Map<string, ChildProcess>();
    }

    createProcess(processPath: string): Promise<ChildProcess> {
        let creator = (resolve: Function, reject: Function) => {

            let worker = fork(processPath);

            worker.on("message", (msg: WorkerMessage) => {
                if (msg.command && msg.command === Command.init) {
                    resolve(worker);
                }
            });

            worker.on("error", (err: Error) => {
                this.logger.error(err);
                reject(err);
            });

            this._workers.set(worker.pid.toString(), worker);
        };

        return new Promise<ChildProcess>(creator);
    }

    sendMessage(pid: string|number, msg: WorkerMessage): Promise<void> {
        return new Promise<void>((resolve) => {
            this._workers.get(pid.toString()).send(msg);
            resolve();
        });
    }

    onMessage(pid: string|number, command: Command, handler: (data: WorkerMessageData) => void): void {
        this._workers.get(pid.toString()).on("message", (msg: WorkerMessage) => {
            if (command === msg.command) {
                handler(msg.payload);
            }
        });
    }

    terminate(pid: string) {
        this._workers.get(pid).disconnect();
    }
}