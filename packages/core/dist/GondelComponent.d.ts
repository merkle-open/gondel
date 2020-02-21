export declare type IGondelComponent<TElement extends HTMLElement = HTMLElement> = new (context: TElement, componentName: string) => GondelComponent<TElement>;
export declare type StartMethod = ((resolve: Function, reject?: Function) => void) | (() => Promise<any>) | (() => void);
export interface GondelComponent<TElement extends HTMLElement = HTMLElement> {
    _ctx: TElement;
    _namespace: string;
    _componentName: string;
    _stopped: boolean;
    start?: StartMethod;
    stop?(): void;
    sync?(): void;
}
export declare class GondelBaseComponent<TElement extends HTMLElement = HTMLElement> implements GondelComponent<TElement> {
    constructor(domNode: TElement, componentName: string);
    /**
     * The component context
     */
    _ctx: TElement;
    /**
     * The namespace e.g. 'g'
     */
    _namespace: string;
    /**
     * The componentname e.g. 'Input'
     */
    _componentName: string;
    /**
     * Stopped
     */
    _stopped: boolean;
    /**
     * Stop method
     */
    stop(): void;
}
