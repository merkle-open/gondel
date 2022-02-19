import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('Button')
class Button extends GondelBaseComponent {

  @EventListener('click')
  async _handleMouseClick(event) {
    // Lazy load npm library
    const { getLoremChucksum } = await import('lorem-chucksum/lib/index');
    // Use the lazy loaded library
    const lorem = getLoremChucksum({
      count: 1,
      unit: 'sentences',
    });
    alert (lorem);
  }
}

export default Button;
