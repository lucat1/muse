import * as React from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route } from "react-router-dom";

import App from "./app";
import Welcome from "./pages/welcome";
import Connect from "./pages/connect";
import NotFound from "./pages/not-found";

import Provider from "./pages/provider";
// const Provider = React.lazy(() => import("./pages/provider"));

createRoot(document.getElementById("root")!).render(
  <App>
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="connect" element={<Connect />} />
      <Route path=":server/*" element={<Provider />} />
      {/*<Route index element={<Home />} /> <Route path="albums" element={<Teams />} />*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </App>
);
