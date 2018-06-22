export interface IGondelComponent<T = GondelComponent> {
  new (context: HTMLElement, componentName: string): T;
}

export interface IGondelComponentWithIdentification {
  __identification: {
    [namespace: string]: string;
  };
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
   * The components initial identification mappings
   */
  static __identification = {};
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
