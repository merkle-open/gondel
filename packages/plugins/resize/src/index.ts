/**
 * This is a gondel plugin which add a custom gondel resize event
 */
import { addGondelPluginEventListener, getComponentByDomNode, GondelComponent } from "@gondel/core";
import { INamespacedEventHandlerRegistry } from "@gondel/core/dist/GondelEventRegistry";

/**
 * This function returns all components for the given eventRegistry which can be found in the dom.
 */
function getComponentsInEventRegistry(
  eventRegistry: INamespacedEventHandlerRegistry,
  namespace: string
): Array<GondelComponent> {
  const selector = Object.keys(eventRegistry)
    .map(componentName => `[data-${namespace}-name="${componentName}"]`)
    .join(",");
  if (!selector) {
    return [];
  }
  const componentElements = document.documentElement.querySelectorAll(selector);
  const components: Array<GondelComponent> = [];
  for (let i = 0; i < componentElements.length; i++) {
    const component = getComponentByDomNode(componentElements[i], namespace);
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
const resize = (eventRegistry: INamespacedEventHandlerRegistry, namespace: string) => {
  let isRunning = false;
  let frameIsRequested = false;
  let resizeDoneTimer: any;
  let componentInformation:
    | Array<{
        component: GondelComponent;
        node: Element;
        selectors: Array<Array<Function>>;
        width: number;
        height: number;
      }>
    | undefined;
  /**
   * This handler is called if a new resize event happens.
   * A resize event is new if no resize occured for 250ms
   */
  function startResizeWatching(event: UIEvent) {
    const components = getComponentsInEventRegistry(eventRegistry, namespace);
    isRunning = true;
    // The resize listener is fired very often
    // for performance optimisations we search and store
    // all components during the initial start event
    componentInformation = components.map(component => {
      const size = (component as any).__resizeSize || {
        width: 0,
        height: 0
      };
      const gondelComponentHandlers = eventRegistry[component._componentName];
      return {
        component: component,
        node: component._ctx,
        selectors: Object.keys(gondelComponentHandlers).map(selector =>
          gondelComponentHandlers[selector].map(
            handlerOption => (component as any)[handlerOption.handlerName]
          )
        ),
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
  function fireResizeEvent(event: UIEvent) {
    frameIsRequested = false;
    if (!componentInformation) {
      return;
    }
    const newSizes = componentInformation.map(({ node }) => ({
      width: node.clientWidth,
      height: node.clientHeight
    }));
    const handlerResults: Array<() => void | undefined> = [];
    componentInformation.forEach((componentInformation, i) => {
      const newSize = newSizes[i];
      // Skip if the size did not change
      if (
        newSize.width === componentInformation.width &&
        newSize.height === componentInformation.height
      ) {
        return;
      }
      // Skip if the component is not running anymore
      if (componentInformation.component._stopped) {
        return;
      }
      (componentInformation.component as any).__resizeSize = newSize;
      componentInformation.width = newSize.width;
      componentInformation.height = newSize.height;
      componentInformation.selectors.forEach(selector =>
        selector.forEach(handler =>
          handlerResults.push(handler.call(componentInformation.component, event, newSize))
        )
      );
    });
    handlerResults.forEach(handlerResult => {
      if (typeof handlerResult === "function") {
        handlerResult();
      }
    });
  }
  window.addEventListener("resize", (event: UIEvent) => {
    if (!isRunning) {
      startResizeWatching(event);
    } else if (!frameIsRequested) {
      frameIsRequested = true;
      window.requestAnimationFrame(fireResizeEvent.bind(null, event));
    }
    clearTimeout(resizeDoneTimer);
    resizeDoneTimer = setTimeout(stopResizeWatching, 250);
  });
};

/**
 * The VIEWPORT_ENTERED will be fired if a new viewport is entered
 */
export const WINDOW_RESIZED = "@gondel/plugin-resize--window-resized";
/**
 * This function creates a custom gondel event
 */
export function initResizePlugin() {
  addGondelPluginEventListener("registerEvent", function addResizeEvent(
    isNativeEvent,
    { eventName, namespace, eventRegistry },
    resolve
  ) {
    // Ignore all events but the resize event
    if (eventName !== WINDOW_RESIZED) {
      resolve(isNativeEvent);
      return;
    }

    resize(eventRegistry, namespace);

    // Tell the event system that it should not listen for the event:
    resolve(false);
  });

  addGondelPluginEventListener("sync", function addResizeEvent(
    components: Array<GondelComponent>,
    data,
    resolve
  ) {
    setTimeout(() => {
      components.forEach(component => {
        (component as any).__resizeSize = {
          width: component._ctx.clientWidth,
          height: component._ctx.clientHeight
        };
      });
    });
    resolve(components);
  });
}
