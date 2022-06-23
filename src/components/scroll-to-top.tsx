import * as React from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC<{
  ele?: HTMLElement;
}> = ({ ele }) => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    ele?.scrollTo(0, 0);
  }, [pathname, ele]);

  return null;
};

export default ScrollToTop;
