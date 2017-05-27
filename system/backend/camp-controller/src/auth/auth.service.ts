import {IUserService, User} from "../user/user";
import {Logger} from "bunyan";
import * as bcrypt from "bcrypt-nodejs";
import * as jwt from "jsonwebtoken";
import {Config} from "../config";
import {SignOptions} from "jsonwebtoken";
import {AuthError, NotAuthorizedError, AuthenticationResponse} from "./auth.model";

export interface IAuthService {
    authenticate(email: string, password: string): Promise<AuthenticationResponse>;
    verify(token: string): Promise<any>;
}

export class AuthService implements IAuthService {
    static $inject = ["IUserService", "Logger", "Config"];

    constructor(private userService: IUserService,
                private logger: Logger,
                private config: Config) {
    }

    authenticate(email: string, password: string): Promise<AuthenticationResponse> {
        return this.userService.findUserStubByEmail(email)
            .then((user: User) => {
                if (!user) {
                    throw new AuthError();
                }

                if (!bcrypt.compareSync(password || "", user.hashedPass)) {
                    throw new AuthError();
                }

                let token: string = jwt.sign(user, this.config.apiSecrete, <SignOptions>{
                    expiresIn: this.config.tokenTimeOut,
                    algorithm: "HS512"
                });

                //we don't want the hashed pass running around
                delete user.hashedPass;

                return {
                    user: user,
                    token: token
                };
            })
            .catch((err: Error) => {
                if (!(err instanceof AuthError)) {
                    this.logger.error(err);
                }

                return Promise.reject(err);
            });
    }

    verify(token: string): Promise<User> {
        let verify = (resolve: Function, reject: Function) => {
            if (!token) {
                reject(new NotAuthorizedError());
                return;
            }

            jwt.verify(token, this.config.apiSecrete, (err: Error, decodedUser: User) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(decodedUser);
            });
        };

        return new Promise(verify);
    }
}