import {IBrokerConfig} from "../../../messaging/messaging";
import {Config} from "../../../config";

export class MqttConfig implements IBrokerConfig {

    static $inject = ["Config"];

    constructor(private config: Config) {
    }


    configure(): Promise<any> {
        let settings = this.config.brokerSetup;
        return Promise
            .resolve(`mqtt://${settings.user}:${settings.password}@${settings.host}:${settings.port}`);
    }
}