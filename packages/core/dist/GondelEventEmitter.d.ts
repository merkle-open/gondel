import { GondelComponent } from "./GondelComponent";
import { ArrayLikeHtmlElement } from "./GondelDomUtils";
export interface UxEvent extends Event {
    currentTarget: Element;
    data: {
        component: GondelComponent;
        name: string;
        namespace: string;
        eventData: any;
    };
}
/**
 * Submit an event which might be caught by foreign gondel, angular or react components
 */
export declare function triggerPublicEvent(eventName: string, gondelComponent: GondelComponent, target?: ArrayLikeHtmlElement, eventData?: Object, canBubble?: boolean): boolean;
