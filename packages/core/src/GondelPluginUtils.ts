export type IGondelPluginEventName =
  | "register" // Fired when a component is added to a registry
  | "unregister" // Fired when a component is removed from
  | "boot" // Fired before booting components
  | "start" // Fired before a component is started
  | "sync" // Fired after the components are started
  | "stop" // Fired after a component is stoped
  | "registerEvent"; // Fired after an event is added to the event registry

export type gondelPluginListener = (
  result: any,
  data: any | undefined,
  next: (result: any) => any
) => any;
export type gondelPluginFunction = (
  result: any,
  data: any | undefined,
  next: (result: any, data: any, next: gondelPluginFunction) => any
) => any;
const basePluginListener: gondelPluginListener = (result, data, next) => next(result);

// Global plugin events registry
export const pluginEvents: { [key: string]: gondelPluginFunction } =
  (window as any).__gondelPluginEvents || {};
(window as any).__gondelPluginEvents = pluginEvents;

/**
 * Fire an event which allows gondel plugins to add features to gondel
 */
export function fireGondelPluginEvent<T>(
  eventName: IGondelPluginEventName,
  initialValue: T,
  data: any
): T;
export function fireGondelPluginEvent<T, U>(
  eventName: IGondelPluginEventName,
  initialValue: T,
  data: any,
  callback: (result: T) => U
): U;
export function fireGondelPluginEvent<T, U>(
  eventName: IGondelPluginEventName,
  initialValue: T,
  data: any,
  callback?: (result: T) => U
): U {
  let isSyncron: boolean = false;
  let callbackResult;
  // Execute all bound events for the given name
  // if they exist
  (pluginEvents[eventName] || basePluginListener)(initialValue, data, (processedResult: T) => {
    isSyncron = true;
    callbackResult = callback ? callback(processedResult) : processedResult;
  });
  // Add a guard to prevent asyncron plugin listeners
  // to simplify the usage of fireGondelPluginEvent
  if (!isSyncron) {
    throw new Error("Async plugin listener");
  }
  return callbackResult as any;
}

/**
 * Fire an async event which allows gondel plugins to add features to gondel
 */
export function fireAsyncGondelPluginEvent<T>(
  eventName: IGondelPluginEventName,
  initialValue: T,
  data: any
): Promise<T> {
  return new Promise(resolve => {
    (pluginEvents[eventName] || basePluginListener)(initialValue, data, result => {
      resolve(result);
    });
  });
}

/**
 * Allow plugins to hook into the gondel event system
 */
export function addGondelPluginEventListener(
  eventName: IGondelPluginEventName,
  eventListenerCallback: gondelPluginListener
) {
  if (!pluginEvents[eventName]) {
    pluginEvents[eventName] = basePluginListener as any;
  }
  const previousEventHandler = pluginEvents[eventName];
  pluginEvents[eventName] = function wrapCallback(result, data, next) {
    previousEventHandler(result, data, function callNextPlugin(modifiedResult, _, firstNext) {
      eventListenerCallback(modifiedResult, data, function bindData(result) {
        next(result, data, firstNext);
      });
    });
  };
}
