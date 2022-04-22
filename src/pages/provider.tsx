import * as React from "react";
import { Routes, Route, Outlet, useParams } from "react-router-dom";
import { RouterParams, useConnections } from "../const";

import Artists from "./artists";
import Artist from "./artist";
import NotFound from "./not-found";

const Provider: React.FunctionComponent = () => {
  const { server } = useParams<RouterParams>();
  const [connections] = useConnections();
  let i;
  if (server == undefined || (i = parseInt(server)) === NaN || !connections[i])
    return <NotFound />;
  console.log(i);

  return (
    <>
      <Routes>
        <Route index element={<h1>index</h1>} />
        <Route path="artists" element={<Artists />} />
        <Route path="artist/:id" element={<Artist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </>
  );
};

export default Provider;
