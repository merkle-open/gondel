/**
 * The event registry provides a way to bind events ahead of time
 * with a very small foot print during launch to improve the time to interaction
 */
import { extractComponent } from "./GondelDomUtils";
import { fireGondelPluginEvent } from "./GondelPluginUtils";
/**
 * Only real browser events are supported.
 * Unfortunately focus and blur do not bubble so a special mapping is needed.
 */
var eventNameMapping = {
    focus: "focusin",
    blur: "focusout"
};
// Polyfill for element.prototype.matches
var matchesCssSelector = function (element, selector) {
    var elementPrototype = window.Element.prototype;
    /* istanbul ignore next : Browser polyfill can't be tested */
    var elementMatches = elementPrototype.matches ||
        elementPrototype.matchesSelector ||
        elementPrototype.mozMatchesSelector ||
        elementPrototype.msMatchesSelector ||
        elementPrototype.webkitMatchesSelector;
    // Cache the function and call it
    return (matchesCssSelector = function (element, selector) {
        return elementMatches.call(element, selector);
    })(element, selector);
};
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
export function getHandlers(attributeName, eventHandlerRegistry, target) {
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
                    target: parents[index],
                    handlerOptions: handlers[selectorName]
                });
            }
            // Iterate backwards over the children of the component to find an element
            // which matches the selector for the current handler
            for (var i = index; --i >= 0;) {
                if (matchesCssSelector(parents[i], selectorName)) {
                    return handlerQueue.push({
                        index: i,
                        ctx: parents[index],
                        target: parents[i],
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
var _domEventRegistry;
/**
 * Returns the namespace registry for the given namespace..
 * This function must be used only by core or plugins
 */
export function getEventRegistry(namespace) {
    if (!_domEventRegistry) {
        _domEventRegistry = window["__\ud83d\udea1DomEvents"] || {};
        window["__\ud83d\udea1DomEvents"] = _domEventRegistry;
    }
    if (!_domEventRegistry[namespace]) {
        _domEventRegistry[namespace] = {};
    }
    return _domEventRegistry[namespace];
}
/**
 * Notify components
 * This function must be used by core or only by plugins
 */
export function executeHandlers(handlers, event, namespace) {
    /** Store wether the original Event was modified to provide the correct currentTarget */
    var eventObjectRequiresCleanup = false;
    /** Store optional callback results which are executed together to allow grouped redraws */
    var results = [];
    for (var i = 0; i < handlers.length && !event.cancelBubble; i++) {
        var handlerObject = handlers[i];
        var handlerOptions = handlerObject.handlerOptions;
        var gondelComponent = extractComponent(handlerObject.ctx, namespace);
        // Skip if the component wasn't started or if it was stopped
        if (gondelComponent) {
            // See https://stackoverflow.com/questions/52057726/what-is-the-best-way-to-alter-a-native-browser-event
            Object.defineProperty(event, "currentTarget", {
                value: handlerObject.target,
                configurable: true
            });
            eventObjectRequiresCleanup = true;
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
    // Cleanup the event object
    if (eventObjectRequiresCleanup) {
        // See https://stackoverflow.com/questions/52057726/what-is-the-best-way-to-alter-a-native-browser-event
        delete event.currentTarget;
    }
}
/**
 * Add a event lister to the <html> element
 * The listener will always call handleEvent with the domEventRegistry for the given event
 */
function startListeningForEvent(eventName, namespace) {
    document.documentElement.addEventListener(eventNameMapping[eventName] || eventName, handleEvent.bind(null, namespace, "data-" + namespace + "-name", getEventRegistry(namespace)[eventName]));
}
/**
 * Add an event to the Gondel EventRegistry
 */
export function addRootEventListener(namespace, domEventName, gondelComponentName, handlerName, handlerOption) {
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
export function removeRootEventListener(namespace, domEventName, gondelComponentName, handlerName, selector) {
    var selectorKey = selector || "";
    var namespacedDomEventRegistry = getEventRegistry(namespace);
    if (namespacedDomEventRegistry[domEventName] &&
        namespacedDomEventRegistry[domEventName][gondelComponentName] &&
        namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey]) {
        namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey] = namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey].filter(function (handlerOption) {
            return handlerOption.handlerName !== handlerName || handlerName === undefined;
        });
    }
}
/**
 * Remove all events for a given Component (e.g. a Button) from the Gondel EventRegistry
 */
export function removeRootEventListernerForComponent(namespace, gondelComponentName) {
    var namespacedDomEventRegistry = getEventRegistry(namespace);
    for (var eventName in namespacedDomEventRegistry) {
        /* istanbul ignore else: for in savety check */
        if (namespacedDomEventRegistry.hasOwnProperty(eventName)) {
            delete namespacedDomEventRegistry[eventName][gondelComponentName];
        }
    }
}
//# sourceMappingURL=GondelEventRegistry.js.map