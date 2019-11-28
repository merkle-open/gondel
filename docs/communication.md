---
id: communication
title: Communication
sidebar_label: Communication
---

When building more complex patterns, your patterns might need to communicate between them. The following examples give you
a deeper dive after looking at the [API reference](api.md).

## getComponentByDomNode

With `getComponentByDomNode` you can access any component by providing it's dom node. After holding onto
the instance of your component, you can call any public method on it:

```js
import { Component, getComponentByDomNode } from '@gondel/core';
import { Bar } from '../../path/to/pattern/bar/js/bar';

@Component('Foo')
export class Foo extends GondelBaseComponent {
  start() {
    const component = document.querySelector('.bar');
    
    if (hasMountedGondelComponent(component)) {
      const bar = getComponentByDomNode(component);
            
       bar.helloWorld();
    }
  }
}
```

Please note: If you need access to a component which is not a parent or a child of your current component, it recommends 
to create a shared parent to prevent searching for your node over the whole document.

### Live Example

https://codesandbox.io/s/github/namics/gondel/tree/master/examples/get-component-by-dom-node

## findComponents

With `findComponents` you can access any child component of your current component. After holding onto
the instance of your component, you can call any public method on it:

```js
import { Component, findComponents } from '@gondel/core';
import { Bar } from '../../path/to/pattern/bar/js/bar';

@Component('Foo')
export class Foo extends GondelBaseComponent {
  start() {
    const barComponents = findComponents(this._ctx, 'Bar');
    
    if (barComponents.length > 0) {
      const bar = barComponents[0];
      bar.helloWorld();
    }
  }
}
```

### Live Example

https://codesandbox.io/s/github/namics/gondel/tree/master/examples/find-components

## triggerPublicEvent

With `triggerPublicEvent` you can trigger a public event which bubbles up the dom tree until he get's consumed.
You can listen for it in any parent component and do some action:

```js
import { Component, triggerPublicEvent } from '@gondel/core';

@Component('Foo')
export class Foo extends GondelBaseComponent {
  start() {
    triggerPublicEvent('gCustomEventHandler', this, undefined, { yourProperty: 'This is event data attached to the event' });
  }
}

@Component('Bar')
export class Bar extends GondelBaseComponent {
  @EventListener('gCustomEventHandler')
  public _handleCustomEvent(event) {
    // access event data
    console.log(event.data.eventData.yourProperty);
  }
}
```

Please note: 
* `triggerPublicEvent` is especially useful in cases where you don't want to get a hold on your target component, e.g. 
disabling scroll on your page controller component
* The third argument can be an optional target to limit who is allowed to listen for the Event
* The fifth argument can be an optional boolean if the event should bubble
* The component `Bar` needs to be a parent of `Foo` within the markup to be able to receive the public event

### Live Example

https://codesandbox.io/s/github/namics/gondel/tree/master/examples/trigger-public-event
