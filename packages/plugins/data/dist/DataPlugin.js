import { addGondelPluginEventListener } from "@gondel/core";
export var areDataBindingsHookedIntoCore = false;
export function hookDataDecoratorIntoCore() {
    areDataBindingsHookedIntoCore = true;
    addGondelPluginEventListener("Data", "start", function (gondelComponents, _, next) {
        gondelComponents.forEach(function (gondelComponent) {
            var componentDataBindings = (gondelComponent.prototype && gondelComponent.prototype.__dataBindings) ||
                gondelComponent.__dataBindings;
            if (!componentDataBindings || componentDataBindings.length === 0) {
                return next(gondelComponents);
            }
            componentDataBindings.forEach(function (_a) {
                var propertyKey = _a[0], attributeKey = _a[1], serializer = _a[2];
                var initialValue = gondelComponent[propertyKey];
                Object.defineProperty(gondelComponent, propertyKey, {
                    enumerable: true,
                    configurable: false,
                    get: function () {
                        var value = gondelComponent._ctx.getAttribute(attributeKey);
                        if (serializer && value !== null) {
                            return serializer.deserialize(value);
                        }
                        return value;
                    },
                    set: function (value) {
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
                    gondelComponent[propertyKey] =
                        gondelComponent[propertyKey] || initialValue;
                    initialValue = undefined;
                }
            });
        });
        next(gondelComponents);
    });
}
//# sourceMappingURL=DataPlugin.js.map