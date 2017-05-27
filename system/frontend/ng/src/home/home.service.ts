import {Config} from "../config/config.model";
import {IHttpService, IPromise, IHttpPromiseCallbackArg} from "angular";
import {ControllerInfo} from "./home.model";

export interface IHomeService {
    getControllerInfo(): IPromise<ControllerInfo>;
}

export class HomeService implements IHomeService {

    static id = "homeService";

    constructor(private $http: IHttpService,
                private config: Config) {
        "ngInject";
    }

    getControllerInfo(): IPromise<ControllerInfo> {
        return this.$http
            .get(`${this.config.apiEndpointUrl}/api/controller-info`)
            .then((response: IHttpPromiseCallbackArg<ControllerInfo>) => {
                return response.data;
            });
    }
}