import * as React from "react";
import { Connection, ConnectionsConext, LOCAL_STORAGE_KEY } from "./const";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "use-local-storage";

const App: React.FunctionComponent = ({ children }) => {
  return (
    <React.StrictMode>
      <ConnectionsConext.Provider
        value={useLocalStorage<Connection[]>(LOCAL_STORAGE_KEY, [])}
      >
        <React.Suspense fallback={<h1>loading</h1>}>
          <BrowserRouter>{children}</BrowserRouter>
        </React.Suspense>
      </ConnectionsConext.Provider>
    </React.StrictMode>
  );
};

export default App;
