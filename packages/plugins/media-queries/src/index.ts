/**
 * This is a plugin to initialize enquire.js and fire a viewportChange event when triggering a breakpoint
 */
import { addGondelPluginEventListener, getComponentByDomNode, GondelComponent } from "@gondel/core";
import { INamespacedEventHandlerRegistry } from "@gondel/core/dist/GondelEventRegistry";

/**
 * The VIEWPORT_ENTERED will be fired if a new viewport is entered
 */
export const VIEWPORT_ENTERED = "@gondel/plugin-media-queries--viewport-entered";

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
  handlerResults.forEach(handlerResults => () => {
    if (typeof handlerResults === "function") {
      handlerResults();
    }
  });
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
function convertBreakpointsToEm<T extends { [key: string]: number }>(breakpointsInPx: T): T {
  const breakpointsInEm: { [key: string]: number } = {};
  const breakpointNames = Object.keys(breakpointsInPx);
  breakpointNames.forEach(breakpointName => {
    breakpointsInEm[breakpointName] = px2em(breakpointsInPx[breakpointName]);
  });
  return breakpointsInEm as T;
}

/**
 * Convert pixel to em
 */
function px2em(pixelValue: number) {
  return Math.round((pixelValue / 16) * 100) / 1000;
}

/**
 * This function generate mediaQueries from breakPoints
 */
function generateMediaQueries(breakPoints: { [key: string]: number }, unit: "em" | "px") {
  // Sort breakpoints by size
  const breakpointNames = Object.keys(breakPoints).sort((breakpointNameA, breakpointNameB) => {
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
  return breakpointNames.map((breakpointName, i) => {
    // If this is the first breakpoint we don't need a min value
    const min =
      breakpointNames[i - 1] === undefined ? undefined : breakPoints[breakpointNames[i - 1]] + 1;
    // If this is the last breakpoint we don't need a max value
    const max = breakPoints[breakpointName] === Infinity ? undefined : breakPoints[breakpointName];

    let queryString;
    if (min && max) {
      queryString = `(min-width: ${min}${unit}) and (max-width: ${max}${unit})`;
    } else if (min) {
      queryString = `(min-width: ${min}${unit})`;
    } else if (max) {
      queryString = `(max-width: ${max}${unit})`;
    } else {
      // This should only happen if the user did a miss configuration
      // with only a single breakpoint which is set to infinity
      throw new Error("The smallest provided viewport must not be set to Infinity");
    }

    return { name: breakpointName, query: queryString, min, max };
  });
}

/**
 * Use enquire.js to listen for viewport changes
 * Once a viewport changed call all gondel plugins which are listening
 */
function setupViewportChangeEvent(
  mediaQueries: Array<{ name: string; query: string }>,
  eventRegistry: INamespacedEventHandlerRegistry,
  namespace: string
) {
  for (const viewport of mediaQueries) {
    matchMedia(viewport.query).addListener(mediaQueryList => {
      if (mediaQueryList.matches) {
        fireViewportChangeEvent(viewport.name, eventRegistry, namespace);
      }
    });
  }
}

/**
 * Use enquire.js to listen for viewport changes
 * for the getCurrentViewport helper method
 */
function setupCurrentViewportHelper(mediaQueries: Array<{ name: string; query: string }>) {
  for (const viewport of mediaQueries) {
    const viewportMediaQueryList = matchMedia(viewport.query);
    // Set initial viewport
    if (viewportMediaQueryList.matches) {
      currentViewport = viewport.name;
    }
    // Watch for media query changes
    viewportMediaQueryList.addListener(mediaQueryList => {
      if (mediaQueryList.matches) {
        currentViewport = viewport.name;
      }
    });
  }
}

export type MediaQueryPluginOptions = {
  /**
   * List all breakpoints as a key value pair.
   * The value will represent the max size of the breakpoint.
   * The last breakpoint should always be set to Infinity:
   *
   * {
   *   xxsmall: 480,     // for screen width 0-480
   *   xsmall: 768,      // for screen width 481-768
   *   small: 992,       // for screen width 769-992
   *   medium: 1240,     // for screen width 993-1240
   *   large: 1440,      // for screen width 1241-1441
   *   xlarge: Infinity, // for screen width 1441-Infinity
   * }
   */
  breakPoints: {
    [breakPointName: string]: number;
  };
  /**
   * The unit which is used - default: 'px'
   */
  unit?: "px" | "em";
  /**
   * Activates a conversion from px - default: false
   */
  convertToEm?: boolean;
};

/**
 * This function creates a custom gondel event
 */
export function initMediaQueriesPlugin(options: MediaQueryPluginOptions) {
  // Get the converted breakpoint values
  const breakPoints = options.convertToEm
    ? convertBreakpointsToEm(options.breakPoints)
    : options.breakPoints;
  // Get the unit
  const unit = options.unit || (options.convertToEm ? "em" : "px");
  const mediaQueries = generateMediaQueries(breakPoints, unit);
  // Setup the viewport helper independently so it will
  // also be avialiable if no component is listening to events:
  setupCurrentViewportHelper(mediaQueries);

  addGondelPluginEventListener("registerEvent", function addViewportChangeEvent(
    isNativeEvent,
    { eventName, namespace, eventRegistry },
    resolve
  ) {
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
