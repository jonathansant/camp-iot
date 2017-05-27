import {setupBrokerContainer} from "../app-setup/container.setup";
import {WorkerMessage, Command, WorkerMessageData} from "./messaging.model";
import {IBrokerService} from "./broker.service";
import {Logger} from "bunyan";
import {ITaskService} from "./task.service";
import {IVariableTaskProvider, VariableTaskProvider} from "../variable/variable";
import {IStorageSetup} from "../storage/storage";
import * as http from "http";
import * as io from "socket.io";
import {ContainerItem} from "../shared/IoC/ioc";
import {Config} from "../config";
import Socket = SocketIO.Socket;

const container = setupBrokerContainer();

export class MessagingProcess {

    static $inject = ["IBrokerService", "Logger", "ITaskService", "IStorageSetup", "Config"];

    constructor(private brokerService: IBrokerService,
                private logger: Logger,
                private taskService: ITaskService,
                private storageSetup: IStorageSetup,
                private config: Config) {

        logger.info("Worker Process Starting...");

        this.handleRabbitInit();
        this.handleSocketServer();
        this.handleBrokerCleanUp();

        //todo clean up when we delete sensors and queues

        container.create<IVariableTaskProvider>(VariableTaskProvider);
    }

    private handleRabbitInit(): void {
        const MESSAGE = "message";
        process.on(MESSAGE, (message: WorkerMessage) => {
            switch (message.command) {
                case Command.subscribe:
                {
                    this.brokerService.subscribe(
                        message.payload.sensor,
                        message.payload.topic,
                        this.taskService.getTask(message.payload.taskKey),
                        message.payload.isRemovableHandler)
                        .then((handlerId: string) => {
                            process.send({
                                command: Command.handlerRegistered,
                                payload: {
                                    handlerId: handlerId
                                } as WorkerMessageData
                            } as WorkerMessage);
                        });
                    break;
                }
                case Command.registerSensor:
                {
                    this.brokerService.registerSensor(message.payload.sensor);
                    break;
                }
                case Command.unsubscribe:
                {
                    this.brokerService.unsubscribe(message.payload.handlerId);
                    break;
                }
                case Command.publish:
                {
                    this.brokerService.publish(
                        message.payload.sensor,
                        message.payload.topic,
                        message.payload.data);
                    break;
                }
                case Command.registerJob:
                {
                    this.brokerService.registerJob(
                        message.payload.sensor,
                        message.payload.topic);
                    break;
                }
            }
        });

        this.logger.info("Sending broker process init message");

        process.send({
            command: Command.init
        });
    }

    private handleSocketServer(): void {
        this.storageSetup
            .initConnection()
            .then(() => {
                this.logger.info("Broker process started");
            });

        this.logger.info("Starting Socket server...");

        const server = http.createServer();

        const socketPort = parseInt(process.env.PORT || this.config.port, undefined) + 1;

        server.listen(socketPort, () => {
            this.logger.info(`socket server listening on port: ${socketPort}`);
        });

        const socketServer = io.listen(server);

        socketServer.on("connection", (socket: Socket) => {
            this.logger.info("client connected");

            socket.on("disconnect", () => {
                this.logger.info("client disconnected");
            });
        });

        ContainerItem.create(container)
            .asNonInstantiatable()
            .forKey("SocketServer")
            .use(socketServer)
            .andRegister();
    }

    private handleBrokerCleanUp(): void {
        setTimeout(() => {
            this.brokerService.cleanUp();
            this.handleBrokerCleanUp();
        }, this.config.brokerCleanUpDelay);
    }
}

//todo remove the process messaging bullshit and just use http. I still need http
//for websockets anyway

//todo initialize all handlers on init

container.create<MessagingProcess>(MessagingProcess);