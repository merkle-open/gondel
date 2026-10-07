# React Plugin

This tiny plugin bootstraps React widgets and apps using Gondel.  

## Usage

**HTML**

```html
  <div data-g-name="DemoWidget">Loading..</div>
```

**JavaScript**

```js
import { GondelReactComponent } from '@gondel/plugin-react';
import { Component } from '@gondel/core';
import { App } from './App';
import React from 'react';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  render() {
    return (
      <App />
    )
  }
}
```

## App configuration

Most apps need some specific configuration e.g. API enpoints or other settings.  
The following pattern allows you to pass a basic configuration from the DOM to your application.
This guarantees us that we have the full flexibility to pass a configuration, so that it can get rendered by anyone (e.g. CMS).

**HTML**

```html
  <div data-g-name="DemoWidget">
    <script type="application/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

**JavaScript**

```js
import { GondelReactComponent } from '@gondel/plugin-react';
import { Component } from '@gondel/core';
import React from 'react';
import { App } from './App';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  render(config) {
    return (
      <App config={config} />
    )
  }
}
```

## Component linking

It's also possible to link a gondel component to a react component without using a render method.

### Sync linking example

In the following example below the React app will be bundled into the same bundle (no code splitting).

**HTML**

```html
  <div data-g-name="DemoWidget">
    <script type="application/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

**JavaScript**

```js
import { GondelReactComponent } from '@gondel/plugin-react';
import { Component } from '@gondel/core';
import { App } from './App';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  App = App;
}
```

### Lazy linking example (code splitting)

To only lazy load the JavaScript of your React widget if the matching
HTML Element is present, you can use the following pattern below which is called lazy linking:

**HTML**

```html
  <div data-g-name="DemoWidget">
    <script type="application/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

**JavaScript**

```js
import { GondelReactComponent } from '@gondel/plugin-react';
import { Component } from '@gondel/core';

const loader = () => import('./App');

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent.create(loader, "App") {

}
```

To use a react App with a default export the second parameter of `create` can be skipped.

```js
import { GondelReactComponent } from '@gondel/plugin-react';
import { Component } from '@gondel/core';

const loader = () => import('./App');

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent.create(loader) {

}
```

## Manipulating state

Initially the state is load from the script tag inside the components HTML markup.
In the following example below, Gondel would extract the initial state `{ theme: 'light' }`:

```html
  <div data-g-name="DemoWidget">
    <script type="application/json">{ "theme":"light" }</script>
    Loading..
  </div>
```

This initial state can be accessed inside the `GondelReactComponent` using `this.state`.  
It is even possible to update the state of the component by calling the method `this.setState(...)`:

```tsx
import React from 'react';
import { GondelReactComponent } from '@gondel/plugin-react';
import { Component } from '@gondel/core';

const DemoApp = ({ theme }: {theme: 'light' | 'dark'}) => (
    <h1 className={theme === 'dark' ? 'dark' : 'light'}>
        Hello World
    </h1>
);

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent.create(() => DemoApp) {
  setTheme(theme: 'light' | 'dark') {
      this.setState({ theme });
  }
}
```

In the example above we've created a public `setTheme` method which is now a public API for your React widget.  
In combination with [`getComponentByDomNode`](https://gondel.js.org/docs/api.html#getcomponentbydomnode-domnode-namespace-gondelbasecomponent) it allows changing the state during runtime by external components:


```js
getComponentByDomNode(domElement).setTheme('dark')
```

## Using Gondel components from react
 
The `useGondelComponent` hook allows us to use a Gondel UI component like an accordion or button inside a React app. 
This can be really handy if you want to interop with your existing component markup inside of React.


### Example

```js
import { useGondelComponent } from '@gondel/plugin-react';

const Button = (props) => {
  const [ref] = useGondelComponent();
  return (
    <button ref={ref} data-g-name="Button"></button>
  );
};
```

In addition to the `ref` object, an instance of the Gondel component gets returned.
This allows to fully control the Gondel component from the React code.

**React component**

```tsx
import { useGondelComponent } from '@gondel/plugin-react';

const Button = (props) => {
  const [ref, gondelButtonInstance] = useGondelComponent();
  return (
    <button
        ref={ref}
        data-g-name="Button"
        onClick={() => {
            // Ensure that the gondelInstance is already initialized
            if (gondelButtonInstance) {
                // Execute a class method from the Gondel component
                gondelButtonInstance.setIsEnabled(false);
            }       
        }}>
        Button text
    </button>
  );
};
```

**Gondel component**

```ts
import { Component, GondelBaseComponent } from '@gondel/core';

@Component('Button')
export class Button extends GondelBaseComponent {
  setIsEnabled(newState) {
    if (newState) {
        this._ctx.removeAttribute('disabled');
    } else {
        this._ctx.setAttribute('disabled');
    }
  }
}
```
