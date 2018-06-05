/**
 * This is a plugin to initialize enquire.js and fire a viewportChange event when triggering a breakpoint
 */
import { addGondelPluginEventListener, getComponentByDomNode, GondelComponent } from "@gondel/core";
import { INamespacedEventHandlerRegistry } from "@gondel/core/dist/GondelEventRegistry";
import * as enquire from "enquire.js";

let currentViewport: string;

/**
 * This function returns all components for the given eventRegistry which can be found in the dom.
 */
function getComponentsInEventRegistry(
  eventRegistry: INamespacedEventHandlerRegistry,
  namespace: string
): GondelComponent[] {
  const selector = Object.keys(eventRegistry)
    .map(componentName => `[data-${namespace}-name="${componentName}"]`)
    .join(",");
  if (!selector) {
    return [];
  }
  const componentElements = document.documentElement.querySelectorAll(selector);
  const components: GondelComponent[] = [];
  for (let i = 0; i < componentElements.length; i++) {
    const component = getComponentByDomNode(componentElements[i], namespace);
    if (component) {
      components.push(component);
    }
  }
  return components;
}

/**
 * This function fire's a custom gondel event to all registered components
 */
function fireViewportChangeEvent(
  viewport: string,
  eventRegistry: INamespacedEventHandlerRegistry,
  namespace: string
) {
  const components = getComponentsInEventRegistry(eventRegistry, namespace);
  const handlerResults: Array<() => void | undefined> = [];

  components.forEach(component => {
    Object.keys(eventRegistry[component._componentName]).forEach(selector => {
      if (selector === "" || viewport === selector) {
        eventRegistry[component._componentName][selector].forEach(handlerOption => {
          handlerResults.push(
            (component as any)[handlerOption.handlerName].call(component, { viewport })
          );
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
function px2em(pixelValue: number) {
  return (
    Math.round(pixelValue / 16 * 100) / 100 + "em" // add unit as string
  );
}

/**
 * This function generate mediaQueries from breakPoints
 */
function generateMediaQueries(breakPoints: { [key: string]: number }) {
  const breakpointNames = Object.keys(breakPoints).sort((breakpointNameA, breakpointNameB) => {
    if (breakPoints[breakpointNameA] > breakPoints[breakpointNameB]) {
      return 1;
    }
    if (breakPoints[breakpointNameA] < breakPoints[breakpointNameB]) {
      return -1;
    }
    return 0;
  });
  return breakpointNames.map((breakpointName, i) => {
    const max = breakPoints[breakpointName] === Infinity ? undefined : breakPoints[breakpointName];
    const min =
      breakpointNames[i - 1] === undefined ? undefined : breakPoints[breakpointNames[i - 1]] + 1;

    let queryString;

    if (min && max) {
      queryString = `(min-width: ${px2em(min)}) and (max-width: ${px2em(max)})`;
    } else if (min) {
      queryString = `(min-width: ${px2em(min)})`;
    } else if (max) {
      queryString = `(max-width: ${px2em(max)})`;
    } else {
      throw new Error("The smallest provided viewport must not be set to Infinity");
    }

    return { name: breakpointName, query: queryString, min, max };
  });
}

/**
 * This function set's up enquire.js
 */
function setupViewportChangeEvent(
  breakPoints: { [breakPointName: string]: number },
  eventRegistry: INamespacedEventHandlerRegistry,
  namespace: string
) {
  const mediaQueries = generateMediaQueries(breakPoints);

  for (const viewport of mediaQueries) {
    enquire.register(viewport.query, {
      setup: () => {
        currentViewport = viewport.name;
      },
      match: () => {
        currentViewport = viewport.name;
        fireViewportChangeEvent(viewport.name, eventRegistry, namespace);
      },
      // trigger setup the first time a viewport is actually entered
      deferSetup: true
    });
  }
}

/**
 * This function creates a custom gondel event
 */
export default function initMediaQueries(breakPoints: { [breakPointName: string]: number }) {
  addGondelPluginEventListener("registerEvent", function addViewportChangeEvent(
    isNativeEvent,
    { eventName, namespace, eventRegistry },
    resolve
  ) {
    if (eventName === "viewportChange") {
      setupViewportChangeEvent(breakPoints, eventRegistry, namespace);

      // Tell the event system that it should not listen for the event:
      resolve(false);
    } else {
      resolve(isNativeEvent);
    }
  });
}
