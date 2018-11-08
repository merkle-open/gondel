/// <reference path="./index.d.ts" />
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@gondel/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@gondel/core'], factory) :
    (factory((global.gondelPluginData = {}),global.gondel));
}(this, (function (exports,core) { 'use strict';

    var serialize = function (value) { return value ? JSON.stringify(value) : ''; };
    var deserialize = function (value) { return value ? JSON.parse(value) : void 0; };

    var _a;
    (function (Serializer) {
        Serializer["JSON"] = "JSON";
    })(exports.Serializer || (exports.Serializer = {}));
    var Serializers = (_a = {},
        _a[exports.Serializer.JSON] = {
            serialize: serialize,
            deserialize: deserialize
        },
        _a);

    var areDataBindingsHookedIntoCore = false;
    function hookDataDecoratorIntoCore() {
        areDataBindingsHookedIntoCore = true;
        core.addGondelPluginEventListener("start", function (gondelComponents, _, next) {
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
                        if (typeof customSerializer !== 'object') {
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

    /**
     * The @data prop decorator will save the selected value into the given variable at start
     */
    function data(attributeKey, serializer) {
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

    // the main @data decorator

    exports.data = data;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.es5.js.map
