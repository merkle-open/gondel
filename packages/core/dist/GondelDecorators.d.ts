import { GondelComponent, IGondelComponent } from './GondelComponent';
export declare function Component(componentName: string, namespace?: string): <TGondelComponent extends IGondelComponent<any>>(constructor: TGondelComponent) => void;
declare type EventOption = [
    string,
    string,
    string | object | undefined
];
/**
 * The @EventListener decorator will add all event names to a static variable
 */
export declare function EventListener(eventName: string, selector?: string | object): <T extends {
    __events?: EventOption[] | undefined;
} & GondelComponent<HTMLElement>>(target: T, handler: string) => void;
export {};
