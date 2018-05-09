/**
 * The event registry provides a way to bind events ahead of time
 * with a very small foot print during launch to improve the time to interaction
 */

import { getComponentByDomNode } from "./GondelDomUtils";
import { fireGondelPluginEvent } from "./GondelPluginUtils";

/**
 * Only real browser events are supported.
 * Unfortunately focus and blur do not bubble so a special mapping is needed.
 */
const eventNameMapping = {
  focus: "focusin",
  blur: "focusout"
};

export type IEventHandlerRegistry = {
  [namespace: string]: INamespacedEventHandlerRegistry;
};

export type INamespacedEventHandlerRegistry = {
  [gondelComponentName: string]: {
    [selector: string]: Array<IHandlerOption>;
  };
};

export type IHandlerOption = {
  selector?: string;
  handlerName: string;
};

const domEventRegistry: {
  [eventName: string]: IEventHandlerRegistry;
} =
  (window as any).__gondelDomEvents || {};
(window as any).__gondelDomEvents = domEventRegistry;

/* istanbul ignore next : Browser polyfill can't be tested */
const matches =
  Element.prototype.matches ||
  (Element as any).prototype.matchesSelector ||
  (Element as any).prototype.mozMatchesSelector ||
  (Element as any).prototype.msMatchesSelector ||
  (Element as any).prototype.oMatchesSelector ||
  (Element as any).prototype.webkitMatchesSelector;

function getParentElements(startElement: HTMLElement): Array<HTMLElement> {
  const nodes = [];
  for (let element: HTMLElement | null = startElement; element; element = element.parentElement) {
    nodes.push(element);
  }
  return nodes;
}

/**
 * Returns an array of all handlers which would apply for the current target
 */
export function getHandlers(
  attributeName: string,
  eventHandlerRegistry: INamespacedEventHandlerRegistry,
  target: HTMLElement
): Array<{ ctx: HTMLElement; handlerOptions: Array<IHandlerOption> }> {
  const parents = getParentElements(target);
  // Find all selectors which have been registred for this event type
  // and which have a gondel component in one of the parrent nodes
  const selectorsOfFoundComponents: Array<{
    index: number;
    handlers: { [selector: string]: Array<IHandlerOption> };
  }> = [];
  parents.forEach((parent, i) => {
    const componentName = parent.getAttribute(attributeName);
    const handlers = componentName && eventHandlerRegistry[componentName];
    if (handlers) {
      // Store the index where the component was found to know in which part
      // of the dom tree the selectors could be found
      selectorsOfFoundComponents.push({ index: i, handlers });
    }
  });
  // Iterate over all possible selectors to find out if the current event
  // should fire any gondel handler
  const handlerQueue: Array<{
    index: number;
    ctx: HTMLElement;
    handlerOptions: Array<IHandlerOption>;
  }> = [];
  selectorsOfFoundComponents.forEach(({ index, handlers }) => {
    const selectorNames = Object.keys(handlers);
    selectorNames.forEach((selectorName): any => {
      // If no selector is given the handler does always match
      if (!selectorName) {
        return handlerQueue.push({
          index,
          ctx: parents[index],
          handlerOptions: handlers[selectorName]
        });
      }
      // Iterate backwards over the children of the component to find an element
      // which matches the selector for the current handler
      for (let i = index; --i >= 0; ) {
        if (matches.call(parents[i], selectorName)) {
          return handlerQueue.push({
            index: i,
            ctx: parents[index],
            handlerOptions: handlers[selectorName]
          });
        }
      }
    });
  });
  // Break if we couldn't find any matching element
  if (handlerQueue.length === 0) {
    return [];
  }
  // Sort the queue so events which are further up the dom are fired first
  handlerQueue.sort(
    (handlerA, handlerB) =>
      handlerA.index > handlerB.index ? 1 : handlerA.index === handlerB.index ? 0 : -1
  );
  return handlerQueue;
}

/**
 * The handler which will catch every event at the documentElement
 */
function handleEvent(
  namespace: string,
  attributeName: string,
  eventHandlerRegistry: INamespacedEventHandlerRegistry,
  event: Event
) {
  const target = event.target as HTMLElement;
  const handlers = getHandlers(attributeName, eventHandlerRegistry, target);
  executeHandlers(handlers, event, namespace);
}

/**
 * Returns the namespace registry for the given namespace..
 * This function must be used only by core or plugins
 */
