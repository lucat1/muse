import * as React from "react";
import { Routes, Route, Outlet, useParams } from "react-router-dom";
import { useConnections } from "../const";

import Artists from "./artists";
import Artist from "./artist";
import Album from "./album";
import NotFound from "./not-found";
import Player, { PlayerContext } from "../components/player";

const Provider: React.FunctionComponent = () => {
  const { server } = useParams();
  const [connections] = useConnections();
  let i;
  if (server == undefined || (i = parseInt(server)) === NaN || !connections[i])
    return <NotFound />;

  return (
    <PlayerContext>
      <Routes>
        <Route index element={<h1>index</h1>} />
        <Route path="artists" element={<Artists />} />
        <Route path="artist/:id" element={<Artist />} />
        <Route path="album/:id" element={<Album />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
      <Player />
    </PlayerContext>
  );
};

export default Provider;
