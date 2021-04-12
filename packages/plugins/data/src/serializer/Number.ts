export const serialize = (value: number): string => `${value}`;
export const deserialize = (value: string): number => parseFloat(value);

export default {
	serialize,
	deserialize,
};
