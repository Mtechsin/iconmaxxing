import { ANDROID_DENSITIES } from "@/lib/constants";

/**
 * Android adaptive icon XML template for ic_launcher.xml
 */
export function generateAdaptiveIconXml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
`;
}

/**
 * Android round icon XML template
 */
export function generateRoundIconXml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
`;
}

/**
 * Get the folder path for a given density bucket.
 */
export function getMipmapFolder(density: string): string {
  return `res/mipmap-${density}`;
}

/**
 * Get all file paths that will be generated for Android.
 */
export function getAndroidFilePaths(): { path: string; type: "png" | "xml" }[] {
  const paths: { path: string; type: "png" | "xml" }[] = [];

  for (const { name } of ANDROID_DENSITIES) {
    const folder = getMipmapFolder(name);
    paths.push({ path: `${folder}/ic_launcher_foreground.png`, type: "png" });
    paths.push({ path: `${folder}/ic_launcher_background.png`, type: "png" });
    paths.push({ path: `${folder}/ic_launcher_monochrome.png`, type: "png" });
  }

  paths.push({ path: "res/mipmap-anydpi-v26/ic_launcher.xml", type: "xml" });
  paths.push({ path: "res/mipmap-anydpi-v26/ic_launcher_round.xml", type: "xml" });

  return paths;
}
