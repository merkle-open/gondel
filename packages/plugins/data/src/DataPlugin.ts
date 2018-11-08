import { addGondelPluginEventListener, GondelComponent } from "@gondel/core";
import { Serializer, Serializers, ISerializer } from "./serializer/all";

export type DataBindingConfig = [
  // Property key
  string,
  // Attribute key
  string,
  // Serialization options
  Serializer | ISerializer | void
];

export let areDataBindingsHookedIntoCore = false;

export function hookDataDecoratorIntoCore() {
  areDataBindingsHookedIntoCore = true;

  addGondelPluginEventListener("start", function(
    gondelComponents: GondelComponent<HTMLElement>[],
    _,
    next
  ) {
    gondelComponents.forEach((gondelComponent: GondelComponent) => {
      const componentDataBindings =
        ((gondelComponent as any).prototype && (gondelComponent as any).prototype.__dataBindings) ||
        (gondelComponent as any).__dataBindings;

      if (!componentDataBindings || componentDataBindings.length === 0) {
        return next(gondelComponents);
      }

      componentDataBindings.forEach(
        ([propertyKey, attributeKey, customSerializer]: DataBindingConfig) => {
          let serializer: ISerializer | void;

          if (customSerializer) {
            if (typeof customSerializer !== "object") {
              serializer = Serializers[customSerializer];
            } else {
              serializer = customSerializer;
            }
          }

          Object.defineProperty(gondelComponent, propertyKey, {
            enumerable: true,
            configurable: false,
            get() {
              const value = gondelComponent._ctx.getAttribute(`data-${attributeKey}`);

              if (serializer && value) {
                return serializer.deserialize(value);
              }

              return value;
            },
            set(value: any) {
              if (serializer) {
                value = serializer.serialize(value);
              }

              gondelComponent._ctx.setAttribute(`data-${attributeKey}`, value);
            }
          });
        }
      );
    });

    next(gondelComponents);
  });
}
