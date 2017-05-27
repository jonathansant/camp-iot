export interface BrokerConfig {
    user: string;
    password: string;
    //server: string;
    host: string;
    port: number;
    vhost?: string;
    protocol: string;
}