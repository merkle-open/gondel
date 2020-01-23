import * as main from "./";

describe("@gondel/plugin-angular index", () => {
  it("should expose the API", () => {
    expect(main.loadAngularInternals).toBeDefined();
    expect(main.GondelAngularComponent).toBeDefined();
    expect(main.createStateProvider).toBeDefined();
    expect(main.createGondelComponentProvider).toBeDefined();
  });
});
