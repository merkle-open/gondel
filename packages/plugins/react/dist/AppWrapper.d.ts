import React, { Component } from "react";
export interface Props<S> extends React.ComponentLifecycle<null, S> {
    children?: (props: S) => JSX.Element;
    onHasState?: (setState: (state: Partial<S>) => void) => void;
    config: S;
}
export declare class AppWrapper<TConfig> extends Component<Props<TConfig>, TConfig> {
    constructor(props: Props<TConfig>);
    render(): JSX.Element | (string & ((props: TConfig) => JSX.Element)) | (number & ((props: TConfig) => JSX.Element)) | (false & ((props: TConfig) => JSX.Element)) | (true & ((props: TConfig) => JSX.Element)) | (React.ReactNodeArray & ((props: TConfig) => JSX.Element)) | undefined;
}
export declare function createRenderAbleAppWrapper<TConfig>(props: Props<TConfig>): JSX.Element;
