import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";

export type NodeFilePersistenceOpts = {
    filePath: string;
    getStorage?: () => Record<string, any>;
    setStorage?: (currentStorage: Record<string, any>) => Promise<void> | void;
}

export function createNodeFilePersistence(opts: NodeFilePersistenceOpts) {
    function defaultGetStorage(): Record<string, any> {
        if (!existsSync(opts.filePath)) {
            return {};
        }

        const storageContent = readFileSync(opts.filePath, { encoding: 'utf-8' });
        return JSON.parse(storageContent);
    }

    async function defaultSetStorage(storage: Record<string, any>) {
        await writeFile(opts.filePath, JSON.stringify(storage, null, 2), { encoding: 'utf-8' });
    }

    return class {
        static type: 'NONE' = 'NONE';
        readonly type = 'NONE' as any;
        getStorage = opts.getStorage || defaultGetStorage;
        setStorage = opts.setStorage || defaultSetStorage;
        filePath: string = opts.filePath;
        storage: Record<string, any> = this.getStorage();

        async _isAvailable(): Promise<boolean> {
            return true;
        }

        async _set<T>(key: string, value: T): Promise<void> {
            this.storage[key] = value;
            await this.setStorage(this.storage);
        }

        async _get<T>(key: string): Promise<T | null> {
            const value = this.storage[key];
            return value === undefined ? null : (value as T);
        }

        async _remove(key: string): Promise<void> {
            delete this.storage[key];
            await this.setStorage(this.storage);
        }

        _addListener(_key: string, _listener: any): void {
            // Listeners are not supported
            return;
        }

        _removeListener(_key: string, _listener: any): void {
            // Listeners are not supported
            return;
        }
    }
}