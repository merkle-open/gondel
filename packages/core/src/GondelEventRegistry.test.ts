import { GondelBaseComponent } from './GondelComponent';
import {
	addRootEventListener,
	getEventRegistry,
	removeRootEventListener,
	removeRootEventListernerForComponent,
} from './GondelEventRegistry';
import { getComponentByDomNode, registerComponent, startComponents, stopComponents, triggerPublicEvent } from './index';

describe('GondelEventRegistry', () => {
	const domEventRegistryG = getEventRegistry('g');

	describe('#addRootEventListener - e2e', () => {
		class Button extends GondelBaseComponent {
			eventCount: number = 0;
			eventHistory: Array<string> = [];
			eventTargetHistory: Array<EventTarget | null> = [];

			_handleEvent(event: Event) {
				this.eventCount++;
				this.eventHistory.push('_handleEvent');
				this.eventTargetHistory.push(event.currentTarget);
			}
			_handleAnotherEvent(event: Event) {
				this.eventHistory.push('_handleAnotherEvent');
				this.eventTargetHistory.push(event.currentTarget);
				return () => {
					this.eventCount++;
					this.eventHistory.push('_handleAnotherEventPostHandler');
				};
			}
		}

		let buttonElement: HTMLDivElement;
		let buttonComponent: Button;
		beforeEach(() => {
			registerComponent('Button', Button);
			buttonElement = document.createElement('div');
			buttonElement.innerHTML = `
        <span class='child'>
          <span class='grand-child'>Click me</span>
        </span>
        <span class='sibling'>
        </span>
      `;
			buttonElement.setAttribute('data-g-name', 'Button');
			document.documentElement.appendChild(buttonElement);
			startComponents(buttonElement);
			buttonComponent = getComponentByDomNode(buttonElement) as Button;
		});

		afterEach(() => {
			removeRootEventListernerForComponent('g', 'Button');
			stopComponents(buttonElement);
			document.documentElement.removeChild(buttonElement);
		});

		it('should not catch events if event target is neither self nor child', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			document.documentElement.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(0);
		});

		it('should catch events on the element', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should catch events on a child element', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent', '.child');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.querySelector('.child')!.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should catch bubbling events from a child element', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.querySelector('.child')!.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should catch bubbling events from a grand child element', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.querySelector('.grand-child')!.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should foward bubbling events from a grand child to a child element', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent', '.child');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.querySelector('.grand-child')!.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should overwrite the currentTarget', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.querySelector('.grand-child')!.dispatchEvent(event);
			// Verify that the eventTarget is the Button instead of .grand-child or html
			expect(buttonComponent.eventTargetHistory).toEqual([buttonElement]);
		});

		it('should overwrite the currentTarget when forwarding parent events', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent', '.child');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.querySelector('.grand-child')!.dispatchEvent(event);
			// Verify that the eventTarget is .child instead of .grand-child or html
			const child = buttonElement.querySelector('.child');
			expect(buttonComponent.eventTargetHistory).toEqual([child]);
		});

		it('should not forward events from ctx to a child element', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent', { selector: '.child' });
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(0);
		});

		it('should not forward events from a sibling to a child element', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent', { selector: '.child' });
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			buttonElement.querySelector('.sibling')!.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(0);
		});

		it('should allow to group read and writes', () => {
			addRootEventListener('g', 'click', 'Button', '_handleAnotherEvent');
			// Fire event
			const clickEvent = document.createEvent('Event');
			clickEvent.initEvent('click', true, true);
			buttonElement.dispatchEvent(clickEvent);
			removeRootEventListener('g', 'click', 'Button', '_handleAnotherEvent');
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should catch focus events from focusin', () => {
			addRootEventListener('g', 'focus', 'Button', '_handleEvent');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('focusin', true, true);
			buttonElement.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should catch blur events from focusout', () => {
			addRootEventListener('g', 'blur', 'Button', '_handleEvent');
			// Fire event
			const event = document.createEvent('Event');
			event.initEvent('focusout', true, true);
			buttonElement.dispatchEvent(event);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should catch public events', () => {
			addRootEventListener('g', 'gCustomEvent', 'Button', '_handleEvent');
			// Fire event
			triggerPublicEvent('gCustomEvent', buttonComponent, buttonElement.querySelector('.child')!, {});
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should throw on unprefixed public events', () => {
			// Fire event
			let errorMessage;
			try {
				triggerPublicEvent('CustomEvent', buttonComponent, buttonElement.querySelector('.child')!, {});
			} catch (error) {
				errorMessage = error.toString();
			}
			// Count events catched:
			expect(errorMessage).toEqual("Error: Invalid event name 'CustomEvent' - use 'gCustomEvent'");
		});

		it('should catch public events', () => {
			addRootEventListener('g', 'gCustomEvent', 'Button', '_handleEvent');
			// Fire event
			triggerPublicEvent('gCustomEvent', buttonComponent);
			removeRootEventListener('g', 'gCustomEvent', 'Button', '_handleEvent');
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(1);
		});

		it('should allow using the same handler for multiple events', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			addRootEventListener('g', 'dblclick', 'Button', '_handleEvent');
			// Fire event
			const clickEvent = document.createEvent('Event');
			clickEvent.initEvent('click', true, true);
			buttonElement.dispatchEvent(clickEvent);
			// Fire event
			const dblClickEvent = document.createEvent('Event');
			dblClickEvent.initEvent('dblclick', true, true);
			buttonElement.dispatchEvent(dblClickEvent);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(2);
		});

		it('should allow using different handler for the same event', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			addRootEventListener('g', 'click', 'Button', '_handleAnotherEvent');
			// Fire event
			const clickEvent = document.createEvent('Event');
			clickEvent.initEvent('click', true, true);
			buttonElement.dispatchEvent(clickEvent);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(2);
		});

		it('should call the handler for child and parent', () => {
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			addRootEventListener('g', 'click', 'Button', '_handleAnotherEvent', '.child');
			// Fire event
			const clickEvent = document.createEvent('Event');
			clickEvent.initEvent('click', true, true);
			buttonElement.querySelector('.child')!.dispatchEvent(clickEvent);
			// Count events catched:
			expect(buttonComponent.eventCount).toEqual(2);
		});

		it('should call the handler for the child before parent', () => {
			addRootEventListener('g', 'click', 'Button', '_handleAnotherEvent', '.child');
			addRootEventListener('g', 'click', 'Button', '_handleEvent');
			// Fire event
			const clickEvent = document.createEvent('Event');
			clickEvent.initEvent('click', true, true);
			buttonElement.querySelector('.child')!.dispatchEvent(clickEvent);
			// Count events catched:
			expect(buttonComponent.eventHistory).toEqual([
				'_handleAnotherEvent',
				'_handleEvent',
				'_handleAnotherEventPostHandler',
			]);
		});
	});

	describe('#removeRootEventListernerForComponent', () => {
		it('should catch public events', () => {
			addRootEventListener('g', 'DemoEvent', 'Button', '_handleEvent');
			removeRootEventListernerForComponent('g', 'Button');
			expect(domEventRegistryG.DemoEvent).toEqual({});
		});
	});

	describe('#removeRootEventListener', () => {
		it('should not throw if event was already removed', () => {
			addRootEventListener('g', 'RemoveTwiceDemoEvent', 'Button', '_handleEvent');
			removeRootEventListener('g', 'RemoveTwiceDemoEvent', 'Button', '_handleEvent');
			removeRootEventListener('g', 'RemoveTwiceDemoEvent', 'Button', '_handleEvent');
		});

		it('should not throw if event name was never registered', () => {
			removeRootEventListener('g', 'RemoveDemoEvent', 'Button', '_handleEvent');
		});
	});
});
