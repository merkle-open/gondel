/**
 * This is a demo plugin which adds a _$ctx for demonstration purposes
 */
import { addGondelPluginEventListener } from "@gondel/core";
import $ from "jquery";
export function init() {
    addGondelPluginEventListener("start", function addJquery(components, data, resolve) {
        components.forEach(function (component) {
            component.$ctx = $(component._ctx);
        });
        resolve(components);
    });
}
//# sourceMappingURL=index.js.map