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


## Lazy loading

To download the javascript of your react widget only if the matching HTML Element is present you can use
the following pattern:

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
import React from 'react';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  async start() {
      this.App = await (import('./App')).App;
  }
  render(config) {
    const App = this.App;
    return 
      <App config={config} />
    ));
  }
}
```


## Component linking

It's also possible to link a gondel component to a react component without using a render method.

### Sync linking example

```js
import {GondelReactComponent} from '@gondel/plugin-react';
import {Component} from '@gondel/core';
import {App} from './App';
import React from 'react';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  App = App;
}
```

### Async linking example

```js
import {GondelReactComponent} from '@gondel/plugin-react';
import {Component} from '@gondel/core';
import React from 'react';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  async start() {
      this.App = await import('./App').App;
  }
}
```


## Manipulating state

It is possible to manipulate the state inside a public method.

```js
import {GondelReactComponent} from '@gondel/plugin-react';
import {Component} from '@gondel/core';
import {App} from './App';
import React from 'react';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent<{counter: number}> {
  App = App;

  setCounter(counter: number) {
      this.setState({counter})
  }
}
```

With this public method it is now possible to set the counter using
get component by using [`getComponentByDomNode`](https://gondel.js.org/docs/api.html#getcomponentbydomnode-domnode-namespace-gondelbasecomponent):


```js
getComponentByDomNode(domElement).setCounter(10)
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
