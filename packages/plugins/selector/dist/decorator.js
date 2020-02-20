import { areSelectorsHookedIntoCore, injectSelectorPluginIntoCore } from "./injector";
/**
 * The @selector decorator will lookup the nodes on access including caching (enabled by default)
 */
export function selector(domSelector, options) {
    if (options === void 0) { options = { cache: true }; }
    return function (target, propertyKey) {
        if (!areSelectorsHookedIntoCore) {
            // prevent multiple hook listeners
            injectSelectorPluginIntoCore();
        }
        if (!target.__boundSelectors) {
            target.__boundSelectors = [];
        }
        target.__boundSelectors.push([propertyKey, domSelector, options]);
    };
}
//# sourceMappingURL=decorator.js.map