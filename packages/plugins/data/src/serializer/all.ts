import { serialize as serializeJSON, deserialize as deserializeJSON } from "./JSON";

export interface ISerializer<T extends any = any> {
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
}

export enum Serializer {
  JSON = "JSON"
}

export const Serializers: { [key in Serializer]: ISerializer } = {
  [Serializer.JSON]: {
    serialize: serializeJSON,
    deserialize: deserializeJSON
  }
};
