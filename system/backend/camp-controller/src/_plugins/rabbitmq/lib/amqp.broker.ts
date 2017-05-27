import {IBrokerService, IBrokerConfig} from "../../../messaging/broker.service";
import * as rabbit from "rabbot";
import {Message} from "rabbot";
import {Task} from "../../../messaging/messaging";
import * as uuid from "node-uuid";

export class AmqpBroker implements IBrokerService {

    static $inject = ["IBrokerConfig"];

    private handlers: Map<string, any>;
    private removableHandlers: Map<string, any>;

    constructor(private brokerConfig: IBrokerConfig) {
        // brokerConfig.configure()
        //     .then((config: any) => {
        //         return rabbit.configure(config);
        //     });

        //todo clean up on delete unsubscribe

        brokerConfig
            .configure()
            .then((config: any) => {
                return rabbit.addConnection({
                    uri: config
                });
            });

        this.handlers = new Map<string, any>();
        this.removableHandlers = new Map<string, any>();
    }

    publish(sensorId: string, topicId: string, data: any): Promise<void> {
        return rabbit.publish(sensorId, {
            routingKey: topicId,
            type: topicId,
            body: data
        });
    }

    registerSensor(sensorId: string): Promise<any> {
        return rabbit.addExchange(sensorId, "topic", {
            durable: true,
            persistent: true,
            autoDelete: false
        });
    }

    registerJob(sensorId: string, topicId: string): Promise<any> {
        return this.addQueue(sensorId, topicId)
            .then(() => {
                rabbit.startSubscription(topicId);
            });
    }

    subscribe(sensorId: string, topicId: string, task: Task, isHandlerRemovable: boolean = false): Promise<string> {
        return this
            .addQueue(sensorId, topicId)
            .then(() => {
                let guid = uuid.v4();
                return Promise.all([
                    this.initBrokerSubscription(topicId, task, guid),
                    guid
                ]);
            })
            .then((handlerData: any[]) => {
                rabbit.startSubscription(topicId);
                return handlerData;
            })
            .then((handlerData: any[]) => {
                let guid = handlerData[1];
                let handler = handlerData[0];

                let handlerList = this.handlers;
                if (isHandlerRemovable) {
                    handlerList = this.removableHandlers;
                }

                handlerList.set(guid, handler);

                return guid;
            });
    }

    unsubscribe(handlerId: string): Promise<void> {

        let unsubscriber = (resolve: Function) => {
            let handler = this.removableHandlers.get(handlerId);
            let handlerList = this.removableHandlers;

            if (!handler) {
                handler = this.handlers.get(handlerId);
                handlerList = this.handlers;
            }

            handler.remove();
            handlerList.delete(handlerId);

            resolve();
        };

        return new Promise<void>(unsubscriber);
    }

    cleanUp(hard: boolean = false): Promise<void> {

        let cleaner = (resolve: Function) => {
            let remover = (handler: any) => {
                handler.remove();
            };

            this.removableHandlers.forEach(remover);
            this.removableHandlers.clear();

            if (hard) {
                this.handlers.forEach(remover);
                this.handlers.clear();
            }

            resolve();
        };

        return new Promise<void>(cleaner);
    }

    private addQueue(sensorId: string, topicId: string): Promise<any> {
        return rabbit
            .addQueue(topicId, {
                durable: true,
                autoDelete: false,
                noAck: false,
                exclusive: false,
                subscribe: false,
            })
            .then(() => {
                return rabbit.bindQueue(sensorId, topicId, [topicId]);
            });
    }

    private initBrokerSubscription(topicId: string, task: Task, handlerId: string): Promise<any> {
        const subscriber = (resolve: Function) => {
            rabbit.nackOnError();
            let handler = rabbit.handle(topicId, (message: Message) => {
                let parsedBody = message.body;
                if (parsedBody.toJSON) {
                    parsedBody = JSON.parse(parsedBody.toString());
                }

                parsedBody.handlerId = handlerId;

                task.task.apply(task.context, [parsedBody]);

                message.ack();
            });

            resolve(handler);
        };

        return new Promise<void>(subscriber);
    }
}