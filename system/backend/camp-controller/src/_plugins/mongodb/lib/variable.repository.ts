import {MongooseModelService} from "./model.repository";
import {IVariableModelRepository} from "../../../storage/storage.service";
import {Schema} from "mongoose";
import * as mongoose from "mongoose";
import {Variable} from "../../../variable/variable";

export class VariableRepository extends MongooseModelService<Variable> implements IVariableModelRepository {

    private static modelDefinition = mongoose.model("Variable", new Schema({
        name: String,
        type: {type: Number, default: 0, min: 0, max: 1},
        value: {type: mongoose.Schema.Types.Mixed, default: 0, required: false },
        isStream: {type: Boolean, default: false}
    }));

    constructor() {
        super(VariableRepository.modelDefinition);
    }

    save(model: Variable): Promise<Variable> {
        return this.objectify(this.saveModel(model));
    }

    update(id: string, updated: Object): Promise<Variable> {
        return undefined;
    }

    findMany(ids: string[]): Promise<Variable[]> {
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

    deleteMany(ids: string[]): Promise<void[]> {
        return this.removeMany(ids);
    }

    find(id: string): Promise<Variable> {
        return this.objectify(
            <any>this.modelDefinition
                .findOne({
                    _id: id
                })
                .select({__v: 0})
                .exec()
        );
    }

    updateValue(variableId: string, value: number|boolean): Promise<Variable> {
        return this.objectify(
            <any>this.modelDefinition
                .findByIdAndUpdate(variableId, {
                    $set: {
                        value: value
                    }
                }).exec());
    }
}