import {ContainerService} from "./ioc.service";

export class ContainerItem {
    private _isSingleton = false;
    public key: string;
    public item: any;
    private _isInstantiatable = true;

    constructor(private container: ContainerService) {
    }

    get isSingleton(): boolean {
        return this._isSingleton;
    }

    get isInstantiatable(): boolean {
        return this._isInstantiatable;
    }

    forKey(key: string): ContainerItem {
        this.key = key;
        return this;
    }

    use(item: Object|Function): ContainerItem {
        this.item = item;
        return this;
    }

    asSingleton(): ContainerItem {
        this._isSingleton = true;
        this._isInstantiatable = false;
        this.item = this.container.create(this.item);

        return this;
    }

    asLazySingleton(): ContainerItem {
        this._isSingleton = true;
        return this;
    }

    asNonInstantiatable(): ContainerItem {
        this._isInstantiatable = false;
        return this;
    }

    andRegister(): void {
        this.container.register(this);
    }

    static create(container: ContainerService): ContainerItem {
        return new ContainerItem(container);
    }
}
