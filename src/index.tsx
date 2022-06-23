import * as React from "react";
import { createRoot } from "react-dom/client";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import App from "./app";
import ScrollToTop from "./components/scroll-to-top";
import Welcome from "./pages/welcome";
import Connect from "./pages/connect";
import NotFound from "./pages/not-found";
import Provider from "./pages/provider";

createRoot(document.getElementById("root")!).render(
  <App>
    <ScrollToTop ele={window} />
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="connect" element={<Connect />} />
      <Route path=":server/*" element={<Provider />} />
      {/*<Route index element={<Home />} /> <Route path="albums" element={<Teams />} />*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </App>
);
