import type { SubsonicAlbum } from "./types";

// These values are extemely arbitrary but that's all we can do until we receive
// a proper API
export const albumCondition = (obj: SubsonicAlbum) =>
  obj.songCount >= 7 || obj.duration >= 60 * 25;
export const epCondition = (obj: SubsonicAlbum) =>
  (obj.songCount > 3 && obj.songCount < 7) ||
  (obj.duration >= 60 * 5 && obj.duration < 60 * 25);
export const singleCondition = (obj: SubsonicAlbum) =>
  obj.songCount <= 3 && obj.duration < 60 * 5;
