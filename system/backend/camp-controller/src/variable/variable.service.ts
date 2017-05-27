import {IVariableModelRepository} from "../storage/storage";
import {IValidator} from "../shared/service/validator.service";
import {Logger} from "bunyan";
import {Variable} from "./variable.model";

export interface IVariableService {
    createVariable(variable: Variable, sensorId: string): Promise<Variable>;
    validateVariable(variable: Variable): Promise<Variable>;
    getAllVariables(variableIds: string[]): Promise<Variable[]>;
    deleteVariable(sensorId: string, variableId: string): Promise<void>;
    getVariable(variableId: string): Promise<Variable>;
    deleteVariables(variableIds: string[]): Promise<void[]>;
    updateValue(variableId: string, value: number|boolean): Promise<Variable>;
}

export class VariableService implements IVariableService {

    static $inject = [
        "IVariableModelRepository",
        "IValidator",
        "Logger"
    ];

    constructor(private variableRepository: IVariableModelRepository,
                private validator: IValidator,
                private logger: Logger) {
    }

    createVariable(variable: Variable, sensorId: string): Promise<Variable> {
        return this.variableRepository
            .save(variable)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    validateVariable(variable: Variable): Promise<Variable> {
        let validate = (resolve: Function, reject: Function) => {
            let errors = this.validator.validate(variable);
            if (errors && errors.length > 0) {
                reject(errors);
                return;
            }

            resolve(variable);
        };

        return new Promise(validate);
    }

    //todo guard so that users to whom the sensor do not belong to is not returned

    getAllVariables(variableIds: string[]): Promise<Variable[]> {
        return this.variableRepository
            .findMany(variableIds)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    getVariable(variableId: string): Promise<Variable> {
        return this.variableRepository
            .find(variableId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    deleteVariable(sensorId: string, variableId: string): Promise<void> {
        return this.variableRepository
            .delete(variableId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    deleteVariables(variableIds: string[]): Promise<void[]> {
        return this.variableRepository
            .deleteMany(variableIds)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    updateValue(variableId: string, value: number|boolean) {
        return this.variableRepository
            .updateValue(variableId, value)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }
}