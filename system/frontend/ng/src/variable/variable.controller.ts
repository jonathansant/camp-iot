import {BaseController} from "../shared/controllers/base.controller";
import {IEntityListControlable} from "../entity-list/entity-list.controller";
import {IVariableService} from "./variable.service";
import {Variable} from "./variable.model";
import * as _ from "lodash";
import {IFormController} from "angular";

export class VariableController extends BaseController implements IEntityListControlable {
    static id = "variableController";

    newVariable: Variable = {
        type: 0,
        name: "",
        isStream: false,
        value: false
    };

    variableTypes: any[];

    constructor(private variableService: IVariableService,
                protected FoundationApi: any,
                private $stateParams: any) {
        "ngInject";

        super(FoundationApi);

        this.variableTypes = [
            {
                label: "boolean",
                value: 0
            },
            {
                label: "number",
                value: 1
            }
        ];

        this.loadVariables();
    }

    remove(variableId: string): angular.IPromise<void> {
        return this.variableService.removeVariable(this.$stateParams.id, variableId)
            .then(() => {
                _.remove((<any>this).variables, (variable: Variable) => {
                    return variable._id === variableId;
                });
            })
            .catch(() => {
                this.genericErrorNotification();
            });
    }

    addVariable(form: IFormController): void {
        if (form.$valid) {
            this.variableService.addVariable(this.newVariable, this.$stateParams.id)
                .then((variable: Variable) => {
                    (<any>this).variables.push(variable);
                    this.newVariable = {
                        type: 0,
                        name: "",
                        isStream: false,
                        value: false
                    };
                    form.$setPristine();
                })
                .catch(() => {
                    this.genericErrorNotification();
                });
        } else {
            this.FoundationApi.publish("main-notifications", {
                title: "Missing data",
                content: "Please fill in the name of the variable",
                color: "warning",
            });
        }
    }

    private loadVariables(): void {
        this.variableService.getAllVariables(this.$stateParams.id)
            .then((variables: Variable[]) => {
                (<any>this).variables = variables;
            })
            .catch((err: Error) => {
                this.genericErrorNotification(err.message);
            });
    }
}