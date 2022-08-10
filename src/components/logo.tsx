import * as React from "react";
import { Link } from "react-router-dom";

import { RING } from "../const";

const Logo: React.FC<{ to: string }> = ({ to }) => (
  <Link to={to} className={RING}>
    <h1 className="text-3xl font-bold font-logo">Muse</h1>
  </Link>
);

export default Logo;
