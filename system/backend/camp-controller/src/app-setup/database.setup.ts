import {IStorageSetup, DbConnectionResult} from "../storage/storage.model";
import {Logger} from "bunyan";
import {Application} from "express";
import {ContainerService} from "../shared/IoC/ioc";

export default function (app: Application): void {
    "use strict";

    let container: ContainerService = app.get("ioc");

    let logger = container.getByKey<Logger>("Logger");

    container.getByKey<IStorageSetup>("IStorageSetup")
        .initConnection()
        .then((res: DbConnectionResult) => {
            logger.info(`Connected to: ${res.dbName}`);
        })
        .catch((err: Error) => {
            logger.error(err);
        });
}