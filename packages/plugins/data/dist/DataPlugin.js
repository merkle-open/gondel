import { addGondelPluginEventListener } from "@gondel/core";
import { Serializers } from "./serializer/all";
export var areDataBindingsHookedIntoCore = false;
export function hookDataDecoratorIntoCore() {
    areDataBindingsHookedIntoCore = true;
    addGondelPluginEventListener("start", function (gondelComponents, _, next) {
        gondelComponents.forEach(function (gondelComponent) {
            var componentDataBindings = (gondelComponent.prototype && gondelComponent.prototype.__dataBindings) ||
                gondelComponent.__dataBindings;
            if (!componentDataBindings || componentDataBindings.length === 0) {
                return next(gondelComponents);
            }
            componentDataBindings.forEach(function (_a) {
                var propertyKey = _a[0], attributeKey = _a[1], customSerializer = _a[2];
                var serializer;
                if (customSerializer) {
                    if (typeof customSerializer !== "object") {
                        serializer = Serializers[customSerializer];
                    }
                    else {
                        serializer = customSerializer;
                    }
                }
                Object.defineProperty(gondelComponent, propertyKey, {
                    enumerable: true,
                    configurable: false,
                    get: function () {
                        var value = gondelComponent._ctx.getAttribute("data-" + attributeKey);
                        if (serializer && value) {
                            return serializer.deserialize(value);
                        }
                        return value;
                    },
                    set: function (value) {
                        if (serializer) {
                            value = serializer.serialize(value);
                        }
                        gondelComponent._ctx.setAttribute("data-" + attributeKey, value);
                    }
                });
            });
        });
        next(gondelComponents);
    });
}
//# sourceMappingURL=DataPlugin.js.map