import { startComponentsFromRegistry } from "./GondelComponentStarter";
import { componentRegistries } from "./GondelComponentRegistry";
/**
 * Returns true if the given object is a single Element
 */
function isElement(domNode) {
    return domNode.nodeType !== undefined;
}
/**
 * This function normalizes takes one of the following:
 *  + document query result
 *  + dom node array
 *  + jquery object
 *  + a single dom node
 * and turns it into a single dom node
 */
export function getFirstDomNode(domNode) {
    if (isElement(domNode)) {
        return domNode;
    }
    return domNode[0];
}
/**
 * Start all nodes in the given context
 */
export function startComponents(domContext, namespace) {
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
export function stopComponents(domContext, namespace) {
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
export function getComponentByDomNode(domNode, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var gondelComponent = firstNode["_gondel_" + namespace];
    // Stop if this dom node is not known to gondel
    if (gondelComponent && gondelComponent._ctx) {
        return gondelComponent;
    }
    return;
}
/**
 * Returns the gondel instance for the given HtmlELement once it is booted
 */
export function getComponentByDomNodeAsync(domNode, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var gondelComponent = firstNode["_gondelA_" + namespace];
    // Stop if this dom node is not known to gondel
    if (!gondelComponent) {
        return Promise.reject(undefined);
    }
    // or the component is already booted up return it
    if (gondelComponent._ctx) {
        return Promise.resolve(gondelComponent);
    }
    // Wait the component to boot up and return it
    return gondelComponent.then(function () { return firstNode["_gondel_" + namespace]; });
}
/**
 * Returns all components inside the given node
 */
export function findComponents(domNode, component, namespace) {
    if (domNode === void 0) { domNode = document.documentElement; }
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var components = [];
    var attribute = "_gondel_" + namespace;
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
//# sourceMappingURL=GondelDomUtils.js.map