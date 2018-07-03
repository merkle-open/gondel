import { internalGondelAsyncRefAttribute, internalGondelRefAttribute } from "./GondelDomUtils";
import { triggerPublicEvent } from "./GondelEventEmitter";
import { fireGondelPluginEvent } from "./GondelPluginUtils";
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
export function startComponentsFromRegistry(gondelComponentRegistry, domContext, namespace) {
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
export function isPristineGondelDomNode(domNode, namespace) {
    return !domNode.hasOwnProperty(internalGondelAsyncRefAttribute + namespace);
}
/**
 * Mark the given dom node as controlled by gondel
 */
export function attachGondelBootingFlag(domNode, bootingFlag, namespace) {
    // The name `A` mean async
    // to allow waiting for asyncronous booted components
    domNode[internalGondelAsyncRefAttribute + namespace] = bootingFlag;
}
/**
 * Constructs a new component
 */
export function constructComponent(domNode, gondelComponentRegisty, namespace) {
    var componentName = domNode.getAttribute("data-" + namespace + "-name");
    var GondelComponent = gondelComponentRegisty.getComponent(componentName);
    if (GondelComponent === undefined) {
        throw new Error("Failed to boot component - " + componentName + " is not registred");
    }
    var componentInstance = new GondelComponent(domNode, componentName);
    componentInstance._ctx = domNode;
    componentInstance._namespace = namespace;
    componentInstance._componentName = componentName;
    // Add stop method
    componentInstance.stop = stopStartedComponent.bind(null, componentInstance, componentInstance.stop || noop, namespace);
    // Create a circular reference which will allow access to the componentInstance from ctx
    domNode["_gondel_" + namespace] = componentInstance;
    return componentInstance;
}
/**
 * Start a component after it was constructed
 */
export function startConstructedComponent(component) {
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
export function stopStartedComponent(component, internalStopMethod, namespace) {
    triggerPublicEvent(namespace + "Stop", component, component._ctx);
    // Remove the component instance from the html element
    delete component._ctx[internalGondelRefAttribute + namespace];
    delete component._ctx[internalGondelAsyncRefAttribute + namespace];
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
//# sourceMappingURL=GondelComponentStarter.js.map