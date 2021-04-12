export declare type IGondelPluginEventName = 'register' | 'unregister' | 'boot' | 'start' | 'sync' | 'stop' | 'registerEvent';
export declare type gondelPluginListener = (result: any, data: any | undefined, next: (result: any) => any) => any;
export declare type gondelPluginFunction = (result: any, data: any | undefined, next: (result: any, data: any, next: gondelPluginFunction) => any) => any;
/** Global Plugin Event Handler Registry */
export declare const pluginEvents: {
    [key: string]: gondelPluginFunction;
};
/**
 * Fire an event which allows gondel plugins to add features to gondel
 */
export declare function fireGondelPluginEvent<T>(eventName: IGondelPluginEventName, initialValue: T, data: any): T;
export declare function fireGondelPluginEvent<T, U>(eventName: IGondelPluginEventName, initialValue: T, data: any, callback: (result: T) => U): U;
/**
 * Fire an async event which allows gondel plugins to add features to gondel
 */
export declare function fireAsyncGondelPluginEvent<T>(eventName: IGondelPluginEventName, initialValue: T, data: any): Promise<T>;
/**
 * Allow plugins to hook into the gondel event system
 */
export declare function addGondelPluginEventListener(pluginName: string, eventName: IGondelPluginEventName, eventListenerCallback: gondelPluginListener): void;