export function getEventRegistry(namespace: string) {
  if (!domEventRegistry[namespace]) {
    domEventRegistry[namespace] = {};
  }
  return domEventRegistry[namespace];
}

/**
 * Notify components
 * This function must be used by core or only by plugins
 */
export function executeHandlers(
  handlers: Array<{ ctx: HTMLElement; handlerOptions: Array<IHandlerOption> }>,
  event: Event,
  namespace: string
) {
  const results = [];
  for (let i = 0; i < handlers.length && !event.cancelBubble; i++) {
    const handlerObject = handlers[i];
    const handlerOptions = handlerObject.handlerOptions;
    const gondelComponent = getComponentByDomNode(handlerObject.ctx, namespace);
    // Skip if the component wasn't started or if it was stopped
    if (gondelComponent) {
      for (let j = 0; j < handlerOptions.length && !event.cancelBubble; j++) {
        const handlerResult = (gondelComponent as any)[handlerOptions[j].handlerName].call(
          gondelComponent,
          event
        );
        if (typeof handlerResult === "function") {
          results.push(handlerResult);
        }
      }
    }
  }
  // Execute all callbacks to allow grouping write events
  results.forEach(result => {
    result();
  });
}

/**
 * Add a event lister to the <html> element
 * The listener will always call handleEvent with the domEventRegistry for the given event
 */
function startListeningForEvent(eventName: string, namespace: string) {
  document.documentElement.addEventListener(
    (eventNameMapping as { [key: string]: string })[eventName] || eventName,
    handleEvent.bind(
      null,
      namespace,
      `data-${namespace}-name`,
      domEventRegistry[namespace][eventName]
    )
  );
}

/**
 * Add an event to the Gondel EventRegistry
 */
export function addRootEventListener(
  namespace: string,
  domEventName: string,
  gondelComponentName: string,
  handlerName: string,
  handlerOption?: string | { selector?: string }
) {
  // Create namespace if neededi
  const namespacedDomEventRegistry = getEventRegistry(namespace);
  // Notify all plugins to allow taking over the event handling for a specific event name
  // This notification is only triggered if a event name e.g. 'click' is used for the first time
  if (!namespacedDomEventRegistry[domEventName]) {
    namespacedDomEventRegistry[domEventName] = {};
    fireGondelPluginEvent(
      "registerEvent",
      true,
      {
        eventName: domEventName,
        namespace,
        eventRegistry: namespacedDomEventRegistry[domEventName]
      },
      function(isNativeEvent) {
        // If no plugin registered the event
        // register a native browser event
        if (isNativeEvent) {
          startListeningForEvent(domEventName, namespace);
        }
      }
    );
  }
  if (!namespacedDomEventRegistry[domEventName][gondelComponentName]) {
    namespacedDomEventRegistry[domEventName][gondelComponentName] = {};
  }
  const handlerOptionObject =
    typeof handlerOption === "object" ? handlerOption : { selector: handlerOption };
  const selectorKey = handlerOptionObject.selector || "";
  if (!namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey]) {
    namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey] = [];
  }
  namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey].push(
    Object.assign({ handlerName, handlerOption })
  );
}

/**
 * Remove an event from the Gondel EventRegistry
 */
export function removeRootEventListener(
  namespace: string,
  domEventName: string,
  gondelComponentName: string,
  handlerName: string,
  selector?: string
) {
  const selectorKey = selector || "";
  const namespacedDomEventRegistry = getEventRegistry(namespace);
  if (
    namespacedDomEventRegistry[domEventName] &&
    namespacedDomEventRegistry[domEventName][gondelComponentName] &&
    namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey]
  ) {
    namespacedDomEventRegistry[domEventName][gondelComponentName][
      selectorKey
    ] = namespacedDomEventRegistry[domEventName][gondelComponentName][selectorKey].filter(
      handlerOption => {
        return handlerOption.handlerName !== handlerName || handlerName === undefined;
      }
    );
  }
}

/**
 * Remove all events for a given Component (e.g. a Button) from the Gondel EventRegistry
 */
export function removeRootEventListernerForComponent(
  namespace: string,
  gondelComponentName: string
) {
  const namespacedDomEventRegistry = getEventRegistry(namespace);
  for (const eventName in namespacedDomEventRegistry) {
    /* istanbul ignore else: for in savety check */
    if (namespacedDomEventRegistry.hasOwnProperty(eventName)) {
      delete namespacedDomEventRegistry[eventName][gondelComponentName];
    }
  }
}
