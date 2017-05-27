import {RouteController, DependableRequest} from "../shared/service/router.service";
import {Request, Response} from "express";
import {HttpStatusCodes} from "../http/http-status-codes";
import {IControllerInfoService} from "./controller-info.service";
import {ControllerInfo} from "./controller-info.model";

export class ControllerInfoRouter extends RouteController<ControllerInfoRouterDependencyProvider> {

    static $inject = ["IControllerInfoService"];

    constructor() {
        super(ControllerInfoRouterDependencyProvider);

        this.createGetRoutes();
    }

    protected routePrefix(): string {
        return "/controller-info";
    }

    private createGetRoutes(): void {
        this.router.get("/controller-info", async(req: Request, res: Response) => {
            let request = req as DependableRequest<ControllerInfoRouterDependencyProvider>;

            await request.dependencies.controllerInfoService.getInfo()
                .then((controllerInfo: ControllerInfo) => {
                    res.status(HttpStatusCodes.OK).json(controllerInfo);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });
    }
}

class ControllerInfoRouterDependencyProvider {
    static $inject = ["IControllerInfoService"];

    constructor(public controllerInfoService: IControllerInfoService) {
    }
}