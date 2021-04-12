import { GondelComponentRegistry } from './GondelComponentRegistry';
import { GondelBaseComponent, IGondelComponent } from './GondelComponent';

describe('GondelComponentRegistry', () => {
	let componentInstance: GondelComponentRegistry;
	let gondelComponent: IGondelComponent;
	beforeEach(() => {
		const exampleElement = document.createElement('DIV');
		gondelComponent = class ExampleClass extends GondelBaseComponent {
			_ctx = exampleElement;
		};
		componentInstance = new GondelComponentRegistry();
	});

	describe('#constructor()', () => {
		it('should create a new instance', () => {
			const newInstance = new GondelComponentRegistry();
			expect(newInstance._components).toEqual({});
			expect(newInstance._activeComponents).toEqual({});
		});
	});

	describe('#registerComponent()', () => {
		it('should register a component with a given name', () => {
			const componentName = 'testComponentName';
			componentInstance.registerComponent(componentName, gondelComponent);
			expect(componentInstance._components[componentName]).toBe(gondelComponent);
		});
	});

	describe('#unregisterComponent()', () => {
		it('should delete a component with the passed in name', () => {
			const deleteKey = 'deleteMe';
			componentInstance._components[deleteKey] = gondelComponent;

			componentInstance.unregisterComponent(deleteKey);
			expect(componentInstance._components[deleteKey]).toBeUndefined();
		});

		// TODO: Maybe we should throw here? Not sure.
		it('should handle unregistering when component not found', () => {
			const deleteKey = 'deleteMe';

			expect(() => componentInstance.unregisterComponent(deleteKey)).not.toThrow();
			expect(componentInstance._components).toEqual({});
		});
	});

	describe('#getComponent()', () => {
		it('should get a component with a given name', () => {
			const componentName = 'getMe';

			componentInstance._components[componentName] = gondelComponent;
			const expected = gondelComponent;
			const received = componentInstance.getComponent(componentName);
			expect(received).toBe(expected);
		});

		it("should return undefined if component doesn't exist", () => {
			const componentName = 'unexistent';

			expect(componentInstance.getComponent(componentName)).toBeUndefined();
		});
	});

	describe('#setActiveState()', () => {
		const isActive = true;
		const activeComponentName = 'activeTestComponent';

		it('should set the active component to the given state', () => {
			componentInstance._activeComponents[activeComponentName] = false;
			componentInstance.setActiveState(activeComponentName, isActive);

			const actual = componentInstance._activeComponents[activeComponentName];
			expect(actual).toBe(isActive);
		});

		// TODO: Should we throw here? Or at lest initialize the active components somehow,
		// (like with null) before setting their active state to a boolean?
		it('should handle setting state to a non-existing component', () => {
			expect(componentInstance._activeComponents).toEqual({});

			const testFn = () => componentInstance.setActiveState(activeComponentName, isActive);

			expect(testFn).not.toThrow();
		});
	});
});
