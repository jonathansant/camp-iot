import {IComponentOptions} from "angular";
import {EntityInfoController} from "./entity-info.controller";

export class EntityInfoComponent {
    static id = "entityInfo";

    static component(): IComponentOptions {
        return {
            bindings: {
                entity: "<"
            },
            templateUrl: "templates/entity-info.html",
            controller: EntityInfoController,
            controllerAs: "vm"
        };
    }
}