import {IRequestConfig, IHttpInterceptor} from "angular";
import {IContextService} from "../context/context.service";
import {IStateService} from "angular-ui-router";
import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;
import IInjectorService = angular.auto.IInjectorService;
import {HttpStatusCodes} from "./http-status-codes";

export class HttpInterceptor {
    static id = "campInterceptor";

    static factory(contextService: IContextService, $injector: IInjectorService): IHttpInterceptor {
        "ngInject";

        return {
            request: (request: IRequestConfig) => {
                request.headers["x-access-token"] = contextService.currentToken;
                return request;
            },
            responseError: (response: IHttpPromiseCallbackArg<any>) => {
                if (response.status === HttpStatusCodes.FORBIDDEN) {
                    let $state = <IStateService>$injector.get("$state");
                    $state.go("login");
                }

                return response;
            }
        };
    }
}