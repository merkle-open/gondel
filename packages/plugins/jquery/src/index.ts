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
    constructor(ctx: HTMLElement, componentName: string) {
      super(ctx, componentName);
      (this as any).$ctx = $(ctx);
    }
  }
  return WithJquery as new (context: HTMLElement, componentName: string) => T & { $ctx: JQuery };
}

/**
 * BaseComponent with JqueryMixin
  * Usage:
   ```
class MyComponent extends GondelJqueyComponent {
  start() {
    console.log(this.$ctx);
  }
}
   ```
 */
export const GondelJqueyComponent = gondelJQueryMixin(GondelBaseComponent);
