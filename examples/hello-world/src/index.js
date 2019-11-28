import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

// The @Component decorator will connect the class with `data-g-name="Button"` elements.
@Component('Button')
class Button extends GondelBaseComponent {
  start() {
    console.log('The button has been initialized');
  }
  @EventListener('click')
  _handleChange(event) {
    alert('Hello World');
  }
}

export default Button;
