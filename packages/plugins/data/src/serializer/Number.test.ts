import { serialize, deserialize } from './Number';

describe('@gondel/plugin-data', () => {
	describe('serializer', () => {
		describe('JSON', () => {
			it('should serialize to number', () => {
				expect(serialize(109)).toEqual('109');
				expect(serialize(109.9123)).toEqual('109.9123');
			});
			it('should deserialize numbers', () => {
				expect(deserialize('109')).toEqual(109);
				expect(deserialize('9.82123')).toEqual(9.82123);
			});
		});
	});
});
