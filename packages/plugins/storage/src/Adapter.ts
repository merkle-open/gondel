export interface IStorage {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
  [name: string]: any;
}

export interface ISerializer<T extends any = any> {
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
}

type AdditionalAdapterConfiguration = {
  prefix: string;
  postfix: string;
  delimitier: string;
};

export class Adapter {
  private config: AdditionalAdapterConfiguration = {
    prefix: "",
    postfix: "",
    delimitier: ""
  };

  constructor(private name: string, private store: IStorage) {
    if (!store) {
      throw new Error(`Stroage not available in your environment`);
    }
  }

  configure(config: AdditionalAdapterConfiguration) {
    this.config = {
      ...this.config,
      ...config
    };
  }

  get<T, S extends ISerializer<T>>(key: string, serializer?: S): T | void {
    const value = this.store.getItem(this.generateAccessorKey(key));

    if (value) {
      if (serializer) {
        return serializer.deserialize(value);
      }

      return (value as unknown) as T;
    }

    return undefined;
  }

  set<T extends any = string>(key: string, value: T, serializer?: ISerializer<T>): void {
    let savableValue: any = "";

    if (serializer && typeof value !== "string") {
      savableValue = serializer.serialize(value);
    } else {
      savableValue = value;
    }

    this.store.setItem(this.generateAccessorKey(key), savableValue);
  }

  remove(key: string): void {
    this.store.removeItem(key);
  }

  clear(): void {
    this.store.clear();
  }

  toString(): string {
    return `Adapter { ${this.name} }`;
  }

  private generateAccessorKey(key: string): string {
    return [this.config.prefix, key, this.config.postfix].join(this.config.delimitier);
  }
}

export const localStorageAdapter = new Adapter("local", window.localStorage as IStorage);
export const sessionStorageAdapter = new Adapter("session", window.sessionStorage as IStorage);
