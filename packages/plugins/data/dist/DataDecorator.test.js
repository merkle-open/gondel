import * as tslib_1 from "tslib";
import { startComponents, getComponentByDomNode, Component, GondelBaseComponent } from "@gondel/core";
import { data } from './DataDecorator';
import { Serializer } from './serializer/all';
// for custom serializer example
var crypto = require('crypto');
var CRYPTO_ALGORITHM = 'aes-256-ctr';
var CRYPTO_PASSWORD = 'd6F3Efeq';
function createMockElement(namespace) {
    var buttonElement = document.createElement("div");
    buttonElement.innerHTML = "\n      <span class='child'>\n        <span class='grand-child'>Click me</span>\n      </span>\n      <span class='sibling'>\n      </span>\n    ";
    buttonElement.setAttribute("data-" + namespace + "-name", "Button");
    buttonElement.setAttribute("data-environment", "TEST");
    buttonElement.setAttribute("data-text", "2c8bd89c2e314f7f2245e04c"); // encrypted 'Hello World!'
    buttonElement.setAttribute("data-config", JSON.stringify({ hello: 'World!', id: 123 }));
    document.documentElement.appendChild(buttonElement);
    startComponents(buttonElement, namespace);
    return getComponentByDomNode(buttonElement, namespace);
}
describe('@gondel/plugin-data', function () {
    describe('@data', function () {
        it('should read values from the data attribute correctly', function () {
            var Button = /** @class */ (function (_super) {
                tslib_1.__extends(Button, _super);
                function Button() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.env = '';
                    return _this;
                }
                Button.prototype.getEnv = function () {
                    return this.env;
                };
                tslib_1.__decorate([
                    data('environment'),
                    tslib_1.__metadata("design:type", String)
                ], Button.prototype, "env", void 0);
                Button = tslib_1.__decorate([
                    Component("Button", "g")
                ], Button);
                return Button;
            }(GondelBaseComponent));
            var button = createMockElement("g");
            expect(button).toMatchSnapshot();
            expect(button.getEnv()).toBeDefined();
            expect(button.getEnv()).toEqual('TEST');
        });
        it('should set values inside the data attribute correctly', function () {
            var Button = /** @class */ (function (_super) {
                tslib_1.__extends(Button, _super);
                function Button() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.env = '';
                    return _this;
                }
                Button.prototype.setToProd = function () {
                    this.env = "PROD";
                };
                Button.prototype.getEnv = function () {
                    return this.env;
                };
                tslib_1.__decorate([
                    data('environment'),
                    tslib_1.__metadata("design:type", String)
                ], Button.prototype, "env", void 0);
                Button = tslib_1.__decorate([
                    Component("Button", "g")
                ], Button);
                return Button;
            }(GondelBaseComponent));
            var button = createMockElement("g");
            expect(button).toMatchSnapshot();
            expect(button.getEnv()).toBeDefined();
            expect(button.getEnv()).toEqual('TEST');
            button.setToProd();
            expect(button).toMatchSnapshot();
            expect(button.getEnv()).toBeDefined();
            expect(button.getEnv()).toEqual('PROD');
        });
        describe('Serializers', function () {
            it('JSON - should work with JSONs', function () {
                var initialConfig = { hello: 'World!', id: 123 };
                // const serializedinitialConfig = "{ \"hello\": \"World!\", \"id\": 123 }"; // test-cases
                var Button = /** @class */ (function (_super) {
                    tslib_1.__extends(Button, _super);
                    function Button() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Button.prototype.setNewId = function (id) {
                        this.config = {
                            hello: this.config.hello,
                            id: id
                        };
                    };
                    Button.prototype.getConfig = function () {
                        return this.config;
                    };
                    tslib_1.__decorate([
                        data('config', Serializer.JSON),
                        tslib_1.__metadata("design:type", Object)
                    ], Button.prototype, "config", void 0);
                    Button = tslib_1.__decorate([
                        Component("Button", "g")
                    ], Button);
                    return Button;
                }(GondelBaseComponent));
                var button = createMockElement("g");
                expect(button).toMatchSnapshot();
                expect(button.getConfig()).toBeDefined();
                expect(button.getConfig()).toEqual(initialConfig);
                button.setNewId(999);
                expect(button).toMatchSnapshot();
                expect(button.getConfig()).toEqual(tslib_1.__assign({}, initialConfig, { id: 999 }));
            });
            it('Custom - should work with custom serializers (encrypted example)', function () {
                var CustomEncryptionSerializer = {
                    serialize: function (value) {
                        var cipher = crypto.createCipher(CRYPTO_ALGORITHM, CRYPTO_PASSWORD);
                        var crypted = cipher.update(value, 'utf8', 'hex');
                        crypted += cipher.final('hex');
                        return crypted;
                    },
                    deserialize: function (value) {
                        var decipher = crypto.createDecipher(CRYPTO_ALGORITHM, CRYPTO_PASSWORD);
                        var dec = decipher.update(value, 'hex', 'utf8');
                        dec += decipher.final('utf8');
                        return dec;
                    }
                };
                var Button = /** @class */ (function (_super) {
                    tslib_1.__extends(Button, _super);
                    function Button() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Button.prototype.setText = function (newText) {
                        this.text = newText;
                    };
                    Button.prototype.getText = function () {
                        return this.text;
                    };
                    tslib_1.__decorate([
                        data('text', CustomEncryptionSerializer),
                        tslib_1.__metadata("design:type", String)
                    ], Button.prototype, "text", void 0);
                    Button = tslib_1.__decorate([
                        Component("Button", "g")
                    ], Button);
                    return Button;
                }(GondelBaseComponent));
                var button = createMockElement("g");
                expect(button).toMatchSnapshot();
                expect(button.getText()).toBeDefined();
                expect(button.getText()).toEqual('Hello World!');
                button.setText('Hello from the other Side!');
                expect(button).toMatchSnapshot();
                expect(button.getText()).toEqual('Hello from the other Side!');
            });
        });
    });
});
//# sourceMappingURL=DataDecorator.test.js.map