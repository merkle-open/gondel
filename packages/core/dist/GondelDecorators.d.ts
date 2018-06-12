import { GondelComponent, IGondelComponentBlueprint } from "./GondelComponent";
/**
 * TODO: Can we deprecate the param componentName in favour of the static field componentName?
 * @param componentName
 * @param namespace
 */
export declare function Component(componentName?: string, namespace?: string): (constructor: IGondelComponentBlueprint) => void;
/**
 * The @EventListener decorator will add all event names to a static variable
 */
export declare function EventListener(eventName: string, selector?: string | object): <T extends {
    __events?: [string, string, string | object | undefined][] | undefined;
} & GondelComponent>(target: T, handler: string) => void;
