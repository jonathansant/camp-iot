import {User} from "../../user/user";

export interface IContextService {
    currentUser: User;
    serverAddress: string;
}

export class ContextService implements IContextService {
    private _currentUser: User;
    private _serverAddress: string;

    get currentUser(): User {
        return this._currentUser;
    }

    set currentUser(user: User) {
        this._currentUser = user;
    }

    get serverAddress(): string {
        return this._serverAddress;
    }

    set serverAddress(serverAddress: string) {
        this._serverAddress = serverAddress;
    }
}