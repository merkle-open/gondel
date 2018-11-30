import * as tslib_1 from "tslib";
var Adapter = /** @class */ (function () {
    function Adapter(name, store) {
        this.name = name;
        this.store = store;
        this.config = {
            prefix: "",
            postfix: "",
            delimitier: ""
        };
        if (!store) {
            throw new Error("Stroage not available in your environment");
        }
    }
    Adapter.prototype.configure = function (config) {
        this.config = tslib_1.__assign({}, this.config, config);
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
        var savableValue = "";
        if (serializer && typeof value !== "string") {
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
        return [this.config.prefix, key, this.config.postfix].join(this.config.delimitier);
    };
    return Adapter;
}());
export { Adapter };
export var localStorageAdapter = new Adapter("local", window.localStorage);
export var sessionStorageAdapter = new Adapter("session", window.sessionStorage);
//# sourceMappingURL=Adapter.js.map