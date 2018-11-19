import { addGondelPluginEventListener, GondelComponent } from "@gondel/core";
import { ISerializer } from "./DataDecorator";

export type DataBindingConfig = [
  // Property key
  string,
  // Attribute key
  string,
  // Serialization options
  ISerializer | void
];

export let areDataBindingsHookedIntoCore = false;

export function hookDataDecoratorIntoCore() {
  areDataBindingsHookedIntoCore = true;

  addGondelPluginEventListener("start", function(
    gondelComponents: GondelComponent<HTMLElement>[],
    _: any | undefined,
    next: (result: any) => any
  ) {
    gondelComponents.forEach((gondelComponent: GondelComponent) => {
      const componentDataBindings =
        ((gondelComponent as any).prototype && (gondelComponent as any).prototype.__dataBindings) ||
        (gondelComponent as any).__dataBindings;

      if (!componentDataBindings || componentDataBindings.length === 0) {
        return next(gondelComponents);
      }

      componentDataBindings.forEach(
        ([propertyKey, attributeKey, serializer]: DataBindingConfig) => {
          let initialValue = (gondelComponent as any)[propertyKey];
          Object.defineProperty(gondelComponent, propertyKey, {
            enumerable: true,
            configurable: false,
            get() {
              const value = gondelComponent._ctx.getAttribute(attributeKey);

              if (serializer && value !== null) {
                return serializer.deserialize(value);
              }

              return value;
            },
            set(value: any) {
              if (value === undefined) {
                gondelComponent._ctx.removeAttribute(attributeKey);
              }

              if (serializer) {
                value = serializer.serialize(value);
              }

              gondelComponent._ctx.setAttribute(attributeKey, value);
            }
          });
          if (initialValue) {
            (gondelComponent as any)[propertyKey] =
              (gondelComponent as any)[propertyKey] || initialValue;
            initialValue = undefined;
          }
        }
      );
    });

    next(gondelComponents);
  });
}
