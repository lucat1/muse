import * as React from "react"
import { useAtomValue } from "jotai"
import useSWR from "swr"
import useSWRInfinite from "swr/infinite"
import md5 from "blueimp-md5"

import { Connection, connectionAtom } from "./stores/connection"
import { SUBSONIC_PROTOCOL_VERSION } from "./const"
import type {
  SubsonicWrapperResponse,
  SubsonicBaseResponse,
  SubsonicErrorResponse
} from "./types"

const CLIENT_NAME = "muse"

export const getURL = (path: string, conn: Connection) => {
  const pass = md5(conn.password + conn.salt)
  const u = new URL(path, conn.host)
  const p = new URLSearchParams(u.search)
  p.set("c", CLIENT_NAME)
  p.set("f", "json")
  p.set("u", conn.username)
  p.set("v", SUBSONIC_PROTOCOL_VERSION)
  p.set("t", pass)
  p.set("s", conn.salt)
  u.search = p.toString()
  return u.toString()
}

const ignoredKeys = ["status", "type", "version"]
const otherKey = <T>(d: SubsonicBaseResponse<T>) =>
  Object.keys(d).reduce((k, f) => (!f && !ignoredKeys.includes(k) ? k : f), "")

export const fetcher = <T>(
  path: string,
  conn: Connection,
  opts: RequestInit | undefined = undefined
) => {
  return fetch(getURL(path, conn), opts)
    .then((r) => r.json())
    .then(
      (
        wrapped: SubsonicWrapperResponse<
          SubsonicBaseResponse<T> | SubsonicErrorResponse
        >
      ) =>
        new Promise<T>((res, rej) => {
          if (wrapped["subsonic-response"].status == "ok") {
            const data = wrapped["subsonic-response"] as SubsonicBaseResponse<T>
            res(data[otherKey(data)] as T)
          } else {
            const data = wrapped["subsonic-response"] as SubsonicErrorResponse
            rej(`Error ${data.code}: ${data.message}`)
          }
        })
    )
}

const useSubsonic = <T extends Object = {}>(
  path: string,
  opts = { suspense: true }
) => {
  return useSWR<T>([path, useAtomValue(connectionAtom)], fetcher, opts)
}

const isArr = ([_, val]: [string, any]) => Array.isArray(val)
const findArray = <T extends Object = {}>(data: T): any[] | null => {
  const entries = Object.entries(data)
  return entries.some(isArr) ? entries.filter(isArr)[0][1] : null
}
export const hasNextPage = <T extends Object = {}>(data: T | null) => {
  let arr = null
  if (data) arr = findArray(data)
  return data == null || (arr?.length || 0) > 0
}

export const useSubsonicInfinite = <T extends Object = {}>(
  gen: (index: number) => string,
  opts = { suspense: true }
) => {
  const conn = useAtomValue(connectionAtom)
  return useSWRInfinite<T>(
    (index, prev) => (hasNextPage(prev) ? [gen(index), conn] : null),
    fetcher,
    opts
  )
}

export const useURL = (path: string) => {
  const connection = useAtomValue(connectionAtom)
  return React.useMemo(() => {
    return getURL(path, connection)
  }, [connection, path])
}

export const useUnmemoizedURL = (path: string) =>
  getURL(path, useAtomValue(connectionAtom))

export default useSubsonic
