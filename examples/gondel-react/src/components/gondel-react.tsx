import { Component } from '@gondel/core';
import { GondelReactComponent } from '@gondel/plugin-react';

const loader = async () => import('./App');

@Component('GondelReactWidget')
class GondelReactWidget extends GondelReactComponent.create(loader, 'ReactApp') {
	setTitle(newTitle: string) {
		this.setState({ title: newTitle });
	}
}

export { GondelReactWidget };
