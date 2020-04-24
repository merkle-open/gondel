import { GondelComponent } from "@gondel/core";
import {
  areDataBindingsHookedIntoCore,
  hookDataDecoratorIntoCore,
  DataBindingConfig,
} from "./DataPlugin";

export interface ISerializer<T extends any = any> {
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
}

type GondelComponentWithData = GondelComponent & {
  __dataBindings?: Array<DataBindingConfig>;
};

type GondelComponentDecorator<T> = (target: T, propertyKey: string) => void;

/**
 * The @data prop decorator will save the selected value into the given variable at start.
 * Via overloads you're capable to use it in three different ways:
 *  - @data (_)dataMyAttribute => data-my-attribute
 *  - @data('my-attribute') attr => data-my-attribute
 *  - @data('some-json', JSONSerializer) some => data-some-json (serialized via JSON or any other serializer)
 */
export function data<T extends GondelComponentWithData>(target: T, propertyKey: string): void;
export function data<T extends GondelComponentWithData>(
  customAttributeKey: string,
  serializer?: ISerializer
): GondelComponentDecorator<T>;
export function data<T extends GondelComponentWithData>(
  targetOrAttributeKey: T | string,
  propertyKeyOrSerializer: string | ISerializer | undefined
): void | GondelComponentDecorator<T> {
  // First case will be used if we have a custom attribute and a valid serializer (which is typeof ISerializer)
  if (typeof targetOrAttributeKey === "string" && typeof propertyKeyOrSerializer !== "string") {
    const customAttributeKey = targetOrAttributeKey;
    const serializer = propertyKeyOrSerializer;

    return function <T extends GondelComponentWithData>(target: T, propertyKey: string): void {
      if (!areDataBindingsHookedIntoCore) {
        // prevent multiple hook listeners
        hookDataDecoratorIntoCore();
      }
      if (!target.__dataBindings) {
        target.__dataBindings = [];
      }
      const attributeKey = `data-${customAttributeKey}`;
      target.__dataBindings.push([propertyKey, attributeKey, serializer]);
    };
  }

  if (typeof targetOrAttributeKey === "string" || typeof propertyKeyOrSerializer !== "string") {
    // this case should not occur, the only case could be a respec of the decorators
    throw new Error("Unexpected usage of @data");
  }

  // We only have a simple decorator which will need to autobind values via prop-key
  const target = targetOrAttributeKey;
  const propertyKey = propertyKeyOrSerializer;

  if (!areDataBindingsHookedIntoCore) {
    // prevent multiple hook listeners
    hookDataDecoratorIntoCore();
  }

  if (!target.__dataBindings) {
    target.__dataBindings = [];
  }

  const attributeKey = convertPropertyKeyToDataAttributeKey(propertyKey);
  target.__dataBindings.push([propertyKey, attributeKey, undefined]);
}

/**
 * Will convert any possible property to a valid data attribute
 * @param {string} propertyKey    the prop to convert
 */
function convertPropertyKeyToDataAttributeKey(propertyKey: string): string {
  if (propertyKey.substr(0, 1) === "_") {
    propertyKey = propertyKey.substr(1);
  }

  if (propertyKey.substr(0, 4) !== "data") {
    throw new Error(
      `${propertyKey}" has an invalid format please use @data dataSomeProp (data-some-prop) for valid bindings.`
    );
  }

  return propertyKey.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
}
