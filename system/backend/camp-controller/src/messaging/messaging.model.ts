export interface WorkerMessage {
    command: Command;
    payload: WorkerMessageData;
}

export enum Command {
    publish,
    subscribe,
    registerSensor,
    unsubscribe,
    handlerRegistered,
    init,
    registerJob
}

export interface WorkerMessageData {
    topic?: string;
    handlerId?: string;
    sensor?: string;
    data?: any;
    taskKey?: string;
    isRemovableHandler?: boolean;
}