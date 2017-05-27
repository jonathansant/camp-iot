import {ContainerItem} from "./ioc.model";

//todo extremely important add lifecycle support

export class ContainerService {
    private container = new Map<string, ContainerItem>();

    register(item: ContainerItem): void {
        if (!this.container.has(item.key)) {
            this.container.set(item.key, item);
        }
    }

    getByKey<T>(key: string): T {
        let item = this.tryGet(key);
        if (this.shouldInstantiate(item)) {
            throw `${key} is not a singleton and it should be created. Try using the create function instead.`;
        }

        return item.item;
    }

    create<T>(instantiatee: {new(...args: any[]): T; }): T {
        let injections = (<any>instantiatee).$inject;
        let items: any[];
        if (injections) {
            items = this.resolve(injections);
        }

        const _instantiatee = instantiatee;
        let ins = function (...args: any[]) {
            return new _instantiatee(...args);
        };
        ins.prototype = _instantiatee;

        ins = ins.apply(null, items);

        return <T><any>ins;
    }

    private resolve(injectionKeys: string[]): any[] {
        let foundItems: any[] = [];

        injectionKeys.forEach((key: string) => {
            let containerItem = this.tryGet(key);
            let instance = containerItem.item;

            if (this.shouldInstantiate(containerItem)) {
                instance = this.create(instance);

                if (containerItem.isSingleton) {
                    containerItem.asNonInstantiatable();
                    containerItem.item = instance;
                }
            }

            foundItems.push(instance);
        });

        return foundItems;
    }

    private tryGet(key: string): ContainerItem {
        let containerItem = this.container.get(key);
        if (containerItem) {
            return containerItem;
        }

        throw `Dependency ${key} not registered!`;
    }

    private shouldInstantiate(item: ContainerItem): boolean {
        let nonSingleton = !item.isSingleton && item.isInstantiatable;
        let lazySingleton = item.isSingleton && item.isInstantiatable;

        return nonSingleton || lazySingleton;
    }
}