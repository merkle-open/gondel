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
<button>
    I am a Button
</button>
```

To initialize gondel on the `<button>` element, you need to decorate your markup by adding a `data-g-name` attribute to the corresponding element, like so:

```html
<div data-g-name="Button">
   I am a Button
</div>
```

Now, when Gondel runs, it will know to take control of this `<button>`, because of the `data-g-name` attribute.

But for now, our code does nothing. So let's add some behaviour to demonstrate it:

Create a `button.js` file in your project, and paste the following content:
```javascript
import {
  Component,
  EventListener,
  GondelBaseComponent
} from '@gondel/core';

@Component('Button')
export class Example extends GondelBaseComponent {
  start() {
    console.log('The button has been initialized');
  }

  @EventListener('click')
  _handleChange(event) {
     alert('Hello World');
   }
};
```

Presto! Our `<button>` now shows an alert box on click. But how did it do that? Let me explain line by line:

## The decorator

Let's analyze the following code:

```javascript
@Component('Button')
export class Example extends GondelBaseComponent {
  start() {
    console.log('The button has been initialized');
  }

  @EventListener('click')
  _handleChange(event) {
     alert('Hello World');
   }
};
```

The first line of our code is a *class decorator*. They are a new ES6 feature, which is still in stage-2 at the moment. However, they are an integral part of *Typescript*, in which Gondel was written. So if you can, it is highly recommended to use Typescript to write your Gondel components.

The line 
`@Component('Button')` invokes the `Component` decorator, with the `Button` parameter. What that means is that the DOM element with the attribute `data-g-name="Button"` will be assigned to the `this._ctx` property of the following class.

## The class definition

Ok, but what about the rest of the class definition? What is this `extend` thing?

`export class Button extends GondelBaseComponent`

Well, the `extend` keyword means that our Example class will inherit some methods from the `GondelBaseComponent` class. What are those methods? Well you can find all of them [here](../packages/core/src/GondelComponent.ts).

## The start method

One of them is the `start()` method. This is the method that will be invoked when gondel initializes.

Within our `start()` method, we are logging to the console that our button component has started.

## Gondel bootstraping

Gondel will be initialized automatically, and will scan the page for elements containing the `data-g-name` attribute, and execute the start method of the corresponding modules.

## Live example

You can also find this code example live on [CodeSandbox](https://codesandbox.io/s/github/namics/gondel/tree/master/examples/hello-world)
