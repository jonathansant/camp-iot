import {DocumentDbConfig} from "../../storage/storage";
import {
    DocumentClient,
    QueryError,
    DatabaseMeta,
    SqlQuerySpec
} from "documentdb";
import {QueryIterator} from "documentdb";

export class AzureDocumentDb {
    static $inject = ["DocumentDbConfig"];

    private documentClient: DocumentClient;

    constructor(private azureDbConfig: DocumentDbConfig) {
        this.documentClient = new DocumentClient(azureDbConfig.endpoint, {
            masterKey: azureDbConfig.key
        });
    }

    createOperationalDb(): Promise<DatabaseMeta> {
        return this.checkElementExistence<DatabaseMeta>
            (
                this.azureDbConfig.operationalDbName,
                this.documentClient.queryDatabases
            )
            .then((dbs: any) => {
                if (dbs) {
                    return dbs;
                }

                let returnValue: Promise<Error>|DatabaseMeta;
                this.documentClient.createDatabase({id: this.azureDbConfig.operationalDbName}, null,
                    (err: QueryError, created: DatabaseMeta) => {
                        if (err) {
                            returnValue = Promise.reject<Error>(err);
                            return;
                        }

                        returnValue = created;
                    });

                return returnValue;
            });
    }

    private checkElementExistence<T>(id: any,
                                     queryFunction: QueryFunction<T>,
                                     elementLink?: string): Promise<T> {

        let query = (resolve: any, reject: any) => {
            let querySpec: SqlQuerySpec = {
                query: "SELECT * FROM root r WHERE r.id=@id",
                parameters: [{
                    name: "@id",
                    value: id
                }]
            };

            let iterator: QueryIterator<T>;
            if (elementLink) {
                iterator = queryFunction.call(this.documentClient, elementLink, querySpec);
            } else {
                iterator = queryFunction.call(this.documentClient, querySpec);
            }

            iterator.toArray((err: QueryError, results: T[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(results[0]);
            });
        };

        return new Promise<T>(query);
    }
}

interface QueryFunction<T> {
    (elementLink: string, query: SqlQuerySpec): QueryIterator<T>;
    (query: SqlQuerySpec): QueryIterator<T>;
}