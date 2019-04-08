---
id: communication
title: Communication
sidebar_label: Communication
---

When building more complex patterns, your patterns might need to communicate with each others.

## getComponentByDomNode

With `getComponentByDomNode` you can access any component by providing it's dom node. After holding onto
the instance of your component, you can call any public method on it:

```js
import { Component, getComponentByDomNode } from '@gondel/core';
import { Bar } from '../../path/to/pattern/bar/js/bar';

@Component('Foo')
export class Foo extends GondelBaseComponent {
  start() {
    if (document.getElementsByClassName('bar') === null || document.getElementsByClassName('bar').length === 0) {
      return console.warn(`Component bar has not been found`);
    } else {
      const bar = getComponentByDomNode<Bar>(document.getElementsByClassName('bar'));
      
      bar.helloWorld();
    }
  }
}
```

## findComponents

With `findComponents` you can access any child component of your current component. After holding onto
the instance of your component, you can call any public method on it:

```js
import { Component, findComponents } from '@gondel/core';
import { Bar } from '../../path/to/pattern/bar/js/bar';

@Component('Foo')
export class Foo extends GondelBaseComponent {
  start() {
    const barComponents = findComponents<Bar>(this._ctx, 'Bar');
    
    if (barComponents.length > 0) {
      const bar = barComponents[0];
      bar.helloWorld();
    }
  }
}
```

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
* The third argument can be an optional target to limit who is allowed to listen for the Event
* The fifth argument can be an optional boolean if the event should bubble
* The component `Bar` needs to be a parent of `Foo` within the markup to be able to receive the public event

## Live examples

You can also find this code example live on StackBlitz:

* https://stackblitz.com/edit/gondel-communication-get-component-by-dom-node
* https://stackblitz.com/edit/gondel-communication-find-components
* https://stackblitz.com/edit/gondel-communication-find-components-promise
* https://stackblitz.com/edit/gondel-communication-trigger-public-event
