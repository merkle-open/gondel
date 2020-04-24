import { Component, getComponentByDomNode, startComponents } from "@gondel/core";
import { createElement } from "react";
import { createGondelReactLoader, GondelReactComponent } from "./GondelReactComponent";

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
          b: "test",
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
      it("should be able to render React apps syncronously", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<div data-g-name="Greeter"><script type="text/json">{ "title": "Hello World"}</script></div>`;

        await new Promise((resolve) => {
          function TestTitleSpan(props: { title: string }) {
            return createElement("span", null, props.title);
          }
          const loader = () => TestTitleSpan;
          const GondelReactLoaderComponent = createGondelReactLoader(loader);
          @Component("Greeter")
          class Greeter extends GondelReactLoaderComponent {
            start() {}
            componentDidMount() {
              resolve();
            }
          }

          startComponents(root);
        });

        expect(root.innerHTML).toBe('<div data-g-name="Greeter"><span>Hello World</span></div>');
      });

      it("should be able to render React apps asyncronously", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<div data-g-name="Greeter"><script type="text/json">{ "title": "Hello World"}</script></div>`;

        await new Promise((resolve) => {
          function TestTitleSpan(props: { title: string }) {
            return createElement("span", null, props.title);
          }
          const loader = async () => TestTitleSpan;
          const GondelReactLoaderComponent = createGondelReactLoader(loader);
          @Component("Greeter")
          class Greeter extends GondelReactLoaderComponent {
            componentDidMount() {
              resolve();
            }
          }

          startComponents(root);
        });

        expect(root.innerHTML).toBe('<div data-g-name="Greeter"><span>Hello World</span></div>');
      });

      it("should be able to render React apps named asyncronously", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<div data-g-name="Greeter"><script type="text/json">{ "title": "Hello World"}</script></div>`;

        await new Promise((resolve) => {
          function TestTitleSpan(props: { title: string }) {
            return createElement("span", null, props.title);
          }
          const loader = async () => ({ TestTitleSpan } as const);
          const GondelReactLoaderComponent = createGondelReactLoader(loader, "TestTitleSpan");
          @Component("Greeter")
          class Greeter extends GondelReactLoaderComponent {
            componentDidMount() {
              resolve();
            }
          }

          startComponents(root);
        });

        expect(root.innerHTML).toBe('<div data-g-name="Greeter"><span>Hello World</span></div>');
      });

      it("should execute hooks during rendering", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<div data-g-name="Greeter"></div>`;
        const hooks: string[] = [];

        await new Promise((resolve) => {
          const loader = () => () => createElement("span", null, "Hello World");
          const GondelReactLoaderComponent = createGondelReactLoader(loader);
          @Component("Greeter")
          class Greeter extends GondelReactLoaderComponent {
            componentDidMount() {
              hooks.push("componentDidMount");
              setTimeout(() => {
                this.stop();
              });
            }
            componentWillUnmount() {
              hooks.push("componentWillUnmount");
              resolve();
            }
          }
          startComponents(root);
        });

        expect(hooks).toEqual(["componentDidMount", "componentWillUnmount"]);
      });

      it("should render after the start method is done", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<div data-g-name="Greeter"></div>`;

        await new Promise((resolve) => {
          function TestTitleSpan(props: { title: string }) {
            return createElement("span", null, props.title);
          }
          const loader = () => TestTitleSpan;
          const GondelReactLoaderComponent = createGondelReactLoader(loader);
          @Component("Greeter")
          class Greeter extends GondelReactLoaderComponent {
            start() {
              return new Promise((resolve) => {
                setTimeout(() => {
                  this.setState({
                    title: "Lazy loaded data",
                  });
                  resolve();
                });
              });
            }
            componentDidMount() {
              resolve();
            }
          }

          startComponents(root);
        });

        expect(root.innerHTML).toBe(
          '<div data-g-name="Greeter"><span>Lazy loaded data</span></div>'
        );
      });

      it("should render after the start method is done using a callback", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<div data-g-name="Greeter"></div>`;

        await new Promise((resolve) => {
          function TestTitleSpan(props: { title: string }) {
            return createElement("span", null, props.title);
          }
          const loader = () => TestTitleSpan;
          const GondelReactLoaderComponent = createGondelReactLoader(loader);
          @Component("Greeter")
          class Greeter extends GondelReactLoaderComponent {
            start(resolve: () => void) {
              setTimeout(() => {
                this.setState({
                  title: "Lazy loaded data",
                });
                resolve();
              });
            }
            componentDidMount() {
              resolve();
            }
          }

          startComponents(root);
        });

        expect(root.innerHTML).toBe(
          '<div data-g-name="Greeter"><span>Lazy loaded data</span></div>'
        );
      });

      it("should rerender once setState is called", async () => {
        const root = document.createElement("div");
        root.innerHTML = `<div data-g-name="Greeter"></div>`;
        await new Promise((resolve) => {
          function TestTitleSpan(props: { title: string }) {
            return createElement("span", null, props.title || "");
          }
          const GondelReactLoaderComponent = createGondelReactLoader(() => TestTitleSpan);
          @Component("Greeter")
          class Greeter extends GondelReactLoaderComponent {
            componentDidMount() {
              resolve();
            }
            componentDidUpdate() {}
            shouldComponentUpdate() {
              return true;
            }
          }
          startComponents(root);
        });

        const component = getComponentByDomNode<any>(root.firstElementChild!);
        component.setState({ title: "update using getComponentByDomNode" });

        expect(root.innerHTML).toBe(
          '<div data-g-name="Greeter"><span>update using getComponentByDomNode</span></div>'
        );
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
