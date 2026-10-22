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
        .map(function (componentName) { return "[data-".concat(namespace, "-name=\"").concat(componentName, "\"]"); })
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
    return breakpointNames.map(function (breakpointName, i) {
        var max = breakPoints[breakpointName];
        var excludeQuery = i === 0 ? undefined : "(max-width: ".concat(breakPoints[breakpointNames[i - 1]]).concat(unit, ")");
        if (max === Infinity) {
            if (excludeQuery === undefined) {
                throw new Error('The smallest provided viewport must not be set to Infinity');
            }
            return { name: breakpointName, query: "not all and ".concat(excludeQuery) };
        }
        return { name: breakpointName, query: "(max-width: ".concat(max).concat(unit, ")"), excludeQuery: excludeQuery };
    });
}
function observeViewport(viewport, onEnter) {
    var upperBoundary = matchMedia(viewport.query);
    var lowerBoundary = viewport.excludeQuery === undefined ? undefined : matchMedia(viewport.excludeQuery);
    // Exclude the previous inclusive range rather than adding an offset to its boundary.
    var matches = function () { return upperBoundary.matches && !(lowerBoundary && lowerBoundary.matches); };
    var matched = matches();
    var handleChange = function () {
        var nextMatched = matches();
        if (nextMatched === matched) {
            return;
        }
        matched = nextMatched;
        if (matched) {
            onEnter();
        }
    };
    upperBoundary.addListener(handleChange);
    if (lowerBoundary) {
        lowerBoundary.addListener(handleChange);
    }
    return matched;
}
/**
 * Use enquire.js to listen for viewport changes
 * Once a viewport changed call all gondel plugins which are listening
 */
function setupViewportChangeEvent(mediaQueries, eventRegistry, namespace) {
    var _loop_1 = function (viewport) {
        observeViewport(viewport, function () {
            currentViewport = viewport.name;
            fireViewportChangeEvent(viewport.name, eventRegistry, namespace);
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
        var matched = observeViewport(viewport, function () {
            currentViewport = viewport.name;
        });
        if (matched) {
            currentViewport = viewport.name;
        }
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