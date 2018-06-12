/// <reference path="./index.d.ts" />
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.gondel = {})));
}(this, (function (exports) { 'use strict';

var basePluginListener = function (result, data, next) { return next(result); };
// Global plugin events registry
var pluginEvents = window.__gondelPluginEvents || {};
window.__gondelPluginEvents = pluginEvents;
function fireGondelPluginEvent(eventName, initialValue, data, callback) {
    var isSyncron = false;
    var callbackResult;
    // Execute all bound events for the given name
    // if they exist
    (pluginEvents[eventName] || basePluginListener)(initialValue, data, function (processedResult) {
        isSyncron = true;
        callbackResult = callback ? callback(processedResult) : processedResult;
    });
    // Add a guard to prevent asyncron plugin listeners
    // to simplify the usage of fireGondelPluginEvent
    if (!isSyncron) {
        throw new Error("Async plugin listener");
    }
    return callbackResult;
}
/**
 * Fire an async event which allows gondel plugins to add features to gondel
 */

/**
 * Allow plugins to hook into the gondel event system
 */
function addGondelPluginEventListener(eventName, eventListenerCallback) {
    if (!pluginEvents[eventName]) {
        pluginEvents[eventName] = basePluginListener;
    }
    var previousEventHandler = pluginEvents[eventName];
    pluginEvents[eventName] = function wrapCallback(result, data, next) {
        previousEventHandler(result, data, function callNextPlugin(modifiedResult, _, firstNext) {
            eventListenerCallback(modifiedResult, data, function bindData(result) {
                next(result, data, firstNext);
            });
        });
    };
}

/**
 * Submit an event which might be caught by foreign gondel, angular or react components
 */
function triggerPublicEvent(eventName, gondelComponent, target, eventData, canBubble) {
    if (eventData === void 0) { eventData = {}; }
    if (canBubble === void 0) { canBubble = true; }
    var event = document.createEvent("Event");
    var eventTarget = target ? getFirstDomNode(target) : gondelComponent._ctx;
    if (eventName[0] !== gondelComponent._namespace) {
        throw new Error("Invalid event name '" +
            eventName +
            "' - use '" +
            gondelComponent._namespace +
            eventName.charAt(0).toUpperCase() +
            eventName.slice(1) +
            "'");
    }
    event.initEvent(eventName, canBubble, true);
    event.data = {
        component: gondelComponent,
        name: gondelComponent._componentName,
        namespace: gondelComponent._namespace,
        eventData: eventData
    };
    return eventTarget.dispatchEvent(event);
}

var noop = function () { };
var Deferred = function () {
    var _this = this;
    this.promise = new Promise(function (resolve) {
        _this.resolve = resolve;
    });
};
/**
 * Start all components of the gondel component registry
 * for the given dom context
 */
function startComponentsFromRegistry(gondelComponentRegistry, domContext, namespace) {
    // Get an array of all nodes which match the namespace
    var gondelDomNodeList = Array.prototype.slice.call(domContext.querySelectorAll("[data-" + namespace + "-name]"));
    if (domContext.hasAttribute("data-" + namespace + "-name")) {
        gondelDomNodeList.push(domContext);
    }
    // Remove already booted nodes
    var pristineGondelDomNodes = gondelDomNodeList.filter(function (gondelDomNode) {
        return isPristineGondelDomNode(gondelDomNode, namespace);
    });
    var bootingDeferred = new Deferred();
    // Mark all nodes as booting
    pristineGondelDomNodes.forEach(function (gondelDomNode) {
        attachGondelBootingFlag(gondelDomNode, bootingDeferred.promise, namespace);
    });
    // Create instances
    var gondelComponents = fireGondelPluginEvent("boot", pristineGondelDomNodes, { namespace: namespace }, function (pristineGondelDomNodes) {
        return pristineGondelDomNodes.map(function (gondelDomNode) {
            return constructComponent(gondelDomNode, gondelComponentRegistry, namespace);
        });
    });
    // Get all component names
    var newComponentNames = getNewComponents(gondelComponents, gondelComponentRegistry);
    newComponentNames.forEach(function (componentName) {
        return gondelComponentRegistry.setActiveState(componentName, true);
    });
    // Start all components
    var gondelComponentStartPromise = fireGondelPluginEvent("start", gondelComponents, { newComponentNames: newComponentNames, namespace: namespace, gondelComponentRegistry: gondelComponentRegistry }, function (gondelComponents) {
        // Wait for async started components
        return Promise.all(gondelComponents.map(startConstructedComponent));
    })
        // Let all plugins know that the components are now all ready to use
        .then(function () {
        gondelComponents.forEach(function (gondelComponent) {
            if (gondelComponent.sync) {
                gondelComponent.sync();
            }
        });
        return fireGondelPluginEvent("sync", gondelComponents, { namespace: namespace });
    });
    // Resolve the booting deferred
    gondelComponentStartPromise.then(bootingDeferred.resolve, bootingDeferred.resolve);
    // Return a promise of all started components
    return gondelComponentStartPromise;
}
/**
 * Returns true if the given domNode is neither booting nor booted
 */
function isPristineGondelDomNode(domNode, namespace) {
    return !domNode.hasOwnProperty(getGondelAttribute(namespace, 'async'));
}
/**
 * Mark the given dom node as controlled by gondel
 */
function attachGondelBootingFlag(domNode, bootingFlag, namespace) {
    // The name `A` mean async
    // to allow waiting for asyncronous booted components
    domNode[getGondelAttribute(namespace, 'async')] = bootingFlag;
}
/**
 * Constructs a new component
 */
function constructComponent(domNode, gondelComponentRegisty, namespace) {
    var componentName = domNode.getAttribute("data-" + namespace + "-name");
    var GondelComponent = gondelComponentRegisty.getComponent(componentName);
    if (GondelComponent === undefined) {
        throw new Error("Failed to boot component - " + componentName + " is not registred");
    }
    var componentInstance = new GondelComponent(domNode, componentName);
    componentInstance._ctx = domNode;
    componentInstance._namespace = namespace;
    // Adopt component name from blueprint
    // TODO: is this needed anymore?
    componentInstance._componentName = GondelComponent.componentName;
    // Add stop method
    componentInstance.stop = stopStartedComponent.bind(null, componentInstance, componentInstance.stop || noop, namespace);
    // Create a circular reference which will allow access to the componentInstance from ctx
    domNode[getGondelAttribute(namespace)] = componentInstance;
    return componentInstance;
}
/**
 * Start a component after it was constructed
 */
function startConstructedComponent(component) {
    // Skip if the start method is missing
    if (!component.start) {
        return;
    }
    var expectsNoArguments = component.start.length === 0;
    // Start the component and expect a promise or a syncronous return value
    // if the function expects no arguments
    if (expectsNoArguments) {
        return component.start();
    }
    return new Promise(function (resolve, reject) { return component.start(resolve, reject); });
}
/**
 * Stops a started component
 */
function stopStartedComponent(component, internalStopMethod, namespace) {
    triggerPublicEvent(namespace + "Stop", component, component._ctx);
    // Remove the component instance from the html element
    delete component._ctx[getGondelAttribute(namespace)];
    delete component._ctx[getGondelAttribute(namespace, 'async')];
    component._stopped = true;
    fireGondelPluginEvent("stop", component, { namespace: namespace }, internalStopMethod.bind(component));
}
/**
 * Filters the given component list and returns the names of those components which have never been started before
 */
function getNewComponents(components, registry) {
    var componentNameHelper = {};
    components.forEach(function (component) { return (componentNameHelper[component._componentName] = true); });
    var componentNames = Object.keys(componentNameHelper);
    return componentNames.filter(function (componentName) { return !registry._activeComponents[componentName]; });
}

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
var componentRegistries = (window.__gondelRegistries = window.__gondelRegistries || {});
function registerComponent(component, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var componentName = component.componentName;
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
        componentRegistries[namespace].registerComponent(componentName, component);
    });
}

/**
 * Returns true if the given object is a single Element
 */
function isElement(domNode) {
    return domNode.nodeType !== undefined;
}
/**
 * Inspired by the RXJS anchor approach by using symbols (if supported) or strings
 * for internal fixtures.
 *
 * @param {string=g} namespace
 * @param {string?} addition
 * @see https://github.com/ReactiveX/rxjs/blob/master/src/internal/symbol/rxSubscriber.ts
 */
function getGondelAttribute(namespace, addition) {
    if (namespace === void 0) { namespace = 'g'; }
    var id = "__gondel_" + (addition ? addition + '_' : '') + namespace + "__";
    if (Symbol && typeof Symbol.for === 'function') {
        return Symbol.for(id);
    }
    return id;
}
/**
 * This function normalizes takes one of the following:
 *  + document query result
 *  + dom node array
 *  + jquery object
 *  + a single dom node
 * and turns it into a single dom node
 */
function getFirstDomNode(domNode) {
    if (isElement(domNode)) {
        return domNode;
    }
    return domNode[0];
}
/**
 * Start all nodes in the given context
 */
function startComponents(domContext, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    if (!componentRegistries[namespace]) {
        return Promise.resolve([]);
    }
    var registry = componentRegistries[namespace];
    return startComponentsFromRegistry(registry, domContext ? getFirstDomNode(domContext) : document.documentElement, namespace);
}
/**
 * Stop all nodes in the given context
 */
function stopComponents(domContext, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var components = findComponents(domContext, undefined, namespace);
    var rootComponent = domContext && getComponentByDomNode(domContext);
    if (rootComponent) {
        components.unshift(rootComponent);
    }
    components.forEach(function (component) { return component.stop(); });
}
/**
 * Returns the gondel instance for the given HtmlELement
 */
function getComponentByDomNode(domNode, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var gondelComponent = firstNode[getGondelAttribute(namespace)];
    // Stop if this dom node is not known to gondel
    if (gondelComponent && gondelComponent._ctx) {
        return gondelComponent;
    }
    return;
}
/**
 * Returns the gondel instance for the given HtmlELement once it is booted
 */
function getComponentByDomNodeAsync(domNode, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var gondelComponent = firstNode[getGondelAttribute(namespace, 'async')];
    // Stop if this dom node is not known to gondel
    if (!gondelComponent) {
        return Promise.reject(undefined);
    }
    // or the component is already booted up return it
    if (gondelComponent._ctx) {
        return Promise.resolve(gondelComponent);
    }
    // Wait the component to boot up and return it
    return gondelComponent.then(function () { return firstNode[getGondelAttribute(namespace)]; });
}
/**
 * Returns all components inside the given node
 */
function findComponents(domNode, component, namespace) {
    if (domNode === void 0) { domNode = document.documentElement; }
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var components = [];
    var attribute = getGondelAttribute(namespace);
    var nodes = firstNode.querySelectorAll("[data-" + namespace + "-name" + (component ? "=\"" + component.componentName + "\"" : "") + "]");
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var gondelComponentInstance = node[attribute];
        // Verify that the component is fully booted
        if (gondelComponentInstance && gondelComponentInstance._ctx === node) {
            components.push(gondelComponentInstance);
        }
    }
    return components;
}

