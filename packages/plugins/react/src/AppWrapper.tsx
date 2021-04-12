import { Component, createElement } from 'react';

export interface Props<S> extends React.ComponentLifecycle<null, S> {
	children?: (props: S) => JSX.Element;
	onHasState?: (setState: (state: Partial<S>) => void) => void;
	config: S;
}

export class AppWrapper<TConfig> extends Component<Props<TConfig>, TConfig> {
	constructor(props: Props<TConfig>) {
		super(props);
		this.state = props.config;

		// Forward react life cycle hooks
		([
			'componentWillMount',
			'componentDidMount',
			'componentWillReceiveProps',
			'shouldComponentUpdate',
			'componentWillUpdate',
			'componentDidUpdate',
			'componentWillUnmount',
			'componentDidCatch',
		] as const).forEach((reactHook) => {
			if (!(this.props as any)[reactHook]) {
				return;
			}

			(this as any)[reactHook] = function () {
				return this.props[reactHook].apply(this, arguments);
			};
		});

		// Notify the Gondel component that the state can be set
		props.onHasState && props.onHasState(this.setState.bind(this));
	}

	render() {
		const children = this.props.children;
		return typeof children === 'function' ? children(this.state) : children;
	}
}

export function createRenderableAppWrapper<TConfig>(props: Props<TConfig>) {
	return createElement(AppWrapper, props);
}
