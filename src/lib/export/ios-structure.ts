import { IOS_SIZES } from "@/lib/constants";

/**
 * Generate Contents.json for Xcode 15+ single-size format.
 * Also includes pre-rendered common sizes for legacy support.
 */
export function generateContentsJson(): string {
  const images = IOS_SIZES.map((size) => ({
    filename: `icon_${size}x${size}.png`,
    idiom: "universal",
    platform: "ios",
    size: `${size}x${size}`,
  }));

  const contents = {
    images: [
      {
        filename: "icon_1024x1024.png",
        idiom: "universal",
        platform: "ios",
        size: "1024x1024",
      },
    ],
    info: {
      author: "Adaptive Icon Generator",
      version: 1,
    },
  };

  return JSON.stringify(contents, null, 2);
}

/**
 * Generate a full Contents.json with all sizes for legacy Xcode support.
 */
export function generateFullContentsJson(): string {
  const images = IOS_SIZES.map((size) => ({
    filename: `icon_${size}x${size}.png`,
    idiom: "universal",
    platform: "ios",
    size: `${size}x${size}`,
  }));

  const contents = {
    images,
    info: {
      author: "Adaptive Icon Generator",
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

  for (const size of IOS_SIZES) {
    paths.push(`AppIcon.appiconset/icon_${size}x${size}.png`);
  }

  paths.push("AppIcon.appiconset/Contents.json");

  return paths;
}
