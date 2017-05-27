import * as express from "express";
import * as bodyParser from "body-parser";
import {Config} from "./config";
import {setupSystemContainer} from "./app-setup/container.setup";
import diagnosticsSetup from "./app-setup/diagnostics.setup";
import databaseSetup from "./app-setup/database.setup";
import {ContainerService} from "./shared/IoC/ioc";
import routeSetup from "./app-setup/route.setup";
import {Logger} from "bunyan";
import brokerSetup from "./app-setup/broker.setup";

diagnosticsSetup();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

setupSystemContainer(app);
databaseSetup(app);
routeSetup(app);

const container: ContainerService = app.get("ioc");

const logger = container.getByKey<Logger>("Logger");
const config = container.getByKey<Config>("Config");

brokerSetup(app, config);

const port = process.env.PORT || config.port;

const server = app.listen(port, () => {
    let addr = server.address();
    logger.info(`Server running on port: ${port}. Server address: ${addr.address}:${addr.port}`);
});