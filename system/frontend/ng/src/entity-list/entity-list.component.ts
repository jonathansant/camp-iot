import {IComponentOptions} from "angular";
import {EntityListController} from "./entity-list.controller";

export class EntityListComponent {
    static id = "entityList";

    static component(): IComponentOptions {
        return {
            bindings: {
                entities: "<",
                entityController: "<",
                entityDetailState: "<",
                parentId: "<",
                imageSrc: "<"
            },
            templateUrl: "templates/entity-list.html",
            controller: EntityListController,
            controllerAs: "vm"
        };
    }
}