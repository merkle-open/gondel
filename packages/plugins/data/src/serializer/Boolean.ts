export const serialize = (value: boolean): string => `${value}`;
export const deserialize = (value: string): boolean => value === "true";

export default {
  serialize,
  deserialize
};
