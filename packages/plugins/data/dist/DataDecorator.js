import { areDataBindingsHookedIntoCore, hookDataDecoratorIntoCore } from "./DataPlugin";
/**
 * The @data prop decorator will save the selected value into the given variable at start
 */
export function data(attributeKey, serializer) {
    return function (target, propertyKey) {
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
//# sourceMappingURL=DataDecorator.js.map