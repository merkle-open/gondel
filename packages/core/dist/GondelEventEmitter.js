import { getFirstDomNode } from "./GondelDomUtils";
/**
 * Submit an event which might be caught by foreign gondel, angular or react components
 */
export function triggerPublicEvent(eventName, gondelComponent, target, eventData, canBubble) {
    if (eventData === void 0) { eventData = {}; }
    if (canBubble === void 0) { canBubble = true; }
    var event = document.createEvent("Event");
    var eventTarget = target ? getFirstDomNode(target) : gondelComponent._ctx;
    if (eventName[0] !== gondelComponent._namespace) {
        throw new Error("Invalid event name " + eventName + " (https://git.io/f4Drw)");
    }
    event.initEvent(eventName, canBubble, true);
    event.data = {
        component: gondelComponent,
        name: gondelComponent._componentName,
        namespace: gondelComponent._namespace,
        eventData: eventData
    };
    return eventTarget.dispatchEvent(event);
}
//# sourceMappingURL=GondelEventEmitter.js.map