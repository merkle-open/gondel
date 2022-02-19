/// <reference path="./index.d.ts" />
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@gondel/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@gondel/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.gondelPluginData = {}, global.gondel));
})(this, (function (exports, core) { 'use strict';

    var areDataBindingsHookedIntoCore = false;
    function hookDataDecoratorIntoCore() {
        areDataBindingsHookedIntoCore = true;
        core.addGondelPluginEventListener('Data', 'start', function (gondelComponents, _, next) {
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
                        },
                    });
                    if (initialValue) {
                        gondelComponent[propertyKey] = gondelComponent[propertyKey] || initialValue;
                        initialValue = undefined;
                    }
                });
            });
            next(gondelComponents);
        });
    }

    function data(targetOrAttributeKey, propertyKeyOrSerializer) {
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

    var serialize$2 = function (value) { return JSON.stringify(value); };
    var deserialize$2 = function (value) { return JSON.parse(value); };
    var JSON$1 = {
        serialize: serialize$2,
        deserialize: deserialize$2,
    };

    var serialize$1 = function (value) { return "".concat(value); };
    var deserialize$1 = function (value) { return value === 'true'; };
    var Boolean = {
        serialize: serialize$1,
        deserialize: deserialize$1,
    };

    var serialize = function (value) { return "".concat(value); };
    var deserialize = function (value) { return parseFloat(value); };
    var Number = {
        serialize: serialize,
        deserialize: deserialize,
    };

    exports.BooleanSerializer = Boolean;
    exports.JSONSerializer = JSON$1;
    exports.NumberSerializer = Number;
    exports.data = data;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.es5.js.map
