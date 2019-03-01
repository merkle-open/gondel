import { GondelBaseComponent, IGondelComponent } from "../../../core/src/GondelComponent";
import {
  startComponents,
  getComponentByDomNode,
  Component,
  EventListener
} from "../../../core/src/index";
import { disableAutoStart } from "../../../core/src/GondelAutoStart";
import { initResizePlugin, WINDOW_RESIZED_EVENT, COMPONENT_RESIZED_EVENT } from "./index";

const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");

// assigment needed to make gondel init and event logic work
window = dom.window;
document = dom.window.document;

// mock clientWidth and clientHeight, see https://github.com/jsdom/jsdom/issues/2342
Object.defineProperty((window as any).HTMLElement.prototype, "clientWidth", {
  get: function() {
    return this._jsdomMockClientWidth || 0;
  }
});

Object.defineProperty((window as any).HTMLElement.prototype, "clientHeight", {
  get: function() {
    return this._jsdomMockClientHeight || 0;
  }
});

function resize(width: number, height: number) {
  // Simulate window resize event
  const resizeEvent = document.createEvent("Event");
  resizeEvent.initEvent("resize", true, true);
  (window as any).innerWidth = width || window.innerWidth;
  (window as any).innerHeight = height || window.innerHeight;

  window.dispatchEvent(resizeEvent);
}

function createMockElement(namespace: string) {
  window.document.body.innerHTML = `<div id="resize-component" data-${namespace}-name="ResizeComponent"><p>This is a container being resized</p></div>`;
  return window.document.getElementById("resize-component");
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
    const component = getGondelComponent("g", divElement!);

    resize(1200, 600);

    expect(component.getWindowResizeEventReceived()).toBe(true);
  });

  /* it("should receive an component resized event upon resize", () => {
    const divElement = createMockElement("g");

    debugger;

    const test = window.document.querySelector("div");

    (test as any)._jsdomMockClientWidth = 1400;
    (test as any)._jsdomMockClientHeight = 600;

    console.log(`Client Width: ${test!.clientWidth}`);
    console.log(`Client Height: ${test!.clientHeight}`);

    const component = getGondelComponent("g", divElement!);

    resize(1200, 600);

    expect(component.getComponentResizeEventReceived()).toBe(true);
  }); */
});
