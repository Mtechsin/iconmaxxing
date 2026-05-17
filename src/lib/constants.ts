// Android adaptive icon density buckets
export const ANDROID_DENSITIES = [
  { name: "mdpi", size: 108 },
  { name: "hdpi", size: 162 },
  { name: "xhdpi", size: 216 },
  { name: "xxhdpi", size: 324 },
  { name: "xxxhdpi", size: 432 },
] as const;

// iOS icon entries: point size + scale per Apple's Contents.json spec
export const IOS_ICON_ENTRIES = [
  { pointSize: "1024x1024", scale: "1x", idiom: "ios-marketing", platform: "ios", pixelSize: 1024 },
  { pointSize: "60x60", scale: "3x", idiom: "universal", pixelSize: 180 },
  { pointSize: "83.5x83.5", scale: "2x", idiom: "universal", pixelSize: 167 },
  { pointSize: "76x76", scale: "2x", idiom: "universal", pixelSize: 152 },
  { pointSize: "40x40", scale: "3x", idiom: "universal", pixelSize: 120 },
  { pointSize: "29x29", scale: "3x", idiom: "universal", pixelSize: 87 },
  { pointSize: "40x40", scale: "2x", idiom: "universal", pixelSize: 80 },
  { pointSize: "76x76", scale: "1x", idiom: "universal", pixelSize: 76 },
  { pointSize: "60x60", scale: "1x", idiom: "universal", pixelSize: 60 },
  { pointSize: "29x29", scale: "2x", idiom: "universal", pixelSize: 58 },
  { pointSize: "40x40", scale: "1x", idiom: "universal", pixelSize: 40 },
  { pointSize: "29x29", scale: "1x", idiom: "universal", pixelSize: 29 },
  { pointSize: "20x20", scale: "1x", idiom: "universal", pixelSize: 20 },
] as const;

export const IOS_SIZES = IOS_ICON_ENTRIES.map((e) => e.pixelSize) as readonly number[];

// Android adaptive icon safe zone: 66% of the 108dp canvas
export const SAFE_ZONE_RATIO = 66 / 108;

// Canvas editor defaults
export const EDITOR_CANVAS_SIZE = 432; // xxxhdpi as working resolution
export const ADAPTIVE_ICON_LAYERS_SIZE = 108; // dp base

// Foreground layer occupies 72/108 of the canvas (with padding)
export const FOREGROUND_RATIO = 72 / 108;

// Default background color
export const DEFAULT_BG_COLOR = "#4F46E5";

// Max upload file size (10 MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Minimum image dimensions (warn if smaller)
export const MIN_IMAGE_DIMENSION = 72;

// Maximum image dimensions (reject if larger to prevent memory issues)
export const MAX_IMAGE_DIMENSION = 4096;

// Color presets for background picker
export const COLOR_PRESETS = [
  "#4F46E5", // Indigo
  "#2563EB", // Blue
  "#0891B2", // Cyan
  "#059669", // Emerald
  "#CA8A04", // Yellow
  "#EA580C", // Orange
  "#DC2626", // Red
  "#9333EA", // Purple
  "#DB2777", // Pink
  "#1F2937", // Gray-800
  "#FFFFFF", // White
  "#000000", // Black
] as const;
