export var serialize = function (value) { return "" + value; };
export var deserialize = function (value) { return value === "true"; };
export default {
    serialize: serialize,
    deserialize: deserialize,
};
//# sourceMappingURL=Boolean.js.map