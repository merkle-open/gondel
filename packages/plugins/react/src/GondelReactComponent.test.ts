import { Component } from "@gondel/core";
import { TestApp } from "../fixtures/TestApp";
import { GondelReactComponent } from "./GondelReactComponent";
import { isPromise } from "./utils";

const createComponentStateHTML = (initialState: object = {}) => {
  const tree = document.createElement("div");
  const initialScript = document.createElement("script");
  initialScript.type = "text/json";
  initialScript.innerHTML = JSON.stringify(initialState);
  tree.appendChild(initialScript);
  return tree;
};

describe("@gondel/plugin-react", () => {
  describe("GondelReactComponent", () => {
    describe("constructor", () => {
      it("should be constructable", () => {
        const root = document.createElement("div");

        expect(() => new GondelReactComponent<{}>(root, "example")).not.toThrow();
      });

      it("should expose gondel lifecycle methods", () => {
        const root = document.createElement("div");
        const c = new GondelReactComponent(root, "example");

        expect((c as any).start).toBeDefined();
        expect((c as any).stop).toBeDefined();
      });

      it("should not expose certain react lifecycle methods", () => {
        class TestComponent extends GondelReactComponent {
          _componentName = "TestComponent";
        }

        const root = document.createElement("div");
        const c = new TestComponent(root, "stub");

        expect(c.componentWillMount).toBeUndefined();
        expect(c.componentDidMount).toBeUndefined();
        expect(c.componentWillReceiveProps).toBeUndefined();
        expect(c.shouldComponentUpdate).toBeUndefined();
        expect(c.componentWillUpdate).toBeUndefined();
        expect(c.componentDidUpdate).toBeUndefined();
        expect(c.componentWillUnmount).toBeUndefined();
        expect(c.componentDidCatch).toBeUndefined();
      });

      it("should read child script config", () => {
        const root = createComponentStateHTML({ theme: "light", loaded: true });

        class TestComponent extends GondelReactComponent<{
          theme: "light" | "dark";
          loaded: boolean;
        }> {
          _componentName = "TestComponent";

          darken = () => this.setState({ theme: "dark" });
          lighten = () => this.setState({ theme: "light" });
          unload = () => this.setState({ loaded: false });
        }

        const component = new TestComponent(root, "test");
        expect(component.state.theme).toEqual("light");
        expect(component.state.loaded).toBe(true);
      });
    });

    describe("state", () => {
      it("should expose an initial default state", () => {
        const root = document.createElement("div");
        class TestComponent extends GondelReactComponent {
          _componentName = "TestComponent";
        }
        const component = new TestComponent(root, "stub");

        // check if state & setter are defined
        expect(component.state).toBeDefined();
        expect(component.setState).toBeDefined();

        // check initial state
        expect(component.state).toEqual({});

        // check state updates
        component.setState({ a: 10, b: "test" });
        expect(component.state).toEqual({
          a: 10,
          b: "test"
        });
      });

      it("should read the custom initial state correctly", () => {
        class TestComponent extends GondelReactComponent<{ username: string }> {
          _componentName = "TestComponent";
          state = { username: "max" };
        }

        const root = document.createElement("div");
        const c = new TestComponent(root, "test");

        expect(c.state).toEqual({ username: "max" });
      });

      it("should re-render on state changes", () => {
        let renderCount = 0;

        class TestComponent extends GondelReactComponent<{ username: string }> {
          _componentName = "TestComponent";
          state = { username: "max" };

          render() {
            renderCount++;
            return `${this.state.username}`;
          }
        }

        const root = document.createElement("div");
        const c = new TestComponent(root, "test");

        expect(renderCount).toEqual(0);
        expect(c.state).toEqual({ username: "max" });

        // initial paint
        const output = c.render();
        expect(renderCount).toEqual(1);
        expect(output).toEqual("max");

        // update paint
        c.setState({ username: "lisa" });
        const outputAfterUpdate = c.render();
        expect(renderCount).toEqual(2);
        expect(c.state.username).toEqual("lisa");
        expect(outputAfterUpdate).toEqual("lisa");
      });
    });

    describe("render", () => {
      // TODO: This test fails, strange behaviour, we need to investigate a bit here
      it.skip("should be able to render React apps", async () => {
        @Component("test")
        class TestComponent extends GondelReactComponent<{ text: string }> {
          App = TestApp;
        }
        const root = document.createElement("div");
        const component = new TestComponent(root, "test");
        component.setState({ text: "test" });
        expect(typeof (component as any).start).toBeTruthy();
        const startPromise = (component as any).start() as Promise<any>;
        expect(isPromise(startPromise)).toBeTruthy();
        const startResponse = await startPromise;
        // const out = await (c as any).start();
        // expect(typeof (c as any).start === 'function').toBeTruthy()
        // expect(c.render()).toEqual('')
      });

      it("base class should throw an error if no app provided", () => {
        const root = document.createElement("div");
        const c = new GondelReactComponent<{}>(root, "test");

        expect(() => c.render()).toThrow("undefined could not render please add a render method");
      });

      it("custom class should throw an error if no render method is provided", () => {
        class TestComponent extends GondelReactComponent<{}> {
          _componentName = "TestComponent";
        }

        const root = document.createElement("div");
        const c = new TestComponent(root, "test");

        expect(() => c.render()).toThrow(
          "TestComponent could not render please add a render method"
        );
      });

      it("custom class should throw an error if invalid App provided", () => {
        class TestComponent extends GondelReactComponent<{}> {
          App = null as any; // fake invalid react component
          _componentName = "TestComponent";
        }

        const root = document.createElement("div");
        const c = new TestComponent(root, "test");

        expect(() => {
          c.render();
        }).toThrow(
          "TestComponent could not render ensure that you are returning a React component"
        );
      });

      it("custom class should not throw an error if invalid App and custom render provided", () => {
        class TestComponent extends GondelReactComponent<{}> {
          App = null as any; // fake invalid react component
          _componentName = "TestComponent";

          render() {
            return `Value: ${this.App}`;
          }
        }

        const root = document.createElement("div");
        const c = new TestComponent(root, "test");

        expect(() => c.render()).not.toThrow();
        expect(c.render()).toEqual("Value: null");
      });
    });
  });
});
