import * as React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./index.css"

import Loading from "./components/loading"
import ScrollToTop from "./components/scroll-to-top"
import Welcome from "./pages/welcome"
import Connect from "./pages/connect"
import NotFound from "./pages/not-found"

const Provider = React.lazy(() => import("./pages/provider"))

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense
      fallback={
        <div className="w-scren h-screen flex items-center justify-center">
          <Loading />
        </div>
      }
    >
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
)
