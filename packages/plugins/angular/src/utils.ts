/**
 * Returns true if the given object is promise like
 */
export function isPromise<T>(
  obj: {} | Promise<T> | undefined | string | number | null
): obj is Promise<T> {
  return !!obj && typeof (obj as Promise<T>).then === "function";
}
