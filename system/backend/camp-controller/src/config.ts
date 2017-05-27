import {DocumentDbConfig} from "./storage/storage";
import {BrokerConfig} from "./messaging/broker.model";

export class Config {
    azureDbSetup: DocumentDbConfig = {
        endpoint: "https://campdb.documents.azure.com:443/;" +
        "AccountKey=jc4Toh01gxcS+pMoNm3KgRlV48WW+gQs/sPkGgrC8QFMs2uPl0A99ncEIoSn3P4/chxlZNMgtGjuff7XQJakgA==;",
        key: "jc4Toh01gxcS+pMoNm3KgRlV48WW+gQs/sPkGgrC8QFMs2uPl0A99ncEIoSn3P4/chxlZNMgtGjuff7XQJakgA==",
        operationalDbName: "Operational"
    };

    mongoDbAzureSetup: DocumentDbConfig = {
        endpoint: "mongodb://js781:Dare2Win@ds036709.mlab.com:36709/camp-db",
        operationalDbName: "camp-db"
    };

    mongoDbAmazonSetup: DocumentDbConfig = {
        endpoint: "mongodb://js781:Dare2Win@ds011492.mlab.com:11492/camp-db-2",
        operationalDbName: "camp-db-2"
    };

    mongoDbLocalSetup: DocumentDbConfig = {
        endpoint: "mongodb://localhost:27017/CampDb",
        operationalDbName: "Operational"
    };

    port = 3000;
    apiSecrete = "tHe~1$in7h3cL0ud!IN*";
    tokenTimeOut = "1d";
    buildDir = "_build";
    brokerCleanUpDelay = 1000 * 60 * 20;

    // brokerSetup: BrokerConfig = {
    //     host: "weasel.rmq.cloudamqp.com",
    //     port: 5672,
    //     user: "cfaseevl",
    //     password: "RPFoCrWZvQPxSy_qhioNnmSd_tgAlt1F",
    //     vhost: "cfaseevl",
    //     protocol: "AMQP"
    // };

    brokerSetup: BrokerConfig = {
        host: "m12.cloudmqtt.com",
        port: 14461,
        user: "ihoygctf",
        password: "u78pw3kJdxjf",
        protocol: "MQTT"
    };

    // brokerSetup: BrokerConfig = {
    //     host: "weasel.rmq.cloudamqp.com",
    //     port: 1883,
    //     user: "cfaseevl:cfaseevl",
    //     password: "RPFoCrWZvQPxSy_qhioNnmSd_tgAlt1F",
    //     protocol: "MQTT"
    // };

    // brokerSetup: BrokerConfig = {
    //     host: "localhost",
    //     port: 1883,
    //     user: "js781",
    //     password: "CampIoT",
    //     vhost: "%2f"
    // };
}