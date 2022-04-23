export interface SubsonicArtistsIndex {
  name: string[1];
  artist: SubsonicArtistBase[];
}

export interface SubsonicArtistBase {
  id: string;
  name: string;
  albumCount: number;
  coverArt?: string;
}

export interface SubsonicArtist extends SubsonicArtistBase {
  album: SubsonicAlbum[];
}

export interface SubsonicAlbumBase {
  id: string;
  name: string;
  title: string;
  artist: string;
  coverArt: string;
}

export interface SubsonicAlbum extends SubsonicAlbumBase {
  album: string /* ? */;
  artistId: string;
  created: string;
  genre: string;
  duration: number;
  year: number;
  songCount: number;
  song: SubsonicSong[];
}

export interface SubsonicSongBase {
  id: string;
  name: string;
  title: string;
  artist: string;
  album: string;
}
export interface SubsonicSong extends SubsonicSongBase {
  albumId: string;
  artistId: string;
  bitRate: number;
  contentType: string;
  coverArt: string;
  created: string;
  discNumber: number;
  duration: number;
  isDir: boolean;
  iaVideo: boolean;
  parent: string;
  path: string;
  size: number;
  suffix: string;
  track: number;
  type: "music" | "video" | "podcast";
  year: number;
}

export interface SubsonicArtistInfo {
  biography: string;

  lastFmUrl: string;
  musicBrianzId: string;

  largeImageUrl: string;
  mediumImageUrl: string;
  smallImageUrl: string;
}

export interface SubsonicError {
  code: number;
  message: string;
}

export interface SubsonicArtistsResponse {
  ignoredArticles: string;
  index: SubsonicArtistsIndex[];
}

export type SubsonicArtistResponse = SubsonicArtist;

export type SubsonicArtistInfoResponse = SubsonicArtistInfo;

export type SubsonicAlbumResponse = SubsonicAlbum;
