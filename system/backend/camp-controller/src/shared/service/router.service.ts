import {Router} from "express";
import * as express from "express";
import {Request, Response, NextFunction} from "express";
import {setupOperationalContainer} from "../../app-setup/container.setup";
import {IContextService} from "./context.service";

//todo refactor routing to consider IoC. This works but it is ugly. Revisit how routing is being created.

export abstract class RouteController<T> {
    protected router: Router;

    constructor(private dependencyProvider: Function) {
        this.router = express.Router();

        this.router.use(this.routePrefix(), async (req: Request, response: Response, next: NextFunction) => {
            let container = setupOperationalContainer();
            let request = req as DependableRequest<T>;
            request.dependencies = container.create<T>(<any>this.dependencyProvider);

            //todo: this should be done on server init no need to do it on every request
            const contextService = container.getByKey<IContextService>("IContextService");
            contextService.serverAddress = req.header("host");

            next();
        });
    }

    protected abstract routePrefix(): string;

    get routes(): Router {
        return this.router;
    }
}

export interface DependableRequest<T> extends Request {
    dependencies: T;
}