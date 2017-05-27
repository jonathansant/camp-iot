import * as sourcemap_support from "source-map-support";
import {createLogger, DEBUG, ERROR, Stream} from "bunyan";

const isProduction = () => {
    return process.env.NODE_ENV === "production";
};

export default function setupDebug() {
    "use strict";

    if (!isProduction()) {
        sourcemap_support.install();
    }
}

export const setUpLogger = () => {
    let setup = {
        name: "Camp-Cloud-Controller",
        streams: [] as Stream[]
    };

    if (isProduction()) {
        setup.streams.push(<any>{
            level: ERROR,
            path: "./error.log"
        });
    } else {
        setup.streams = setup.streams.concat([
            {
                level: DEBUG,
                stream: process.stdout
            },
            {
                level: ERROR,
                stream: process.stdout
            }]);
    }

    return createLogger(setup);
};