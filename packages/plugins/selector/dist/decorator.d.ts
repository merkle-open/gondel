import { IGondelComponentWithSelectors, ISelectorBindingOptions } from './const';
declare type GondelComponentDecorator<T> = (target: T, propertyKey: string) => void;
/**
 * The @selector decorator will lookup the nodes on access including caching (enabled by default)
 */
export declare function selector<T extends IGondelComponentWithSelectors>(domSelector: string, options?: ISelectorBindingOptions): GondelComponentDecorator<T>;
export {};
