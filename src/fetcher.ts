import * as React from "react";
import useSWR from "swr";
import md5 from "blueimp-md5";
import { useConnection, SUBSONIC_PROTOCOL_VERSION, Connection } from "./const";
import { SubsonicError } from "./types";
import { useMemo } from "react";

const CLIENT_NAME = "muse";

const salt = (len: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; ++i)
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
};

interface SubsonicBasicResponse {
  "subsonic-response": {
    status: "ok" | "failed";
    type: string;
    version: string;
  };
}

export const gen = (path: string, conn: Connection) => {
  const s = salt(conn.saltLength);
  const pass = md5(conn.password + s);
  const u = new URL(path, conn.host);
  const p = new URLSearchParams(u.search);
  p.set("c", CLIENT_NAME);
  p.set("f", "json");
  p.set("u", conn.username);
  p.set("v", SUBSONIC_PROTOCOL_VERSION);
  p.set("t", pass);
  p.set("s", s);
  u.search = p.toString();
  return u.toString();
};

const ignoredKeys = ["status", "type", "version"];
const otherKey = <T extends SubsonicBasicResponse>(d: T) =>
  Object.keys(d).reduce((k, f) => (!f && !ignoredKeys.includes(k) ? k : f), "");

export const fetcher = (path: string, conn: Connection) => {
  return fetch(gen(path, conn))
    .then((r) => r.json())
    .then(
      (data: SubsonicBasicResponse) =>
        new Promise<T>((res, rej) =>
          data["subsonic-response"].status == "ok"
            ? res(
                data["subsonic-response"][
                  otherKey(data["subsonic-response"])
                ] as T
              )
            : rej((data["subsonic-response"] as ErrorSubsonicResponse).error)
        )
    );
};

const useAuthenticatedSWR = <T extends Object = {}>(
  path: string,
  opts = { suspense: true }
) => {
  return useSWR<T>([path, useConnection()[0]], fetcher, opts);
};

export const useURL = (path: string) => {
  const [connection] = useConnection();
  return React.useMemo(() => {
    return gen(path, connection);
  }, [connection, path]);
};
export const useUnmemoizedURL = (path: string) => gen(path, useConnection()[0]);

export default useAuthenticatedSWR;
