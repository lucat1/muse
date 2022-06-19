import * as React from "react";
import { Navigate, Link } from "react-router-dom";
import { useConnections } from "../const";

const Welcome = () => {
  const [connections] = useConnections();
  if (connections.length > 0) return <Navigate to="/0/" replace />;

  return (
    <>
      <h1>welcome</h1>
      <Link to="/connect">connect</Link>
    </>
  );
};

export default Welcome;
