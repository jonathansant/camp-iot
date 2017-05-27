import {WorkerService} from "./worker.service";
import {setUpLogger} from "../app-setup/diagnostics.setup";
import {Config} from "../config";
import {ChildProcess} from "child_process";
import {Command} from "../messaging/messaging.model";

describe("Given start process was called", () => {
    describe("When not process is started", () => {
        it("it should start a new process", (done) => {

            let config = new Config();
            config.buildDir = "_build";

            let worker = new WorkerService(setUpLogger());

            worker.createProcess(`${config.buildDir}/worker/worker.process.js`)
                .then((wrk: ChildProcess) => {
                setTimeout(() => {
                    worker.sendMessage(wrk.pid, {
                        command: Command.publish,
                        payload: {}
                    });
                    wrk.disconnect();

                    done();
                }, 1000);
            });
        });
    });
});