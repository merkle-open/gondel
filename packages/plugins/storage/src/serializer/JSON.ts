export const serialize = (value: any): string => JSON.stringify(value, null, 0);
export const deserialize = <T extends any = any>(value: string): T => JSON.parse(value);

export default {
  serialize,
  deserialize
};
