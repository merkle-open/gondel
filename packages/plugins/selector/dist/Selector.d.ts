import { GondelComponent } from "@gondel/core";
import { SelectorBinding, ISelectorBindingOptions, ISelector } from "./const";
export declare class Selector<T extends HTMLElement = HTMLElement> implements ISelector<T> {
    private gondelComponent;
    private boundPropertyKey;
    options: ISelectorBindingOptions;
    selector: string;
    constructor(gondelComponent: GondelComponent, binding: SelectorBinding);
    /**
     * Returns a list of matching DOM components found in the current component context
     * @returns {T[]} List of DOM elements
     */
    get all(): T[];
    /**
     * Returns the first matching element of matching DOM nodes in the current component context
     * @returns {T} The DOM element
     */
    get first(): T;
    /**
     * Executes a lookup for different context with the current selector options
     * @param {C} context
     */
    getInContext<C extends HTMLElement>(context: C): any;
    /**
     * Returns a readable string for debugging
     * @example
     * 'Selector(Component.property) .a-heading > h2'
     */
    toString(): string;
}
