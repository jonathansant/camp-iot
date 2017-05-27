import {IComponentOptions} from "angular";
import {VariableController} from "./variable.controller";

export class VariableFormComponent {
    static id = "variableForm";

    static component(): IComponentOptions {
        return {
            bindings: {
                variables: "="
            },
            templateUrl: "templates/variable-form.html",
            controller: VariableController,
            controllerAs: "vm"
        };
    }
}