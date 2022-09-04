import * as React from "react";

import Header from "./header";
import Navbar from "./nav";
import Player from "./player";
import PlayerInfo from "./player-info";
import ScrollToTop from "./scroll-to-top";

const App: React.FunctionComponent<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const ref = React.useRef<HTMLElement>(null);
  return (
    <main className="w-screen h-screen grid grid-cols-smlayout md:grid-cols-layout grid-rows-layout">
      <Header />
      <Navbar />
      <main
        ref={ref}
        className="col-stat-1 col-end-2 row-start-2 row-end-3 md:col-start-2 md:row-start-1 overflow-auto"
      >
        <React.Suspense fallback={<h1>TODO LOADING</h1>}>
          {children}
        </React.Suspense>
      </main>
      <PlayerInfo />
      <Player />
      <ScrollToTop
        ele={ref.current?.firstChild as HTMLElement | undefined | null}
      />
    </main>
  );
};

export default App;
