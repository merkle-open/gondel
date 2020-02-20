import { GondelComponent } from "@gondel/core";
import { SelectorBinding, ISelectorBindingOptions, ISelector } from "./const";

export class Selector<T extends HTMLElement = HTMLElement> implements ISelector<T> {
  private boundPropertyKey: string;
  public options: ISelectorBindingOptions;
  public selector: string;

  constructor(private gondelComponent: GondelComponent, binding: SelectorBinding) {
    const [propertyKey, selector, options] = binding;
    this.boundPropertyKey = propertyKey;
    this.selector = selector;
    this.options = options;
  }

  /**
   * Returns a list of matching DOM components found in the current component context
   * @returns {T[]} List of DOM elements
   */
  public get all(): T[] {
    const nodes = this.gondelComponent._ctx.querySelectorAll(this.selector);
    if (!nodes) {
      throw new Error(
        `No components found in ${this.gondelComponent._componentName} for ${this.selector}`
      );
    }
    return Array.prototype.slice.call(nodes);
  }

  /**
   * Returns the first matching element of matching DOM nodes in the current component context
   * @returns {T} The DOM element
   */
  public get first() {
    if (this.all.length === 0) {
      throw new Error(
        `No first component for ${this.selector} found in ${this.gondelComponent._componentName}`
      );
    }
    return this.all[0];
  }

  /**
   * Executes a lookup for different context with the current selector options
   * @param {C} context
   */
  public getInContext<C extends HTMLElement>(context: C) {
    const nodes = context.querySelectorAll(this.selector);
    if (!nodes) {
      throw new Error(`No components found in context ${context} for ${this.selector}`);
    }
    return Array.prototype.slice.call(nodes);
  }

  /**
   * Returns a readable string for debugging
   * @example
   * 'Selector(Component.property) .a-heading > h2'
   */
  public toString() {
    return `Selector(${this.gondelComponent._componentName}.${this.boundPropertyKey}) ${this.selector}`;
  }
}
