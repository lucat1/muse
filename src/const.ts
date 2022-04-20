import { createContext, useContext } from "react";
import { useParams } from "react-router";
import { Setter } from "use-local-storage";

export const LOCAL_STORAGE_KEY = "muse";

export interface RouterParams {
  server?: number;
}

export interface Connection {
  host: string;
}

export const ConnectionsConext = createContext<
  [Connection[], Setter<Connection[]>]
>([[], void 0 as any]);

export const useConnection = (i: numer | null = null) => {
  if (i == null) i = useParams<RouterParams>().server!;

  const [ctx, setCtx] = useContext(ConnectionsConext);
  return [
    ctx[i],
    (connection: Connection) =>
      setCtx(ctx.map((conn, j) => (j == i ? connection : conn))),
  ];
};
