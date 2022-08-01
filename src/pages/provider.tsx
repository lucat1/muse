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
import ScrollToTop from "../components/scroll-to-top";

const Provider: React.FunctionComponent = () => {
  const ref = React.useRef<HTMLElement>();
  const { server } = useParams();
  const [connections] = useConnections();
  let i;
  if (server == undefined || (i = parseInt(server)) === NaN || !connections[i])
    return <NotFound />;

  return (
    <PlayerContext>
      <ScrollToTop ele={ref.current?.firstChild} />
      <Navbar />
      <NavbarContent ref={ref}>
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
      </NavbarContent>
      <Player />
    </PlayerContext>
  );
};

export default Provider;
