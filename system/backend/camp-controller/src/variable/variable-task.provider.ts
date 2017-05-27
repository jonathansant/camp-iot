import {Variable} from "./variable.model";
import {Stream, IStreamService} from "../stream/stream";
import {Logger} from "bunyan";
import {ITaskService} from "../messaging/messaging";
import {IVariableService} from "./variable";

export interface IVariableTaskProvider {
    handleVariableUpdate(data: any): Promise<void>;
    handleVariableSiteUpdate(data: any): void;
}

export class VariableTaskProvider implements IVariableTaskProvider {

    static $inject = [
        "IStreamService",
        "Logger",
        "ITaskService",
        "IVariableService",
        "SocketServer"
    ];

    constructor(private streamService: IStreamService,
                private logger: Logger,
                private taskService: ITaskService,
                private variableService: IVariableService,
                private socket: SocketIO.Server) {

        taskService.registerTask("add-stream", {
            context: this,
            task: this.handleVariableUpdate
        });

        taskService.registerTask("variable-update", {
            context: this,
            task: this.handleVariableSiteUpdate
        });
    }

    handleVariableUpdate(data: any): Promise<void> {
        return this.variableService
            .getVariable(data.variableId)
            .then((variable: Variable) => {
                if (variable.isStream) {
                    let stream = new Stream();
                    stream.value = data.value;
                    stream.variableId = variable._id;

                    this.streamService
                        .validateStream(stream)
                        .then((stream: Stream) => {
                            return this.streamService.createStream(stream);
                        })
                        .catch((errs: Error[]) => {
                            errs.forEach(error => {
                                this.logger.error(error);
                            });
                        });
                }

                this.variableService.updateValue(variable._id, data.value);
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    handleVariableSiteUpdate(data: any): void {
        try {
            let stream = new Stream();
            stream.timeStamp = new Date(Date.now());
            stream.variableId = data.variableId;
            stream.value = data.value;

            this.socket.emit(`variable-update-${data.variableId}-${data.handlerId}`, stream);
        } catch (err) {
            this.logger.error(err);
        }
    }
}