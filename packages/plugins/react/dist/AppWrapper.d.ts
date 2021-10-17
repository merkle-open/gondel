import { Component } from 'react';
export interface Props<S> extends React.ComponentLifecycle<null, S> {
    children?: (props: S) => JSX.Element;
    onHasState?: (setState: (state: Partial<S>) => void) => void;
    config: S;
}
export declare class AppWrapper<TConfig> extends Component<Props<TConfig>, TConfig> {
    constructor(props: Props<TConfig>);
    render(): JSX.Element | (((props: TConfig) => JSX.Element) & string) | (((props: TConfig) => JSX.Element) & number) | (((props: TConfig) => JSX.Element) & false) | (((props: TConfig) => JSX.Element) & true) | undefined;
}
export declare function createRenderableAppWrapper<TConfig>(props: Props<TConfig>): import("react").CElement<Props<unknown>, AppWrapper<unknown>>;
