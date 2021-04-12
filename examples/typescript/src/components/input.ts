import { Component, EventListener, GondelBaseComponent, triggerPublicEvent } from '@gondel/core';

@Component('Input')
class Input extends GondelBaseComponent<HTMLInputElement> {
	@EventListener('input')
	_handleInput() {
		triggerPublicEvent('gInput', this);
	}

	setValue(newValue: string) {
		this._ctx.value = newValue;
	}

	getValue() {
		return this._ctx.value;
	}
}

export default Input;
