import {
	GondelBaseComponent,
	startComponents,
	stopComponents,
	getComponentByDomNode,
	Component,
	EventListener,
	disableAutoStart,
} from '@gondel/core';

import { initResizePlugin, WINDOW_RESIZED_EVENT, COMPONENT_RESIZED_EVENT } from './index';

// mock clientWidth and clientHeight, see https://github.com/jsdom/jsdom/issues/2342
Object.defineProperty((window as any).HTMLElement.prototype, 'clientWidth', {
	get: function () {
		return this._jsdomMockClientWidth || 0;
	},
});

Object.defineProperty((window as any).HTMLElement.prototype, 'clientHeight', {
	get: function () {
		return this._jsdomMockClientHeight || 0;
	},
});

function setMockClientWidthAndHeight(component: HTMLElement, width: number, height: number) {
	(component as any)._jsdomMockClientWidth = width;
	(component as any)._jsdomMockClientHeight = height;
}

function resize(width: number, height: number) {
	// Simulate window resize event
	const resizeEvent = document.createEvent('Event');
	resizeEvent.initEvent('resize', true, true);
	(window as any).innerWidth = width || window.innerWidth;
	(window as any).innerHeight = height || window.innerHeight;

	window.dispatchEvent(resizeEvent);
}

@Component('ResizeComponent')
class ResizeComponent extends GondelBaseComponent {
	_windowResizedEventReceived = 0;
	_componentResizedEventReceived = 0;

	public getWindowResizeEventReceived(): number {
		return this._windowResizedEventReceived;
	}

	public getComponentResizeEventReceived(): number {
		return this._componentResizedEventReceived;
	}

	@EventListener(WINDOW_RESIZED_EVENT)
	public _handleWindowResizeEvent() {
		this._windowResizedEventReceived++;
	}
	@EventListener(COMPONENT_RESIZED_EVENT)
	public _handleComponentResizeEvent() {
		this._componentResizedEventReceived++;
	}
}

let gondelDivElement: HTMLDivElement;
let gondelInstance: ResizeComponent;

describe('GondelResizePlugin', () => {
	beforeEach(() => {
		disableAutoStart();

		const mockElementWrapper = document.createElement('div');
		mockElementWrapper.innerHTML = `<div data-g-name="ResizeComponent"><p>This is a container being resized</p></div>`;
		gondelDivElement = mockElementWrapper.firstElementChild as HTMLDivElement;
		document.body.appendChild(gondelDivElement);

		initResizePlugin();
		startComponents(gondelDivElement);

		gondelInstance = getComponentByDomNode(gondelDivElement);
	});

	afterEach(() => {
		stopComponents();
		document.body.innerHTML = '';
	});

	it('should have registered a gondel resize window event', () => {
		expect((window as any)['__🚡DomEvents'].g).toHaveProperty(WINDOW_RESIZED_EVENT);
	});

	it('should have registered a gondel resize component event', () => {
		expect((window as any)['__🚡DomEvents'].g).toHaveProperty(COMPONENT_RESIZED_EVENT);
	});

	it('should receive no window resized event without resize', () => {
		expect(gondelInstance.getWindowResizeEventReceived()).toBe(0);
	});

	it('should receive no component resized event without resize', () => {
		expect(gondelInstance.getComponentResizeEventReceived()).toBe(0);
	});

	it('should receive an window resized event upon resize', async () => {
		resize(1200, 600);
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(gondelInstance.getWindowResizeEventReceived()).toBe(1);
	});

	it('should receive no component resized event when component dimensions did not change', async () => {
		resize(1200, 400);
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(gondelInstance.getComponentResizeEventReceived()).toBe(0);
	});

	it('should receive a component resized event when component dimensions did change', async () => {
		setMockClientWidthAndHeight(gondelDivElement, 1400, 600);
		resize(1400, 600);
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(gondelInstance.getComponentResizeEventReceived()).toBe(1);
	});

	it('should receive two component resize events when firing resize two times', async () => {
		// we need to set the initial dimensions as they are 0 when the resize plugin get's initialized
		setMockClientWidthAndHeight(gondelDivElement, 1400, 600);

		// first resize event get's executed right away
		resize(1400, 600);

		setMockClientWidthAndHeight(gondelDivElement, 1300, 500);

		resize(1300, 500);

		await new Promise((resolve) => setTimeout(resolve, 300));

		expect(gondelInstance.getComponentResizeEventReceived()).toBe(2);
	});

	it('should should throttle more than 2 resize events being fired', async () => {
		// we need to set the initial dimensions as they are 0 when the resize plugin get's initialized
		setMockClientWidthAndHeight(gondelDivElement, 1400, 600);

		// first resize event get's executed right away
		resize(1400, 600);

		setMockClientWidthAndHeight(gondelDivElement, 1300, 500);
		// second resize get's stored for requestAnimationFrame
		resize(1300, 500);

		// further resize events get neglected
		setMockClientWidthAndHeight(gondelDivElement, 1200, 400);
		resize(1200, 400);

		setMockClientWidthAndHeight(gondelDivElement, 1100, 300);
		resize(1100, 300);

		setMockClientWidthAndHeight(gondelDivElement, 1000, 200);
		resize(1000, 200);

		await new Promise((resolve) => setTimeout(resolve, 300));

		expect(gondelInstance.getComponentResizeEventReceived()).toBe(2);
	});

	it('should should reset throttling after requestAnimationFrame time duration', async () => {
		// we need to set the initial dimensions as they are 0 when the resize plugin get's initialized
		setMockClientWidthAndHeight(gondelDivElement, 1400, 600);

		// first resize event get's executed right away
		resize(1400, 600);

		setMockClientWidthAndHeight(gondelDivElement, 1300, 500);
		resize(1300, 500);

		await new Promise((resolve) => setTimeout(resolve, 20));

		setMockClientWidthAndHeight(gondelDivElement, 1200, 400);
		resize(1200, 400);

		await new Promise((resolve) => setTimeout(resolve, 20));

		setMockClientWidthAndHeight(gondelDivElement, 1100, 300);
		resize(1100, 300);

		await new Promise((resolve) => setTimeout(resolve, 20));

		setMockClientWidthAndHeight(gondelDivElement, 1000, 200);
		resize(1000, 200);

		await new Promise((resolve) => setTimeout(resolve, 300));

		expect(gondelInstance.getComponentResizeEventReceived()).toBe(5);
	});

	it('should should reset component information after 250ms time duration', async () => {
		// we need to set the initial dimensions as they are 0 when the resize plugin get's initialized
		setMockClientWidthAndHeight(gondelDivElement, 1400, 600);

		// first resize event get's executed right away
		resize(1400, 600);

		setMockClientWidthAndHeight(gondelDivElement, 1300, 500);
		resize(1300, 500);

		// after 250ms, the resize event is being considered completed and component information get reset
		await new Promise((resolve) => setTimeout(resolve, 500));

		// resetting __resizeSize forces to set width / height to 0 during startResizeWatching and
		// therefore being different than previous dimensions
		(gondelInstance as any).__resizeSize = undefined;

		// next resize event get's treated as fresh resize and therefor also triggers component resize event
		resize(1200, 400);

		await new Promise((resolve) => setTimeout(resolve, 300));

		expect(gondelInstance.getComponentResizeEventReceived()).toBe(3);
	});
});
