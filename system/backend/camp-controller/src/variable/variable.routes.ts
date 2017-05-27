import {RouteController, DependableRequest} from "../shared/service/router.service";
import {Response, NextFunction, Request} from "express";
import {HttpStatusCodes} from "../http/http-status-codes";
import {Variable} from "./variable.model";
import {IVariableProvider} from "./variable.provider";

export class VariableRouter extends RouteController<VariableRouterDependencyProvider> {
    static $inject = ["IVariableProvider"];

    constructor() {
        super(VariableRouterDependencyProvider);

        this.router.param("id", async(req: Request, res: Response, next: NextFunction, value: string) => {
            (<any>req).variableId = value;
            next();
        });

        this.createPostRoutes();
        this.createGetRoutes();
        this.createDeleteRoutes();
    }

    protected routePrefix(): string {
        return "/variable";
    }

    private createPostRoutes(): void {
        this.router.post("/variable",
            async(req: any, res: Response, next: NextFunction) => {
                let request = req as DependableRequest<VariableRouterDependencyProvider>;

                await request.dependencies.variableProvider
                    .validateVariable(req.body.variable)
                    .then((variable: Variable) => {
                        req.variable = variable;
                        next();
                    })
                    .catch((errs: Error[]) => {
                        res.status(HttpStatusCodes.BAD_REQUEST).json(errs);
                    });
            },
            async(req: any, res: Response) => {
                let request = req as DependableRequest<VariableRouterDependencyProvider>;

                await request.dependencies.variableProvider
                    .createVariable(req.variable, req.body.sensorId)
                    .then((variable: Variable) => {
                        res.status(HttpStatusCodes.OK).json(variable);
                    })
                    .catch((err: Error) => {
                        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
                    });
            });

        this.router.post("/variable/:id/bind", async(req: any, res: Response) => {
            let request = req as DependableRequest<VariableRouterDependencyProvider>;

            await request.dependencies.variableProvider
                .bindToValueUpdates(req.body.sensorId, req.variableId)
                .then((data: any) => {
                    res.status(HttpStatusCodes.OK).json(data);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });

        this.router.post("/variable/unbind", async(req: any, res: Response) => {
            let request = req as DependableRequest<VariableRouterDependencyProvider>;

            await request.dependencies.variableProvider
                .unbindToUpdates(req.body.handlerId)
                .then(() => {
                    res.sendStatus(HttpStatusCodes.OK);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });
    }

    private createGetRoutes(): void {
        this.router.get("/variable", async(req: any, res: Response) => {
            let request = req as DependableRequest<VariableRouterDependencyProvider>;

            await request.dependencies.variableProvider
                .getAllVariables(req.query.sensorId)
                .then((variables: Variable[]) => {
                    res.status(HttpStatusCodes.OK).json(variables);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });

        this.router.get("/variable/:id", async(req: Request, res: Response) => {
            let request = req as DependableRequest<VariableRouterDependencyProvider>;

            await request.dependencies.variableProvider
                .getVariable((<any>req).variableId)
                .then((variable: Variable) => {
                    res.status(HttpStatusCodes.OK).json(variable);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });

        });
    }

    private createDeleteRoutes(): void {
        this.router.delete("/variable", async(req: any, res: Response) => {
            let request = req as DependableRequest<VariableRouterDependencyProvider>;

            await request.dependencies.variableProvider
                .deleteVariable(req.query.sensorId, req.query.variableId)
                .then(() => {
                    res.sendStatus(HttpStatusCodes.OK);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });
    }
}

class VariableRouterDependencyProvider {
    static $inject = ["IVariableProvider"];

    constructor(public variableProvider: IVariableProvider) {
    }
}