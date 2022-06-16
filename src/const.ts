import { createContext, useContext } from "react";
import { useParams } from "react-router";

export const LOCAL_STORAGE_KEY = "muse";
export const SUBSONIC_PROTOCOL_VERSION = "1.16.1";

export const GET_ARTISTS = "getArtists";
export const GET_ARTIST = "getArtist";
export const GET_ARTIST_INFO = "getArtistInfo2";
export const GET_ALBUM = "getAlbum";
// export const GET_ALBUM_INFO = "getAlbumInfo2";
export const GET_TOP_SONGS = "getTopSongs";
export interface Connection {
  id: number;
  host: string;
  username: string;
  password: string;
  saltLength: number;
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
  return [
    { ...ctx[i], id: i },
    (connection: Connection) =>
      setCtx(ctx.map((conn, j) => (j == i ? connection : conn))),
  ] as ConnectionContextValue;
};
