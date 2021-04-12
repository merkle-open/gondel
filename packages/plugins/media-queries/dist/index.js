/**
 * This is a plugin to initialize enquire.js and fire a viewportChange event when triggering a breakpoint
 */
import { addGondelPluginEventListener, getComponentByDomNode } from '@gondel/core';
/**
 * The VIEWPORT_ENTERED will be fired if a new viewport is entered
 */
export var VIEWPORT_ENTERED = '@gondel/plugin-media-queries--viewport-entered';
var currentViewport;
/**
 * This function returns all components for the given eventRegistry which can be found in the dom.
 */
function getComponentsInEventRegistry(eventRegistry, namespace) {
    var selector = Object.keys(eventRegistry)
        .map(function (componentName) { return "[data-" + namespace + "-name=\"" + componentName + "\"]"; })
        .join(',');
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
            if (selector === '' || viewport === selector) {
                eventRegistry[component._componentName][selector].forEach(function (handlerOption) {
                    handlerResults.push(component[handlerOption.handlerName].call(component, { viewport: viewport }));
                });
            }
        });
    });
    handlerResults.forEach(function (handlerResults) { return function () {
        if (typeof handlerResults === 'function') {
            handlerResults();
        }
    }; });
}
/**
 * This function returns the current viewport
 */
export function getCurrentViewport() {
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
    return Math.round((pixelValue / 16) * 100) / 1000;
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
            throw new Error('The smallest provided viewport must not be set to Infinity');
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
export function initMediaQueriesPlugin(options) {
    // Get the converted breakpoint values
    var breakPoints = options.convertToEm ? convertBreakpointsToEm(options.breakPoints) : options.breakPoints;
    // Get the unit
    var unit = options.unit || (options.convertToEm ? 'em' : 'px');
    var mediaQueries = generateMediaQueries(breakPoints, unit);
    // Setup the viewport helper independently so it will
    // also be avialiable if no component is listening to events:
    setupCurrentViewportHelper(mediaQueries);
    addGondelPluginEventListener('MediaQueries', 'registerEvent', function addViewportChangeEvent(isNativeEvent, _a, resolve) {
        var eventName = _a.eventName, namespace = _a.namespace, eventRegistry = _a.eventRegistry;
        // Ignore all events but the viewportChange event
        if (eventName !== VIEWPORT_ENTERED) {
            resolve(isNativeEvent);
            return;
        }
        setupViewportChangeEvent(mediaQueries, eventRegistry, namespace);
        // Tell the event system that it should not listen for the event:
        resolve(false);
    });
}
//# sourceMappingURL=index.js.map