import { addRootEventListener, removeRootEventListernerForComponent } from "./GondelEventRegistry";
// Because of how decorators work @EventListeners is executed before the class is registred
// so we need to provide a hrm compatible approch initialize and reinitialize the events
import { addGondelPluginEventListener } from "./GondelPluginUtils";
import { registerComponent } from "./index";
/**
 * TODO: Can we deprecate the param componentName in favour of the static field componentName?
 * @param componentName
 * @param namespace
 */
export function Component(componentName, namespace) {
    return function (constructor) {
        if (!constructor.componentName) {
            throw new Error("Could not register component, check if " + constructor.name + ".componentName is defined.");
        }
        registerComponent(constructor.componentName, namespace, constructor);
    };
}
var areEventsHookedIntoCore = false;
function hookEventDecoratorInCore() {
    areEventsHookedIntoCore = true;
    addGondelPluginEventListener("register", function (component, _a, next) {
        var componentName = _a.componentName, namespace = _a.namespace, gondelComponentRegistry = _a.gondelComponentRegistry;
        // Only apply in case the component is already active in the DOM
        // this will only happen during hot module replacement
        if (!gondelComponentRegistry._activeComponents[componentName]) {
            return next(component);
        }
        // The decorator will store the event information in two different places.
        // For ES6 classes it is using __events
        // For ES5 prototype classes and transpiled ES6 classes it is using prototype.__events
        var componentEventOptions = (component.prototype && component.prototype.__events) || component.__events;
        if (componentEventOptions) {
            componentEventOptions.forEach(function (eventOptions) {
                addRootEventListener(namespace, 
                /* event name: */ eventOptions[0], componentName, 
                /* handler: */ eventOptions[1], 
                /* selector: */ eventOptions[2]);
            });
        }
        next(component);
    });
    addGondelPluginEventListener("unregister", function (component, _a, next) {
        var componentName = _a.componentName, namespace = _a.namespace;
        removeRootEventListernerForComponent(namespace, componentName);
        next(component);
    });
    addGondelPluginEventListener("start", function (gondelComponents, _a, next) {
        var newComponentNames = _a.newComponentNames, gondelComponentRegistry = _a.gondelComponentRegistry, namespace = _a.namespace;
        var components = newComponentNames.forEach(function (componentName) {
            var gondelComponent = gondelComponentRegistry.getComponent(componentName);
            // The decorator will store the event information in two different places.
            // For ES6 classes it is using __events
            // For ES5 prototype classes and transpiled ES6 classes it is using prototype.__events
            var componentEventOptions = (gondelComponent.prototype && gondelComponent.prototype.__events) ||
                gondelComponent.__events;
            if (componentEventOptions) {
                componentEventOptions.forEach(function (eventOptions) {
                    addRootEventListener(namespace, 
                    /* event name: */ eventOptions[0], componentName, 
                    /* handler: */ eventOptions[1], 
                    /* selector: */ eventOptions[2]);
                });
            }
        });
        next(gondelComponents);
    });
}
/**
 * The @EventListener decorator will add all event names to a static variable
 */
export function EventListener(eventName, selector) {
    return function (target, handler) {
        if (!areEventsHookedIntoCore) {
            hookEventDecoratorInCore();
        }
        if (handler.substr(0, 1) !== "_") {
            throw new Error("Invalid handler name '" + handler + "' use '_" + handler + "' instead.");
        }
        if (!target.__events) {
            target.__events = [];
        }
        target.__events.push([eventName, handler, selector]);
    };
}
//# sourceMappingURL=GondelDecorators.js.map