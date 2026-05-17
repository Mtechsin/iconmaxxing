import { IOS_ICON_ENTRIES } from "@/lib/constants";

/**
 * Generate a full Contents.json with all sizes for Xcode compatibility.
 */
export function generateFullContentsJson(): string {
  const images = IOS_ICON_ENTRIES.map((entry) => ({
    filename: `icon_${entry.pixelSize}x${entry.pixelSize}.png`,
    idiom: entry.idiom,
    ...('platform' in entry && { platform: entry.platform }),
    size: entry.pointSize,
    scale: entry.scale,
  }));

  const contents = {
    images,
    info: {
      author: "IconMaxxing",
      version: 1,
    },
  };

  return JSON.stringify(contents, null, 2);
}

/**
 * Get all file paths that will be generated for iOS.
 */
export function getIOSFilePaths(): string[] {
  const paths: string[] = [];

  for (const entry of IOS_ICON_ENTRIES) {
    paths.push(`AppIcon.appiconset/icon_${entry.pixelSize}x${entry.pixelSize}.png`);
  }

  paths.push("AppIcon.appiconset/Contents.json");

  return paths;
}
