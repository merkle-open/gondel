import { InjectionToken } from "@angular/core";
import { GondelBaseComponent } from "@gondel/core";

/**
 * Creates a static injection token for providing
 * the state via a GondelAngularComponent into the
 * corresponding lazy loaded application.
 *
 * @param {string} id   Injection token identifier
 * @typeparam {T}       Corresponding value type
 * @reutrns {InjectionToken<T>}
 */
export const createStateProvider = <T>(id: string) =>
  new InjectionToken<T>(`gondel state token for ${id}`);

/**
 * Can be used to directly access the root Gondel component
 * via the @Inject() strategy of Angulars injector
 * @typeparam {T}       Corresponding component type
 * @reutrns {InjectionToken<T>}
 */
export const createGondelComponentProvider = <
  T extends GondelBaseComponent = GondelBaseComponent
>() => new InjectionToken<T>("provides the root gondel component of the current module");
