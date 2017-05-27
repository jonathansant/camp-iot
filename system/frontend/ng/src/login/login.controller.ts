import {IAuthService} from "../authentication/authentication.service";
import {IStateService} from "angular-ui-router";
import {HttpStatusCodes} from "../http/http-status-codes";
import {User} from "../user/user";
import * as _ from "lodash";
import {IQService, IHttpPromiseCallbackArg} from "angular";
import {BaseController} from "../shared/controllers/base.controller";

export class LoginController extends BaseController {
    static id = "loginController";

    userName: string;
    password: string;

    constructor(private authService: IAuthService,
                private $state: IStateService,
                private $q: IQService,
                protected FoundationApi: any) {
        "ngInject";

        super(FoundationApi);
    }

    login(): void {
        this.authService.authenticate(this.userName, this.password)
            .then((user: User) => {
                if (_.isNull(user) || _.isUndefined(user)) {
                    return this.$q.reject({
                        status: HttpStatusCodes.UNAUTHORIZED
                    });
                }

                this.$state.go("secure.home");
            })
            .catch((response: IHttpPromiseCallbackArg<any>) => {
                if (response.status === HttpStatusCodes.UNAUTHORIZED) {
                    this.genericErrorNotification("Incorrect Username or Password!");
                } else {
                    this.genericErrorNotification();
                }
            });
    }
}