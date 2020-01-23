import "zone.js";
import { GondelAngularComponent } from "./GondelAngularComponent";
import { Component } from "@gondel/core";
import { createStateToken } from "./GondelConfigurationProvider";

interface FixtureState {
  text: string;
}

const FixtureToken = createStateToken<FixtureState>("fixture");

@Component("Fixture")
class FixtureComponent extends GondelAngularComponent<FixtureState> {
  AppModule = import("../fixtures/example.module").then(mod => {
    console.log("Import dynamic AppModule", mod);
    return mod.ExampleModule;
  });
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
  it("should be startable", () => {
    const root = document.createElement("div");
    root.innerHTML = createComponentHTML("Fixture", { text: "Max" });
    const component = new FixtureComponent(root, "fixture");

    expect(() => (component as any).start()).not.toThrow();
  });

  it("should return the angular module ref on start as promise", async () => {
    const root = document.createElement("div");
    const component = new FixtureComponent(root, "fixture");
    const ngModuleRef = await (component as any).start();

    expect(ngModuleRef).toBeTruthy();
  });
});
