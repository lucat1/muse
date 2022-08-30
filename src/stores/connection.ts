import { atom, SetStateAction } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";
import { focusAtom } from "jotai/optics";

interface InternalConnection {
  host: string;
  username: string;
  password: string;
  salt: string;
  // settings: Settings;
}

export interface Connection extends InternalConnection {
  id: number;
}

export interface InternalConnections {
  default?: number;
  list: InternalConnection[];
}

export interface Connections {
  default?: number;
  list: Connection[];
}

const CONNECTIONS_DEFAULT = { list: [] };
const internalConnectionsAtom = atomWithStorage<InternalConnections>(
  "connections",
  CONNECTIONS_DEFAULT
);
export const connectionsAtom = atom(
  (get) => {
    const conns = get(internalConnectionsAtom);
    return {
      ...conns,
      list: conns.list.map((c, i) => ({ ...c, id: i })),
    } as Connections;
  },
  (get, set, newValue: SetStateAction<Connections>) => {
    // discard any id
    const actualValue =
      typeof newValue == "function" ? newValue(get(connectionsAtom)) : newValue;
    set(internalConnectionsAtom, {
      ...actualValue,
      list: actualValue.list.map((c) => ({
        host: c.host,
        username: c.username,
        password: c.password,
        salt: c.salt,
      })),
    } as InternalConnections);
  }
);
export const connectionsListAtom = focusAtom(connectionsAtom, (optic) =>
  optic.prop("list")
);
export const connectionsListAtomsAtom = splitAtom(connectionsListAtom);

export const internalConnectionAtom = atom(null as unknown as Connection);
export const connectionAtom = atom(
  (get) => {
    const res: Connection | null = get(internalConnectionAtom);
    if (res == null)
      throw new TypeError("The connection atom was used outside of a provider");
    return res;
  },
  (get, set, newValue: SetStateAction<Connection>) => {
    set(
      internalConnectionAtom,
      typeof newValue == "function" ? newValue(get(connectionAtom)) : newValue
    );
  }
);
