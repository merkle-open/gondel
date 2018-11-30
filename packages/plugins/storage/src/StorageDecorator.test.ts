import {
  startComponents,
  getComponentByDomNode,
  Component,
  GondelBaseComponent,
  GondelComponent
} from "@gondel/core";
import { storage } from "./StorageDecorator";
import JSONSerializer from "./serializer/JSON";
import { Adapter } from "./Adapter";

function createMockElement(component: string, namespace: string = "g") {
  const buttonElement = document.createElement("div");
  buttonElement.setAttribute("data-" + namespace + "-name", component);
  document.documentElement!.appendChild(buttonElement);
  startComponents(buttonElement, namespace);
  return getComponentByDomNode(buttonElement, namespace)!;
}

beforeAll(() => {
  localStorage.clear();
  sessionStorage.clear();
});

const snapshotify = (val: any) => JSON.stringify(val);

describe("@gondel/plugin-data", () => {
  describe("@storage", () => {
    it("should bind to the localstorage", () => {
      @Component("Button")
      class Button extends GondelBaseComponent {
        @storage
        testProp: string;

        setTestProp() {
          this.testProp = "hellow there!";
        }
      }

      const button = createMockElement("Button") as Button;
      expect(button).toMatchSnapshot();
      expect(button.testProp).toBeUndefined();
      button.setTestProp();
      expect(button.testProp).toEqual("hellow there!");
      expect(button).toMatchSnapshot();
    });
  });

  describe("@storage()", () => {
    it("with serializer", () => {
      const tdata = {
        a: 10,
        b: "test",
        c: [1, "10", { d: [5] }]
      };

      @Component("Button")
      class Button extends GondelBaseComponent {
        @storage("anotherTestProp", JSONSerializer)
        testProp: Object;

        setTestProp() {
          this.testProp = tdata;
        }
      }

      const button = createMockElement("Button") as Button;
      expect(button).toMatchSnapshot();
      expect(button.testProp).toBeUndefined();
      button.setTestProp();
      expect(button.testProp).toEqual({
        a: 10,
        b: "test",
        c: [1, "10", { d: [5] }]
      });
      expect(button).toMatchSnapshot();
    });

    it("with custom adapter", () => {
      const customAdapter = new Adapter("custom-test", localStorage);
      customAdapter.configure({
        prefix: "custom",
        postfix: "custom",
        delimitier: "_"
      });

      customAdapter.set("test", "10");
      expect(snapshotify(localStorage)).toMatchSnapshot();
      expect(customAdapter.get("test")).toEqual("10");
      expect(localStorage.getItem("custom_test_custom")).toBeDefined();
    });

    it("syncs to all components on getter call", () => {
      @Component("A")
      class A extends GondelBaseComponent {
        @storage("sync")
        message: string;

        hello() {
          this.message = "Hello from A";
        }
      }

      @Component("B")
      class B extends GondelBaseComponent {
        @storage("sync")
        message: string;

        hello() {
          this.message = "Hello from B";
        }
      }

      const a = createMockElement("A") as A;
      const b = createMockElement("B") as B;
      expect(a).toMatchSnapshot();
      expect(b).toMatchSnapshot();
      expect(snapshotify(localStorage)).toMatchSnapshot();

      a.hello();
      expect(snapshotify(localStorage)).toMatchSnapshot();
      expect(a.message).toEqual("Hello from A");
      expect(b.message).toEqual("Hello from A");

      b.hello();
      expect(snapshotify(localStorage)).toMatchSnapshot();
      expect(a.message).toEqual("Hello from B");
      expect(b.message).toEqual("Hello from B");
    });
  });
});
