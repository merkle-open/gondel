import { Component, EventListener, GondelBaseComponent, findComponents } from "@gondel/core";
import { data } from "@gondel/plugin-data";
import { Input } from "./input";

type Model = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

@Component("Search")
export class Search extends GondelBaseComponent {
  @data("host")
  private host: string;
  @data("endpoint")
  private endpoint: string;

  private selectedSearchID: string;

  @EventListener("gInput")
  public _handleChange() {
    this.selectedSearchID = this._getInput().getValue();
    this._search();
  }

  private async _search() {
    if (!this.selectedSearchID) {
      return (document.getElementById("results")!.innerHTML = "please enter a valid ID");
    }

    const requestURL = `${this.host}/${this.endpoint}/${this.selectedSearchID}`;
    const response = await fetch(requestURL);

    if (response.status === 404) {
      return (document.getElementById("results")!.innerHTML = "no results found :(");
    }

    this.renderResults(response);
  }

  private async renderResults(response: Response) {
    const $results = document.getElementById("results");
    const result: Model = await response.json();

    $results!.innerHTML = `
      <h2>${result.title} (ID: ${result.id})</h2>
      <p>${result.body}</p>
    `;
  }

  private _getInput(): Input {
    return findComponents<Input>(this._ctx, "Input")[0];
  }
}