/**
 * The event registry provides a way to bind events ahead of time
 * with a very small foot print during launch to improve the time to interaction
 */
/**
 * Only real browser events are supported.
 * Unfortunately focus and blur do not bubble so a special mapping is needed.
 */
var eventNameMapping = {
    focus: "focusin",
    blur: "focusout"
};
var domEventRegistry = window.__gondelDomEvents || {};
window.__gondelDomEvents = domEventRegistry;
/* istanbul ignore next : Browser polyfill can't be tested */
var matches = Element.prototype.matches ||
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
function getParentElements(startElement) {
    var nodes = [];
    for (var element = startElement; element; element = element.parentElement) {
        nodes.push(element);
    }
    return nodes;
}
/**
 * Returns an array of all handlers which would apply for the current target
 */
function getHandlers(attributeName, eventHandlerRegistry, target) {
    var parents = getParentElements(target);
    // Find all selectors which have been registred for this event type
    // and which have a gondel component in one of the parrent nodes
    var selectorsOfFoundComponents = [];
    parents.forEach(function (parent, i) {
        var componentName = parent.getAttribute(attributeName);
        var handlers = componentName && eventHandlerRegistry[componentName];
        if (handlers) {
            // Store the index where the component was found to know in which part
            // of the dom tree the selectors could be found
            selectorsOfFoundComponents.push({ index: i, handlers: handlers });
        }
    });
    // Iterate over all possible selectors to find out if the current event
    // should fire any gondel handler
    var handlerQueue = [];
    selectorsOfFoundComponents.forEach(function (_a) {
        var index = _a.index, handlers = _a.handlers;
        var selectorNames = Object.keys(handlers);
        selectorNames.forEach(function (selectorName) {
            // If no selector is given the handler does always match
            if (!selectorName) {
                return handlerQueue.push({
                    index: index,
                    ctx: parents[index],
                    handlerOptions: handlers[selectorName]
                });
            }
            // Iterate backwards over the children of the component to find an element
            // which matches the selector for the current handler
            for (var i = index; --i >= 0;) {
                if (matches.call(parents[i], selectorName)) {
                    return handlerQueue.push({
                        index: i,
                        ctx: parents[index],
                        handlerOptions: handlers[selectorName]
                    });
                }
            }
        });
    });
    // Break if we couldn't find any matching element
    if (handlerQueue.length === 0) {
        return [];
    }
    // Sort the queue so events which are further up the dom are fired first
    handlerQueue.sort(function (handlerA, handlerB) {
        return handlerA.index > handlerB.index ? 1 : handlerA.index === handlerB.index ? 0 : -1;
    });
    return handlerQueue;
}
/**
 * The handler which will catch every event at the documentElement
 */
