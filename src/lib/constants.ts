// Android adaptive icon density buckets
export const ANDROID_DENSITIES = [
  { name: "mdpi", size: 108 },
  { name: "hdpi", size: 162 },
  { name: "xhdpi", size: 216 },
  { name: "xxhdpi", size: 324 },
  { name: "xxxhdpi", size: 432 },
] as const;

// iOS icon sizes (Xcode 15+ uses single 1024, but we also export common sizes)
export const IOS_SIZES = [1024, 180, 120, 87, 80, 76, 60, 58, 40, 29, 20] as const;

// Android adaptive icon safe zone: 66% of the 108dp canvas
export const SAFE_ZONE_RATIO = 66 / 108;

// Canvas editor defaults
export const EDITOR_CANVAS_SIZE = 432; // xxxhdpi as working resolution
export const ADAPTIVE_ICON_LAYERS_SIZE = 108; // dp base

// Foreground layer occupies 72/108 of the canvas (with padding)
export const FOREGROUND_RATIO = 72 / 108;

// Default background color
export const DEFAULT_BG_COLOR = "#4F46E5";

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
