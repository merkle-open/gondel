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
export var componentRegistries = (window.__gondelRegistries = window.__gondelRegistries || {});
export function registerComponent(componentName, component, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    // Add an identifier to the constructor
    // for mapping the class to a dom query selector
    var identifiedComponent = component;
    if (!identifiedComponent.hasOwnProperty("__identification")) {
        identifiedComponent.__identification = {};
    }
    identifiedComponent.__identification[namespace] = componentName;
    if (!componentRegistries[namespace]) {
        componentRegistries[namespace] = new GondelComponentRegistry();
    }
    // If this component was already registered we remove the previous one
    // and notify all plugins - this is especially usefull for hot component replacement
    if (componentRegistries[namespace].getComponent(componentName)) {
        fireGondelPluginEvent("unregister", component, { componentName: componentName, namespace: namespace });
    }
    // Let plugins know about the new component
    fireGondelPluginEvent("register", component, {
        componentName: componentName,
        namespace: namespace,
        gondelComponentRegistry: componentRegistries[namespace]
    }, function (component) {
        componentRegistries[namespace].registerComponent(componentName, identifiedComponent);
    });
}
//# sourceMappingURL=GondelComponentRegistry.js.map