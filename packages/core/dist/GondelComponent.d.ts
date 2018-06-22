export interface IGondelComponent<T = GondelComponent> {
    new (context: HTMLElement, componentName: string): T;
}
export interface IGondelComponentWithIdentification {
    __identification: {
        [namespace: string]: string;
    };
}
export declare type StartMethod = ((resolve: Function, reject?: Function) => void) | (() => Promise<any>) | (() => void);
export interface GondelComponent {
    _ctx: HTMLElement;
    _namespace: string;
    _componentName: string;
    _stopped: boolean;
    start?: StartMethod;
    stop?(): void;
    sync?(): void;
}
export declare class GondelBaseComponent implements GondelComponent {
    /**
     * The components initial identification mappings
     */
    static __identification: {};
    /**
     * The component context
     */
    _ctx: HTMLElement;
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
