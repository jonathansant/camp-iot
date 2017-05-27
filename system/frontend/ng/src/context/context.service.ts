import {User} from "../user/user";
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import consts from "../consts";
import * as _ from "lodash";

export interface IContextService {
    currentUser: User;
    currentToken: string;
    isLoggedIn: boolean;
    clearAuthInfo(): void;
}

export class ContextService implements IContextService {
    static id = "contextService";

    private _currentUser: User;
    private _currentToken: string;

    constructor(private localStorageService: ILocalStorageService) {
        "ngInject";

        this._currentToken = localStorageService.get<string>(consts.tokenStorageKey);
        this._currentUser = localStorageService.get<User>(consts.userStorageKey);
    }

    get currentUser(): User {
        return this._currentUser;
    }

    get currentToken(): string {
        return this._currentToken;
    }

    set currentUser(user: User) {
        this.localStorageService.set<User>(consts.userStorageKey, user);
        this._currentUser = user;
    }

    set currentToken(token: string) {
        this.localStorageService.set<string>(consts.tokenStorageKey, token);
        this._currentToken = token;
    }

    get isLoggedIn(): boolean {
        return !(_.isNull(this._currentToken) || _.isNull(this._currentUser));
    }

    clearAuthInfo(): void {
        this.currentToken = null;
        this.currentUser = null;
    }
}