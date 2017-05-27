import {IComponentOptions} from "angular";
import {VariableChartController} from "./variable-chart.controller";

export class VariableChartComponent {
    static id = "variableChart";

    static component(): IComponentOptions {
        return {
            bindings: {
                streamSeries: "<"
            },
            templateUrl: "templates/variable-chart.html",
            controller: VariableChartController,
            controllerAs: "vm"
        };
    }
}