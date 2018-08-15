import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('Button')
export class Button extends GondelBaseComponent {

  @EventListener('click') 
  async _handleMouseClick(event) {
    // Lazy load npm library
    const {Funnies} = await import('funnies');
    // Use the lazy loaded library
    let funnies = new Funnies();
    alert (funnies.message());
  }

};
