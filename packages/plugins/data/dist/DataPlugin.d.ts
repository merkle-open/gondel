import { ISerializer } from './DataDecorator';
export declare type DataBindingConfig = [
    string,
    string,
    ISerializer | void
];
export declare let areDataBindingsHookedIntoCore: boolean;
export declare function hookDataDecoratorIntoCore(): void;
