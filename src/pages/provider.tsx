import * as React from "react"
import { Routes, Route, useParams } from "react-router-dom"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useAtomValue, Provider as JotaiProvider } from "jotai"

import {
  internalConnectionAtom,
  connectionsListAtom
} from "../stores/connection"
import {
  playerAtom,
  DEFAULT_STATE as PLAYER_DEFAULT_STATE
} from "../stores/player"
import {
  queueAtom,
  stackAtom,
  DEFAULT_STATE as QUEUE_DEFAULT_STATE
} from "../stores/queue"

import App from "../components/app"
import Queue from "./queue"

const Index = React.lazy(() => import("./index"))
const Search = React.lazy(() => import("./search"))
const Artists = React.lazy(() => import("./artists"))
const Artist = React.lazy(() => import("./artist"))
const Albums = React.lazy(() => import("./albums"))
const Album = React.lazy(() => import("./album"))
const Playlists = React.lazy(() => import("./playlists"))
const Playlist = React.lazy(() => import("./playlist"))
const NotFound = React.lazy(() => import("./not-found"))

const Provider: React.FunctionComponent = () => {
  const { server } = useParams()
  const conns = useAtomValue(connectionsListAtom)
  const id = parseInt(server!)
  if (server == undefined || !conns[id]) return <NotFound />

  return (
    <JotaiProvider
      initialValues={[
        [internalConnectionAtom, conns[id]],
        [playerAtom, PLAYER_DEFAULT_STATE],
        [queueAtom, QUEUE_DEFAULT_STATE],
        [stackAtom, QUEUE_DEFAULT_STATE]
      ]}
    >
      <App>
        <DndProvider backend={HTML5Backend}>
          <Routes>
            <Route index element={<Index />} />
            <Route path="queue" element={<Queue />} />
            <Route path="search" element={<Search />} />
            <Route path="artists" element={<Artists />} />
            <Route path="artist/:id" element={<Artist />} />
            <Route path="albums" element={<Albums />} />
            <Route path="album/:id" element={<Album />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="playlist/:id" element={<Playlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DndProvider>
      </App>
    </JotaiProvider>
  )
}

export default Provider
