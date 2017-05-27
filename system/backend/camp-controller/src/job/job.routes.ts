import {RouteController, DependableRequest} from "../shared/service/router.service";
import {Response, NextFunction, Request} from "express";
import {HttpStatusCodes} from "../http/http-status-codes";
import {Job} from "./job.model";
import {IJobProvider} from "./job.provider";

export class JobRouter extends RouteController<JobRouterDependencyProvider> {

    static $inject = ["IJobProvider"];

    constructor() {
        super(JobRouterDependencyProvider);

        this.router.param("id", async(req: Request, res: Response, next: NextFunction, value: string) => {
            (<any>req).jobId = value;
            next();
        });

        this.createPostRoutes();
        this.createGetRoutes();
        this.createDeleteRoutes();
    }

    protected routePrefix(): string {
        return "/job";
    }

    private createPostRoutes(): void {
        this.router.post("/job",
            async(req: any, res: Response, next: NextFunction) => {
                let request = req as DependableRequest<JobRouterDependencyProvider>;

                await request.dependencies.jobProvider
                    .validateJob(req.body.job)
                    .then((job: Job) => {
                        req.job = job;
                        next();
                    })
                    .catch((errs: Error[]) => {
                        res.status(HttpStatusCodes.BAD_REQUEST).json(errs);
                    });
            },
            async(req: any, res: Response) => {
                let request = req as DependableRequest<JobRouterDependencyProvider>;

                await request.dependencies.jobProvider
                    .createJob(req.job, req.body.sensorId)
                    .then((job: Job) => {
                        res.status(HttpStatusCodes.OK).json(job);
                    })
                    .catch((err: Error) => {
                        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
                    });
            });

        this.router.post("/job/:id/invoke", async(req: any, res: Response) => {
            let request = req as DependableRequest<JobRouterDependencyProvider>;

            await request.dependencies.jobProvider
                .invokeJob(req.body.sensorId, req.jobId, req.body.parameters)
                .then(() => {
                    res.sendStatus(HttpStatusCodes.OK);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
                });
        });
    }

    private createGetRoutes(): void {
        this.router.get("/job", async(req: any, res: Response) => {
            let request = req as DependableRequest<JobRouterDependencyProvider>;

            await request.dependencies.jobProvider
                .getAllJobs(req.query.sensorId)
                .then((jobs: Job[]) => {
                    res.status(HttpStatusCodes.OK).json(jobs);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });

        this.router.get("/job/:id", async(req: Request, res: Response) => {
            let request = req as DependableRequest<JobRouterDependencyProvider>;

            await request.dependencies.jobProvider
                .getJob((<any>req).jobId)
                .then((job: Job) => {
                    res.status(HttpStatusCodes.OK).json(job);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });
    }

    private createDeleteRoutes(): void {
        this.router.delete("/job", async(req: any, res: Response) => {
            let request = req as DependableRequest<JobRouterDependencyProvider>;

            await request.dependencies.jobProvider
                .deleteJob(req.query.sensorId, req.query.jobId)
                .then(() => {
                    res.sendStatus(HttpStatusCodes.OK);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });
    }
}

class JobRouterDependencyProvider {
    static $inject = ["IJobProvider"];

    constructor(public jobProvider: IJobProvider) {
    }
}