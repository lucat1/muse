import * as React from "react";

import Logo from "../components/logo";
import ThemeButton from "../components/theme-button";

const MinimalWrapper: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => (
  <>
    <div className="fixed top-0 left-0 p-4">
      <Logo to="/" />
    </div>
    <div className="fixed top-0 right-0 p-4">
      <ThemeButton />
    </div>
    {children}
  </>
);

export default MinimalWrapper
