import { AppWrapper, Props as AppWrapperProps } from './AppWrapper';
import { createElement, Component, Props } from 'react';
import { render } from 'react-dom';

const serializeRenderedOutput = (r: any): object => JSON.parse(JSON.stringify(r, null, 2));

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

type HelloProps = { text: string };

class HelloFixture extends Component<HelloProps> {
	render() {
		return createElement('div', null, `Hello ${this.props.text}`);
	}
}

describe('@gondel/plugin-react', () => {
	describe('AppWrapper', () => {
		it('should render with empty configuration', () => {
			expect(() => {
				new AppWrapper<undefined>({
					config: undefined,
				});
			}).not.toThrow();
		});

		it('should set the initial state from config', () => {
			const wrapper = new AppWrapper<{ test: number }>({
				config: { test: 10 },
			});

			expect(wrapper.state.test).toEqual(10);
		});

		it('should pass react lifecycle hooks', () => {
			const lifecycles = [
				'componentWillMount' as const,
				'componentDidMount' as const,
				'componentWillReceiveProps' as const,
				'shouldComponentUpdate' as const,
				'componentWillUpdate' as const,
				'componentDidUpdate' as const,
				'componentWillUnmount' as const,
				'componentDidCatch' as const,
			];

			const mockLifecycle = lifecycles.reduce(
				(prev, curr) => ({
					...prev,
					[curr]: jest.fn(),
				}),
				{} as Record<ArrayElement<typeof lifecycles>, () => any>
			);

			const Wrapper = new AppWrapper<HelloProps>({
				...mockLifecycle, // add react lifecycle hooks
				config: { text: 'World' },
				children: (props) => createElement(HelloFixture, props, null),
			});

			lifecycles.forEach((lifecycle) => {
				expect(Wrapper[lifecycle]).toBeDefined();
			});
		});

		it('should be renderable', () => {
			const root = document.createElement('div');
			const Wrapper = new AppWrapper<HelloProps>({
				config: { text: 'World' },
				children: (props) => createElement(HelloFixture, props, null),
			});

			expect(Wrapper.render()).toBeDefined();
			expect(serializeRenderedOutput(Wrapper.render())).toEqual({
				_owner: null,
				_store: {},
				key: null,
				props: {
					children: null,
					text: 'World',
				},
				ref: null,
			});

			class App extends Component<HelloProps> {
				public render() {
					return createElement(
						AppWrapper,
						{
							children: (props: HelloProps) => createElement(HelloFixture, props, null),
							config: {
								text: 'World',
							},
						},
						null
					);
				}
			}

			const rendered = render(createElement(App, { text: 'world' }, null), root);
			expect(rendered).toBeDefined();
			expect(rendered.props.text).toEqual('world');
		});

		it('state mutations should be possible', () => {
			const root = document.createElement('div');
			const wrapper = createElement(
				AppWrapper,
				{
					config: { text: 'initial' },
					children: (props: HelloProps) => createElement(HelloFixture, props, null),
				},
				null
			);

			const rendered = render<Props<HelloProps>>(wrapper, root) as Component<HelloProps, HelloProps>;

			rendered.setState({ text: 'galaxy' });
			expect(rendered.state).toEqual({ text: 'galaxy' });
		});

		it('enables onHasState bindings', () => {
			const onHasState = jest.fn<AppWrapperProps<HelloProps>['onHasState'], any>((stateFn) => stateFn);

			new AppWrapper<HelloProps>({
				onHasState,
				config: { text: 'config' },
			});

			expect(onHasState.mockReturnValue).toBeDefined();
			expect(typeof onHasState.mockReturnValue).toEqual('function');
			expect(() => {
				onHasState.mockReturnValue((setState) => {
					setState({ text: 'mock' });
				});
			}).not.toThrow();
		});
	});
});
