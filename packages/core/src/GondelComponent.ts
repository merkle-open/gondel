export interface IGondelComponent {
  new (context: HTMLElement, componentName: string): GondelComponent;
  // used for registry to DOM mapping
  componentName: string;
}

export type StartMethod =
  // Async boot
  | ((resolve: Function, reject?: Function) => void)
  // Async with promise
  | (() => Promise<any>)
  // Sync boot
  | (() => void);

export interface GondelComponent {
  // The component context
  _ctx: HTMLElement;
  // The namespace e.g. 'g'
  _namespace: string;
  // The componentname e.g. 'Input'
  _componentName: string;
  // Stopped
  _stopped: boolean;
  // Async with resolve function
  start?: StartMethod;
  // Tear down
  stop?(): void;
  // Sync
  sync?(): void;
}

export class GondelBaseComponent implements GondelComponent {
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
  stop() {}
}
