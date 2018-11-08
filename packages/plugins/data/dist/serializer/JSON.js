export var serialize = function (value) { return (value ? JSON.stringify(value) : ""); };
export var deserialize = function (value) {
    return value ? JSON.parse(value) : void 0;
};
//# sourceMappingURL=JSON.js.map