import {Logger} from "bunyan";
import {Application} from "express";
import {ContainerService} from "../shared/IoC/ioc";
import {IWorkerService} from "../worker/worker.service";
import {ChildProcess} from "child_process";
import {Config} from "../config";
import {IMessagingService} from "../messaging/messaging.service";

const createMessagingWorker = async(logger: Logger,
                                    workerController: IWorkerService,
                                    config: Config,
                                    messageService: IMessagingService) => {

    await workerController.createProcess(`${config.buildDir}/messaging/messaging.process`)
        .then((worker: ChildProcess) => {
            messageService.brokerPid = worker.pid;
        })
        .catch((err: Error) => {
            logger.error(err);
        });
};

export default function (app: Application,
                         config: Config): void {
    "use strict";

    let container: ContainerService = app.get("ioc");

    let logger = container.getByKey<Logger>("Logger");

    const workerController = container.getByKey<IWorkerService>("IWorkerService");

    const messagingService = container.getByKey<IMessagingService>("IMessagingService");

    createMessagingWorker(logger, workerController, config, messagingService);
}

