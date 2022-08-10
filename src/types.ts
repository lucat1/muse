export interface SubsonicArtistsIndex {
  name: string[1];
  artist: SubsonicArtistBase[];
}

export interface SubsonicArtistBase {
  id: string;
  name: string;
  albumCount: number;
  artistImageUrl?: string;
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
  duration: number;
  year: number;
}

export interface SubsonicAlbum extends SubsonicAlbumBase {
  album: string /* ? */;
  artistId: string;
  created: string;
  genre: string;
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
  artistId?: string;
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
  starred: string | undefined;
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

  similarArtist: SubsonicArtistBase[] | undefined;
}

export interface SubsonicWrapperResponse<T> {
  "subsonic-response": {
    status: "ok" | "failed";
  } & T;
}

export interface SubsonicBaseResponse<T> {
  type: string;
  version: string;
  serverVersion: string;
  [key: string]: T | string;
}

export interface SubsonicPingResponse {}

export interface SubsonicErrorResponse {
  code: number;
  message: string;
}

export interface SubsonicArtistsResponse {
  ignoredArticles: string;
  index: SubsonicArtistsIndex[];
}

export type SubsonicArtistResponse = SubsonicArtist;

export type SubsonicArtistInfoResponse = SubsonicArtistInfo;

export interface SubsonicAlbumsResponse {
  album: SubsonicAlbumBase[];
}

export type SubsonicAlbumResponse = SubsonicAlbum;

export interface SubsonicTopSongsResponse {
  song: SubsonicSong[];
}

export interface SubsonicSearchResponse {
  artist?: SubsonicArtistBase[];
  album?: SubsonicAlbumBase[];
  song?: SubsonicSong[];
}

export interface SubsonicPlaylistBase {
  id: string;
  name: string;
  songCount: number;
  duration: number;
  public: boolean;
  owner: string;
  created: Date;
  changed: Date;
}

export interface SubsonicPlaylist extends SubsonicPlaylistBase {
  entry: SubsonicSong[];
}

export interface SubsonicPlaylistsResponse {
  playlist: SubsonicPlaylistBase[];
}

export type SubsonicPlaylistResponse = SubsonicPlaylist;
