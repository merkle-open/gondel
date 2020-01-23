interface ModuleType {
  default?: string;
  [key: string]: any;
}

const resolveDefaultOrModule = <T extends Record<string, any>>(mod: T) =>
  (mod.default as T["default"]) || (mod as T);

/**
 * Loading the angular required dependencies async
 */
export const loadAngularInternals = () => {
  const Zone = import(
    // @ts-ignore
    /* webpackPrefetch: true, webpackChunkName: 'zone' */ "zone.js/dist/zone.js"
  );
  const Compiler = import(
    /* webpackPrefetch: true, webpackChunkName: 'ng-compiler' */ "@angular/compiler"
  ).then(resolveDefaultOrModule);
  const PlatformBrowser = import(
    /* webpackPrefetch: true, webpackChunkName: 'ng-platform-browser' */ "@angular/platform-browser"
  ).then(resolveDefaultOrModule);
  const PlatformBrowserDynamic = import(
    /* webpackPrefetch: true, webpackChunkName: 'ng-platform-browser-dynamic' */ "@angular/platform-browser-dynamic"
  ).then(resolveDefaultOrModule);

  return {
    Compiler,
    PlatformBrowser,
    PlatformBrowserDynamic,
    Zone
  } as const;
};
