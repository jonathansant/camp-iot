declare module "rabbot" {
    function configure(configuration: any): Promise<void>;

    function addExchange(name: string, type: string, options: ExchangeOptions): Promise<any>

    function addQueue(name: string, options: QueueOptions): Promise<any>;

    function bindQueue(exchange: string, queue: string, routingKeys: string[]): Promise<void>;

    function nackOnError(): any;

    function handle(topicId: string, callback: (message: Message) => void): void;

    function publish(exchangeName: string, options: PublishOptions): Promise<any>;

    function startSubscription(queueName: string): Promise<any>;

    function addConnection(config: any): any;

    // enum ExchangeType {
    //     topic,
    //     fanout,
    //     direct
    // }

    interface ExchangeOptions {
        autoDelete: boolean;
        durable: boolean;
        persistent: boolean;
    }

    interface QueueOptions {
        durable: boolean;
        autoDelete: boolean;
        noAck: boolean;
        exclusive: boolean;
        subscribe: boolean;
    }

    interface Message {
        content: any;
        body: any;
        topicId: string;
        ack(): void;
    }

    interface PublishOptions {
        routingKey: string;
        type: string;
        body: any;
        contentType?: string;
    }
}