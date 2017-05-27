import * as os from "os";
import {ControllerInfo} from "./controller-info.model";
import {Config} from "../config";

export interface IControllerInfoService {
    getInfo(): Promise<ControllerInfo>;
}

//todo remove as this is just for thesis
export class ControllerInfoService implements IControllerInfoService {

    static $inject = ["Config"];

    constructor(private config: Config) {
    }

    getInfo(): Promise<ControllerInfo> {

        return Promise.resolve({
            platform: os.platform(),
            brokerProtocol: this.config.brokerSetup.protocol
        } as ControllerInfo);
    }
}