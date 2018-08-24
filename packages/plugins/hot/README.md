# Hot Loader

Adds support for hot-module-reloading (hmr) for Gondel components.  

## Installation

```
npm i --save-dev @gondel/plugin-hot
```

## Usage 

Add the follwoing code to your your entry point:

```js
import {hot} from '@gondel/plugin-hot';
hot(module);
```
