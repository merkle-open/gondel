import { createStateToken } from "@gondel/plugin-angular";

export interface ToolState {
  title: string;
}

export const ToolStateProvider = createStateToken<ToolState>("toolState");
