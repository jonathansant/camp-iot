import {IComponentOptions} from "angular";
import {VariableController} from "./variable.controller";

export class VariableListComponent {
    static id = "variableList";

    static component(): IComponentOptions {
        return {
            bindings: {
                variables: "=",
                sensorId: "<"
            },
            templateUrl: "templates/variable-list.html",
            controller: VariableController,
            controllerAs: "vm"
        };
    }
}