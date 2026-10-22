import { serialize, deserialize } from '../src/serializer/JSON';

describe('@gondel/plugin-data', () => {
	describe('serializer', () => {
		describe('JSON', () => {
			it('should serialize to JSON', () => {
				expect(serialize({ a: 10 })).toEqual('{"a":10}');
			});
			it('should deserialize JSON', () => {
				expect(deserialize('{"a":10}')).toEqual({ a: 10 });
			});
		});
	});
});
