import { GondelComponent } from './GondelComponent';
import { ArrayLikeHtmlElement, getFirstDomNode } from './GondelDomUtils';

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
export function triggerPublicEvent(
	eventName: string,
	gondelComponent: GondelComponent,
	target?: ArrayLikeHtmlElement,
	eventData: Object = {},
	canBubble: boolean = true,
): boolean {
	const event = <UxEvent>document.createEvent('Event');
	const eventTarget = target ? getFirstDomNode(target) : gondelComponent._ctx;
	const namespace = gondelComponent._namespace;
	if (eventName.substr(0, namespace.length) !== namespace) {
		throw new Error(
			"Invalid event name '" +
				eventName +
				"' - use '" +
				namespace +
				eventName.charAt(0).toUpperCase() +
				eventName.slice(1) +
				"'",
		);
	}
	event.initEvent(eventName, canBubble, true);
	event.data = {
		component: gondelComponent,
		name: gondelComponent._componentName,
		namespace: gondelComponent._namespace,
		eventData: eventData,
	};
	return eventTarget.dispatchEvent(event);
}
