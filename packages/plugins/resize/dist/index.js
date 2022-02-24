/**
 * This is a gondel plugin which add a custom gondel resize event
 */
import { addGondelPluginEventListener, getComponentByDomNode } from '@gondel/core';
/**
 * The COMPONENT_RESIZED_EVENT event will be fired if a component size was changed because of a browser window resize
 */
export var COMPONENT_RESIZED_EVENT = '@gondel/plugin-resize--component-resized';
/**
 * The WINDOW_RESIZED_EVENT event will be fired if the browser window was resized
 */
export var WINDOW_RESIZED_EVENT = '@gondel/plugin-resize--window-resized';
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
 * Add @EventListener('resize')
 *
 * This will allow components to listen for throttled window resize events
 * The resize event will only be fired for a component if the width or the height of the component changed
 */
var initializeResizeEvent = function (eventRegistry, namespace, eventName) {
    var isRunning = false;
    var frameIsRequested = false;
    var resizeDoneTimer;
    var componentInformation;
    var fireResizeEvent = eventName === WINDOW_RESIZED_EVENT ? fireWindowResizeEvent : fireComponentResizeEvent;
    /**
     * This handler is called if a new resize event happens.
     * A resize event is new if no resize occurred for 250ms
     */
    function startResizeWatching(event) {
        var components = getComponentsInEventRegistry(eventRegistry, namespace);
        isRunning = true;
        // The resize listener is fired very often
        // for performance optimisations we search and store
        // all components during the initial start event
        componentInformation = components.map(function (component) {
            var size = component.__resizeSize || {
                width: 0,
                height: 0,
            };
            var gondelComponentHandlers = eventRegistry[component._componentName];
            return {
                component: component,
                node: component._ctx,
                selectors: Object.keys(gondelComponentHandlers).map(function (selector) {
                    return gondelComponentHandlers[selector].map(function (handlerOption) { return component[handlerOption.handlerName]; });
                }),
                width: size.width,
                height: size.height,
            };
        });
        fireResizeEvent(event);
    }
    /**
     * Clean up after no resize event happened for 250ms
     */
    function stopResizeWatching() {
        // If there is still a throttled resize handler
        // wait until it is done
        if (frameIsRequested) {
            requestAnimationFrame(stopResizeWatching);
            return;
        }
        // Memory cleanup
        isRunning = false;
        componentInformation = undefined;
    }
    /**
     * Check which modules changed in size, are still running and call their event handler
     */
    function fireComponentResizeEvent(event) {
        frameIsRequested = false;
        if (!componentInformation) {
            return;
        }
        var newSizes = componentInformation.map(function (_a) {
            var node = _a.node;
            return ({
                width: node.clientWidth,
                height: node.clientHeight,
            });
        });
        var handlerResults = [];
        componentInformation.forEach(function (componentInformation, i) {
            var newSize = newSizes[i];
            // Skip if the size did not change
            if (newSize.width === componentInformation.width && newSize.height === componentInformation.height) {
                return;
            }
            // Skip if the component is not running anymore
            if (componentInformation.component._stopped) {
                return;
            }
            componentInformation.component.__resizeSize = newSize;
            componentInformation.width = newSize.width;
            componentInformation.height = newSize.height;
            componentInformation.selectors.forEach(function (selector) {
                return selector.forEach(function (handler) {
                    return handlerResults.push(handler.call(componentInformation.component, event, newSize));
                });
            });
        });
        handlerResults.forEach(function (handlerResult) {
            if (typeof handlerResult === 'function') {
                handlerResult();
            }
        });
    }
    /**
     * Check if the components are still running and call their event handler
     */
    function fireWindowResizeEvent(event) {
        frameIsRequested = false;
        if (!componentInformation) {
            return;
        }
        var handlerResults = [];
        componentInformation.forEach(function (componentInformation, i) {
            // Skip if the component is not running anymore
            if (componentInformation.component._stopped) {
                return;
            }
            componentInformation.selectors.forEach(function (selector) {
                return selector.forEach(function (handler) { return handlerResults.push(handler.call(componentInformation.component, event)); });
            });
        });
        handlerResults.forEach(function (handlerResult) {
            if (typeof handlerResult === 'function') {
                handlerResult();
            }
        });
    }
    window.addEventListener('resize', function (event) {
        if (!isRunning) {
            startResizeWatching(event);
        }
        else if (!frameIsRequested) {
            frameIsRequested = true;
            window.requestAnimationFrame(fireResizeEvent.bind(null, event));
        }
        clearTimeout(resizeDoneTimer);
        resizeDoneTimer = setTimeout(stopResizeWatching, 250);
    });
};
/**
 * This function creates a custom gondel event
 */
export function initResizePlugin() {
    addGondelPluginEventListener('Resize', 'registerEvent', function addResizeEvent(isNativeEvent, _a, resolve) {
        var eventName = _a.eventName, namespace = _a.namespace, eventRegistry = _a.eventRegistry;
        // Ignore all events but the resize events
        if (eventName !== WINDOW_RESIZED_EVENT && eventName !== COMPONENT_RESIZED_EVENT) {
            resolve(isNativeEvent);
            return;
        }
        initializeResizeEvent(eventRegistry, namespace, eventName);
        // Tell the event system that it should not listen for the event:
        resolve(false);
    });
    addGondelPluginEventListener('Resize', 'sync', function addResizeEvent(components, data, resolve) {
        setTimeout(function () {
            components.forEach(function (component) {
                component.__resizeSize = {
                    width: component._ctx.clientWidth,
                    height: component._ctx.clientHeight,
                };
            });
        });
        resolve(components);
    });
}
//# sourceMappingURL=index.js.map