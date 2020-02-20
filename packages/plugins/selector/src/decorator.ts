import { IGondelComponentWithSelectors, ISelectorBindingOptions } from "./const";
import { areSelectorsHookedIntoCore, injectSelectorPluginIntoCore } from "./injector";

type GondelComponentDecorator<T> = (target: T, propertyKey: string) => void;

/**
 * The @selector decorator will lookup the nodes on access including caching (enabled by default)
 */
export function selector<T extends IGondelComponentWithSelectors>(
  domSelector: string,
  options: ISelectorBindingOptions = { cache: true }
): GondelComponentDecorator<T> {
  return function<T extends IGondelComponentWithSelectors>(target: T, propertyKey: string): void {
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
