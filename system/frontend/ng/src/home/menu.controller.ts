import {IContextService} from "../context/context.service";
import {IStateService} from "angular-ui-router";
import {IAuthService} from "../authentication/authentication.service";

export class MenuController {
    static id = "menuController";

    constructor(private contextService: IContextService,
                private $state: IStateService,
                private authService: IAuthService) {
        "ngInject";
    }

    get isLoggedIn(): boolean {
        return this.contextService.isLoggedIn;
    }

    redirectToLoginOrLogout(): void {
        if (!this.contextService.isLoggedIn) {
            this.$state.go("login");
        } else {
            this.authService.logout()
                .then(() => {
                    this.$state.go("login");
                });
        }
    }
}