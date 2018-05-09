import {
  startComponents,
  stopComponents,
  getComponentByDomNode,
  getComponentByDomNodeAsync,
  registerComponent,
  triggerPublicEvent,
  Component,
  EventListener
} from "./index";

import { GondelBaseComponent, IGondelComponent } from "./GondelComponent";

function createMockElement(namespace: string) {
  const buttonElement = document.createElement("div");
  buttonElement.innerHTML = `
    <span class='child'>
      <span class='grand-child'>Click me</span>
    </span>
    <span class='sibling'>
    </span>
  `;
  buttonElement.setAttribute("data-" + namespace + "-name", "Button");
  document.documentElement.appendChild(buttonElement);
  return buttonElement;
}

describe("GondelComponentStarter", () => {
  describe("#component - e2e", () => {
    it("should call the constructor during start", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {
        _wasConstructed: boolean;
        constructor() {
          super();
          this._wasConstructed = true;
        }
      }
      const buttonElement = createMockElement("g");
      startComponents();
      const button = getComponentByDomNode(buttonElement) as Button;
      expect(button._wasConstructed).toBe(true);
    });

    it("should call the start method during start", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {
        _wasStarted: boolean;
        start() {
          this._wasStarted = true;
        }
      }
      const buttonElement = createMockElement("g");
      startComponents();
      const button = getComponentByDomNode(buttonElement) as Button;
      expect(button._wasStarted).toBe(true);
    });

    it("should resolve the boot after sync start", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {
        _wasStarted: boolean;
        start() {
          this._wasStarted = true;
        }
      }
      const buttonElement = createMockElement("g");
      return startComponents(buttonElement).then((components: Array<Button>) => {
        expect(components.length).toBe(1);
        expect(components[0]._wasStarted).toBe(true);
      });
    });

    it("should resolve the boot after async start", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {
        _wasStarted: boolean;
        start(resolve: any) {
          setTimeout(() => {
            this._wasStarted = true;
            resolve();
          });
        }
      }
      const buttonElement = createMockElement("g");
      return startComponents(buttonElement).then((components: Array<Button>) => {
        expect(components.length).toBe(1);
        expect(components[0]._wasStarted).toBe(true);
      });
    });

    it("should resolve the boot after async promise start", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {
        _wasStarted: boolean;
        start() {
          return new Promise(resolve => {
            setTimeout(() => {
              this._wasStarted = true;
              resolve();
            });
          });
        }
      }
      const buttonElement = createMockElement("g");
      return startComponents(buttonElement).then((components: Array<Button>) => {
        expect(components.length).toBe(1);
        expect(components[0]._wasStarted).toBe(true);
      });
    });

    it("should call the sync method after start", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {
        _wasSynced: boolean;
        sync() {
          this._wasSynced = true;
        }
      }
      const buttonElement = createMockElement("g");
      startComponents(buttonElement);
      return getComponentByDomNodeAsync(buttonElement).then((button: Button) => {
        expect(button._wasSynced).toBe(true);
      });
    });

    it("should add a stop method to stop the component", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {}
      const buttonElement = createMockElement("g");
      startComponents(buttonElement);
      const button = getComponentByDomNode(buttonElement) as Button;
      button.stop();
      expect(getComponentByDomNode(buttonElement)).toBe(undefined);
    });

    it("should add a the default namespace", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {}
      const buttonElement = createMockElement("g");
      startComponents(buttonElement);
      const button = getComponentByDomNode(buttonElement) as Button;
      expect(button._namespace).toBe("g");
    });

    it("should add a custom namespace", () => {
      @Component("Button", "x")
      class Button extends GondelBaseComponent {}
      const buttonElement = createMockElement("x");
      startComponents(buttonElement, "x");
      const button = getComponentByDomNode(buttonElement, "x") as Button;
      expect(button._namespace).toBe("x");
    });

    it("should add a the component name", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {}
      const buttonElement = createMockElement("g");
      startComponents(buttonElement);
      const button = getComponentByDomNode(buttonElement) as Button;
      expect(button._componentName).toBe("Button");
    });

    it("should add a reference to the dom element", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {}
      const buttonElement = createMockElement("g");
      startComponents(buttonElement);
      const button = getComponentByDomNode(buttonElement) as Button;
      expect(button._ctx).toBe(buttonElement);
    });

    it("should throw if a component is not registered", () => {
      const buttonElement = createMockElement("zzz");
      @Component("FancyComponent", "zzz")
      class FancyComponent extends GondelBaseComponent {}
      let errorMessage = "No error";
      try {
        startComponents(undefined, "zzz");
      } catch (error) {
        errorMessage = error.toString();
      }
      expect(errorMessage).toBe("Error: Failed to boot component - Button is not registred");
    });
  });
});
