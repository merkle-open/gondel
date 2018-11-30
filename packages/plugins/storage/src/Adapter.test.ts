import { localStorageAdapter, sessionStorageAdapter, Adapter } from "./Adapter";
import JSONSerializer from "./serializer/JSON";

beforeEach(() => {
  localStorageAdapter.clear();
  sessionStorageAdapter.clear();
});

describe("@gondel/plugin-storage", () => {
  describe("Adapter", () => {
    it("should expose members", () => {
      expect(localStorageAdapter).toBeDefined();
      expect(sessionStorageAdapter).toBeDefined();
    });

    it("should fail if no env given", () => {
      expect(() => {
        // test case for no localStorage (e.g. old browsers)
        new Adapter("noEnvGiven", undefined as any);
      }).toThrowError();
    });

    it("should stringify correctly", () => {
      expect(localStorageAdapter.toString()).toEqual("Adapter { local }");
      expect(sessionStorageAdapter.toString()).toEqual("Adapter { session }");
    });

    it("should get/set simple items correctly", () => {
      localStorageAdapter.set("test1", "test1");
      expect(JSON.stringify(localStorage)).toMatchSnapshot();
      expect(localStorageAdapter.get("test1")).toEqual("test1");
    });

    it("should get/set custom serializable items correctly", () => {
      localStorageAdapter.set("test2", { a: 10, b: 20 }, JSONSerializer);
      expect(JSON.stringify(localStorage)).toMatchSnapshot();
      expect(localStorageAdapter.get("test2", JSONSerializer)).toEqual({
        a: 10,
        b: 20
      });
    });

    it("should remove items", () => {
      localStorageAdapter.set("test3", "remove");
      localStorageAdapter.remove("test3");
      expect(localStorageAdapter.get("test3")).toBeUndefined();
    });
  });
});
