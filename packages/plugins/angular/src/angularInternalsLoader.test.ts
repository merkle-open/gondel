import { loadAngularInternals } from "./angularInternalsLoader";
import { isPromise } from "./utils";

describe("@gondel/plugin-angular angularInternalsLoader", () => {
  describe("loadAngularInternals", () => {
    it("should load all internals async", () => {
      const internals = loadAngularInternals();
      expect(isPromise(internals.Zone)).toBeTruthy();
      expect(isPromise(internals.Compiler)).toBeTruthy();
      expect(isPromise(internals.PlatformBrowser)).toBeTruthy();
      expect(isPromise(internals.PlatformBrowserDynamic)).toBeTruthy();
    });
  });
});
