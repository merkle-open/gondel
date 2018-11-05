# Resize Plugin

Installation

```
import { initResizePlugin } from '@gondel/plugin-resize';
initResizePlugin();
```

## Event Listener

The resize event is fired if the element changed after a `window.resize` event.
The event is throttled using requestAnimationFrame

```js
import { WINDOW_RESIZED } from '@gondel/plugin-resize';
@EventListener(WINDOW_RESIZED)
public _handleWindowResizeEvent() {
    // add your code
}
```

# Known Issues

The `initResizePlugin` has to be called before any component is registered.
