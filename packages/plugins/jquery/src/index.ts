/**
 * This plugin provides utils for Gondel jQuery integrations
 */
import { GondelBaseComponent, IGondelComponent } from "@gondel/core";
import $ from "jquery";

/**
 * Class mixin https://basarat.gitbooks.io/typescript/docs/types/mixins.html
 * Usage:
   ```
class MyComponent extends gondelJQueryMixin(GondelBaseComponent) {
  start() {
    console.log(this.$ctx);
  }
}
   ```
 */
export function gondelJQueryMixin<
  T extends GondelBaseComponent,
  U extends new (context: HTMLElement, componentName: string) => T
>(BaseClass: U) {
  class WithJquery extends (BaseClass as IGondelComponent) {
    $ctx: JQuery<HTMLElement>;
    constructor(ctx: HTMLElement, componentName: string) {
      super(ctx, componentName);
      this.$ctx = $(ctx);
    }
  }
  return WithJquery as new (context: HTMLElement, componentName: string) => T & { $ctx: JQuery };
}

/**
 * BaseComponent with JqueryMixin
  * Usage:
   ```
class MyComponent extends GondelJqueryComponent {
  start() {
    console.log(this.$ctx);
  }
}
   ```
 */
export class GondelJqueryComponent<
  TElement extends HTMLElement = HTMLElement
> extends GondelBaseComponent<TElement> {
  $ctx: JQuery<TElement>;
  constructor(ctx: TElement, componentName: string) {
    super(ctx, componentName);
    this.$ctx = $(ctx);
  }
}
