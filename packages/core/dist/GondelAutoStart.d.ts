/**
 * By default Gondel will run startComponents on DOMContentLoaded
 * To gain more controll over the boot behaviour tihs function can be called
 * to disable the auto start
 */
export declare function disableAutoStart(namespace?: string): void;
/**
 * Wait for document ready and boot the registry
 */
export declare function addRegistryToBootloader(namespace: string): void;
