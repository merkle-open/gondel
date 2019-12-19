# React Plugin

This tiny plugin bootstraps React widgets and apps using Gondel.  

## Usage

html

```html
  <div data-g-name="DemoWidget">Loading..</div>
```

js

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

Most apps need some specific configuration e.g. Api enpoints.  
The following pattern allows you to pass a basic configuration from the dom to your app.

html

```html
  <div data-g-name="DemoWidget">
    <script type="text/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

js

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

In this example the react app will be bundled into the same bundle (no splitting).

html

```html
  <div data-g-name="DemoWidget">
    <script type="text/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

js

```js
import {GondelReactComponent} from '@gondel/plugin-react';
import {Component} from '@gondel/core';
import {App} from './App';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  App = App;
}
```

### Lazy linking example (code splitting)

To only lazy load the javascript of your react widget if the matching
HTML Element is present, you can use the following pattern:

html

```html
  <div data-g-name="DemoWidget">
    <script type="text/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

js

```js
import {GondelReactComponent} from '@gondel/plugin-react';
import {Component} from '@gondel/core';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  App = import('./App').then(({App}) => App);
}
```

### Async blocking linking example (code splitting)

You can use a async start method to lazy load a component and tell Gondel to wait until the javascript of the component has been loaded.  
This will guarantee that the sync method of all Gondel components will be delayed until the react component was completely loaded.

html

```html
  <div data-g-name="DemoWidget">
    <script type="text/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

js

```js
import {GondelReactComponent} from '@gondel/plugin-react';
import {Component} from '@gondel/core';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  async start() {
      this.App = (await import('./App')).App;
  }
}
```


## Manipulating state

Initially the state is load from the html.
In the following example it would be `{theme: 'light'}`:

```html
  <div data-g-name="DemoWidget">
    <script type="text/json">{ "theme":"light" }</script>
    Loading..
  </div>
```

This initial state can be accesed inside the `GondelReactComponent` using `this.state`.  
It is even possible to update the state by calling `this.setState`:

```js
import {GondelReactComponent} from '@gondel/plugin-react';
import {Component} from '@gondel/core';
import React from 'react';

const DemoApp = ({theme}) => (
    <h1 className={theme === 'dark' ? 'dark' : 'light'}>
        Hello World
    </h1>
)

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent<{theme: 'light' | 'dark'}> {
  App = DemoApp;

  setTheme(theme: 'light' | 'dark') {
      this.setState({theme})
  }
}
```

In the example above we created a public `setTheme` method which is now a public api for your react widget.  
In combination with [`getComponentByDomNode`](https://gondel.js.org/docs/api.html#getcomponentbydomnode-domnode-namespace-gondelbasecomponent) it allows changing the state during runtime:


```js
getComponentByDomNode(domElement).setTheme('dark')
```

## Using Gondel components from react
 
The `useGondelComponent` hook allows to use a Gondel UI component like an accordion or button inside a react app. 

```js
import { useGondelComponent } from '@gondel/plugin-react';

const Button = (props) => {
  const [ref] = useGondelComponent();
  return (
    <button ref={ref} data-g-name="Button"></button>
  );
};
```

In addition to the `ref` object an instance of the gondel component is returned.  
This allows controlling the Gondel component from react.

```js
// react component
import { useGondelComponent } from '@gondel/plugin-react';

const Button = (props) => {
  const [ref, gondelButtonInstance] = useGondelComponent();
  return (
    <button onClick={() => {
        // Ensure that the gondelInstance is already initialized
        if (gondelButtonInstance) {
            // Execute a class method from the Gondel component
            gondelButtonInstance.setIsEnabled(false);
        }       
    }} ref={ref} data-g-name="Button"></button>
  );
};

// gondel component
import { Component, GondelBaseComponent } from '@gondel/core';

@Component('Button')
export class Button extends GondelBaseComponent {
  setIsEnabled(newState) {
    if(newState) {
        this._ctx.removeAttribute('disabled');
    } else {
        this._ctx.setAttribute('disabled');
    }
  }
}
```
