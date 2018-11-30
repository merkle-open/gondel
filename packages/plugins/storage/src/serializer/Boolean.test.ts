import { serialize, deserialize } from "./Boolean";

describe("@gondel/plugin-data", () => {
  describe("serializer", () => {
    describe("JSON", () => {
      it("should serialize to number", () => {
        expect(serialize(true)).toEqual("true");
        expect(serialize(false)).toEqual("false");
      });
      it("should deserialize numbers", () => {
        expect(deserialize("false")).toEqual(false);
        expect(deserialize("true")).toEqual(true);
      });
    });
  });
});
