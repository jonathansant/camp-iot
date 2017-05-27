import {User} from "../user/user";

export class AuthError extends Error {
    constructor() {
        super("Incorrect username or password!");
    }
}

export class NotAuthorizedError extends Error {
    constructor() {
        super("Not authorized!");
    }
}

export interface AuthenticationResponse {
    user: User;
    token: string;
}