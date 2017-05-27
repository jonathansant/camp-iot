import {Response, Request} from "express";
import {RouteController, DependableRequest} from "../shared/service/router.service";
import {IAuthService} from "./auth.service";
import {AuthError, AuthenticationResponse} from "./auth.model";

export class AuthRouter extends RouteController<AuthRouterDependencyProvider> {
     constructor() {
        super(AuthRouterDependencyProvider);

        this.setupAuthRoute();
    }

    protected routePrefix(): string {
        return "/user/auth";
    }

    private setupAuthRoute(): void {
        this.router.post("/user/auth", async(req: Request, res: Response) => {

            let request = req as DependableRequest<AuthRouterDependencyProvider>;

            await request.dependencies.authService.authenticate(req.body.email, req.body.password)
                .then((auth: AuthenticationResponse) => {
                    res.status(200).json(auth);
                })
                .catch((err: Error) => {
                    if (err instanceof AuthError) {
                        res.status(401).json(err.message);
                    } else {
                        res.sendStatus(500);
                    }
                });
        });
    }
}

class AuthRouterDependencyProvider {
    static $inject = ["IAuthService"];

    constructor(public authService: IAuthService) {
    }
}