import {IBrokerService, Task, IBrokerConfig} from "../../../messaging/messaging";
import * as mqtt from "mqtt";
import {Client} from "mqtt";
import * as uuid from "node-uuid";
import * as _ from "lodash";

export class MqttBroker implements IBrokerService {

    static $inject = ["IBrokerConfig"];

    private client: Client;
    private handlers = new Map<string, HandlerContent>();
    private removableHandlers = new Map<string, HandlerContent>();

    constructor(private config: IBrokerConfig) {
        config.configure()
            .then((settings: any) => {

                this.client = mqtt.connect(settings);

                this.client.on("message", (topic: string, message: Buffer) => {

                    let parsedMessage = JSON.parse(message.toString());

                    let handlerList: HandlerContent[] = [];
                    let handler = this.handlers.get(topic);
                    if (handler) {
                        handlerList.push(handler);
                    }

                    let removables: HandlerContent[] = [];

                    this.removableHandlers.forEach((hndl: HandlerContent, key: string) => {
                        let keyParts = key.split(":");
                        if (topic === keyParts[0] && hndl.handlerId === keyParts[1]) {
                            removables.push(hndl);
                        }
                    });

                    handlerList = _.concat(handlerList, removables);

                    _.forEach(handlerList, (hndl: HandlerContent) => {
                        parsedMessage.handlerId = hndl.handlerId;
                        hndl.task.task.apply(hndl.task.context, [parsedMessage]);
                    });
                });
            });
    }

    publish(sensorId: string, topicId: string, data: any): Promise<void> {
        let publisher = (resolve: Function, reject: Function) => {
            try {
                this.client.publish(topicId, JSON.stringify(data));
                resolve();
            } catch (err) {
                reject(err);
            }
        };

        return new Promise<void>(publisher);
    }

    registerSensor(sensorId: string): Promise<any> {
        return Promise.resolve();
    }

    registerJob(sensorId: string, topicId: string): Promise<any> {
        let jobRegister = (resolve: Function, reject: Function) => {
            try {
                this.client.subscribe(topicId);
                resolve();
            } catch (err) {
                reject(err);
            }
        };

        return new Promise(jobRegister);
    }

    subscribe(sensorId: string,
              topicId: string,
              task: Task,
              isHandlerRemovable: boolean = false): Promise<string> {
        let variableRegister = (resolve: Function, reject: Function) => {
            try {
                this.client.subscribe(topicId);
                let guid = uuid.v4();

                let key = topicId;
                let handlerList = this.handlers;
                if (isHandlerRemovable) {
                    handlerList = this.removableHandlers;
                    key = `${topicId}:${guid}`;
                }

                handlerList.set(key, {
                    task: task,
                    handlerId: guid
                });

                resolve(guid);
            } catch (err) {
                reject(err);
            }
        };

        return new Promise(variableRegister);
    }

    //todo call unsubscribe
    //todo change the signature of this method to take a topic id
    //todo uncrappify this code
    unsubscribe(handlerId: string): Promise<void> {
        let unsubscriber = (resolve: Function, reject: Function) => {
            try {

                for (let handleItem of this.handlers) {
                    let handle: HandlerContent = handleItem[1];
                    if (handle.handlerId === handlerId) {
                        let topic = handleItem[0];
                        this.handlers.delete(topic);
                        this.client.unsubscribe(topic);
                        break;
                    }
                }

                this.removableHandlers.forEach((handle: HandlerContent, key: string) => {
                    if (key.indexOf(handlerId) > -1) {
                        this.removableHandlers.delete(key);
                    }
                });

                resolve();
            } catch (err) {
                reject(err);
            }
        };

        return new Promise<void>(unsubscriber);
    }

    cleanUp(hard?: boolean): Promise<void> {
        let cleaner = (resolve: Function) => {
            this.removableHandlers.clear();

            if (hard) {
                this.handlers.clear();
            }

            resolve();
        };

        return new Promise<void>(cleaner);
    }
}

interface HandlerContent {
    task: Task;
    handlerId: string;
}