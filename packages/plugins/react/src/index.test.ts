import { useGondelComponent, GondelReactComponent } from './index';

describe('@gondel/plugin-react', () => {
	describe('module', () => {
		it('should expose the hook and base component', () => {
			expect(useGondelComponent).toBeDefined();
			expect(GondelReactComponent).toBeDefined();
		});
	});
});
