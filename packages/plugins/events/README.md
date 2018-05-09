# Events Plugin

Installation

```
import {initEventPlugin} from '@gondel/plugin-events';
initEventPlugin();
```

## Resize

The resize event is fired if the element changed after a `window.resize` event.
The event is throttled using requestAnimationFrame

```js
  @EventListener('resize')
  handleResize(event, sizes) {
    console.log(sizes);
  }
```

## Listen to page key events

The key event is fired for every global keydown.
If a second argument is given the handler is only called for the given [key value](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values).

```js
  @EventListener('key', 'Escape') 
  keyHandler(event: KeyboardEvent) {
    alert('Escaped');
    event.preventDefault();
  }
```

# Known Issues

The `initEventPlugin` has to be called before any component is registered.