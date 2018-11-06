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

@Component('Resize')
export class Resize extends GondelBaseComponent {
  @EventListener(WINDOW_RESIZED)
  _handleWindowResizeEvent(event, dimensions) {
    // add your code
  }
}
```

## Known Issues

The `initResizePlugin` has to be called before any component is registered.
