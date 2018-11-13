import {
  startComponents,
  getComponentByDomNode,
  Component,
  GondelBaseComponent
} from "@gondel/core";
import { data, ISerializer } from "./DataDecorator";
import JSONSerializer from "./serializer/JSON";

// for custom serializer example
const crypto = require("crypto");
const CRYPTO_ALGORITHM = "aes-256-ctr";
const CRYPTO_PASSWORD = "d6F3Efeq";

function createMockElement(namespace: string) {
  const buttonElement = document.createElement("div");
  buttonElement.setAttribute("data-" + namespace + "-name", "Button");
  buttonElement.setAttribute("data-environment", "TEST");
  buttonElement.setAttribute("data-text", "2c8bd89c2e314f7f2245e04c"); // encrypted 'Hello World!'
  buttonElement.setAttribute("data-config", JSON.stringify({ hello: "World!", id: 123 }));
  document.documentElement!.appendChild(buttonElement);
  startComponents(buttonElement, namespace);
  return getComponentByDomNode(buttonElement, namespace)!;
}

describe("@gondel/plugin-data", () => {
  describe("@data", () => {
    it("should automatically convert property key to data value", () => {
      @Component("Button", "g")
      class Button extends GondelBaseComponent {
        @data
        dataEnvironment: string;
        @data
        dataLanguage: string = "es";

        getEnv() {
          return this.dataEnvironment;
        }

        getLang() {
          return this.dataLanguage;
        }
      }

      const button = createMockElement("g") as Button;
      expect(button.getLang()).toEqual("es");
      expect(button).toMatchSnapshot();
      expect(button.getEnv()).toBeDefined();
      expect(button.getEnv()).toEqual("TEST");
    });
  });
  it("should use default values from the class if no attr provided", async () => {
    @Component("Button", "g")
    class Button extends GondelBaseComponent {
      @data
      dataSomeInvalidElement: string = "initial-value";

      start() {
        expect(this.dataSomeInvalidElement).toEqual("initial-value");
      }
    }

    const button = createMockElement("g") as Button;
    expect(button).toMatchSnapshot();
  });
  it("should allow/auto-convert private-like-values with underscore prefix", () => {
    @Component("Button", "g")
    class Button extends GondelBaseComponent {
      @data
      _dataEnvironment: string;

      getEnv() {
        return this._dataEnvironment;
      }
    }

    const button = createMockElement("g") as Button;
    expect(button).toMatchSnapshot();
    expect(button.getEnv()).toBeDefined();
    expect(button.getEnv()).toEqual("TEST");
  });
  it("should read values from the data attribute correctly", () => {
    @Component("Button", "g")
    class Button extends GondelBaseComponent {
      @data("environment")
      private env: string = "";

      getEnv() {
        return this.env;
      }
    }

    const button = createMockElement("g") as Button;
    expect(button).toMatchSnapshot();
    expect(button.getEnv()).toBeDefined();
    expect(button.getEnv()).toEqual("TEST");
  });

  it("should set values inside the data attribute correctly", () => {
    @Component("Button", "g")
    class Button extends GondelBaseComponent {
      @data("environment")
      private env: string = "";

      setToProd() {
        this.env = `PROD`;
      }

      getEnv() {
        return this.env;
      }
    }

    const button = createMockElement("g") as Button;
    expect(button).toMatchSnapshot();
    expect(button.getEnv()).toBeDefined();
    expect(button.getEnv()).toEqual("TEST");

    button.setToProd();
    expect(button).toMatchSnapshot();
    expect(button.getEnv()).toBeDefined();
    expect(button.getEnv()).toEqual("PROD");
  });

  describe("Serializers", () => {
    it("JSON - should work with JSONs", () => {
      type Config = { hello: string; id: number };
      const initialConfig: Config = { hello: "World!", id: 123 };
      // const serializedinitialConfig = "{ \"hello\": \"World!\", \"id\": 123 }"; // test-cases

      @Component("Button", "g")
      class Button extends GondelBaseComponent {
        @data("config", JSONSerializer)
        private config: Config;

        setNewId(id: number) {
          this.config = {
            hello: this.config.hello,
            id
          };
        }

        getConfig(): Config {
          return this.config;
        }
      }

      const button = createMockElement("g") as Button;
      expect(button).toMatchSnapshot();
      expect(button.getConfig()).toBeDefined();
      expect(button.getConfig()).toEqual(initialConfig);

      button.setNewId(999);
      expect(button).toMatchSnapshot();
      expect(button.getConfig()).toEqual({ ...initialConfig, id: 999 });
    });

    it("Custom - should work with custom serializers (encrypted example)", () => {
      const CustomEncryptionSerializer: ISerializer = {
        serialize(value: string) {
          const cipher = crypto.createCipher(CRYPTO_ALGORITHM, CRYPTO_PASSWORD);
          let crypted = cipher.update(value, "utf8", "hex");
          crypted += cipher.final("hex");
          return crypted;
        },
        deserialize(value: string): string {
          const decipher = crypto.createDecipher(CRYPTO_ALGORITHM, CRYPTO_PASSWORD);
          let dec = decipher.update(value, "hex", "utf8");
          dec += decipher.final("utf8");
          return dec;
        }
      };

      @Component("Button", "g")
      class Button extends GondelBaseComponent {
        @data("text", CustomEncryptionSerializer)
        private text: string;

        setText(newText: string) {
          this.text = newText;
        }

        getText(): string {
          return this.text;
        }
      }

      const button = createMockElement("g") as Button;
      expect(button).toMatchSnapshot();
      expect(button.getText()).toBeDefined();
      expect(button.getText()).toEqual("Hello World!");

      button.setText("Hello from the other Side!");
      expect(button).toMatchSnapshot();
      expect(button.getText()).toEqual("Hello from the other Side!");
    });
  });
});
