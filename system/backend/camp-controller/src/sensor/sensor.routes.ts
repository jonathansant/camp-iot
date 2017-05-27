import {RouteController, DependableRequest} from "../shared/service/router.service";
import {Request, Response, NextFunction} from "express";
import {Sensor} from "./sensor.model";
import {IContextService} from "../shared/service/context.service";
import {HttpStatusCodes} from "../http/http-status-codes";
import {ISensorProvider} from "./sensor.provider";

export class SensorRouter extends RouteController<SensorRouterDependencyProvider> {

    static $inject = ["ISensorProvider", "IContextService"];

    constructor() {
        super(SensorRouterDependencyProvider);

        this.createPostRoutes();
        this.createGetRoutes();
        this.createDeleteRoutes();
    }

    private createPostRoutes(): void {
        this.router.post("/sensor",
            async(req: Request, res: Response, next: NextFunction) => {
                let request = req as DependableRequest<SensorRouterDependencyProvider>;

                await request.dependencies.sensorProvider.validateSensor(req.body)
                    .then((sensor: Sensor) => {
                        (<any>req).sensor = sensor;
                        next();
                    })
                    .catch((errs: Error[]) => {
                        res.status(HttpStatusCodes.BAD_REQUEST).json(errs);
                    });
            },
            async(req: Request, res: Response) => {
                let request = req as DependableRequest<SensorRouterDependencyProvider>;

                await request.dependencies.sensorProvider
                    .createSensor((<any>req).sensor, (req as any).user._id)
                    .then((sensor: Sensor) => {
                        res.status(HttpStatusCodes.OK).json(sensor);
                    })
                    .catch((err: Error) => {
                        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                    });
            });
    }

    protected routePrefix(): string {
        return "/sensor";
    }

    private createGetRoutes(): void {
        this.router.get("/sensor", async(req: Request, res: Response) => {
            let request = req as DependableRequest<SensorRouterDependencyProvider>;

            await request.dependencies.sensorProvider
                .getAllSensors((req as any).user._id)
                .then((sensors: Sensor[]) => {
                    res.status(HttpStatusCodes.OK).json(sensors);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });

        this.router.param("id", async(req: Request, res: Response, next: NextFunction, value: string) => {
            (<any>req).sensorId = value;
            next();
        });

        this.router.get("/sensor/:id", async(req: Request, res: Response) => {
            let request = req as DependableRequest<SensorRouterDependencyProvider>;

            await request.dependencies.sensorProvider
                .getSensor((<any>req).sensorId)
                .then((sensor: Sensor) => {
                    res.status(HttpStatusCodes.OK).json(sensor);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });

        });
    }

    private createDeleteRoutes(): void {
        this.router.delete("/sensor", async(req: Request, res: Response) => {
            let request = req as DependableRequest<SensorRouterDependencyProvider>;

            await request.dependencies.sensorProvider
                .deleteSensor((req as any).user._id, req.query.id)
                .then(() => {
                    res.sendStatus(HttpStatusCodes.OK);
                })
                .catch((err: Error) => {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
                });
        });
    }
}

class SensorRouterDependencyProvider {
    static $inject = ["ISensorProvider", "IContextService"];

    constructor(public sensorProvider: ISensorProvider,
                public contextService: IContextService) {
    }
}