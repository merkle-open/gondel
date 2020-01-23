import { isPromise } from "./utils";

describe("@gondel/plugin-angular utils", () => {
  describe("isPromise", () => {
    it("should recognize promises", () => {
      const asyncFunc = async () => true;
      const promiseFunc = () => new Promise(r => r());
      const resolveFunc = () => Promise.resolve();

      expect(isPromise(asyncFunc())).toBeTruthy();
      expect(isPromise(promiseFunc())).toBeTruthy();
      expect(isPromise(resolveFunc())).toBeTruthy();
    });

    it("should recognize non promise", () => {
      const staticFunc = () => false;

      expect(isPromise(staticFunc())).toBeFalsy();
    });
  });
});