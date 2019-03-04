import { GondelBaseComponent, IGondelComponent } from "../../../core/src/GondelComponent";
import {
  startComponents,
  stopComponents,
  getComponentByDomNode,
  Component,
  EventListener
} from "../../../core/src/index";
import { disableAutoStart } from "../../../core/src/GondelAutoStart";
import { initResizePlugin, WINDOW_RESIZED_EVENT, COMPONENT_RESIZED_EVENT } from "./index";

const { JSDOM } = require("jsdom");

function createJsDom() {
  const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");

  // assigment needed to make gondel init and event logic work
  window = dom.window;
  document = dom.window.document;
}

function overrideClientWidthAndHeight() {
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
}

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

@Component("ResizeComponent")
class ResizeComponent extends GondelBaseComponent {
  _windowResizedEventReceived = false;
  _componentResizedEventReceived = false;
  _numberOfComponentResizeEventsHappened = 0;

  public start() {}

  public sync() {
    console.log("Component sync");
  }

  public getWindowResizeEventReceived(): boolean {
    return this._windowResizedEventReceived;
  }

  public getComponentResizeEventReceived(): boolean {
    return this._componentResizedEventReceived;
  }

  public getNumberOfComponentResizeEventsHappened(): number {
    return this._numberOfComponentResizeEventsHappened;
  }

  public getWidth(): number {
    return this._ctx.clientWidth;
  }
  public getHeight(): number {
    return this._ctx.clientHeight;
  }

  public setDimensions(width: number, height: number) {
    (this._ctx as any)._jsdomMockClientWidth = width;
    (this._ctx as any)._jsdomMockClientHeight = height;
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
    this._numberOfComponentResizeEventsHappened++;
  }
}

describe("GondelResizePlugin", () => {
  beforeEach(() => {
    disableAutoStart();
    createJsDom();
    overrideClientWidthAndHeight();
    initResizePlugin();
  });

  afterEach(() => {
    stopComponents(window.document.getElementById("resize-component")!);
    window.document.body.innerHTML = "";

    (document as any) = undefined;
    (window as any) = undefined;
  });

  /*it("should receive an window resized event upon resize", () => {
    const divElement = createMockElement("g");
    const component = getGondelComponent("g", divElement!);

    resize(1200, 600);

    expect(component.getWindowResizeEventReceived()).toBe(true);
  });*/

  /*it("should not receive an component resized event if the component's dimension did not change", () => {
    const divElement = createMockElement("g");
    const component = getGondelComponent("g", divElement!);

    expect(component.getComponentResizeEventReceived()).toBe(false);
  });*/

  /*it("should receive an component resized event if the component's dimension changed", () => {
    const divElement = createMockElement("g");

    const component = getGondelComponent("g", divElement!);
    component.setDimensions(1400, 600);

    console.log(`Client Width: ${component.getWidth()}`);
    console.log(`Client Height: ${component.getHeight()}`);

    resize(1200, 400);

    // TODO should fail, but works because initial width and height are 0.. (because sync event seems not working)
    expect(component.getComponentResizeEventReceived()).toBe(true);
  });*/

  it("should trigger 2 component resize events with a timeout of > 250ms", async () => {
    const divElement = createMockElement("g");

    const component = getGondelComponent("g", divElement!);
    component.setDimensions(1400, 600);

    resize(1200, 400);
    await new Promise(resolve => setTimeout(resolve, 300));
    // TODO why does the test fail if dimensions are not set again (according to code, dimensions should be reset after 250ms)
    // component.setDimensions(1400, 600);
    resize(1100, 300);

    expect(component.getNumberOfComponentResizeEventsHappened()).toBe(2);
  });
});
