/**
 * Returns true if the given object is promise like
 */
export declare function isPromise<T>(obj: {} | Promise<T> | undefined | string | number | null): obj is Promise<T>;
