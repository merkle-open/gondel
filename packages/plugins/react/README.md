# React Lazy Plugin

This tiny plugin bootstraps React widgets and apps using Gondel.  
The only difference to `@gondel/react` is the lazy load of `react-dom`.

## Usage

html

```
  <div data-g-name="DemoWidget">Loading..</div>
```

js

```
import {GondelReactComponent} from '@gondel/plugin-react-lazy';
import {Component} from '@gondel/core';
import { App } from './App';
import React from 'react';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  intitialRender() {
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

```
  <div data-g-name="DemoWidget">
    <script type="text/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

js

```
import {GondelReactComponent} from '@gondel/plugin-react-lazy';
import {Component} from '@gondel/core';
import React from 'react';
import { App } from './App';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  intitialRender(config) {
    return (
      <App config={config} />
    )
  }
}
```


## Lazy loading

To load the javascript of your react widget only if the matching HTML Element is present you can use
the following pattern:

html

```
  <div data-g-name="DemoWidget">
    <script type="text/json">{ "foo":"bar" }</script>
    Loading..
  </div>
```

js

```
import {GondelReactComponent} from '@gondel/plugin-react-lazy';
import {Component} from '@gondel/core';
import React from 'react';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  intitialRender(config) {
    return import('./App').then(({ App }) => (
      <App config={config} />
    ));
  }
}
```

js (with async/await)
```
import {GondelReactComponent} from '@gondel/plugin-react-lazy';
import {Component} from '@gondel/core';
import React from 'react';

@Component('DemoWidget')
export class DemoWidget extends GondelReactComponent {
  intitialRender(config) {
    const { App } = await import('./App');
    return <App config={config} />;
  }
}
```
