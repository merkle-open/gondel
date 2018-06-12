import { GondelComponent, IGondelComponent } from "./GondelComponent";
/**
 * Register a gondel component to the registry
 * @param {string} namespace   The gondel components namespace
 */
export declare function Component(componentName?: string, namespace?: string): (constructor: IGondelComponent) => void;
/**
 * The @EventListener decorator will add all event names to a static variable
 */
export declare function EventListener(eventName: string, selector?: string | object): <T extends {
    __events?: [string, string, string | object | undefined][] | undefined;
} & GondelComponent>(target: T, handler: string) => void;
