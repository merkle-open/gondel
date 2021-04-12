import { Component, EventListener, GondelBaseComponent, findComponents } from '@gondel/core';
import { data, JSONSerializer, NumberSerializer } from '@gondel/plugin-data';
import { Input } from './input';

type Model = {
	userId: number;
	id: number;
	title: string;
	body: string;
};

@Component('Search')
export class Search extends GondelBaseComponent {
	// data-language
	@data
	_dataLanguage = 'de';

	// data-endpoint
	@data
	dataEndpoint: string;

	// data-host
	@data('host')
	host: string;

	// data-results
	@data('results', JSONSerializer)
	results: Model | {};

	// data-status-code
	@data('status-code', NumberSerializer)
	httpStatusCode: number;

	private selectedSearchID: string;

	@EventListener('gInput')
	public _handleChange() {
		this.selectedSearchID = this._getInput().getValue();
		this._search();
	}

	private async _search(): Promise<void> {
		if (!this.selectedSearchID) {
			document.getElementById('results')!.innerHTML = 'please enter a valid ID';
			return;
		}

		const requestURL = `${this.host}/${this.dataEndpoint}/${this.selectedSearchID}`;
		const response = await fetch(requestURL);
		this.httpStatusCode = response.status;

		if (response.status === 404) {
			document.getElementById('results')!.innerHTML = 'no results found :(';
			this.results = {};
			return;
		}

		this.renderResults(response);
	}

	private async renderResults(response: Response) {
		const $results = document.getElementById('results');
		const result: Model = await response.json();

		this.results = result;
		$results!.innerHTML = `
      <h2>${result.title} (ID: ${result.id})</h2>
      <p>${result.body}</p>
    `;
	}

	private _getInput(): Input {
		return findComponents<Input>(this._ctx, 'Input')[0];
	}
}
