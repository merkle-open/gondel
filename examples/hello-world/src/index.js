import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

// The @Component decorator will connect the class with `data-g-name="Button"` elements.
@Component('Button')
export class Button extends GondelBaseComponent {
  @EventListener('click')
  _handleChange(event) {
    alert('Hello World');
  }
}
