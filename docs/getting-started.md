---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

Here's how to get started:

## Installation

To add Gondel to your project, execute the following line in your project directory:

`npm install @gondel/core --save`

This will install the core gondel library in your local project, and add it to your `package.json`.

## Using Gondel

Ok, now you installed Gondel, but how do you use it?
Well, first you need to modify your HTML code a bit. Let's say you have the following markup:

```html
<div>
    I am the example markup, hear me roar.
</div>
```

To initialize gondel on the `<div>` element, you need to decorate your markup by adding a `data-g-name` attribute to the corresponding element, like so:

```html
<div data-g-name="example">
    I am the example markup, hear me roar.
</div>
```

Now, when Gondel runs, it will know to take control of this `<div>`, because of the `data-g-name` attribute.

But for now, our code does nothing. So let's add some behaviour to demonstarte it:

Create a `example.js` file in your project, and paste the following content:
```javascript
import {
  Component,
  EventListener,
  GondelBaseComponent,
  startComponents
} from '@gondel/core';

@Component('Example')
export class Example extends GondelBaseComponent {
  start() {
    this._ctx.innerHTML = 'Hello from Gondel!';
  }
};

startComponents();
```


Presto! Our `<div>` now changes it's inner content to `Hello from Gondel!`. But how did it do that? Let me explain line by line:

## The decorator

Let's analyze the following code:

```javascript
@Component('Example')
export class Example extends GondelBaseComponent {
  start() {
    this._ctx.innerHTML = 'Hello from Gondel!';
  }
};
```

The first line of our code is a *class decorator*. They are a new ES6 feature, which is still in stage-2 at the moment. However, they are an integral part of *Typescript*, in which Gondel was written. So if you can, it is highly recomended to use Typescript to write your Gondel components.

The line 
`@Component('Example')` invokes the `Component` decorator, with the `Example` parameter. What that means is that the DOM element with the attribute `data-g-name="Example"` will be assigned to the `this._ctx` property of the following class.

## The class definition
Ok, but what about the rest of the class definition? What is this `extend` thing?

`export class Example extends GondelBaseComponent`

Well, the `extend` keyword means that our Example class will inherit some methods from the `GondelBaseComponent` class. What are those methods? Well you can find all of them here: `//TODO`

## The start method
One of them is the `start()` method. This is the method that will be invoked when gondel initializes.

Within our `start()` method, we are changing the `innerHTML` of our `<div data-g-name="Example">` element, to:

`Hello from Gondel!`


## Gondel bootstraping
Finally, there is the following line:

`startComponents();`

This will initialize Gondel, scan the page for elements containing the `data-g-name` attribute, and execute the start method of the corresponding modules.

## Live example
You can also find this code example live on StackBlitz:
https://stackblitz.com/edit/js-6sn3wb
