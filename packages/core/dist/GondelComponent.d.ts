export declare type IGondelComponent = new (context: HTMLElement, componentName: string) => GondelComponent;
export declare type StartMethod = ((resolve: Function, reject?: Function) => void) | (() => Promise<any>) | (() => void);
export interface GondelComponent<TElement = HTMLElement> {
    _ctx: TElement;
    _namespace: string;
    _componentName: string;
    _stopped: boolean;
    start?: StartMethod;
    stop?(): void;
    sync?(): void;
}
export declare class GondelBaseComponent<TElement = HTMLElement> implements GondelComponent<TElement> {
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
