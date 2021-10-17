/// <reference path="./index.d.ts" />
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.gondelPluginMediaQueries = {}));
})(this, (function (exports) { 'use strict';

    var basePluginListener = function (result, data, next) { return next(result); };
    // Global plugin events registry
    var pluginEventRegistry = window.__gondelPluginEvents || { pluginMapping: {}, pluginEvents: {} };
    window.__gondelPluginEvents = pluginEventRegistry;
    /** Global Plugin Event Handler Registry */
    var pluginEvents = pluginEventRegistry.pluginEvents;
    // Mapping to track if plugin was already registered to prevent double registrations
    var pluginMapping = pluginEventRegistry.pluginMapping;
    /**
     * Allow plugins to hook into the gondel event system
     */
    function addGondelPluginEventListener(pluginName, eventName, eventListenerCallback) {
        // Prevent any event registration if this pluginHandlerName
        // has already been used
        var pluginHandlerNamePerEvent = eventName + "#" + pluginName;
        if (pluginMapping[pluginHandlerNamePerEvent]) {
            return;
        }
        // Flag plugin as registered
        pluginMapping[pluginHandlerNamePerEvent] = true;
        // Ensure that an entry for the given event name exists
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

    var internalGondelRefAttribute = '_gondel_';
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
     * Returns the gondel instance for the given HtmlELement
     */
    function getComponentByDomNode(domNode, namespace) {
        if (namespace === void 0) { namespace = 'g'; }
        var gondelComponent = extractComponent(getFirstDomNode(domNode), namespace);
        if (!gondelComponent) {
            throw new Error("Could not find a started gondel component in namespace \"" + namespace + "\",\nplease check if your component is mounted via 'hasMountedGondelComponent'");
        }
        return gondelComponent;
    }
    /**
     * Internal helper function of getComponentByDomNode
     *
     * Returns the gondel instance from a known HtmlElement
     * This function is an internal helper with a possible undefined
     * return value.
     */
    function extractComponent(element, namespace) {
        var gondelComponent = element[internalGondelRefAttribute + namespace];
        // Stop if this dom node is not known to gondel
        if (gondelComponent && gondelComponent._ctx) {
            return gondelComponent;
        }
    }

    /**
     * This is a plugin to initialize enquire.js and fire a viewportChange event when triggering a breakpoint
     */
    /**
     * The VIEWPORT_ENTERED will be fired if a new viewport is entered
     */
    var VIEWPORT_ENTERED = '@gondel/plugin-media-queries--viewport-entered';
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
    function initMediaQueriesPlugin(options) {
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

    exports.VIEWPORT_ENTERED = VIEWPORT_ENTERED;
    exports.getCurrentViewport = getCurrentViewport;
    exports.initMediaQueriesPlugin = initMediaQueriesPlugin;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.es5.js.map
