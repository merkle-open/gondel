/**
 * This is a demo plugin which adds custom events
 */
import { addGondelPluginEventListener, getComponentByDomNode } from "@gondel/core";
import { getHandlers, executeHandlers } from "@gondel/core/dist/GondelEventRegistry";
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
var customEvents = {
    /**
     * Add @EventListener('resize')
     *
     * This will allow components to listen for throttled window resize events
     * The resize event will only be fired for a component if the width or the height of the component changed
     */
    resize: function (eventRegistry, namespace) {
        var isRunning = false;
        var frameIsRequested = false;
        var resizeDoneTimer;
        var componentInformation;
        /**
         * This handler is called if a new resize event happens.
         * A resize event is new if no resize occured for 250ms
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
                    height: 0
                };
                var gondelComponentHandlers = eventRegistry[component._componentName];
                return {
                    component: component,
                    node: component._ctx,
                    selectors: Object.keys(gondelComponentHandlers).map(function (selector) {
                        return gondelComponentHandlers[selector].map(function (handlerOption) { return component[handlerOption.handlerName]; });
                    }),
                    width: size.width,
                    height: size.height
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
         * Check which modules changed in size an call their event handler
         */
        function fireResizeEvent(event) {
            frameIsRequested = false;
            if (!componentInformation) {
                return;
            }
            var newSizes = componentInformation.map(function (_a) {
                var node = _a.node;
                return ({
                    width: node.clientWidth,
                    height: node.clientHeight
                });
            });
            var handlerResults = [];
            componentInformation.forEach(function (componentInformation, i) {
                var newSize = newSizes[i];
                // Skip if the size did not change
                if (newSize.width === componentInformation.width &&
                    newSize.height === componentInformation.height) {
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
                if (typeof handlerResult === "function") {
                    handlerResult();
                }
            });
        }
        window.addEventListener("resize", function (event) {
            if (!isRunning) {
                startResizeWatching(event);
            }
            else if (!frameIsRequested) {
                frameIsRequested = true;
                window.requestAnimationFrame(fireResizeEvent.bind(event));
            }
            clearTimeout(resizeDoneTimer);
            resizeDoneTimer = setTimeout(stopResizeWatching, 250);
        });
    },
    /**
     * Add @EventListener('key')
     * Add @EventListener('key', 'Escape')
     *
     * This will allow components to listen for global key press events
     * For a full list of possible keys see:
     * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
     */
    key: function (eventRegistry, namespace) {
        window.addEventListener("keydown", function (event) {
            var components = getComponentsInEventRegistry(eventRegistry, namespace);
            var handlerResults = [];
            components.forEach(function (component) {
                var gondelComponentHandlers = Object.keys(eventRegistry[component._componentName]).forEach(function (selector) {
                    if (selector === "" || event.key === selector) {
                        eventRegistry[component._componentName][selector].forEach(function (handlerOption) {
                            handlerResults.push(component[handlerOption.handlerName].call(component, event));
                        });
                    }
                });
            });
            handlerResults.forEach(function (handlerResult) {
                if (typeof handlerResult === "function") {
                    handlerResult();
                }
            });
        });
    },
    /**
     * Add @EventListener('swipe-left')
     *
     * This will allow components to listen for mouse swipe events
     */
    "swipe-left": function (eventRegistry, namespace) {
        document.documentElement.addEventListener("mousedown", function (mouseDownEvent) {
            var handlers = getHandlers("data-" + namespace + "-name", eventRegistry, mouseDownEvent.target);
            var latestMouseMoveEvent;
            var frameListernerId;
            if (handlers.length === 0) {
                return;
            }
            mouseDownEvent.preventDefault();
            function handleMouseMove(mouseMoveEvent) {
                latestMouseMoveEvent = mouseMoveEvent;
                mouseMoveEvent.preventDefault();
                if (!frameListernerId) {
                    frameListernerId = requestAnimationFrame(handleMouseMoveThrottled);
                }
            }
            function handleMouseMoveThrottled() {
                frameListernerId = undefined;
                var deltaX = latestMouseMoveEvent.x - mouseDownEvent.x;
                if (deltaX < -100) {
                    executeHandlers(handlers, latestMouseMoveEvent, namespace);
                    stopMouseMoveTracking();
                }
            }
            function stopMouseMoveTracking() {
                document.documentElement.removeEventListener("mousemove", handleMouseMove);
                document.documentElement.removeEventListener("mouseup", handleMouseUp);
                if (frameListernerId) {
                    cancelAnimationFrame(frameListernerId);
                }
            }
            function handleMouseUp(mouseMoveUpEvent) {
                mouseMoveUpEvent.preventDefault();
                stopMouseMoveTracking();
            }
            document.documentElement.addEventListener("mousemove", handleMouseMove);
            document.documentElement.addEventListener("mouseup", handleMouseUp);
        });
    },
    /**
     * Add @EventListener('swipe-right')
     *
     * This will allow components to listen for mouse swipe events
     */
    "swipe-right": function (eventRegistry, namespace) {
        document.documentElement.addEventListener("mousedown", function (mouseDownEvent) {
            var handlers = getHandlers("data-" + namespace + "-name", eventRegistry, mouseDownEvent.target);
            var latestMouseMoveEvent;
            var frameListernerId;
            if (handlers.length === 0) {
                return;
            }
            mouseDownEvent.preventDefault();
            function handleMouseMove(mouseMoveEvent) {
                latestMouseMoveEvent = mouseMoveEvent;
                mouseMoveEvent.preventDefault();
                if (!frameListernerId) {
                    frameListernerId = requestAnimationFrame(handleMouseMoveThrottled);
                }
            }
            function handleMouseMoveThrottled() {
                frameListernerId = undefined;
                var deltaX = latestMouseMoveEvent.x - mouseDownEvent.x;
                if (deltaX > 100) {
                    executeHandlers(handlers, latestMouseMoveEvent, namespace);
                    stopMouseMoveTracking();
                }
            }
            function stopMouseMoveTracking() {
                document.documentElement.removeEventListener("mousemove", handleMouseMove);
                document.documentElement.removeEventListener("mouseup", handleMouseUp);
                if (frameListernerId) {
                    cancelAnimationFrame(frameListernerId);
                }
            }
            function handleMouseUp(mouseMoveUpEvent) {
                mouseMoveUpEvent.preventDefault();
                stopMouseMoveTracking();
            }
            document.documentElement.addEventListener("mousemove", handleMouseMove);
            document.documentElement.addEventListener("mouseup", handleMouseUp);
        });
    }
};
export function initEventPlugin() {
    addGondelPluginEventListener("Events", "registerEvent", function addResizeEvent(isNativeEvent, _a, resolve) {
        var eventName = _a.eventName, namespace = _a.namespace, eventRegistry = _a.eventRegistry;
        if (customEvents[eventName]) {
            customEvents[eventName](eventRegistry, namespace);
            // Tell the event system that it should not listen for the event:
            resolve(false);
        }
        else {
            resolve(isNativeEvent);
        }
    });
    addGondelPluginEventListener("Events", "sync", function addResizeEvent(components, data, resolve) {
        setTimeout(function () {
            components.forEach(function (component) {
                component.__resizeSize = {
                    width: component._ctx.clientWidth,
                    height: component._ctx.clientHeight
                };
            });
        });
        resolve(components);
    });
}
//# sourceMappingURL=index.js.map