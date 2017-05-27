import {Task} from "./task.model";

export interface ITaskService {
    registerTask(key: string, task: Task): void;
    getTask(key: string): Task;

}

export class TaskService implements ITaskService {

    private _tasks: Map<string, Task>;

    constructor() {
        this._tasks = new Map<string, Task>();
    }

    registerTask(key: string, task: Task): void {
        this._tasks.set(key, task);
    }

    getTask(key: string): Task {
        return this._tasks.get(key);
    }
}