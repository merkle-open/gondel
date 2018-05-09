/**
 * This is a demo plugin which adds a data-t-id for demonstration purposes
 */
import { addGondelPluginEventListener } from "@gondel/core";
export function init(namespace) {
    var id = 0;
    addGondelPluginEventListener("start", function addDataId(components, data, resolve) {
        if (data.namespace !== namespace) {
            return resolve(components);
        }
        components.forEach(function (component) {
            component._ctx.setAttribute("data-" + namespace + "-id", (id++).toString());
        });
        resolve(components);
    });
}
//# sourceMappingURL=index.js.map