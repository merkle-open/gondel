import { GondelComponent } from '@gondel/core';
import { Adapter, ISerializer } from './Adapter';
declare type GondelComponentWithStorage = GondelComponent & {
    __gondelStoragePlugin?: boolean;
};
declare type GondelComponentDecorator<T> = (target: T, propertyKey: string) => void;
export declare function storage<T extends GondelComponentWithStorage>(target: T, propertyKey: string): void;
export declare function storage<T extends GondelComponentWithStorage>(customAttributeKey: string, serializer?: ISerializer, storageAdapter?: Adapter): GondelComponentDecorator<T>;
export {};
