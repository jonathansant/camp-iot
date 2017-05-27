import {CampModel} from "../shared/model/common.model";
import {IsEmail, NotEmpty} from "validator.ts/decorator/Validation";

export class User extends CampModel {

    @IsEmail()
    email: string;

    @NotEmpty()
    name: string;

    hashedPass: string;

    sensors: string[];
}

export class Password {
    password: string;
    passwordConfirmation: string;
}

export interface UserRegistration {
    user: User;
    password: Password;
}