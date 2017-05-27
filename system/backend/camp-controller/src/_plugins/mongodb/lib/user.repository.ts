import {MongooseModelService} from "./model.repository";
import {User} from "../../../user/user";
import {IUserModelRepository} from "../../../storage/storage";
import {Schema} from "mongoose";
import * as mongoose from "mongoose";

export class UserRepository extends MongooseModelService<User> implements IUserModelRepository {

    private static modelDefinition = mongoose.model("User", new Schema({
        email: {type: String, unique: true},
        name: String,
        hashedPass: String,
        sensors: [Schema.Types.ObjectId]
    }));

    constructor() {
        super(UserRepository.modelDefinition);
    }

    find(id: string): Promise<User> {
        return this.objectify(this.findOne({_id: id}));
    }

    findByEmail(email: string): Promise<User> {
        return this.objectify(this.findOne({email: email}));
    }

    findUserStubByEmail(email: string): Promise<User> {
        return this.objectify(
            <any>this.modelDefinition.findOne({
                    email: email
                })
                .select({sensors: 0, __v: 0})
                .exec()
        );
    }

    save(user: User): Promise<User> {
        return this.objectify(this.saveModel(user));
    }

    addSensor(id: string, sensorsIds: string[]): Promise<User> {
        let ids = MongooseModelService.toMongooseId(sensorsIds);
        return this.objectify(
            <any>this.modelDefinition.findOneAndUpdate(
                {_id: id},
                {
                    $push: {sensors: ids}
                },
                {
                    upsert: true
                }
            ).exec()
        );
    }

    deleteSensor(id: string, sensorId: string): Promise<User> {
        let ids = MongooseModelService.toMongooseId([sensorId]);
        return this.objectify(
            <any>this.modelDefinition.findOneAndUpdate(
                {_id: id},
                {
                    $pull: {sensors: ids}
                },
                {
                    upsert: true
                }
            ).exec()
        );
    }

    update(id: string, updated: Object): Promise<User> {
        return undefined;
    }

    findMany(ids: string[]): Promise<User[]> {
        return undefined;
    }

    delete(id: string): Promise<void> {
        return undefined;
    }

    deleteMany(ids: string[]): Promise<void[]> {
        return undefined;
    }
}