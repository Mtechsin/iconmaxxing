export interface EditorState {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export interface IconProject {
  sourceImage: HTMLImageElement | null;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  monochromeThreshold: number;
  monochromeInvert: boolean;
  editor: EditorState;
}

export type ExportTarget = "android" | "ios" | "both";

export type MaskShape = "circle" | "squircle" | "rounded-square";
