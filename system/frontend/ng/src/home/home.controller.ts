import {IHomeService} from "./home.service";
import {BaseController} from "../shared/controllers/base.controller";
import {ControllerInfo} from "./home.model";

export class HomeController extends BaseController {

    campControllerInfo: ControllerInfo;

    constructor(private homeService: IHomeService,
                protected FoundationApi: any) {
        "ngInject";

        super(FoundationApi);

        this.loadControllerInfo();
    }

    private loadControllerInfo(): void {
        this.homeService
            .getControllerInfo()
            .then((info: ControllerInfo) => {
                this.campControllerInfo = info;
            })
            .catch((err: Error) => {
                this.genericErrorNotification(err.message);
            });
    }
}