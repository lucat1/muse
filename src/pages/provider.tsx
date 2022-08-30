import * as React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { useAtomValue, Provider as JotaiProvider } from "jotai";

import {
  internalConnectionAtom,
  connectionsListAtom,
} from "../stores/connection";
import {
  playerAtom,
  DEFAULT_STATE as PLAYER_DEFAULT_STATE,
} from "../stores/player";
import {
  queueAtom,
  stackAtom,
  DEFAULT_STATE as QUEUE_DEFAULT_STATE,
} from "../stores/queue";
import Player from "../components/player";
import Navbar, { NavbarContent } from "../components/nav";
import ScrollToTop from "../components/scroll-to-top";

import Search from "./search";
import Artists from "./artists";
import Artist from "./artist";
import Albums from "./albums";
import Album from "./album";
import Playlists from "./playlists";
import Playlist from "./playlist";
import NotFound from "./not-found";
import Queue from "./queue";

const Provider: React.FunctionComponent = () => {
  const ref = React.useRef<HTMLElement>(null);
  const { server } = useParams();
  const conns = useAtomValue(connectionsListAtom);
  const id = parseInt(server!);
  if (server == undefined || !conns[id]) return <NotFound />;

  return (
    <JotaiProvider
      initialValues={[
        [internalConnectionAtom, conns[id]],
        [playerAtom, PLAYER_DEFAULT_STATE],
        [queueAtom, QUEUE_DEFAULT_STATE],
        [stackAtom, QUEUE_DEFAULT_STATE],
      ]}
    >
      <Navbar />
      <NavbarContent ref={ref}>
        <React.Suspense fallback={<h1>loading in provider</h1>}>
          <Routes>
            <Route index element={<h1>index</h1>} />
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
        </React.Suspense>
      </NavbarContent>
      <Player />
      <ScrollToTop
        ele={ref.current?.firstChild as HTMLElement | undefined | null}
      />
    </JotaiProvider>
  );
};

export default Provider;
