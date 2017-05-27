import {Entity} from "./entity-list.model";
import {IPromise} from "angular";

export class EntityListController {
    private entityController: IEntityListControlable;

    constructor() {
        "ngInject";
    }

    getThumbnailUrl(entity: Entity): string {
        if (!_.isUndefined(entity.thumbnailUrl) && !_.isNull(entity.thumbnailUrl)) {
            return "";
        }

        return "";
    }

    remove(entityId: string): void {
        this.entityController.remove(entityId);
    }
}

export interface IEntityListControlable {
    remove(entityId: string): IPromise<void>;
}