export interface DocumentDbConfig {
    endpoint: string;
    key?: string;
    operationalDbName: string;
}

export interface IStorageSetup {
    initConnection(): Promise<DbConnectionResult>;
}

export interface DbConnectionResult {
    db: any;
    dbName: string;
}

export interface StorageError extends Error {
    code: number;
    message: string;
}