import { GondelComponent } from '@gondel/core';
import { DataBindingConfig } from './DataPlugin';
export interface ISerializer<T extends any = any> {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
}
type GondelComponentWithData = GondelComponent & {
    __dataBindings?: Array<DataBindingConfig>;
};
type GondelComponentDecorator<T> = (target: T, propertyKey: string) => void;
/**
 * The @data prop decorator will save the selected value into the given variable at start.
 * Via overloads you're capable to use it in three different ways:
 *  - @data (_)dataMyAttribute => data-my-attribute
 *  - @data('my-attribute') attr => data-my-attribute
 *  - @data('some-json', JSONSerializer) some => data-some-json (serialized via JSON or any other serializer)
 */
export declare function data<T extends GondelComponentWithData>(target: T, propertyKey: string): void;
export declare function data<T extends GondelComponentWithData>(customAttributeKey: string, serializer?: ISerializer): GondelComponentDecorator<T>;
export {};
