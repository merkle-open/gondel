import { Component, EventListener, GondelBaseComponent } from '@gondel/core';

@Component('Button')
export default class Button extends GondelBaseComponent {

  @EventListener('mouseover')
  _handleMouseOver(event) {
    this._ctx.style.border = '1px solid orange';
  }

  @EventListener('mouseout')
  _handleMouseOut(event) {
    this._ctx.style.border = '';
  }

  @EventListener('swipe-left') 
  _handleSwipeLeft(event) {
    console.log(this._ctx, 'was swiped left');
  }

  @EventListener('swipe-right') 
  _handleSwipeRight(event) {
    console.log(this._ctx, 'was swiped right');
  }

  @EventListener('key', 'Escape') 
  _handleEscapePress(event) {
    console.log('Global escape key was pressed');
  }

  @EventListener('resize') 
  _handleResize(event) {
    console.log(this._ctx, 'was resized');
  }


};
