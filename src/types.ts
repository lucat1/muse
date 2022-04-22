export interface SubsonicError {
  code: number;
  message: string;
}

export interface SubsonicArtistsResponse {
  ignoredArticles: string
  index: 
}

export interface SubsonicArtistsIndex {
  name: string
  artist: []
}

export interface SubsonicArtistBase {
  id: string
  name: string
  albumCount: number
}

export interface SubsonicArtist extends SubsonicArtistBase {
  albums: SubsonicAlbumBase[]
}

export interface SubsonicAlbumBase {
  id: string
  name: string
  artist: string
}
