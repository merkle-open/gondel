import {
  Adapter,
  storage,
  BooleanSerializer,
  NumberSerializer,
  JSONSerializer,
  setDefaultStorageAdapter
} from "./index";

describe("@gondel/plugin-storage", () => {
  it("exports", () => {
    expect(Adapter).toBeDefined();
    expect(storage).toBeDefined();
    expect(BooleanSerializer).toBeDefined();
    expect(NumberSerializer).toBeDefined();
    expect(JSONSerializer).toBeDefined();
    expect(setDefaultStorageAdapter).toBeDefined();
  });
});
