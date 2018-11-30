/// <reference path="./index.d.ts" />
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.gondelPluginStorage = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var Adapter = /** @class */ (function () {
        function Adapter(name, store) {
            this.name = name;
            this.store = store;
            this.config = {
                prefix: '',
                postfix: '',
                delimitier: ''
            };
            if (!store) {
                throw new Error("Stroage not available in your environment");
            }
        }
        Adapter.prototype.configure = function (config) {
            this.config = __assign({}, this.config, config);
        };
        Adapter.prototype.get = function (key, serializer) {
            var value = this.store.getItem(this.generateAccessorKey(key));
            if (value) {
                if (serializer) {
                    return serializer.deserialize(value);
                }
                return value;
            }
            return undefined;
        };
        Adapter.prototype.set = function (key, value, serializer) {
            var savableValue = '';
            if (serializer && typeof value !== 'string') {
                savableValue = serializer.serialize(value);
            }
            else {
                savableValue = value;
            }
            this.store.setItem(this.generateAccessorKey(key), savableValue);
        };
        Adapter.prototype.remove = function (key) {
            this.store.removeItem(key);
        };
        Adapter.prototype.clear = function () {
            this.store.clear();
        };
        Adapter.prototype.toString = function () {
            return "Adapter { " + this.name + " }";
        };
        Adapter.prototype.generateAccessorKey = function (key) {
            return [
                this.config.prefix,
                key,
                this.config.postfix
            ].join(this.config.delimitier);
        };
        return Adapter;
    }());
    var localStorageAdapter = new Adapter('local', window.localStorage);
    var sessionStorageAdapter = new Adapter('session', window.sessionStorage);

    function createStorageBindings(_a) {
        var target = _a.target, propertyKey = _a.propertyKey, _b = _a.storeKey, storeKey = _b === void 0 ? propertyKey : _b, _c = _a.storageAdapter, storageAdapter = _c === void 0 ? localStorageAdapter : _c, serializer = _a.serializer;
        // TODO: should we use the component class name as prefix or sth?
        // const componentKey = target.constructor.name;
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return storageAdapter.get(storeKey, serializer);
            },
            set: function (value) {
                storageAdapter.set(storeKey, value, serializer);
            }
        });
    }
    function storage(targetOrStoreKey, propertyKeyOrSerializer, storageAdapter) {
        // First case will be used if we have a custom attribute and a valid serializer (which is typeof Serializer)
        if (typeof targetOrStoreKey === "string" && typeof propertyKeyOrSerializer !== "string") {
            var storeKey_1 = targetOrStoreKey;
            var serializer_1 = propertyKeyOrSerializer;
            return function (target, propertyKey) {
                target.__gondelStoragePlugin = true;
                createStorageBindings({
                    target: target,
                    storageAdapter: storageAdapter,
                    storeKey: storeKey_1,
                    propertyKey: propertyKey,
                    serializer: serializer_1,
                });
            };
        }
        if (typeof targetOrStoreKey === "string" || typeof propertyKeyOrSerializer !== "string") {
            // this case should not occur, the only case could be a respec of the decorators
            throw new Error("Unexpected usage of @storage");
        }
        var target = targetOrStoreKey;
        var propertyKey = propertyKeyOrSerializer;
        target.__gondelStoragePlugin = true;
        // create simple bindings for @storage
        createStorageBindings({
            target: target,
            propertyKey: propertyKey
        });
    }

    var serialize = function (value) { return "" + value; };
    var deserialize = function (value) { return value === "true"; };
    var _Boolean = {
        serialize: serialize,
        deserialize: deserialize
    };

    var serialize$1 = function (value) { return "" + value; };
    var deserialize$1 = function (value) { return parseFloat(value); };
    var _Number = {
        serialize: serialize$1,
        deserialize: deserialize$1
    };

    var serialize$2 = function (value) { return JSON.stringify(value, null, 0); };
    var deserialize$2 = function (value) { return JSON.parse(value); };
    var _JSON = {
        serialize: serialize$2,
        deserialize: deserialize$2
    };

    exports.Adapter = Adapter;
    exports.storage = storage;
    exports.BooleanSerializer = _Boolean;
    exports.NumberSerializer = _Number;
    exports.JSONSerializer = _JSON;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.es5.js.map
