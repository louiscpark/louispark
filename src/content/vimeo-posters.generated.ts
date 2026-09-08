// GENERATED FILE — do not edit by hand.
// Written by scripts/fetch-vimeo-posters.mjs (npm run posters, and prebuild).
// Maps a Vimeo id to its poster frame and its aspect ratio (width / height),
// both resolved from Vimeo's public oEmbed API.

export type VimeoMeta = {
  poster?: string;
  /** width / height of the video itself. Below 1 means a portrait frame. */
  aspectRatio?: number;
};

export const VIMEO_META: Record<string, VimeoMeta | undefined> = {
  "1224464015": { poster: "https://i.vimeocdn.com/video/2197929473-68f914a39774851c9323daf6254cb86e8836ccd8a07d5a11ad78f9a3ad4fe9d3-d_1280?region=us", aspectRatio: 0.5624 },
  "1224464075": { poster: "https://i.vimeocdn.com/video/2197930791-a75b5df7c650432d9285fc8a734019ef12e77e09c7f547f125f92f53f981f1f3-d_1280?region=us", aspectRatio: 1.7778 },
  "1224464076": { poster: "https://i.vimeocdn.com/video/2197929981-035c839aa59223d2033b5c784546c1671e9e2c25330c275dea95e305b4d4d74c-d_1280?region=us", aspectRatio: 0.5624 },
};
