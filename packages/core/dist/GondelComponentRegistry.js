import { fireGondelPluginEvent } from "./GondelPluginUtils";
var GondelComponentRegistry = /** @class */ (function () {
    function GondelComponentRegistry() {
        this._components = {};
        this._activeComponents = {};
    }
    GondelComponentRegistry.prototype.registerComponent = function (name, gondelComponent) {
        this._components[name] = gondelComponent;
    };
    GondelComponentRegistry.prototype.unregisterComponent = function (name) {
        delete this._components[name];
    };
    GondelComponentRegistry.prototype.getComponent = function (name) {
        return this._components[name];
    };
    /**
     * Set if a component is used
     */
    GondelComponentRegistry.prototype.setActiveState = function (name, isActive) {
        this._activeComponents[name] = isActive;
    };
    return GondelComponentRegistry;
}());
export { GondelComponentRegistry };
var _componentRegistries;
export function getComponentRegistry(namespace) {
    if (!_componentRegistries) {
        _componentRegistries = window["__\ud83d\udea1Registries"] || {};
        window["__\ud83d\udea1Registries"] = _componentRegistries;
    }
    if (!_componentRegistries[namespace]) {
        _componentRegistries[namespace] = new GondelComponentRegistry();
    }
    return _componentRegistries[namespace];
}
export function registerComponent() {
    var args = arguments;
    // The componentName is always the first argument
    var componentName = args[0];
    // Use namespace from the second argument or fallback to the default "g" if it is missing
    var namespace = typeof args[1] === "string" ? args[1] : "g";
    // The last argument is always the component class
    var component = args[args.length - 1];
    var gondelComponentRegistry = getComponentRegistry(namespace);
    // If this component was already registered we remove the previous one
    // and notify all plugins - this is especially usefull for hot component replacement
    if (gondelComponentRegistry.getComponent(componentName)) {
        fireGondelPluginEvent("unregister", component, { componentName: componentName, namespace: namespace });
    }
    // Let plugins know about the new component
    fireGondelPluginEvent("register", component, {
        componentName: componentName,
        namespace: namespace,
        gondelComponentRegistry: gondelComponentRegistry
    }, function (component) {
        gondelComponentRegistry.registerComponent(componentName, component);
    });
}
//# sourceMappingURL=GondelComponentRegistry.js.map