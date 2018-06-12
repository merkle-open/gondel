export declare type IGondelComponent = new (context: HTMLElement, componentName: string) => GondelComponent;
export interface IGondelComponentBlueprint {
    new (context: HTMLElement, componentName: string): GondelComponent;
    componentName: string;
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
