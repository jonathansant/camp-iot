import {MongooseModelService} from "./model.repository";
import {IJobRepository} from "../../../storage/storage.service";
import {Job} from "../../../job/job";
import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export class JobRepository extends MongooseModelService<Job> implements IJobRepository {

    private static modelDefinition = mongoose.model("Job", new Schema({
        name: String,
        parameters: [Schema.Types.String]
    }));

    constructor() {
        super(JobRepository.modelDefinition);
    }

    save(model: Job): Promise<Job> {
        return this.objectify(this.saveModel(model));
    }

    update(id: string, updated: Object): Promise<Job> {
        return undefined;
    }

    findMany(ids: string[]): Promise<Job[]> {
        return this.objectifyMany(
            <any>this.modelDefinition
                .find({
                    _id: {$in: ids}
                })
                .select({__v: 0})
                .exec()
        );
    }

    delete(id: string): Promise<void> {
        return this.remove(id);
    }

    find(id: string): Promise<Job> {
        return this.objectify(
            <any>this.modelDefinition
                .findOne({
                    _id: id
                })
                .select({__v: 0})
                .exec()
        );
    }

    deleteMany(ids: string[]): Promise<void[]> {
        return this.removeMany(ids);
    }
}