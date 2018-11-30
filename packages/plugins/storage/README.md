# Storage Plugin for Gondel <small>_(@gondel/plugin-storage)_</small>
This plugin makes it easier to use local- and session storage within gondel components by dual-bind them
automatically to a property. It supports preshipped serializers and also custom implementation e.g. for encryptions or special parsing for each property 
as well as custom adapters to connect to your own storage.

### Installation
```bash
$ npm i --save @gondel/plugin-storage

# or with yarn
$ yarn add @gondel/plugin-storage
```

### Example

```ts
import { storage, localStorageAdapter, JSONSerializer } from '@gondel/plugin-storage';

@Component('SearchResults')
class Search extends GondelBaseComponent {
    // simple bindings to localStorage.setItem/getItem
    @storage someValue: string;

    // normally you would need to localStorage.getItem/setItem
    // on every change and parse/stringify it.
    @storage('staticSearchResults', localStorageAdapter, JSONSerializer)
    staticSearchResults: StaticSearchResult[];

    async getStaticSearchResults() {
        this.staticSearchResults = await call(`https://api.com/staticSearchResults`);
    }

    start() {
        // we use the data from cache
        render(this.staticSearchResults);

        // update data async in the BG
        this.getStaticSearchResults();
    }
}
```

## API

### @storage()

#### Signatures
```ts
@storage: void
@storage(storageKey: string, addapter?: Adapter, serializer?: ISerializer): void
```

For basic bindings we recommend using the decorator as the simple `@storage` decorator. It will bind the property key to the selected storage in a pretty simple way:

* Each property will be saved based on the property name into the selected storage *(default: localStorage)*
* The storage key can be overwritten by using the advanced way
* Custom adapters can be specified if needed

If you won't follow the rules, the package will throw a reasonable error at you to correct your prop key naming. If you don't want to represent the data attribute from the markup the same way in your code please check the section below for how to use custom attribute keys for props. This decorator will expose a non-configurable enumerable property on your gondel component which is bound to the dedicated storage item.

If you want to use it in an advanced or special way with serializers you can use the decorator expression.

## Serializers
If you don't want to care about parsing and serializing the value everytime it changes or you read it from the storage adapter (localStorage, sessionStorage or custom) you can plug serializers directly into the decorator which will handle this process for you :D.

### Built-in serializers
You can import the serializers below from the plugin package.

* NumberSerializer
* BooleanSerializer
* JSONSerializer

### Create a custom serializer
```ts
// first create a simple object ...
const CustomSerializer: ISerializer = {
    serialize: (unserializedValue: string): any => serializedValue,
    deserialize: (serializedValue: any): string => unserializedValue,
}

// ... then use it like this:
@storage('someStorageVar', selectedAdapter, CustomSerializer)
value: string;

// 🎉 voilà!
```