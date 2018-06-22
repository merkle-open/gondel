import { startComponentsFromRegistry } from "./GondelComponentStarter";
import { componentRegistries } from "./GondelComponentRegistry";
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
export function getGondelAttribute(namespace, addition) {
    if (namespace === void 0) { namespace = "g"; }
    var id = "__gondel_" + (addition ? addition + "_" : "") + namespace + "__";
    if (Symbol && typeof Symbol.for === "function") {
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
export function getFirstDomNode(domNode) {
    if (isElement(domNode)) {
        return domNode;
    }
    return domNode[0];
}
/**
 *
 * @param gondelComponent
 * @param namespace
 */
function getComponentName(gondelComponent, namespace) {
    if (!gondelComponent._identifier) {
        throw new Error('1 Unregistered component has no identifier.');
    }
    var identification = gondelComponent.__identification;
    if (!identification[namespace]) {
        throw new Error('2 No component for namespace ' + namespace);
    }
    return identification[namespace];
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
export function isComponentMounted(domNode, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var gondelComponent = firstNode[getGondelAttribute(namespace)];
    return gondelComponent && gondelComponent._ctx;
}
/**
 * Returns the gondel instance for the given HtmlELement
 */
export function getComponentByDomNode(domNode, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var gondelComponent = firstNode[getGondelAttribute(namespace)];
    // Stop if this dom node is not known to gondel
    if (gondelComponent && gondelComponent._ctx) {
        return gondelComponent;
    }
    throw new Error("Could not find any gondel component in namespace " + namespace + " on node " + firstNode.nodeName + ". " +
        "This usually happens when the DOM content was modified by a third-party tool." +
        "Use 'isComponentMounted' to check if the component is mounted.");
}
/**
 * Returns the gondel instance for the given HtmlELement once it is booted
 */
export function getComponentByDomNodeAsync(domNode, namespace) {
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var gondelComponent = firstNode[getGondelAttribute(namespace, "async")];
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
export function findComponents(domNode, component, namespace) {
    if (domNode === void 0) { domNode = document.documentElement; }
    if (namespace === void 0) { namespace = "g"; }
    var firstNode = getFirstDomNode(domNode);
    var components = [];
    var attribute = getGondelAttribute(namespace);
    var nodes = firstNode.querySelectorAll("[data-" + namespace + "-name" + (component ? "=\"" + (typeof component === "string" ? component : getComponentName(component, namespace)) + "\"" : "") + "]");
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var gondelComponentInstance = node[attribute];
        // Verify that the component is fully booted
        if (gondelComponentInstance && gondelComponentInstance._ctx === node) {
            components.push(gondelComponentInstance);
        }
    }
    if (typeof component === 'string') {
        return components;
    }
    return components;
}
//# sourceMappingURL=GondelDomUtils.js.map