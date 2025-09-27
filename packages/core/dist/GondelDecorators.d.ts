import { GondelComponent, IGondelComponent } from './GondelComponent';
export declare function Component(componentName: string, namespace?: string): <TGondelComponent extends IGondelComponent<any>>(constructor: TGondelComponent) => void;
type EventOption = [
    string,
    string,
    string | object | undefined
];
/**
 * The @EventListener decorator will add all event names to a static variable
 */
export declare function EventListener(eventName: string, selector?: string | object): <T extends {
    __events?: Array<EventOption>;
} & GondelComponent>(target: T, handler: string) => void;
export {};
