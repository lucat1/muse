import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css'

import ScrollToTop from "./components/scroll-to-top";
import Welcome from "./pages/welcome";
import Connect from "./pages/connect";
import NotFound from "./pages/not-found";

const Provider = React.lazy(() => import("./pages/provider"))

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback={<h1>loading</h1>}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route index element={<Welcome />} />
          <Route path="connect" element={<Connect />} />
          <Route path=":server/*" element={<Provider />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop ele={document.body} />
      </BrowserRouter>
    </React.Suspense>
  </React.StrictMode>
);
