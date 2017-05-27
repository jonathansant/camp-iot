import {ContainerService, ContainerItem} from "../shared/IoC/ioc";
import {Config} from "../config";
import {setUpLogger} from "./diagnostics.setup";
import {Validator} from "validator.ts/Validator";
import {AuthService} from "../auth/auth";
import {UserService} from "../user/user";
import {Application} from "express";
import {
    SensorRepository,
    Setup,
    UserRepository,
    VariableRepository
} from "../_plugins/mongodb/camp-mongo.plugin";
import {SensorService, SensorProvider} from "../sensor/sensor";
import {ContextService} from "../shared/service/context.service";
import {VariableService, VariableProvider, VariableTaskProvider} from "../variable/variable";
import {WorkerService} from "../worker/worker.service";
import {AmqpBroker, AmqpConfig, MqttBroker, MqttConfig} from "../_plugins/rabbitmq/rabbitmq-broker";
import {MessagingService, TaskService} from "../messaging/messaging";
import {StreamRepository} from "../_plugins/mongodb/lib/stream.repository";
import {StreamService} from "../stream/stream.service";
import {JobProvider, JobService} from "../job/job";
import {JobRepository} from "../_plugins/mongodb/lib/job.repository";
import {ControllerInfoService} from "../controller-info/controller-info.service";
import {IMessagingService} from "../messaging/messaging.service";

const logger = setUpLogger();
const config = new Config();
let messagingService: IMessagingService;

export function setupSystemContainer(app: Application) {
    "use strict";

    let container = new ContainerService();
    app.set("ioc", container);

    ContainerItem.create(container)
        .forKey("Logger")
        .use(logger)
        .asNonInstantiatable()
        .andRegister();

    ContainerItem.create(container)
        .forKey("Config")
        .use(config)
        .asNonInstantiatable()
        .andRegister();

    ContainerItem.create(container)
        .forKey("DocumentDbConfig")
        //.use(config.mongoDbAzureSetup)
        .use(config.mongoDbAmazonSetup)
        //.use(config.mongoDbLocalSetup)
        .asNonInstantiatable()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IStorageSetup")
        .use(Setup)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IWorkerService")
        .use(WorkerService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IMessagingService")
        .use(MessagingService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IUserModelRepository")
        .use(UserRepository)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IValidator")
        .use(Validator)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IUserService")
        .use(UserService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IAuthService")
        .use(AuthService)
        .asSingleton()
        .andRegister();

    messagingService = container.getByKey<IMessagingService>("IMessagingService");
}

export function setupOperationalContainer(): ContainerService {
    "use strict";

    //todo optimize this by creating separate setups per router

    let container = new ContainerService();

    ContainerItem.create(container)
        .forKey("Logger")
        .use(logger)
        .asNonInstantiatable()
        .andRegister();

    ContainerItem.create(container)
        .forKey("Config")
        .use(config)
        .asNonInstantiatable()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IMessagingService")
        .use(messagingService)
        .asNonInstantiatable()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IValidator")
        .use(Validator)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IContextService")
        .use(ContextService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IUserModelRepository")
        .use(UserRepository)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IUserService")
        .use(UserService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IAuthService")
        .use(AuthService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("ISensorModelRepository")
        .use(SensorRepository)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("ISensorService")
        .use(SensorService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IVariableModelRepository")
        .use(VariableRepository)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IVariableService")
        .use(VariableService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IStreamRepository")
        .use(StreamRepository)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IStreamService")
        .use(StreamService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IVariableProvider")
        .use(VariableProvider)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IJobRepository")
        .use(JobRepository)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IJobProvider")
        .use(JobProvider)
        .andRegister();

    ContainerItem.create(container)
        .forKey("IJobService")
        .use(JobService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("ISensorProvider")
        .use(SensorProvider)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IControllerInfoService")
        .use(ControllerInfoService)
        .asSingleton()
        .andRegister();

    return container;
}

export function setupBrokerContainer(): ContainerService {
    "use strict";

    let container = new ContainerService();

    ContainerItem.create(container)
        .forKey("Config")
        .use(Config)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("Logger")
        .use(setUpLogger())
        .asNonInstantiatable()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IBrokerConfig")
        //.use(AmqpConfig)
        .use(MqttConfig)
        .andRegister();

    ContainerItem.create(container)
        .forKey("IBrokerService")
        //.use(AmqpBroker)
        .use(MqttBroker)
        .andRegister();

    ContainerItem.create(container)
        .forKey("ITaskService")
        .use(TaskService)
        .asSingleton()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IVariableTaskProvider")
        .use(VariableTaskProvider)
        .andRegister();

    ContainerItem.create(container)
        .forKey("IStreamService")
        .use(StreamService)
        .andRegister();

    ContainerItem.create(container)
        .forKey("IStreamRepository")
        .use(StreamRepository)
        .andRegister();

    ContainerItem.create(container)
        .forKey("IValidator")
        .use(Validator)
        .andRegister();

    ContainerItem.create(container)
        .forKey("IVariableService")
        .use(VariableService)
        .andRegister();

    ContainerItem.create(container)
        .forKey("IVariableModelRepository")
        .use(VariableRepository)
        .andRegister();

    ContainerItem.create(container)
        .forKey("DocumentDbConfig")
        //.use(container.getByKey<Config>("Config").mongoDbAzureSetup)
        //.use(container.getByKey<Config>("Config").mongoDbLocalSetup)
        .use(container.getByKey<Config>("Config").mongoDbAmazonSetup)
        .asNonInstantiatable()
        .andRegister();

    ContainerItem.create(container)
        .forKey("IStorageSetup")
        .use(Setup)
        .asSingleton()
        .andRegister();

    return container;
}