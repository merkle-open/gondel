import { Serializer, ISerializer } from "./serializer/all";
export declare type DataBindingConfig = [string, string, Serializer | ISerializer | void];
export declare let areDataBindingsHookedIntoCore: boolean;
export declare function hookDataDecoratorIntoCore(): void;
