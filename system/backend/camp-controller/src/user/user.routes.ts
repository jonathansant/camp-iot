import {IUserService} from "./user.service";
import {User} from "./user.model";
import {
    Request,
    Response,
    NextFunction
} from "express";
import {RouteController, DependableRequest} from "../shared/service/router.service";
import {HttpStatusCodes} from "../http/http-status-codes";

export class UserRouter extends RouteController<UserRouterDependencyProvider> {

    constructor() {
        super(UserRouterDependencyProvider);

        this.registerUserRoute();
    }

    protected routePrefix(): string {
        return "/user";
    }

    private registerUserRoute(): void {
        this.router.post("/user", async(req: Request, res: Response, next: NextFunction) => {
            let request = req as DependableRequest<UserRouterDependencyProvider>;

            await request.dependencies.userService.validateUserRegistration(req.body)
                .then((user: User) => {
                    (<any>req).validatedUser = user;
                    next();
                })
                .catch((errors: Error) => {
                    res.status(HttpStatusCodes.BAD_REQUEST).json(errors);
                });
        }, async(req: Request, res: Response) => {
            let user: User = (<any>req).validatedUser;

            let request = req as DependableRequest<UserRouterDependencyProvider>;

            await request.dependencies.userService.registerUser(user)
                .then(() => {
                    res.end();
                }).catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });
    }
}

class UserRouterDependencyProvider {
    static $inject = ["IUserService"];

    constructor(public userService: IUserService) {
    }
}