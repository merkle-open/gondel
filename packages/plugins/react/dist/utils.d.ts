/**
 * Returns true if the given object is promise like
 */
export declare function isPromise<T>(obj: {} | Promise<T> | undefined | string | number | null): obj is Promise<T>;
/**
 * Extracts all key from a type T which are assignable to V
 * @see https://stackoverflow.com/a/54520829/159319
 */
export declare type KeysMatching<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];
/**
 * Returns the resolved Promise value type
 */
export declare type UnwrapPromise<T> = T extends Promise<infer V> ? V : never;
