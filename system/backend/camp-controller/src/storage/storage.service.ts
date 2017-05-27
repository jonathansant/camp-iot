import {User} from "../user/user";
import {Sensor} from "../sensor/sensor";
import {CampModel} from "../shared/model/common.model";
import {Variable} from "../variable/variable";
import {Stream} from "../stream/stream";
import {Job} from "../job/job.model";

export interface ICampModelRepository<T extends CampModel> {
    save(model: T): Promise<T>;
    update(id: string, updated: Object): Promise<T>;
    findMany(ids: string[]): Promise<T[]>;
    delete(id: string): Promise<void>;
    find(id: string): Promise<T>;
    deleteMany(ids: string[]): Promise<void[]>;
}

export interface IUserModelRepository extends ICampModelRepository<User> {
    findByEmail(email: string): Promise<User>;
    addSensor(id: string, sensorsIds: string[]): Promise<User>;
    findUserStubByEmail(email: string): Promise<User>;
    deleteSensor(id: string, sensorId: string): Promise<User>;
}

export interface ISensorModelRepository extends ICampModelRepository<Sensor> {
    addVariable(id: string, variableIds: string[]): Promise<Sensor>;
    deleteVariable(id: string, variableId: string): Promise<Sensor>;
    addJob(sensorId: string, jobIds: string[]): Promise<Sensor>;
    deleteJob(sensorId: string, jobId: string): Promise<Sensor>;
}

export interface IVariableModelRepository extends ICampModelRepository<Variable> {
    updateValue(variableId: string, value: number|boolean): Promise<Variable>;
}

export interface IStreamRepository extends ICampModelRepository<Stream> {
    deleteByVariableId(variableId: any): Promise<Stream[]>;
    getStreamsByVariableId(variableId: string, limit?: number): Promise<Stream[]>;
}

export interface IJobRepository extends ICampModelRepository<Job> {
}