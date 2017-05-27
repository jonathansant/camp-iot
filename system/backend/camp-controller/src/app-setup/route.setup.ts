import {UserRouter} from "../user/user";
import {AuthRouter, AuthMiddleware, IAuthService} from "../auth/auth";
import {Request, Response, NextFunction, Application} from "express";
import {Logger} from "bunyan";
import {ContainerService} from "../shared/IoC/ioc";
import {SensorRouter} from "../sensor/sensor";
import * as cors from "cors";
import {VariableRouter} from "../variable/variable";
import {StreamRouter} from "../stream/stream";
import {JobRouter} from "../job/job";
import {ControllerInfoRouter} from "../controller-info/controller-info";

export default function (app: Application): void {
    "use strict";

    let container: ContainerService = app.get("ioc");

    const userRoutes = new UserRouter();
    const authRoutes = new AuthRouter();
    const sensorRoutes = new SensorRouter();
    const variableRoutes = new VariableRouter();
    const streamRoutes = new StreamRouter();
    const jobRoutes = new JobRouter();
    const controllerInfoRoutes = new ControllerInfoRouter();
    const authMiddleware = new AuthMiddleware(container.getByKey<IAuthService>("IAuthService"));

    const logger = container.getByKey<Logger>("Logger");

    const routePrefix = "/api";

    app.use(cors());

    app.use(authMiddleware.middleWare);
    app.use(routePrefix, userRoutes.routes);
    app.use(routePrefix, authRoutes.routes);
    app.use(routePrefix, sensorRoutes.routes);
    app.use(routePrefix, variableRoutes.routes);
    app.use(routePrefix, streamRoutes.routes);
    app.use(routePrefix, jobRoutes.routes);
    app.use(routePrefix, controllerInfoRoutes.routes);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error(err, null, req);
        return next(err);
    });
};