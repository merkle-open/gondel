/// <reference path="./index.d.ts" />
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.gondelPluginMediaQueries = {})));
}(this, (function (exports) { 'use strict';

var basePluginListener = function (result, data, next) { return next(result); };
// Global plugin events registry
var pluginEvents = window.__gondelPluginEvents || {};
window.__gondelPluginEvents = pluginEvents;

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

/**
 * Start all components of the gondel component registry
 * for the given dom context
 */

/**
 * Returns true if the given domNode is neither booting nor booted
 */

/**
 * Mark the given dom node as controlled by gondel
 */

/**
 * Constructs a new component
 */

/**
 * Start a component after it was constructed
 */

/**
 * Stops a started component
 */

var componentRegistries = (window.__gondelRegistries = window.__gondelRegistries || {});

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
function getFirstDomNode(domNode) {
    if (isElement(domNode)) {
        return domNode;
    }
    return domNode[0];
}
/**
 * Start all nodes in the given context
 */

/**
 * Stop all nodes in the given context
 */

/**
 * Returns the gondel instance for the given HtmlELement
 */
function getComponentByDomNode(domNode, namespace) {
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

/**
 * Returns all components inside the given node
 */

/**
 * The event registry provides a way to bind events ahead of time
 * with a very small foot print during launch to improve the time to interaction
 */
var domEventRegistry = window.__gondelDomEvents || {};
window.__gondelDomEvents = domEventRegistry;
/* istanbul ignore next : Browser polyfill can't be tested */
var matches = Element.prototype.matches ||
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
/**
 * Returns an array of all handlers which would apply for the current target
 */

/**
 * Returns the namespace registry for the given namespace..
 * This function must be used only by core or plugins
 */

/**
 * Notify components
 * This function must be used by core or only by plugins
 */

/**
 * Add an event to the Gondel EventRegistry
 */

/**
 * Remove an event from the Gondel EventRegistry
 */

/**
 * Remove all events for a given Component (e.g. a Button) from the Gondel EventRegistry
 */

// Because of how decorators work @EventListeners is executed before the class is registred
// so we need to provide a hrm compatible approch initialize and reinitialize the events

/**
 * The @EventListener decorator will add all event names to a static variable
 */

// Export helpers to hook into the gondel frameworks (should only be used by plugins)

/**
 * This is a plugin to initialize enquire.js and fire a viewportChange event when triggering a breakpoint
 */
var currentViewport;
/**
 * This function returns all components for the given eventRegistry which can be found in the dom.
 */
function getComponentsInEventRegistry(eventRegistry, namespace) {
    var selector = Object.keys(eventRegistry)
        .map(function (componentName) { return "[data-" + namespace + "-name=\"" + componentName + "\"]"; })
        .join(",");
    if (!selector) {
        return [];
    }
    var componentElements = document.documentElement.querySelectorAll(selector);
    var components = [];
    for (var i = 0; i < componentElements.length; i++) {
        var component = getComponentByDomNode(componentElements[i], namespace);
        if (component) {
            components.push(component);
        }
    }
    return components;
}
/**
 * This function fire's a custom gondel event to all registered components
 */
function fireViewportChangeEvent(viewport, eventRegistry, namespace) {
    var components = getComponentsInEventRegistry(eventRegistry, namespace);
    var handlerResults = [];
    components.forEach(function (component) {
        Object.keys(eventRegistry[component._componentName]).forEach(function (selector) {
            if (selector === "" || viewport === selector) {
                eventRegistry[component._componentName][selector].forEach(function (handlerOption) {
                    handlerResults.push(component[handlerOption.handlerName].call(component, { viewport: viewport }));
                });
            }
        });
    });
    handlerResults.forEach(function (handlerResults) { return function () {
        if (typeof handlerResults === "function") {
            handlerResults();
        }
    }; });
}
/**
 * This function returns the current viewport
 */
function getCurrentViewport() {
    return currentViewport;
}
/**
 * Converts the given pixel breakpoint object into a em breakpoint object
 */
function convertBreakpointsToEm(breakpointsInPx) {
    var breakpointsInEm = {};
    var breakpointNames = Object.keys(breakpointsInPx);
    breakpointNames.forEach(function (breakpointName) {
        breakpointsInEm[breakpointName] = px2em(breakpointsInPx[breakpointName]);
    });
    return breakpointsInEm;
}
/**
 * Convert pixel to em
 */
function px2em(pixelValue) {
    return Math.round(pixelValue / 16 * 100) / 1000;
}
/**
 * This function generate mediaQueries from breakPoints
 */
function generateMediaQueries(breakPoints, unit) {
    // Sort breakpoints by size
    var breakpointNames = Object.keys(breakPoints).sort(function (breakpointNameA, breakpointNameB) {
        if (breakPoints[breakpointNameA] > breakPoints[breakpointNameB]) {
            return 1;
        }
        if (breakPoints[breakpointNameA] < breakPoints[breakpointNameB]) {
            return -1;
        }
        return 0;
    });
    // Convert breakpoints from 980 into (min-width: 700) and (max-width: 980)
    // by using the previous breakpoint
    return breakpointNames.map(function (breakpointName, i) {
        // If this is the first breakpoint we don't need a min value
        var min = breakpointNames[i - 1] === undefined ? undefined : breakPoints[breakpointNames[i - 1]] + 1;
        // If this is the last breakpoint we don't need a max value
        var max = breakPoints[breakpointName] === Infinity ? undefined : breakPoints[breakpointName];
        var queryString;
        if (min && max) {
            queryString = "(min-width: " + min + unit + ") and (max-width: " + max + unit + ")";
        }
        else if (min) {
            queryString = "(min-width: " + min + unit + ")";
        }
        else if (max) {
            queryString = "(max-width: " + max + unit + ")";
        }
        else {
            // This should only happen if the user did a miss configuration
            // with only a single breakpoint which is set to infinity
            throw new Error("The smallest provided viewport must not be set to Infinity");
        }
        return { name: breakpointName, query: queryString, min: min, max: max };
    });
}
/**
 * Use enquire.js to listen for viewport changes
 * Once a viewport changed call all gondel plugins which are listening
 */
function setupViewportChangeEvent(mediaQueries, eventRegistry, namespace) {
    var _loop_1 = function (viewport) {
        matchMedia(viewport.query).addListener(function (mediaQueryList) {
            if (mediaQueryList.matches) {
                fireViewportChangeEvent(viewport.name, eventRegistry, namespace);
            }
        });
    };
    for (var _i = 0, mediaQueries_1 = mediaQueries; _i < mediaQueries_1.length; _i++) {
        var viewport = mediaQueries_1[_i];
        _loop_1(viewport);
    }
}
/**
 * Use enquire.js to listen for viewport changes
 * for the getCurrentViewport helper method
 */
function setupCurrentViewportHelper(mediaQueries) {
    var _loop_2 = function (viewport) {
        var viewportMediaQueryList = matchMedia(viewport.query);
        // Set initial viewport
        if (viewportMediaQueryList.matches) {
            currentViewport = viewport.name;
        }
        // Watch for media query changes
        viewportMediaQueryList.addListener(function (mediaQueryList) {
            if (mediaQueryList.matches) {
                currentViewport = viewport.name;
            }
        });
    };
    for (var _i = 0, mediaQueries_2 = mediaQueries; _i < mediaQueries_2.length; _i++) {
        var viewport = mediaQueries_2[_i];
        _loop_2(viewport);
    }
}
/**
 * This function creates a custom gondel event
 */
function initMediaQueriesPlugin(options) {
    // Get the converted breakpoint values
    var breakPoints = options.convertToEm
        ? convertBreakpointsToEm(options.breakPoints)
        : options.breakPoints;
    // Get the unit
    var unit = options.unit || (options.convertToEm ? "em" : "px");
    var mediaQueries = generateMediaQueries(breakPoints, unit);
    // Setup the viewport helper independently so it will
    // also be avialiable if no component is listening to events:
    setupCurrentViewportHelper(mediaQueries);
    addGondelPluginEventListener("registerEvent", function addViewportChangeEvent(isNativeEvent, _a, resolve) {
        var eventName = _a.eventName, namespace = _a.namespace, eventRegistry = _a.eventRegistry;
        // Ignore all events but the viewportChange event
        if (eventName !== "viewportChange") {
            resolve(isNativeEvent);
            return;
        }
        setupViewportChangeEvent(mediaQueries, eventRegistry, namespace);
        // Tell the event system that it should not listen for the event:
        resolve(false);
    });
}

exports.getCurrentViewport = getCurrentViewport;
exports.initMediaQueriesPlugin = initMediaQueriesPlugin;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.es5.js.map