function handleEvent(namespace, attributeName, eventHandlerRegistry, event) {
    var target = event.target;
    var handlers = getHandlers(attributeName, eventHandlerRegistry, target);
    executeHandlers(handlers, event, namespace);
}
/**
 * Returns the namespace registry for the given namespace..
 * This function must be used only by core or plugins
 */
function getEventRegistry(namespace) {
    if (!domEventRegistry[namespace]) {
        domEventRegistry[namespace] = {};
    }
    return domEventRegistry[namespace];
}
/**
 * Notify components
 * This function must be used by core or only by plugins
 */
function executeHandlers(handlers, event, namespace) {
    var results = [];
    for (var i = 0; i < handlers.length && !event.cancelBubble; i++) {
        var handlerObject = handlers[i];
        var handlerOptions = handlerObject.handlerOptions;
        var gondelComponent = getComponentByDomNode(handlerObject.ctx, namespace);
        // Skip if the component wasn't started or if it was stopped
        if (gondelComponent) {
            for (var j = 0; j < handlerOptions.length && !event.cancelBubble; j++) {
                var handlerResult = gondelComponent[handlerOptions[j].handlerName].call(gondelComponent, event);
                if (typeof handlerResult === "function") {
                    results.push(handlerResult);
                }
            }
        }
    }
    // Execute all callbacks to allow grouping write events
    results.forEach(function (result) {
        result();
    });
}
/**
 * Add a event lister to the <html> element
 * The listener will always call handleEvent with the domEventRegistry for the given event
 */
