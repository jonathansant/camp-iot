export class BaseController {
    constructor(protected FoundationApi: any) {
    }

    protected genericErrorNotification(message?: string): void {
        this.FoundationApi.publish("main-notifications", {
            title: "Error",
            content: message || "Something went wrong!",
            color: "alert",
        });
    }
}