import { addGondelPluginEventListener, GondelComponent } from "@gondel/core";
import { IGondelComponentWithSelectors, SelectorBinding } from "./const";
import { Selector } from "./Selector";
import { lookupCache } from "./cache";

export let areSelectorsHookedIntoCore = false;

export function injectSelectorPluginIntoCore() {
  areSelectorsHookedIntoCore = true;

  addGondelPluginEventListener("Selector", "start", function(
    gondelComponents: GondelComponent<HTMLElement>[],
    _: any | undefined,
    next: (result: any) => any
  ) {
    gondelComponents.forEach((gondelComponent: GondelComponent) => {
      const componentBoundSelectors =
        ((gondelComponent as any).prototype &&
          (gondelComponent as any).prototype.__boundSelectors) ||
        (gondelComponent as IGondelComponentWithSelectors).__boundSelectors;

      if (!componentBoundSelectors || componentBoundSelectors.length === 0) {
        return next(gondelComponents);
      }

      componentBoundSelectors.forEach(([propertyKey, selector, options]: SelectorBinding) => {
        // create new selector cache for current gondel component
        if (!lookupCache.has(gondelComponent)) {
          lookupCache.set(gondelComponent, new Map());
        }

        // get corresponding cache for the current component
        const selectorCache = lookupCache.get(gondelComponent)!;

        Object.defineProperty(gondelComponent, propertyKey, {
          enumerable: true,
          configurable: false,
          get(): Selector<any> {
            if (options.cache && selectorCache.has(selector)) {
              // found in cache, return cached one
              return selectorCache.get(selector)!;
            }

            const selectorInst = new Selector(gondelComponent, [propertyKey, selector, options]);
            selectorCache.set(selector, selectorInst);
            return selectorInst;
          },
          set(_value: any) {
            throw new Error(`You're not allowed to set ${propertyKey} manually`);
          }
        });
      });
    });

    next(gondelComponents);
  });
}
