import {IStreamRepository} from "../storage/storage";
import {Stream} from "./stream.model";
import {Logger} from "bunyan";
import {IValidator} from "../shared/service/validator.service";

export interface IStreamService {
    createStream(stream: Stream): Promise<Stream>;
    validateStream(stream: Stream): Promise<Stream>;
    deleteStreamsByVariableId(variableId: string): Promise<void>;
    getStreamsByVariableId(variableId: string): Promise<Stream[]>;
}

export class StreamService implements IStreamService {

    static $inject = ["IStreamRepository", "Logger", "IValidator"];

    constructor(private streamRepository: IStreamRepository,
                private logger: Logger,
                private validator: IValidator) {
    }

    createStream(stream: Stream): Promise<Stream> {
        stream.timeStamp = new Date(Date.now());

        return this.streamRepository
            .save(stream)
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    validateStream(stream: Stream): Promise<Stream> {
        let validate = (resolve: Function, reject: Function) => {
            let errors = this.validator.validate(stream);
            if (errors && errors.length > 0) {
                reject(errors);
                return;
            }

            resolve(stream);
        };

        return new Promise(validate);
    }

    deleteStreamsByVariableId(variableId: string): Promise<void> {
        return this.streamRepository
            .deleteByVariableId(variableId)
            .then(() => {
                return Promise.resolve();
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }

    getStreamsByVariableId(variableId: string): Promise<Stream[]> {
        return this.streamRepository
            .getStreamsByVariableId(variableId, 8)
            .then((streams: Stream[]) => {
                return streams.sort((streamA: Stream, streamB: Stream) => {
                    if (streamA.timeStamp > streamB.timeStamp) {
                        return 1;
                    } else if (streamA.timeStamp < streamB.timeStamp) {
                        return -1;
                    }

                    return 0;
                });
            })
            .catch((err: Error) => {
                this.logger.error(err);
                return Promise.reject(err);
            });
    }
}