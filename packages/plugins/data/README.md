# Data Plugin for Gondel <small>_(@gondel/plugin-data)_</small>
This plugin makes it easier to use data-attributes within gondel components by dual-bind them
automatically to a property. It supports preshipped serializers but also custom implementation e.g. for encryptions or special parsing for each data property.

### Installation
```bash
$ npm i --save @gondel/plugin-data

# or with yarn
$ yarn add @gondel/plugin-data
```

### Example

```html
<div data-t-name="Search"
     data-endpoint="https://my-endpoint.com/api/v1"
     data-lang="de"
     config="{someJSON: 'goes here'}" data-result-count="0">
    <!-- some common search code here ... -->
</div>
```

```ts
@Component('Search')
class Search extends GondelBaseComponent {
    @data('endpoint')
    private endpointURL: string;

    @data('lang')
    private language: 'de' | 'en';

    @data('config', Serializer.JSON)
    private config: { someJSON: string };

    @data('result-count', CustomNumberSerializer)
    private resultCount: number;

    async someMethodToWorkWith() {
        const results = await call(`${this.endpoint}/${this.language}/search?query=bla`);
        this.resultCount = results.length || 0; // <= will write to 'data-result-count'
    }
}
```

## API

### @data()

#### Signature
```ts
@data(attributeKey: string, serializer?: Serializer | ISerializer): void
```

Use it with your desired data-attribute key to create the binding between your class property and the HTML - that's it!

```ts
// place this inside your component
@data('my-value')
private myValue: string;

// and it will be bound to:
// <node data-my-value="..."></node>
```
## Custom Serializer
```ts
// first create a simple object ...
const CustomSerializer: ISerializer = {
    serialize: (unserializedValue: string): any => serializedValue,
    deserialize: (serializedValue: any): string => unserializedValue,
}

// ... then use it like this:
@data('some-property', CustomSerializer)
private value: string;

// 🎉 voilà!
```