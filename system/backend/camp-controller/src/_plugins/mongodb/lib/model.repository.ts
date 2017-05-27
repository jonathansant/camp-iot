import {StorageError} from "../../../storage/storage";
import * as mongoose from "mongoose";
import {CampModel} from "../../../shared/model/common.model";
import {WriteError} from "mongodb";
import {Model, Document, Types} from "mongoose";

export abstract class MongooseModelService<T extends CampModel> {

    constructor(protected modelDefinition: Model<any>) {
        mongoose.Promise = <any>global.Promise;
    }

    protected saveModel(model: T): Promise<Document> {
        let generatedModel = new this.modelDefinition(model);

        return (<any>generatedModel).save()
            .catch((err: WriteError) => {
                let error: StorageError = {
                    code: err.code,
                    message: err.errmsg || (<any>err).message,
                    name: "Save"
                };

                return Promise.reject(error);
            });
    }

    protected findManyModel(queryObject: any): Promise<Document[]> {
        return <any>this.modelDefinition.find(queryObject).exec();
    }

    protected findOne(queryObject: any): Promise<Document> {
        return <any>this.modelDefinition.findOne(queryObject).exec();
    }

    protected updateModel(id: string, updated: any): Promise<Document> {
        return (<any>this.modelDefinition.findOneAndUpdate({_id: id}, updated)
            .exec())
            .catch((err: WriteError) => {
                return Promise.reject({
                    code: err.code,
                    message: err.errmsg,
                    name: "Update"
                });
            });
    }

    protected remove(id: string): Promise<void> {
        return (<any>this.modelDefinition.findOneAndRemove({_id: id})
            .exec())
            .catch((err: any) => {
                return Promise.reject({
                    code: err.code,
                    message: err.errmsg ? err.errmsg : err.message,
                    name: "Remove"
                });
            });
    }

    protected removeMany(ids: string[]): Promise<void[]> {
        return (<any>this.modelDefinition
            .find({_id: { $in: ids }})
            .remove()
            .exec())
            .catch((err: any) => {
                return Promise.reject({
                    code: err.code,
                    message: err.errmsg ? err.errmsg : err.message,
                    name: "RemoveMany"
                });
            });
    }

    protected objectify(promise: Promise<Document>): Promise<T> {
        return promise
            .then((dbModel: Document) => {
                return <any>this.convertToRawObject(dbModel);
            })
            .catch((err: any) => {
                return Promise.reject({
                    code: err.code,
                    write_message: err.errmsg,
                    message: err.message
                });
            });
    }

    protected objectifyMany(promise: Promise<Document[]>): Promise<T[]> {
        return promise
            .then((dbModels: Document[]) => {
                let models: T[] = [];

                dbModels.forEach((dbModel: Document) => {
                    let raw = this.convertToRawObject(dbModel);
                    models.push(raw);
                });

                return <any>models;
            })
            .catch((err: WriteError) => {
                return Promise.reject({
                    code: err.code,
                    message: err.errmsg
                });
            });
    }

    private convertToRawObject(dbModel: Document): T {
        if (!dbModel) {
            return null;
        }

        let raw = <T>dbModel.toObject();
        raw._id = raw._id.toHexString();

        return raw;
    }

    static toMongooseId(ids: string[]): Types.ObjectId[] {
        let objectIds: Types.ObjectId[] = [];
        ids.forEach((id: string) => {
            let objectId = Types.ObjectId.createFromHexString(id);
            objectIds.push(objectId);
        });

        return objectIds;
    }
}

