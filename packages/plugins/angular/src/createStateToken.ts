import { InjectionToken } from "@angular/core";

/**
 * Creates a static injection token for providing
 * the state via a GondelAngularComponent into the
 * corresponding lazy loaded application.
 *
 * @param {string} id   Injection token identifier
 * @typeparam {T}       Corresponding value type
 * @reutrns {InjectionToken<T>}
 */
export const createStateToken = <T>(id: string) => new InjectionToken<T>(id);
