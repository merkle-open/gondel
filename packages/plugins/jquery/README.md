# jQuery Plugin

Gondel is written in vanilla js.  
For projects where jQuery is already included the jQuery plugin will allow you easy
access to the current ctx.


## Installation

```
npm i --save @gondel/plugin-jquery
```


## Usage

### Class

```js
import { GondelJqueryComponent } from '@gondel/plugin-jquery';

class MyComponent extends GondelJqueryComponent {
  start() {
    console.log(this.$ctx);
  }
}
```

### Mixin


```js
import { gondelJQueryMixin } from '@gondel/plugin-jquery';

class MyComponent extends gondelJQueryMixin(GondelBaseComponent) {
  start() {
    console.log(this.$ctx);
  }
}
```