function startListeningForEvent(eventName, namespace) {
    document.documentElement.addEventListener(eventNameMapping[eventName] || eventName, handleEvent.bind(null, namespace, "data-" + namespace + "-name", domEventRegistry[namespace][eventName]));
}
/**
 * Add an event to the Gondel EventRegistry
 */
function addRootEventListener(namespace, domEventName, gondelComponentName, handlerName, handlerOption) {
    // Create namespace if neededi
    var namespacedDomEventRegistry = getEventRegistry(namespace);
    // Notify all plugins to allow taking over the event handling for a specific event name
    // This notification is only triggered if a event name e.g. 'click' is used for the first time
    if (!namespacedDomEventRegistry[domEventName]) {
        namespacedDomEventRegistry[domEventName] = {};
        fireGondelPluginEvent("registerEvent", true, {
            eventName: domEventName,
            namespace: namespace,
            eventRegistry: namespacedDomEventRegistry[domEventName]
        }, function (isNativeEvent) {
            // If no plugin registered the event
            // register a native browser event
            if (isNativeEvent) {
                startListeningForEvent(domEventName, namespace);
            }
        });
    }
    if (!namespacedDomEventRegistry[domEventName][gondelComponentName]) {
        namespacedDomEventRegistry[domEventName][gondelComponentName] = {};
    }
    var handlerOptionObject = typeof handlerOption === "object" ? handlerOption : { selector: handlerOption };
    var selectorKey = handlerOptionObject.selector || "";
    if (!namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey]) {
        namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey] = [];
    }
    namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey].push(Object.assign({ handlerName: handlerName, handlerOption: handlerOption }));
}
/**
 * Remove an event from the Gondel EventRegistry
 */

/**
 * Remove all events for a given Component (e.g. a Button) from the Gondel EventRegistry
 */
function removeRootEventListernerForComponent(namespace, gondelComponentName) {
    var namespacedDomEventRegistry = getEventRegistry(namespace);
    for (var eventName in namespacedDomEventRegistry) {
        /* istanbul ignore else: for in savety check */
        if (namespacedDomEventRegistry.hasOwnProperty(eventName)) {
            delete namespacedDomEventRegistry[eventName][gondelComponentName];
        }
    }
}

// Because of how decorators work @EventListeners is executed before the class is registred
// so we need to provide a hrm compatible approch initialize and reinitialize the events
/**
 * Register a gondel component to the registry
 * @param {string} namespace   The gondel components namespace
 */
function Component(componentName, namespace) {
    return function (constructor) {
        if (!constructor.componentName) {
            throw new Error("Could not register component, check if " + constructor.name + ".componentName is defined.");
        }
        registerComponent(constructor, namespace);
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
function EventListener(eventName, selector) {
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

var GondelBaseComponent = /** @class */ (function () {
    function GondelBaseComponent() {
    }
    /**
     * Stop method
     */
    GondelBaseComponent.prototype.stop = function () { };
    return GondelBaseComponent;
}());

// Export helpers to hook into the gondel frameworks (should only be used by plugins)

exports.addGondelPluginEventListener = addGondelPluginEventListener;
exports.registerComponent = registerComponent;
exports.getGondelAttribute = getGondelAttribute;
exports.getFirstDomNode = getFirstDomNode;
exports.startComponents = startComponents;
exports.stopComponents = stopComponents;
exports.getComponentByDomNode = getComponentByDomNode;
exports.getComponentByDomNodeAsync = getComponentByDomNodeAsync;
exports.findComponents = findComponents;
exports.Component = Component;
exports.EventListener = EventListener;
exports.triggerPublicEvent = triggerPublicEvent;
exports.GondelBaseComponent = GondelBaseComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gondel.es5.js.map
