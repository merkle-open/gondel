import "zone.js";
import { GondelAngularComponent } from "./GondelAngularComponent";
class FixtureComponent extends GondelAngularComponent<{}> {
  AppModule = import("../fixtures/example.module").then(mod => {
    console.log("Import dynamic AppModule", mod);
    return mod.ExampleModule;
  });
}

describe("@gondel/plugin-angular – GondelAngularComponent", () => {
  it("should be startable", () => {
    const root = document.createElement("div");
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
