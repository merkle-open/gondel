export interface ISerializer<T extends any = any> {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
}
export declare enum Serializer {
    JSON = "JSON"
}
export declare const Serializers: {
    [key in Serializer]: ISerializer;
};
