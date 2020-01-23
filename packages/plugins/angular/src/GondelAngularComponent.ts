import { GondelBaseComponent, GondelComponent } from "@gondel/core";
import { NgModuleRef, Type, NgZone, getPlatform, InjectionToken } from "@angular/core";
import { isPromise } from "./utils";
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

  constructor(ctx: TElement, componentName: string) {
    super(ctx, componentName);

    // Overwrite the current start method
    const originalStart = (this as any).start;
    const { Zone, Compiler, PlatformBrowser, PlatformBrowserDynamic } = loadAngularInternals();

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
      }
    };

    (this as GondelComponent).start = function(this: GondelAngularComponent<State>) {
      // Wait for the original start promise to allow lazy loading
      const originalStartPromise = new Promise((resolve, reject) => {
        if (!originalStart) {
          return resolve();
        }

        if (originalStart.length) {
          return originalStart.call(this, resolve, reject);
        }

        const result = originalStart.call(this);
        return isPromise(result) ? result.then(resolve, reject) : resolve(result);
      });

      // Render the app
      const renderAppPromise = originalStartPromise
        .then(() =>
          Promise.all<
            NGModule | undefined,
            typeof import("@angular/platform-browser-dynamic"),
            typeof import("@angular/platform-browser"),
            any,
            any
          >([
            this.AppModule,
            // main JIT compileable platform
            PlatformBrowserDynamic,
            // required dependencies of dynamic platform
            PlatformBrowser,
            Compiler,
            Zone
          ])
        )
        .then(([AppModule, DynamicBoot, Browser]) => {
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
          const zoneIdentifier = `gondel:${this._componentName}`;

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

          const staticModuleProviders = this.StateProvider
            ? [
                {
                  provide: this.StateProvider,
                  useValue: this.state
                }
              ]
            : [];

          console.log("providing state", this.state);

          DynamicBoot.platformBrowserDynamic(staticModuleProviders)
            .bootstrapModule((AppModule as unknown) as Type<unknown>)
            .then(ref => {
              console.log("Platform after boot", getPlatform());
              const bootstrappedNgZone = ref.injector.get(NgZone);
              this.zone = bootstrappedNgZone;
              (bootstrappedNgZone as any)._inner._properties[zoneIdentifier] = true;
              GondelAngularComponent.ZoneMap.set(zoneIdentifier, bootstrappedNgZone);
              GondelAngularComponent.ModuleRefMap.set(AppModule, ref);
            })
            .catch(err => {
              console.error(err);
              console.info("Platform:", getPlatform());
            });
        });

      return renderAppPromise;
    };
  }

  private ensureComponentTagInContext() {
    if (this._ctx && this._ctx.innerHTML.indexOf("<ng-component") > -1) {
      return;
    }

    this._ctx.innerHTML += `<ng-component><ng-component>`;
  }
}
