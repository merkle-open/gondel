import { GondelBaseComponent, IGondelComponent } from "../../../core/src/GondelComponent";
import {
  startComponents,
  getComponentByDomNode,
  Component,
  EventListener
} from "../../../core/src/index";
import { disableAutoStart } from "../../../core/src/GondelAutoStart";
import { initResizePlugin, WINDOW_RESIZED_EVENT, COMPONENT_RESIZED_EVENT } from "./index";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");

window = dom.window;
document = dom.window.document;

function resize(width: number, height: number) {
  // Simulate window resize event
  const resizeEvent = document.createEvent("Event");
  resizeEvent.initEvent("resize", true, true);
  (window as any).innerWidth = width || window.innerWidth;
  (window as any).innerHeight = height || window.innerHeight;

  window.dispatchEvent(resizeEvent);
}

function createMockElement(namespace: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = `<p>This is a container being resized</p>`;
  divElement.setAttribute("data-" + namespace + "-name", "ResizeComponent");

  window.document.body.appendChild(divElement);

  return divElement;
}

function getGondelComponent(namespace: string, divElement: HTMLElement): ResizeComponent {
  startComponents(divElement, namespace);
  return getComponentByDomNode(divElement, namespace);
}

disableAutoStart();
initResizePlugin();

@Component("ResizeComponent")
class ResizeComponent extends GondelBaseComponent {
  _componentWidth = 0;
  _componentHeight = 0;
  _windowResizedEventReceived = false;
  _componentResizedEventReceived = false;
  public start() {}
  public getWindowResizeEventReceived(): boolean {
    return this._windowResizedEventReceived;
  }

  public getComponentResizeEventReceived(): boolean {
    return this._componentResizedEventReceived;
  }
  public getWidth(): number {
    return this._componentWidth;
  }
  public getHeight(): number {
    return this._componentHeight;
  }
  @EventListener(WINDOW_RESIZED_EVENT)
  public _handleWindowResizeEvent() {
    console.log("window resize happened");
    this._windowResizedEventReceived = true;
  }
  @EventListener(COMPONENT_RESIZED_EVENT)
  public _handleComponentResizeEvent() {
    console.log("component resize happened");
    this._componentResizedEventReceived = true;
  }
  private setDimensions() {
    this._componentWidth = this._ctx.offsetWidth;
    this._componentHeight = this._ctx.offsetHeight;
  }
}

describe("GondelResizePlugin", () => {
  it("should receive an window resized event upon resize", () => {
    const divElement = createMockElement("g");
    const component = getGondelComponent("g", divElement);

    resize(1200, 600);

    expect(component.getWindowResizeEventReceived()).toBe(true);
  });

  /*it("should receive an component resized event upon resize", () => {
    resize(1400, 800);
    const component = createMockElement('g') as ResizeComponent;
    resize(1200, 600);

    expect(component.getComponentResizeEventReceived()).toBe(true);
  });*/
});
