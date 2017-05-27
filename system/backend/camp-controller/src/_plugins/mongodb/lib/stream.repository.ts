import {MongooseModelService} from "./model.repository";
import {Stream} from "../../../stream/stream";
import {IStreamRepository} from "../../../storage/storage.service";
import {Schema} from "mongoose";
import * as mongoose from "mongoose";

export class StreamRepository extends MongooseModelService<Stream> implements IStreamRepository {

    private static modelDefinition = mongoose.model("Stream", new Schema({
        value: mongoose.Schema.Types.Mixed,
        variableId: {type: Schema.Types.ObjectId, index: true},
        timeStamp: Date
    }));

    constructor() {
        super(StreamRepository.modelDefinition);
    }

    save(stream: Stream): Promise<Stream> {
        return this.objectify(this.saveModel(stream));
    }

    update(id: string, updated: Object): Promise<Stream> {
        return undefined;
    }

    findMany(ids: string[]): Promise<Stream[]> {
        return undefined;
    }

    delete(id: string): Promise<void> {
        return undefined;
    }

    find(id: string): Promise<Stream> {
        return undefined;
    }

    deleteByVariableId(variableId: any): Promise<Stream[]> {
        return (<any>this.modelDefinition
            .find({variableId: variableId})
            .remove()
            .exec())
            .catch((err: any) => {
                return Promise.reject({
                    code: err.code,
                    message: err.errmsg ? err.errmsg : err.message,
                    name: "Remove"
                });
            });
    }

    deleteMany(ids: string[]): Promise<void[]> {
        return undefined;
    }


    getStreamsByVariableId(variableId: string, limit: number = 0): Promise<Stream[]> {
        return this.objectifyMany(<any>this.modelDefinition
            .find({variableId: variableId})
            .sort([["timeStamp", "descending"]])
            .limit(limit)
            //.sort([["timeStamp", "ascending"]])
            .select({__v: 0})
            .exec());
    }
}