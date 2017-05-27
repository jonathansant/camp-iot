import {Response, Request, NextFunction} from "express";
import {IAuthService} from "./auth.service";
import {NotAuthorizedError} from "./auth.model";
import {User} from "../user/user";
import * as express from "express";

export class AuthMiddleware {
    private router = express.Router();

    constructor(private authService: IAuthService) {
        this.setupAuthMiddeleware();
    }

    get middleWare() {
        return this.router;
    }

    private setupAuthMiddeleware(): void {
        this.router.use(async(req: Request, res: Response, next: NextFunction) => {
            if ((/.*?(user|auth)/i).test(req.path)) {
                next();
                return;
            }

            let token = req.body.token || req.query.token || req.headers["x-access-token"];

            await this.authService.verify(token)
                .then((decodedUser: User) => {
                    if (!decodedUser) {
                        return res.status(403).json(new NotAuthorizedError().message);
                    }

                    (req as any).user = decodedUser;

                    next();
                })
                .catch((err: Error) => {
                    return res.status(403).json(err.message);
                });

        });
    }
}