import './styles.css';
import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

@Component('Rating')
class Rating extends GondelBaseComponent {

  @EventListener("input", ".rating__input")
  _handleInput(event) {
    this._ctx.style.setProperty("--rating", event.target.value);
  }
}

export default Rating;
