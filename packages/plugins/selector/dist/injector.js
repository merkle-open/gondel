import { addGondelPluginEventListener } from "@gondel/core";
import { Selector } from "./Selector";
import { lookupCache } from "./cache";
export var areSelectorsHookedIntoCore = false;
export function injectSelectorPluginIntoCore() {
    areSelectorsHookedIntoCore = true;
    addGondelPluginEventListener("Selector", "start", function (gondelComponents, _, next) {
        gondelComponents.forEach(function (gondelComponent) {
            var componentBoundSelectors = (gondelComponent.prototype &&
                gondelComponent.prototype.__boundSelectors) ||
                gondelComponent.__boundSelectors;
            if (!componentBoundSelectors || componentBoundSelectors.length === 0) {
                return next(gondelComponents);
            }
            componentBoundSelectors.forEach(function (_a) {
                var propertyKey = _a[0], selector = _a[1], options = _a[2];
                // create new selector cache for current gondel component
                if (!lookupCache.has(gondelComponent)) {
                    lookupCache.set(gondelComponent, new Map());
                }
                // get corresponding cache for the current component
                var selectorCache = lookupCache.get(gondelComponent);
                Object.defineProperty(gondelComponent, propertyKey, {
                    enumerable: true,
                    configurable: false,
                    get: function () {
                        if (options.cache && selectorCache.has(selector)) {
                            // found in cache, return cached one
                            return selectorCache.get(selector);
                        }
                        var selectorInst = new Selector(gondelComponent, [propertyKey, selector, options]);
                        selectorCache.set(selector, selectorInst);
                        return selectorInst;
                    },
                    set: function (_value) {
                        throw new Error("You're not allowed to set " + propertyKey + " manually");
                    }
                });
            });
        });
        next(gondelComponents);
    });
}
//# sourceMappingURL=injector.js.map