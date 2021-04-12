import { Component, GondelBaseComponent } from '@gondel/core';

@Component('Button')
class Button extends GondelBaseComponent {
	start() {
		console.log('started');
	}

	stop() {
		console.log('stopped');
	}

	setIsEnabled(isEnabled: boolean) {
		if (isEnabled) {
			this._ctx.removeAttribute('disabled');
		} else {
			this._ctx.setAttribute('disabled', '');
		}
	}
}
export default Button;
