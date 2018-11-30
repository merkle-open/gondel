export interface IStorage {
    readonly length: number;
    clear(): void;
    getItem(key: string): string | null;
    key(index: number): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
    [name: string]: any;
}
export interface ISerializer<T extends any = any> {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
}
declare type AdditionalAdapterConfiguration = {
    prefix: string;
    postfix: string;
    delimitier: string;
};
export declare class Adapter {
    private name;
    private store;
    private config;
    constructor(name: string, store: IStorage);
    configure(config: AdditionalAdapterConfiguration): void;
    get<T, S extends ISerializer<T>>(key: string, serializer?: S): T | void;
    set<T extends any = string>(key: string, value: T, serializer?: ISerializer<T>): void;
    remove(key: string): void;
    clear(): void;
    toString(): string;
    private generateAccessorKey;
}
export declare const localStorageAdapter: Adapter;
export declare const sessionStorageAdapter: Adapter;
export {};
