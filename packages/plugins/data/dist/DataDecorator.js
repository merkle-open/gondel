import { areDataBindingsHookedIntoCore, hookDataDecoratorIntoCore } from './DataPlugin';
export function data(targetOrAttributeKey, propertyKeyOrSerializer) {
    // First case will be used if we have a custom attribute and a valid serializer (which is typeof ISerializer)
    if (typeof targetOrAttributeKey === 'string' && typeof propertyKeyOrSerializer !== 'string') {
        var customAttributeKey_1 = targetOrAttributeKey;
        var serializer_1 = propertyKeyOrSerializer;
        return function (target, propertyKey) {
            if (!areDataBindingsHookedIntoCore) {
                // prevent multiple hook listeners
                hookDataDecoratorIntoCore();
            }
            if (!target.__dataBindings) {
                target.__dataBindings = [];
            }
            var attributeKey = "data-".concat(customAttributeKey_1);
            target.__dataBindings.push([propertyKey, attributeKey, serializer_1]);
        };
    }
    if (typeof targetOrAttributeKey === 'string' || typeof propertyKeyOrSerializer !== 'string') {
        // this case should not occur, the only case could be a respec of the decorators
        throw new Error('Unexpected usage of @data');
    }
    // We only have a simple decorator which will need to autobind values via prop-key
    var target = targetOrAttributeKey;
    var propertyKey = propertyKeyOrSerializer;
    if (!areDataBindingsHookedIntoCore) {
        // prevent multiple hook listeners
        hookDataDecoratorIntoCore();
    }
    if (!target.__dataBindings) {
        target.__dataBindings = [];
    }
    var attributeKey = convertPropertyKeyToDataAttributeKey(propertyKey);
    target.__dataBindings.push([propertyKey, attributeKey, undefined]);
}
/**
 * Will convert any possible property to a valid data attribute
 * @param {string} propertyKey    the prop to convert
 */
function convertPropertyKeyToDataAttributeKey(propertyKey) {
    if (propertyKey.substr(0, 1) === '_') {
        propertyKey = propertyKey.substr(1);
    }
    if (propertyKey.substr(0, 4) !== 'data') {
        throw new Error("".concat(propertyKey, "\" has an invalid format please use @data dataSomeProp (data-some-prop) for valid bindings."));
    }
    return propertyKey.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}
//# sourceMappingURL=DataDecorator.js.map