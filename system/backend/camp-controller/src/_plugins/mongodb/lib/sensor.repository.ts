import {MongooseModelService} from "./model.repository";
import {ISensorModelRepository} from "../../../storage/storage.service";
import {Sensor} from "../../../sensor/sensor";
import {Schema} from "mongoose";
import * as mongoose from "mongoose";

export class SensorRepository extends MongooseModelService<Sensor> implements ISensorModelRepository {

    private static modelDefinition = mongoose.model("Sensor", new Schema({
        name: String,
        variables: [Schema.Types.ObjectId],
        jobs: [Schema.Types.ObjectId]
    }));

    constructor() {
        super(SensorRepository.modelDefinition);
    }

    save(sensor: Sensor): Promise<Sensor> {
        return this.objectify(this.saveModel(sensor));
    }

    update(id: string, updated: Object): Promise<Sensor> {
        return this.objectify(this.updateModel(id, updated));
    }

    delete(id: string): Promise<void> {
        return this.remove(id);
    }

    findMany(sensorIds: string[]): Promise<Sensor[]> {
        return this.objectifyMany(
            <any>this.modelDefinition
                .find({
                    _id: {$in: sensorIds}
                })
                .select({__v: 0, jobs: 0, variables: 0})
                .exec()
        );
    }

    find(sensorId: string): Promise<Sensor> {
        return this.objectify(
            <any>this.modelDefinition
                .findOne({
                    _id: sensorId
                })
                .select({__v: 0})
                .exec()
        );
    }

    addVariable(id: string, variableIds: string[]): Promise<Sensor> {
        let ids = MongooseModelService.toMongooseId(variableIds);
        return this.objectify(
            <any>this.modelDefinition.findOneAndUpdate(
                {_id: id},
                {
                    $push: {variables: ids}
                },
                {
                    upsert: true
                }
            ).exec()
        );
    }

    deleteVariable(id: string, variableId: string): Promise<Sensor> {
        let ids = MongooseModelService.toMongooseId([variableId]);
        return this.objectify(
            <any>this.modelDefinition.findOneAndUpdate(
                {_id: id},
                {
                    $pull: {variables: ids}
                },
                {
                    upsert: true
                }
            ).exec()
        );
    }

    deleteMany(ids: string[]): Promise<void[]> {
        return undefined;
    }

    addJob(sensorId: string, jobIds: string[]): Promise<Sensor> {
        let ids = MongooseModelService.toMongooseId(jobIds);
        return this.objectify(
            <any>this.modelDefinition.findOneAndUpdate(
                {_id: sensorId},
                {
                    $push: {jobs: ids}
                },
                {
                    upsert: true
                }
            ).exec()
        );
    }

    deleteJob(sensorId: string, jobId: string): Promise<Sensor> {
        let ids = MongooseModelService.toMongooseId([jobId]);
        return this.objectify(
            <any>this.modelDefinition.findOneAndUpdate(
                {_id: sensorId},
                {
                    $pull: {jobs: ids}
                },
                {
                    upsert: true
                }
            ).exec()
        );
    }
}