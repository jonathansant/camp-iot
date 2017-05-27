import {IStorageSetup, DocumentDbConfig, DbConnectionResult} from "../../../storage/storage";
import * as mongoose from "mongoose";
import {Logger} from "bunyan";

export class Setup implements IStorageSetup {
    static $inject = ["DocumentDbConfig", "Logger"];

    constructor(private config: DocumentDbConfig, private logger: Logger) {
    }

    initConnection(): Promise<DbConnectionResult> {
        return new Promise<DbConnectionResult>((resolve: Function, reject: Function) => {
            try {
                let db = mongoose.connect(this.config.endpoint);
                db.connection.on("error", (err: Error) => {
                    this.logger.error(err);
                });

                resolve({
                    db: db,
                    dbName: "MongoDb"
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}