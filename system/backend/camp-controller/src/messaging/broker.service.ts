import {Task} from "./task.model";

export interface IBrokerService {
    publish(sensorId: string, topicId: string, data: any): Promise<void>;
    registerSensor(sensorId: string): Promise<any>;
    registerJob(sensorId: string, topicId: string): Promise<any>;
    subscribe(sensorId: string, topicId: string, task: Task, isHandlerRemovable?: boolean): Promise<string>;
    unsubscribe(handlerId: string): Promise<void>;
    cleanUp(hard?: boolean): Promise<void>;
}

export interface IBrokerConfig {
    configure(): Promise<any>;
}