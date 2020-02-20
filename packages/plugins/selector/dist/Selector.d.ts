import { GondelComponent } from '@gondel/core';
import { SelectorBinding, ISelectorBindingOptions, ISelector } from './const';
export declare class Selector<T extends HTMLElement = HTMLElement> implements ISelector<T> {
    private gondelComponent;
    private boundPropertyKey;
    options: ISelectorBindingOptions;
    selector: string;
    constructor(gondelComponent: GondelComponent, binding: SelectorBinding);
    get all(): T[];
    get first(): T;
    getInContext<C extends HTMLElement>(context: C): any;
    toString(): string;
}
