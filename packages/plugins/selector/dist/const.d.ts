import { GondelComponent } from '@gondel/core';
export interface ISelectorBindingOptions {
    cache?: boolean;
}
export declare type SelectorBinding = [string, // class property key
string, // the main DOM selector
ISelectorBindingOptions];
export interface IGondelComponentWithSelectors extends GondelComponent {
    __boundSelectors?: SelectorBinding[];
}
/**
 * Main selector API for devs
 */
export interface ISelector<T extends HTMLElement = HTMLElement> {
    all: T[];
    first: T;
    selector: string;
    options: ISelectorBindingOptions;
    getInContext<C extends HTMLElement>(context: C): T;
    toString(): string;
}
