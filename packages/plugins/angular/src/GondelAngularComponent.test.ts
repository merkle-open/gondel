import "zone.js";
import { getTestBed } from "@angular/core/testing";
import { GondelAngularComponent } from "./GondelAngularComponent";
import { Component } from "@gondel/core";
import { createStateProvider } from "./providers";

beforeEach(() => {
  getTestBed().resetTestEnvironment();
});

interface FixtureState {
  text: string;
}

const FixtureToken = createStateProvider<FixtureState>("fixture");
const FixtureModule = import("../fixtures/example.module").then(mod => mod.ExampleModule);

@Component("Fixture")
// @ts-ignore doesn't recognize the experimentalDecoratorFlag
class FixtureComponent extends GondelAngularComponent<FixtureState> {
  AppModule = FixtureModule;
  StateProvider = FixtureToken;
}

const createComponentHTML = (name: string, state: object = {}) => `
<div data-g-name="Fixture">
  <script type="text/json">
  ${JSON.stringify(state)}
  </script>
</div>
`;

describe("@gondel/plugin-angular – GondelAngularComponent", () => {
  it("should have working tests", () => {
    expect(true).toBeTruthy();
  });

  it.skip("should be startable", () => {
    const root = document.createElement("div");
    root.innerHTML = createComponentHTML("Fixture", { text: "Max" });
    const component = new FixtureComponent(root, "fixture");

    expect(() => (component as any).start()).not.toThrow();
  });

  it.skip("should return the angular module ref on start as promise", async () => {
    const root = document.createElement("div");
    const component = new FixtureComponent(root, "fixture");
    const ngModuleRef = await (component as any).start();

    expect(ngModuleRef).toBeTruthy();
  });

  it.skip("should provide the the state via injection token", async () => {
    const root = document.createElement("div");
    root.innerHTML = createComponentHTML("Fixture", { text: "Max" });
    const component = new FixtureComponent(root, "fixture");

    await (component as any).start();

    const ngModuleRef = FixtureComponent.ModuleRefMap.get(FixtureModule);
    expect(ngModuleRef).toBeDefined(); // module ref for resolving dependencies

    expect(ngModuleRef!.injector).toBeDefined(); // no NullInjector
    const stateProviderInst = ngModuleRef!.injector.get(FixtureToken); // get runtime provider
    expect(stateProviderInst).toEqual({
      name: "Max"
    });
  });
});
