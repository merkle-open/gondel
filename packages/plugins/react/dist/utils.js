/**
 * Returns true if the given object is promise like
 */
export function isPromise(obj) {
    return !!obj && typeof obj.then === 'function';
}
//# sourceMappingURL=utils.js.map