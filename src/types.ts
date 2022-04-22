export interface SubsonicError {
  code: number;
  message: string;
}

export interface SubsonicArtistsResponse {
  ignoredArticles: string;
  index: SubsonicArtistsIndex[];
}

export interface SubsonicArtistsIndex {
  name: string[1];
  artist: SubsonicArtistBase[];
}

export interface SubsonicArtistBase {
  id: string;
  name: string;
  albumCount: number;
}

export interface SubsonicArtist extends SubsonicArtistBase {
  albums: SubsonicAlbumBase[];
}

export interface SubsonicAlbumBase {
  id: string;
  name: string;
  artist: string;
}
