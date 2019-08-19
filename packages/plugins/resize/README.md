# Resize Plugin

Installation

```
import { initResizePlugin } from '@gondel/plugin-resize';
initResizePlugin();
```

## Event Listener

The resize event is fired if the element changed after a `window.resize` event.
The event is throttled using requestAnimationFrame

```typescript
import { Component, EventListener, GondelBaseComponent } from '@gondel/core';
import { WINDOW_RESIZED_EVENT } from '@gondel/plugin-resize';

@Component('WindowResize')
export class WindowResize extends GondelBaseComponent {
  @EventListener(WINDOW_RESIZED_EVENT)
  _handleWindowResizeEvent(event: UIEvent) {
    console.log(event);
  }
}

import { COMPONENT_RESIZED_EVENT, IComponentDimension } from '@gondel/plugin-resize';

@Component('ComponentResize')
export class ComponentResize extends GondelBaseComponent {
  @EventListener(COMPONENT_RESIZED_EVENT)
  _handleComponentResizeEvent(event: UIEvent, dimensions: IComponentDimension) {
    // event is only getting fired if the component dimensions did change
    console.log(event);
    console.log(dimensions);
  }
}
```

## Known Issues

The `initResizePlugin` has to be called before any component is registered.
