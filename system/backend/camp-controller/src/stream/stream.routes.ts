import {RouteController, DependableRequest} from "../shared/service/router.service";
import {IStreamService} from "./stream.service";
import {Response, NextFunction} from "express";
import {HttpStatusCodes} from "../http/http-status-codes";
import {Stream} from "./stream.model";

export class StreamRouter extends RouteController<StreamRouterDependencyProvider> {

    static $inject = ["IStreamService"];

    constructor() {
        super(StreamRouterDependencyProvider);

        this.createPostRoutes();
        this.createGetRoutes();
    }

    protected routePrefix(): string {
        return "/stream";
    }

    private createPostRoutes(): void {
        this.router.post("/stream",
            async(req: any, res: Response, next: NextFunction) => {
                let request = req as DependableRequest<StreamRouterDependencyProvider>;

                await request.dependencies.streamService
                    .validateStream(req.body)
                    .then((stream: Stream) => {
                        req.stream = stream;
                        next();
                    })
                    .catch((errs: Error[]) => {
                        res.status(HttpStatusCodes.BAD_REQUEST).json(errs);
                    });
            },
            async(req: any, res: Response) => {
                let request = req as DependableRequest<StreamRouterDependencyProvider>;

                await request.dependencies.streamService
                    .createStream(req.body)
                    .then((stream: Stream) => {
                        res.status(HttpStatusCodes.OK).json(stream);
                    })
                    .catch((err: Error) => {
                        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
                    });
            });
    }

    private createGetRoutes(): void {
        this.router.param("variableId",
            async(req: any, res: Response, next: NextFunction, value: string) => {
                req.variableId = value;
                next();
            });

        this.router.get("/stream/:variableId",
            async(req: any, res: Response) => {
                let request = req as DependableRequest<StreamRouterDependencyProvider>;

                request.dependencies
                    .streamService.getStreamsByVariableId(req.variableId)
                    .then((streams: Stream[]) => {
                        res.status(HttpStatusCodes.OK).json(streams);
                    })
                    .catch((err: Error) => {
                        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
                    });
            });
    }
}

class StreamRouterDependencyProvider {

    static $inject = ["IStreamService"];

    constructor(public streamService: IStreamService) {
    }
}