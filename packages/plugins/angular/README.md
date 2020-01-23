# Angular Plugin

This tiny plugin bootstraps Angular widgets and apps using Gondel.  

#### Installation

```bash
# install pre-requisites
npm i --save
    @angular/common
    @angular/compiler
    @angular/platform-browser
    @angular/platform-browser-dynamic

# install the plugin
npm i --save @gondel/plugin-angular
```

#### Compatiblity

The plugin currently supports Angular version >= 8.0.0 < 9.0.0

## Basic usage

This section handles bootstrapping a basic module without any state nor connection to the outter world of angular itself. If you're already up and running you may take a look at the [using an initial state](#using-an-initial-state) or [interacting with the Gondel component](#interacting-with-the-gondel-component) sections below or take a look at the [recipes](#recipes) section for any frequently asked questions.

### HTML

```html
<div data-g-name="DemoWidget">
    Loading..
</div>
```

### JavaScript

##### demo-widget.module.ts (@NgModule)

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { DemoWidget } from "./calculator.component";

@NgModule({
  imports: [
        CommonModule,
        BrowserModule // <- required!
    ],
    declarations: [DemoWidget],
    bootstrap: [DemoWidget]
})
export class DemoWidgetModule {}

```

##### demo-widget.ts (Gondel)

```ts
import { Component } from "@gondel/core";
import { GondelAngularComponent } from "@gondel/plugin-angular";

@Component("Tool")
export class Tool extends GondelAngularComponent {
    // import your angular module here
    AppModule = import("./demo-widget.module").then(mod => mod.DemoWidgetModule);
}
```

## Using an initial state

### HTML

```html
<div data-g-name="DemoWidget">
    <script type="text/json">{ "message": "Hello World!" }</script>
    Loading..
</div>
```

### JavaScript

##### demo-widget.ts <small>(Gondel Component)</small>

As you may know, Angular is based on the dependency injection pattern. Thus to pass data
from outside of any Angular application you need to define an injectable. In this case 
we need to create a new injection token which is then used by the plugin to provide the
internal data.

```ts
import { Component } from "@gondel/core";
import { GondelAngularComponent, createStateProvider } from "@gondel/plugin-angular";

export interface DemoWidgetState {
  message: string;
}

export const DemoWidgetStateProvider =
    createStateProvider<DemoWidgetState>("demoWidgetState");

@Component("DemoWidget")
export class DemoWidget extends GondelAngularComponent {
    // import your angular module here
    AppModule = import("./demo-widget.module")
        .then(mod => mod.DemoWidgetModule);

    // injectable state reference, see example in next snippet
    StateProvider = DemoWidgetStateProvider;
}
```


##### demo-widget.component.ts <small>(Angular Component)</small>

```ts
import { Component, Inject } from "@angular/core";
import { DemoWidgetStateProvider, DemoWidgetState } from "./demo-widget";

@Component({
  template: `<h1>{{message}}</h1>`
})
export class DemoWidget {
  public message: string = "";

    constructor(
      @Inject(DemoWidgetStateProvider) state: DemoWidgetState
    ) {
        this.title = state.message;
    }
}
```



## Interacting with the Gondel component

##### demo-widget.ts <small>(Gondel Component)</small>

```ts
import { Component } from "@gondel/core";
import {
    GondelAngularComponent,
    createGondelComponentProvider
} from "@gondel/plugin-angular";

export const DemoWidgetComponentRef = createGondelComponentProvider<DemoWidget>();

@Component("DemoWidget")
export class DemoWidget extends GondelAngularComponent {
    // import your angular module here
    AppModule = import("./demo-widget.module")
        .then(mod => mod.DemoWidgetModule);

    // injectable gondel component reference, see example in next snippet
    GondelComponentProvider = DemoWidgetComponentRef;

    // will be triggered inside an Angular component
    public sendMessage(message: string) {
        alert(message);
    }
}
```


##### demo-widget.component.ts <small>(Angular Component)</small>

```ts
import { Component, Inject } from "@angular/core";
import { DemoWidget, DemoWidgetComponentRef } from "./demo-widget";

@Component({
  template: `<button (click)="sayHi()">{{message}}</button>`
})
export class DemoWidget {

    constructor(@Inject(DemoWidgetComponentRef) private component: DemoWidget) {}

    sayHi() {
        this.component.sendMessage('Hello from Angular!');
    }
}
```


## Interacting with Angular

*not supported yet, tbd.*


## Other Recipes

### Using the `templateUrl` for Angular components

*webpack recipe tbd.*
