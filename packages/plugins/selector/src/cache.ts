import { GondelComponent } from "@gondel/core";
import { Selector } from "./Selector";

/**
 * TODO: describe
 */
export const lookupCache = new WeakMap<GondelComponent, Map<string, Selector>>();
