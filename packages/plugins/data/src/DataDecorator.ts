import { GondelComponent } from "@gondel/core";
import {
  areDataBindingsHookedIntoCore,
  hookDataDecoratorIntoCore,
  DataBindingConfig
} from "./DataPlugin";
import { Serializer, ISerializer } from "./serializer/all";

/**
 * The @data prop decorator will save the selected value into the given variable at start
 */
export function data(attributeKey: string, serializer?: Serializer | ISerializer) {
  return function<T extends { __dataBindings?: Array<DataBindingConfig> } & GondelComponent>(
    target: T,
    propertyKey: string
  ): void {
    if (!areDataBindingsHookedIntoCore) {
      // prevent multiple hook listeners
      hookDataDecoratorIntoCore();
    }

    if (!target.__dataBindings) {
      target.__dataBindings = [];
    }

    target.__dataBindings.push([propertyKey, attributeKey, serializer]);
  };
}
