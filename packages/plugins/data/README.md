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
    @data _dataEndpoint: string;

    @data('lang')
    language: 'de' | 'en';

    @data('config', JSONSerializer)
    config: { someJSON: string };

    @data('result-count', SomeCustomSerializer)
    resultCount: number;

    async someMethodToWorkWith() {
        const results = await call(`${this._dataEndpoint}/${this.language}/search?query=bla`);
        this.resultCount = results.length || 0; // <= will write to 'data-result-count'
    }
}
```

## API

### @data()

#### Signatures
```ts
@data: void
@data(attributeKey: string, serializer?: Serializer | ISerializer): void
```

For basic bindings we recommend using the decorator as the simple `@data` decorator. It will bind the property key to the HTML in a pretty simple way:

* `@data('my-property') someVar` will become `data-my-property`
* `@data dataMyProperty` will be connected to `data-my-property`
* `@data _dataPrivateProp` will be connected to `data-private-prop`

If you won't follow the rules, the package will throw a reasonable error at you to correct your prop key naming. If you don't want to represent the data attribute from the markup the same way in your code please check the section below for how to use custom attribute keys for props. This decorator will expose a non-configurable enumerable property on your gondel component which is bound to the dedicated attribute.

If you want to use it in an advanced or special way with serializers you can use the decorator expression.
Use it with your desired data-attribute key to create the binding between your class property and the HTML - that's it!

```ts
// place this inside your component
@data('my-value')
myValue: string;

// and it will be bound to:
// <node data-my-value="..."></node>
```

## Serializers
If you don't want to care about parsing and serializing the value everytime it changes or you read it from the HTML you can plug serializers directly into the decorator which will handle this process for you :D.

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
@data('some-property', CustomSerializer)
value: string;

// 🎉 voilà!
```