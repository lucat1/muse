import useSWR from "swr";
import md5 from "blueimp-md5";
import { useConnection, SUBSONIC_PROTOCOL_VERSION } from "./const";
import { SubsonicError } from "./types";

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
interface SubsonicErrorResponse extends BasicSubsonicResponse {
  error: SubsonicError;
}

const ignoredKeys = ["status", "type", "version"];
const otherKey = <T extends BasicSubsonicResponse>(d: T) =>
  Object.keys(d).reduce((k, f) => (!f && !ignoredKeys.includes(k) ? k : f), "");

const fetcher =
  <T>(username: string, salted: string, salt: string) =>
  (url: string) => {
    const u = new URL(url);
    const p = new URLSearchParams(u.search);
    p.set("c", CLIENT_NAME);
    p.set("f", "json");
    p.set("u", username);
    p.set("v", SUBSONIC_PROTOCOL_VERSION);
    p.set("t", salted);
    p.set("s", salt);
    u.search = p.toString();
    return fetch(u.toString())
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
  const [connection] = useConnection();
  const s = salt(connection.saltLength);
  const pass = md5(connection.password + s);
  return useSWR(
    new URL(path, connection.host).toString(),
    fetcher<T>(connection.username, pass, s),
    opts
  );
};

export default useAuthenticatedSWR;
