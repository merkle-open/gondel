/// <reference types="jquery" />
/**
 * This plugin provides utils for Gondel jQuery integrations
 */
import { GondelBaseComponent } from "@gondel/core";
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
export declare function gondelJQueryMixin<T extends GondelBaseComponent, U extends new (context: HTMLElement, componentName: string) => T>(BaseClass: U): new (context: HTMLElement, componentName: string) => T & {
    $ctx: JQuery<HTMLElement>;
};
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
export declare const GondelJqueyComponent: new (context: HTMLElement, componentName: string) => GondelBaseComponent & {
    $ctx: JQuery<HTMLElement>;
};
