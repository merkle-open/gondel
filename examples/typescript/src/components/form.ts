import { Component, EventListener, GondelBaseComponent, findComponents } from "@gondel/core";
import { Button } from "./button";
import { Input } from "./input";

@Component("Form")
export class Form extends GondelBaseComponent {
  @EventListener("key", "Escape")
  _clearForm() {
    this._getInputs().forEach(input => input.setValue(""));
    this._handleChange();
  }

  @EventListener("submit")
  _handleSubmit(event) {
    alert("Submitted");
    event.preventDefault();
  }

  @EventListener("gInput")
  _handleChange(event?) {
    const hasEmptyElements = this._getInputs().some(input => !input.getValue());
    this._getSubmitButton().setIsEnabled(!hasEmptyElements);
  }

  _getInputs(): Array<Input> {
    return findComponents(this._ctx, "Input") as Array<Input>;
  }

  _getSubmitButton(): Button {
    return findComponents(this._ctx, "Button")[0] as Button;
  }
}
