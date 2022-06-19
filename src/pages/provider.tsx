import * as React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { useConnections } from "../const";

import Search from "./search";
import Artists from "./artists";
import Artist from "./artist";
import Album from "./album";
import NotFound from "./not-found";
import Player, { PlayerContext } from "../components/player";
import Navbar, { NavbarContent } from "../components/nav";

const Provider: React.FunctionComponent = () => {
  const { server } = useParams();
  const [connections] = useConnections();
  let i;
  if (server == undefined || (i = parseInt(server)) === NaN || !connections[i])
    return <NotFound />;

  return (
    <PlayerContext>
      <Navbar />
      <NavbarContent>
        <React.Suspense fallback={<h1>loading in provider</h1>}>
          <Routes>
            <Route index element={<h1>index</h1>} />
            <Route path="search" element={<Search />} />
            <Route path="artists" element={<Artists />} />
            <Route path="artist/:id" element={<Artist />} />
            <Route path="album/:id" element={<Album />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
        <Player />
      </NavbarContent>
    </PlayerContext>
  );
};

export default Provider;
