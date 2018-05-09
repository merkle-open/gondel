export declare type IEventHandlerRegistry = {
    [namespace: string]: INamespacedEventHandlerRegistry;
};
export declare type INamespacedEventHandlerRegistry = {
    [gondelComponentName: string]: {
        [selector: string]: Array<IHandlerOption>;
    };
};
export declare type IHandlerOption = {
    selector?: string;
    handlerName: string;
};
/**
 * Returns an array of all handlers which would apply for the current target
 */
export declare function getHandlers(attributeName: string, eventHandlerRegistry: INamespacedEventHandlerRegistry, target: HTMLElement): Array<{
    ctx: HTMLElement;
    handlerOptions: Array<IHandlerOption>;
}>;
/**
 * Returns the namespace registry for the given namespace..
 * This function must be used only by core or plugins
 */
export declare function getEventRegistry(namespace: string): IEventHandlerRegistry;
/**
 * Notify components
 * This function must be used by core or only by plugins
 */
export declare function executeHandlers(handlers: Array<{
    ctx: HTMLElement;
    handlerOptions: Array<IHandlerOption>;
}>, event: Event, namespace: string): void;
/**
 * Add an event to the Gondel EventRegistry
 */
export declare function addRootEventListener(namespace: string, domEventName: string, gondelComponentName: string, handlerName: string, handlerOption?: string | {
    selector?: string;
}): void;
/**
 * Remove an event from the Gondel EventRegistry
 */
export declare function removeRootEventListener(namespace: string, domEventName: string, gondelComponentName: string, handlerName: string, selector?: string): void;
/**
 * Remove all events for a given Component (e.g. a Button) from the Gondel EventRegistry
 */
export declare function removeRootEventListernerForComponent(namespace: string, gondelComponentName: string): void;
