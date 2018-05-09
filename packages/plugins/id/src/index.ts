/**
 * This is a demo plugin which adds a data-t-id for demonstration purposes
 */
import { addGondelPluginEventListener, GondelComponent } from "@gondel/core";

export function init(namespace: string) {
  let id = 0;
  addGondelPluginEventListener("start", function addDataId(
    components: Array<GondelComponent>,
    data,
    resolve
  ) {
    if (data.namespace !== namespace) {
      return resolve(components);
    }
    components.forEach(component => {
      component._ctx.setAttribute(`data-${namespace}-id`, (id++).toString());
    });
    resolve(components);
  });
}
