import { GondelBaseComponent, GondelComponent, StartMethod } from "@gondel/core";
import {
  NgModuleRef,
  Type,
  NgZone,
  getPlatform,
  InjectionToken,
  StaticProvider,
  ValueProvider
} from "@angular/core";
import { isPromise } from "./utils";
import { createGondelComponentProvider } from "./providers";
import { loadAngularInternals } from "./angularInternalsLoader";

type GondelAngularModule = any;

export class GondelAngularComponent<
  State = {},
  NGModule extends GondelAngularModule = any,
  TElement extends HTMLElement = HTMLDivElement
> extends GondelBaseComponent<TElement> {
  static readonly AppPromiseMap = new WeakMap<Promise<GondelAngularModule>, GondelAngularModule>();
  /**
   * Saving all NgModule references here, important
   * for updating or destroying apps
   */
  static readonly ModuleRefMap = new WeakMap<
    Promise<GondelAngularModule> | GondelAngularModule,
    NgModuleRef<any>
  >();

  /**
   * The module ref zones, will be set after
   * each successful bootstrap process.
   */
  static readonly ZoneMap = new Map<string, NgZone>();
  /**
   * Injection token instance which defines the state
   * injectable, required for static provider typings
   */
  public StateProvider: InjectionToken<State>;
  /**
   * Injection token instance which defines the reference
   * to the current Gondel component instance
   */
  public GondelComponentProvider: InjectionToken<
    GondelAngularComponent<State, NGModule, TElement>
  > = createGondelComponentProvider<GondelAngularComponent<State, NGModule, TElement>>();
  /**
   * Dynamic import of the root NgModule class
   */
  public AppModule?: Promise<NGModule>;
  /**
   * Initial loaded state from DOM
   */
  public state: Readonly<State>;
  /**
   * Public zone reference
   */
  public zone: NgZone;

  /**
   * Unique identifier per component which defines
   * the reference to the forked Zone property
   */
  private zoneIdentifier: string;

  constructor(ctx: TElement, componentName: string) {
    super(ctx, componentName);

    // Overwrite the current start method
    const originalStart = (this as any).start;

    // Get required Angular internal modules
    const { Zone, Compiler, PlatformBrowser, PlatformBrowserDynamic } = loadAngularInternals();

    // Parse initial state from DOM
    const configScript = ctx.querySelector("script[type='text/json']");
    this.state = configScript ? JSON.parse(configScript.innerHTML) : {};

    (this as GondelComponent).stop = function(this: GondelAngularComponent<State>) {
      if (!this.AppModule) {
        return;
      }

      const appModule = this.AppModule;
      const ngModuleRef = GondelAngularComponent.ModuleRefMap.get(appModule);

      if (ngModuleRef) {
        ngModuleRef.destroy();
        GondelAngularComponent.ModuleRefMap.delete(appModule);
        this.setZoneActiveProperty(false); // global zone
        this.setZoneActiveProperty(false, this.zone); // bootstrapped zone
      }
    };

    (this as GondelComponent).start = function(this: GondelAngularComponent<State>) {
      // Wait for the original start promise to allow lazy loading
      const originalStartPromise = this.getSafeStartPromise(originalStart);

      // Render the app
      const renderAppPromise = originalStartPromise
        .then(() =>
          Promise.all([
            this.AppModule,
            // main JIT compileable platform
            PlatformBrowserDynamic,
            // required dependencies of dynamic platform
            PlatformBrowser,
            Compiler,
            Zone
          ])
        )
        .then(([AppModule, DynamicBoot]) => {
          // Store unwrapped promise for this.App
          if (AppModule && isPromise(this.AppModule)) {
            GondelAngularComponent.AppPromiseMap.set(this.AppModule, AppModule);
          }

          if (this._stopped) {
            return;
          }

          if (!AppModule) {
            throw new Error(`No valid application module available, found "${AppModule}"`);
          }

          const zone = NgZone;
          const zoneIdentifier = (this.zoneIdentifier = `gondel_${this._componentName}`);

          /**
           * This is a hack, since NgZone doesn't allow you to configure the property that identifies your zone.
           * @see https://github.com/PlaceMe-SAS/single-spa-angular-cli/issues/33
           * @see https://github.com/CanopyTax/single-spa-angular/issues/47
           * @see https://github.com/CanopyTax/single-spa-angular/issues/47
           * @see https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L144
           * @see https://github.com/angular/angular/blob/a14dc2d7a4821a19f20a9547053a5734798f541e/packages/core/src/zone/ng_zone.ts#L257
           */
          zone.isInAngularZone = () => {
            // @ts-ignore
            return window.Zone.current._properties[zoneIdentifier] === true;
          };

          // we need to ensure that we have at least one
          // <ng-component> tag inside our context so that
          // the AppModule can be bootstrapped correctly
          this.ensureComponentTagInContext();

          const staticModuleProviders: StaticProvider[] = [
            // provide reference to the current instance of the Gondel component
            this.getInternalComponentRefProvider(),
            // provide initial state from Gondel component
            this.getInternalStateProvider()
          ];

          DynamicBoot.platformBrowserDynamic(staticModuleProviders)
            .bootstrapModule((AppModule as unknown) as Type<unknown>)
            .then((ref: NgModuleRef<unknown>) => {
              // extract corelated zone instance from root injector
              const bootstrappedNgZone = ref.injector.get(NgZone);
              this.zone = bootstrappedNgZone;

              // set reference property in bootstrapped zone
              (bootstrappedNgZone as any)._inner._properties[zoneIdentifier] = true;
              // activate reference property in global zone
              this.setZoneActiveProperty(true);

              // save references of zone and module in class
              GondelAngularComponent.ZoneMap.set(zoneIdentifier, bootstrappedNgZone);
              GondelAngularComponent.ModuleRefMap.set(AppModule, ref);
            })
            .catch((err: Error) => {
              // TODO: remove after successful testing
              console.error(`${err}\n\n${getPlatform()}`);
            });
        });

      return renderAppPromise;
    };
  }

  private getSafeStartPromise(originalStart?: StartMethod) {
    return new Promise((resolve, reject) => {
      if (!originalStart) {
        return resolve();
      }

      if (originalStart.length) {
        return originalStart.call(this, resolve, reject);
      }

      const result = originalStart.call(this);
      return isPromise(result) ? result.then(resolve, reject) : resolve(result);
    });
  }

  private setZoneActiveProperty(active: boolean, zone: NgZone = (window as any).Zone.current) {
    if (!this.zoneIdentifier) {
      return;
    }

    return (zone as any)._properties[this.zoneIdentifier] === active;
  }

  private getInternalComponentRefProvider(): ValueProvider {
    return {
      provide: this.GondelComponentProvider,
      useValue: this
    };
  }

  private getInternalStateProvider(): ValueProvider {
    if (!this.StateProvider) {
      // default state will be empty object
      return { provide: this.StateProvider, useValue: {} };
    }

    return {
      provide: this.StateProvider,
      useValue: this.state
    };
  }

  private ensureComponentTagInContext() {
    if (!this._ctx) {
      return false;
    }

    if (this._ctx.innerHTML.indexOf("<ng-component") === -1) {
      this._ctx.innerHTML += `<ng-component><ng-component>`;
    }

    return true;
  }
}
