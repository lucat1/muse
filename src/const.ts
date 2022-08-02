import { createContext, useContext } from "react";
import { useParams } from "react-router";

export const LOCAL_STORAGE_KEY = "muse";
export const SUBSONIC_PROTOCOL_VERSION = "1.16.1";

export const GET_COVER_ART = "getCoverArt";
export const GET_ARTISTS = "getArtists";
export const GET_ARTIST = "getArtist";
export const GET_ARTIST_INFO = "getArtistInfo2";
export const GET_ALBUMS = "getAlbumList2"
export const GET_ALBUM = "getAlbum";
// export const GET_ALBUM_INFO = "getAlbumInfo2";
export const GET_TOP_SONGS = "getTopSongs";
export const SEARCH = "search3";
export const SCROBBLE = "scrobble";

export type OptionType = "boolean" | "multi";
export interface Option<T> {
  type: OptionType;
  values: T[];
  default: T;
}

export interface BooleanOption extends Option<boolean> {
  type: "boolean";
  values: [true, false];
  default: false;
}

interface Settings {
  scrobble: BooleanOption;
}

const defaultSettings: Settings = {
  scrobble: {},
};

export interface Connection {
  id: number;
  host: string;
  username: string;
  password: string;
  salt: string;
  settings: Settings;
}
type ConnectionsContextValue = [
  Connection[],
  React.Dispatch<React.SetStateAction<Connection[]>>
];
type ConnectionContextValue = [
  Connection,
  React.Dispatch<React.SetStateAction<Connection>>
];

export const ConnectionsContext = createContext<ConnectionsContextValue>([
  [],
  void 0 as any,
]);

export const useConnections = () => useContext(ConnectionsContext);

export const useConnection = (i: number | null = null) => {
  if (i == null) i = parseInt(useParams().server!);

  const [ctx, setCtx] = useContext(ConnectionsContext);
  const { settings, ...ele } = ctx[i];
  return [
    // {
    //   ...ele, id: i, settings: {
    //     ...
    // },
    { ...ele, id: i },
    (connection: Connection) =>
      setCtx(ctx.map((conn, j) => (j == i ? connection : conn))),
  ] as ConnectionContextValue;
};

export const useTitle = (title: string) => {
  document.title = `${title} - Muse`;
};
