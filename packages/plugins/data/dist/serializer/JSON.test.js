import { serialize, deserialize } from "./JSON";
describe('@gondel/plugin-data', function () {
    describe('serializer', function () {
        describe('JSON', function () {
            it('should serialize to JSON', function () {
                expect(serialize({ a: 10 })).toEqual("{\"a\":10}");
            });
            it('should deserialize JSON', function () {
                expect(deserialize('{\"a\":10}')).toEqual({ a: 10 });
            });
        });
    });
});
//# sourceMappingURL=JSON.test.js.map