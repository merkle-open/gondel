import { createStateProvider, createGondelComponentProvider } from "./providers";
import { Injector, InjectionToken } from "@angular/core";
import { Component, GondelBaseComponent } from "@gondel/core";

describe("@gondel/plugin-angular", () => {
  describe("createStateProvider", () => {
    it("should return a valid InjectionToken", () => {
      const stateToken = createStateProvider<unknown>("test");
      expect(stateToken).toBeDefined();
      expect(stateToken instanceof InjectionToken).toBeTruthy();
      expect(stateToken.toString()).toEqual("InjectionToken gondel state token for test");
    });

    it("should be injectable", () => {
      const stateToken = createStateProvider<string>("test");
      const injector = Injector.create(
        [{ provide: stateToken, useValue: "provider value" }],
        Injector.NULL
      );

      expect(injector.get(stateToken)).toEqual("provider value");
    });

    it("should be overridable via child injector", () => {
      const stateToken = createStateProvider<string>("test");
      const rootInjector = Injector.create(
        [{ provide: stateToken, useValue: "root value" }],
        Injector.NULL
      );
      const integrationInjector = Injector.create(
        [{ provide: stateToken, useValue: "integration value" }],
        rootInjector
      );

      expect(integrationInjector.get(stateToken)).toEqual("integration value");
    });
  });

  describe("createGondelComponentProvider", () => {
    @Component("Fixture")
    // @ts-ignore doesn't recognize decorators enabled
    class Fixture extends GondelBaseComponent {}
    const rootNode = document.createElement("div");

    it("should return a valid InjectionToken", () => {
      const componentRef = createGondelComponentProvider<Fixture>();
      expect(componentRef).toBeDefined();
      expect(componentRef instanceof InjectionToken).toBeTruthy();
      expect(componentRef.toString()).toEqual(
        "InjectionToken provides the root gondel component of the current module"
      );
    });

    it("should be injectable", () => {
      const componentRef = createGondelComponentProvider<Fixture>();
      const injector = Injector.create(
        [{ provide: componentRef, useValue: new Fixture(rootNode, "Fixture") }],
        Injector.NULL
      );

      const value = injector.get(componentRef);
      expect(value).toBeDefined();
    });

    it("should be overridable via child injector", () => {
      const componentRef = createGondelComponentProvider<Fixture>();
      const rootInjector = Injector.create(
        [{ provide: componentRef, useValue: null }],
        Injector.NULL
      );
      const integrationInjector = Injector.create(
        [{ provide: componentRef, useValue: new Fixture(rootNode, "Fixture") }],
        rootInjector
      );

      const value = integrationInjector.get(componentRef);
      expect(value).toBeDefined();
    });
  });
});
