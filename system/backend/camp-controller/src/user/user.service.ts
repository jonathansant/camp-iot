import {IUserModelRepository} from "../storage/storage";
import {User, UserRegistration, Password} from "./user.model";
import {Logger} from "bunyan";
import {IValidator} from "../shared/service/validator.service";
import * as bcrypt from "bcrypt-nodejs";
import {BusinessError} from "../shared/model/common.model";

export interface IUserService {
    findUserStubByEmail(email: string): Promise<User>;
    registerUser(user: User): Promise<void>;
    validateUserRegistration(registrationInfo: UserRegistration): Promise<User>;
    addSensorToUser(userId: string, sensorId: string): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    findUserById(id: string): Promise<User>;
    removeSensorFromUser(userId: string, sensorId: string): Promise<User>;
}

export class UserService implements IUserService {

    static $inject = ["IUserModelRepository", "IValidator", "Logger"];

    constructor(private userRepository: IUserModelRepository,
                private validator: IValidator,
                private logger: Logger) {
    }

    findUserById(id: string): Promise<User> {
        return this.userRepository.find(id)
            .then((user: User) => {
                return user;
            })
            .catch((err: Error) => {
                this.logger.error(err, id);
                return Promise.reject<Error>(err);
            });
    }

    findUserByEmail(email: string): Promise<User> {
        return this.userRepository.findByEmail(email)
            .then((user: User) => {
                return user;
            })
            .catch((err: Error) => {
                this.logger.error(err, email);
                return Promise.reject<Error>(err);
            });
    }

    findUserStubByEmail(email: string): Promise<User> {
        return this.userRepository.findUserStubByEmail(email)
            .then((user: User) => {
                return user;
            })
            .catch((err: Error) => {
                this.logger.error(err, email);
                return Promise.reject<Error>(err);
            });
    }

    registerUser(user: User): Promise<void> {
        return this.userRepository.save(user)
            .then(() => {
                return;
            })
            .catch((err: Error) => {
                this.logger.error(err, user);
                return Promise.reject<Error>(err);
            });
    }

    validateUserRegistration(registrationInfo: UserRegistration): Promise<User> {
        let validate = (resolve: Function, reject: Function) => {
            let user: User = new User();
            user.email = registrationInfo.user.email;
            user.name = registrationInfo.user.name;

            let errs = this.validator.validate(user);

            let passwordError = this.validatePassword(registrationInfo.password);
            if (passwordError) {
                errs.push(passwordError);
            }

            if (errs && errs.length !== 0) {
                reject(errs);
                return;
            }

            user.hashedPass = bcrypt.hashSync(registrationInfo.password.password);
            return resolve(user);
        };

        return new Promise(validate);
    }

    addSensorToUser(userId: string, sensorId: string): Promise<User> {
        return this.userRepository.addSensor(userId, [sensorId])
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    removeSensorFromUser(userId: string, sensorId: string): Promise<User> {
        return this.userRepository.deleteSensor(userId, sensorId)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    private validatePassword(pass: Password): BusinessError {
        if (pass.password === pass.passwordConfirmation) {
            return null;
        }

        return {
            errorName: "Password confirmation does not match",
            property: "Password"
        };
    }
}