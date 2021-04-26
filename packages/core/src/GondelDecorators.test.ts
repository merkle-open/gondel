import { startComponents, getComponentByDomNode, Component, EventListener, stopComponents } from './index';

import { GondelBaseComponent } from './GondelComponent';

function createMockElement(namespace: string) {
	const buttonElement = document.createElement('div');
	buttonElement.innerHTML = `
    <span class='child'>
      <span class='grand-child'>Click me</span>
    </span>
    <span class='sibling'>
    </span>
  `;
	buttonElement.setAttribute('data-' + namespace + '-name', 'Button');
	document.documentElement.appendChild(buttonElement);
	startComponents(buttonElement, namespace);
	return getComponentByDomNode(buttonElement, namespace)!;
}

describe('GondelDecorators', () => {
	describe('#component - e2e', () => {
		it("should add the component for the default 'g' namespace", () => {
			@Component('Button')
			class Button extends GondelBaseComponent<HTMLButtonElement> {}
			const button = createMockElement('g');
			stopComponents(button._ctx, 'g');
			expect(button.constructor).toBe(Button);
		});

		it("should add the component for a custom 't' namespace", () => {
			@Component('Button', 't')
			class Button extends GondelBaseComponent {}
			const button = createMockElement('t');
			stopComponents(button._ctx, 't');
			expect(button.constructor).toBe(Button);
		});

		it("should add the component for a custom 'utils' namespace", () => {
			@Component('Button', 'util')
			class Button extends GondelBaseComponent {}
			const button = createMockElement('util');
			stopComponents(button._ctx, 'util');
			expect(button.constructor).toBe(Button);
		});
	});

	describe('#event - e2e', () => {
		it("should add a event listener for the default 'g' namespace", () => {
			@Component('Button')
			class Button extends GondelBaseComponent {
				_wasClicked = false;
				@EventListener('click')
				_handler() {
					this._wasClicked = true;
				}
			}
			const button = createMockElement('g') as Button;
			const clickEvent = new Event('click');
			clickEvent.initEvent('click', true, true);
			button._ctx.dispatchEvent(clickEvent);
			expect(button._wasClicked).toBe(true);
		});

		it("should add a event listener for the custom 't' namespace", () => {
			@Component('Button', 't')
			class Button extends GondelBaseComponent {
				_wasClicked = false;
				@EventListener('click')
				_handler() {
					this._wasClicked = true;
				}
			}
			const button = createMockElement('t') as Button;
			const clickEvent = new Event('click');
			clickEvent.initEvent('click', true, true);
			button._ctx.dispatchEvent(clickEvent);
			expect(button._wasClicked).toBe(true);
		});

		it('should trow an error if a handler does not start with _', () => {
			let errorMessage;
			try {
				@Component('Button')
				class Button extends GondelBaseComponent {
					_wasClicked = false;
					@EventListener('click')
					handler() {
						this._wasClicked = true;
					}
				}
			} catch (err) {
				errorMessage = err.toString();
			}
			expect(errorMessage).toBe("Error: Invalid handler name 'handler' use '_handler' instead.");
		});
	});
});
