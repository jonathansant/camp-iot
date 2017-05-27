import {IBrokerConfig} from "../../../messaging/broker.service";
import {Config} from "../../../config";

export class AmqpConfig implements IBrokerConfig {
    static $inject = ["Config"];

    constructor(private config: Config) {
    }

    configure(): Promise<any> {
        let settings = this.config.brokerSetup;
        return Promise
            .resolve(`amqp://${settings.user}:${settings.password}@${settings.host}/${settings.vhost}`);
    }
}