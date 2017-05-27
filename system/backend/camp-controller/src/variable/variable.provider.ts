import {Variable, SocketBindingProperties} from "./variable.model";
import {IVariableService} from "./variable.service";
import {ISensorService, Sensor} from "../sensor/sensor";
import {IStreamService} from "../stream/stream";
import {IMessagingService} from "../messaging/messaging";
import {Logger} from "bunyan";
import {IContextService} from "../shared/service/context.service";

export interface IVariableProvider {
    createVariable(variable: Variable, sensorId: string): Promise<Variable>;
    validateVariable(variable: Variable): Promise<Variable>;
    getAllVariables(sensorId: string): Promise<Variable[]>;
    deleteVariable(sensorId: string, variableId: string): Promise<void>;
    getVariable(variableId: string): Promise<Variable>;
    deleteVariables(variableIds: string[]): Promise<void>;
    bindToValueUpdates(sensorId: string, variableId: string): Promise<SocketBindingProperties>;
    unbindToUpdates(handlerId: string): Promise<void>;
}

export class VariableProvider implements IVariableProvider {

    // todo improve inject with decorators

    static $inject = [
        "IVariableService",
        "ISensorService",
        "IStreamService",
        "IMessagingService",
        "Logger",
        "IContextService"
    ];

    constructor(private variableService: IVariableService,
                private sensorService: ISensorService,
                private streamService: IStreamService,
                private messagingService: IMessagingService,
                private logger: Logger,
                private contextService: IContextService) {
    }

    createVariable(variable: Variable, sensorId: string): Promise<Variable> {
        return this.variableService
            .createVariable(variable, sensorId)
            .then((createdVariable: Variable) => {
                return this.sensorService
                    .addVariableToSensor(sensorId, createdVariable._id)
                    .then(() => {
                        return createdVariable;
                    });
            })
            .then((createdVariable: Variable) => {
                this.registerVariableWithBroker(sensorId, createdVariable);
                return createdVariable;
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    validateVariable(variable: Variable): Promise<Variable> {
        return this.variableService.validateVariable(variable);
    }

    getAllVariables(sensorId: string): Promise<Variable[]> {
        return this.sensorService.getSensor(sensorId)
            .then((sensor: Sensor) => {
                return this.variableService.getAllVariables(sensor.variables);
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    deleteVariable(sensorId: string, variableId: string): Promise<void> {
        return this.variableService
            .deleteVariable(sensorId, variableId)
            .then(() => {
                return this.sensorService
                    .removeVariableFromSensor(sensorId, variableId);
            })
            .then(() => {
                return this.streamService.deleteStreamsByVariableId(variableId);
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    getVariable(variableId: string): Promise<Variable> {
        return this.variableService
            .getVariable(variableId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    deleteVariables(variableIds: string[]): Promise<void> {
        return this.variableService
            .deleteVariables(variableIds)
            .then(() => {
                variableIds.forEach((id: string) => {
                    this.streamService.deleteStreamsByVariableId(id);
                });
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    bindToValueUpdates(sensorId: string, variableId: string): Promise<SocketBindingProperties> {
        return this.messagingService
            .registerIOSubscription(sensorId, variableId, "variable-update", true)
            .then((handlerId: string) => {
                let serverAddr = this.contextService.serverAddress;
                let addrParts = serverAddr.split(":");
                let socketPort = parseInt(addrParts[1] || "80", undefined) + 1;

                return {
                    url: `${addrParts[0]}:${socketPort}`,
                    eventName: `variable-update-${variableId}-${handlerId}`,
                    handlerId: handlerId
                };
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });

    }

    unbindToUpdates(handlerId: string): Promise<void> {
        return this.messagingService
            .unsubscribeIO(handlerId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    private registerVariableWithBroker(sensorId: string, variable: Variable): Promise<string> {
        return this.messagingService
            .registerIOSubscription(sensorId, variable._id, "add-stream")
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }
}