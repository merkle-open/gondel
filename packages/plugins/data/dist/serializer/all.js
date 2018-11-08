var _a;
import { serialize as serializeJSON, deserialize as deserializeJSON } from "./JSON";
export var Serializer;
(function (Serializer) {
    Serializer["JSON"] = "JSON";
})(Serializer || (Serializer = {}));
export var Serializers = (_a = {},
    _a[Serializer.JSON] = {
        serialize: serializeJSON,
        deserialize: deserializeJSON
    },
    _a);
//# sourceMappingURL=all.js.map