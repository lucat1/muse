import * as React from "react";
import { BrowserRouter } from "react-router-dom";

const App: React.FunctionComponent<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<h1>loading</h1>}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          {children}
        </BrowserRouter>
      </React.Suspense>
    </React.StrictMode>
  );
};

export default App;
