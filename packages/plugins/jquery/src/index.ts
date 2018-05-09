/**
 * This is a demo plugin which adds a _$ctx for demonstration purposes
 */
import { GondelComponent, addGondelPluginEventListener } from "@gondel/core";
import $ from "jquery";

export function init() {
  addGondelPluginEventListener("start", function addJquery(
    components: Array<GondelComponent>,
    data: any,
    resolve: (components: Array<GondelComponent>) => void
  ) {
    components.forEach(component => {
      (component as any).$ctx = $(component._ctx);
    });
    resolve(components);
  });
}
