import { GondelComponent } from '@gondel/core';
import { Serializer, ISerializer } from './serializer/all';
/**
 * The @data prop decorator will save the selected value into the given variable at start
 */
export declare function data(attributeKey: string, serializer?: Serializer | ISerializer): <T extends {
    __dataBindings?: [string, string, void | Serializer | ISerializer<any>][] | undefined;
} & GondelComponent<HTMLElement>>(target: T, propertyKey: string) => void;
