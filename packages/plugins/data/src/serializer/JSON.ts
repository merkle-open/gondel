export const serialize = (value: any): string => (value ? JSON.stringify(value) : "");

export const deserialize = <T extends any = any>(value: string): T =>
  value ? JSON.parse(value) : void 0;
