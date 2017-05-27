import {IPromise, IHttpService, IHttpPromiseCallbackArg, IQService} from "angular";
import {User} from "../user/user";
import {IContextService} from "../context/context.service";
import {Config} from "../config/config.model";

export interface IAuthService {
    authenticate(userName: string, password: string): IPromise<User>;
    logout(): IPromise<void>;
}

export class AuthService implements IAuthService {
    static id = "authService";

    constructor(private contextService: IContextService,
                private $http: IHttpService,
                private config: Config,
                private $q: IQService) {
        "ngInject";
    }

    authenticate(userName: string, password: string): IPromise<User> {
        return this.$http.post(`${this.config.apiEndpointUrl}/api/user/auth`, {
                email: userName,
                password: password
            })
            .then((response: IHttpPromiseCallbackArg<any>) => {
                this.contextService.currentToken = response.data.token;
                this.contextService.currentUser = response.data.user;

                return <User>response.data.user;
            });
    }

    logout(): IPromise<void> {
        this.contextService.clearAuthInfo();
        //todo should call backend

        return this.$q.resolve();
    }
}