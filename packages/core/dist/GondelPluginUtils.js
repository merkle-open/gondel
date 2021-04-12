var basePluginListener = function (result, data, next) { return next(result); };
// Global plugin events registry
var pluginEventRegistry = window.__gondelPluginEvents || { pluginMapping: {}, pluginEvents: {} };
window.__gondelPluginEvents = pluginEventRegistry;
/** Global Plugin Event Handler Registry */
export var pluginEvents = pluginEventRegistry.pluginEvents;
// Mapping to track if plugin was already registered to prevent double registrations
var pluginMapping = pluginEventRegistry.pluginMapping;
export function fireGondelPluginEvent(eventName, initialValue, data, callback) {
    var isSyncron = false;
    var callbackResult;
    // Execute all bound events for the given name
    // if they exist
    (pluginEvents[eventName] || basePluginListener)(initialValue, data, function (processedResult) {
        isSyncron = true;
        callbackResult = callback ? callback(processedResult) : processedResult;
    });
    // Add a guard to prevent asyncron plugin listeners
    // to simplify the usage of fireGondelPluginEvent
    if (!isSyncron) {
        throw new Error('Async plugin listener');
    }
    return callbackResult;
}
/**
 * Fire an async event which allows gondel plugins to add features to gondel
 */
export function fireAsyncGondelPluginEvent(eventName, initialValue, data) {
    return new Promise(function (resolve) {
        (pluginEvents[eventName] || basePluginListener)(initialValue, data, function (result) {
            resolve(result);
        });
    });
}
/**
 * Allow plugins to hook into the gondel event system
 */
export function addGondelPluginEventListener(pluginName, eventName, eventListenerCallback) {
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
//# sourceMappingURL=GondelPluginUtils.js.map