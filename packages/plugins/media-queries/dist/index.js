/**
 * This is a plugin to initialize enquire.js and fire a viewportChange event when triggering a breakpoint
 */
import { addGondelPluginEventListener, getComponentByDomNode } from "@gondel/core";
import * as enquire from "enquire.js";
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
}
/**
 * This function returns the current viewport
 */
export function getCurrentViewport() {
    return currentViewport;
}
/**
 * Convert pixel to em
 */
function px2em(pixelValue) {
    return (Math.round(pixelValue / 16 * 100) / 100 + "em" // add unit as string
    );
}
/**
 * This function generate mediaQueries from breakPoints
 */
function generateMediaQueries(breakPoints) {
    var breakpointNames = Object.keys(breakPoints).sort(function (breakpointNameA, breakpointNameB) {
        if (breakPoints[breakpointNameA] > breakPoints[breakpointNameB]) {
            return 1;
        }
        if (breakPoints[breakpointNameA] < breakPoints[breakpointNameB]) {
            return -1;
        }
        return 0;
    });
    return breakpointNames.map(function (breakpointName, i) {
        var max = breakPoints[breakpointName] === Infinity ? undefined : breakPoints[breakpointName];
        var min = breakpointNames[i - 1] === undefined ? undefined : breakPoints[breakpointNames[i - 1]] + 1;
        var queryString;
        if (min && max) {
            queryString = "(min-width: " + px2em(min) + ") and (max-width: " + px2em(max) + ")";
        }
        else if (min) {
            queryString = "(min-width: " + px2em(min) + ")";
        }
        else if (max) {
            queryString = "(max-width: " + px2em(max) + ")";
        }
        else {
            throw new Error('The smallest provided viewport must not be set to Infinity');
        }
        return { name: breakpointName, query: queryString, min: min, max: max };
    });
}
/**
 * This function set's up enquire.js
 */
function setupViewportChangeEvent(breakPoints, eventRegistry, namespace) {
    var mediaQueries = generateMediaQueries(breakPoints);
    var _loop_1 = function (viewport) {
        enquire.register(viewport.query, {
            setup: function () {
                currentViewport = viewport.name;
            },
            match: function () {
                currentViewport = viewport.name;
                fireViewportChangeEvent(viewport.name, eventRegistry, namespace);
            },
            // trigger setup the first time a viewport is actually entered
            deferSetup: true
        });
    };
    for (var _i = 0, mediaQueries_1 = mediaQueries; _i < mediaQueries_1.length; _i++) {
        var viewport = mediaQueries_1[_i];
        _loop_1(viewport);
    }
}
/**
 * This function creates a custom gondel event
 */
export default function initMediaQueries(breakPoints) {
    addGondelPluginEventListener("registerEvent", function addViewportChangeEvent(isNativeEvent, _a, resolve) {
        var eventName = _a.eventName, namespace = _a.namespace, eventRegistry = _a.eventRegistry;
        if (eventName === "viewportChange") {
            setupViewportChangeEvent(breakPoints, eventRegistry, namespace);
            // Tell the event system that it should not listen for the event:
            resolve(false);
        }
        else {
            resolve(isNativeEvent);
        }
    });
}
//# sourceMappingURL=index.js.map