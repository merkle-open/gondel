/// <reference types="react" />
import React, { Component } from 'react';
export interface Props<S> extends React.ComponentLifecycle<null, S> {
    children?: (props: S) => JSX.Element;
    onHasState?: (setState: (state: Partial<S>) => void) => void;
    config: S;
}
export declare class AppWrapper<TConfig> extends Component<Props<TConfig>, TConfig> {
    constructor(props: Props<TConfig>);
    updateConfig: (config: TConfig) => void;
    render(): JSX.Element | null;
}
export declare function createRenderAbleAppWrapper<TConfig>(props: Props<TConfig>): JSX.Element;
