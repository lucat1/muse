import * as React from "react";
import { Navigate, Link } from "react-router-dom";

import { Connection, RING, useConnections, useTitle } from "../const";
import MinimalWrapper from "../components/minimal-wrapper";

const ConnWrap: React.FC<React.PropsWithChildren<{ auto: boolean }>> = ({
  auto,
  children,
}) => (
  <div
    className={`rounded-xl p-8 w-48 h-64 mx-6 bg-neutral-200 dark:bg-neutral-800 ${
      auto ? RING : ""
    }`}
  >
    {children}
  </div>
);

const Conn: React.FC<{ conn: Connection; i: number }> = ({ conn, i }) => {
  const url = new URL(conn.host);
  return (
    <Link to={`/${i}/`}>
      <ConnWrap auto={conn.auto}>
        <div className="flex items-center justify-center w-32 h-32 text-4xl rounded-xl bg-neutral-300 dark:bg-neutral-700">
          #{i}
        </div>
        <div className="my-4 break-words">
          {conn.username}@{url.hostname}
        </div>
      </ConnWrap>
    </Link>
  );
};

const Welcome = () => {
  useTitle("Home");
  const [connections] = useConnections();
  if (connections.length == 0) return <Navigate to="/connect" replace />;
  if (connections.length > 0 && connections.some((c) => c.auto))
    return (
      <Navigate
        to={`/${
          connections
            .map((c, i) => [c.auto, i])
            .filter(([auto, _]) => auto)[0][1]
        }/`}
        replace
      />
    );

  return (
    <MinimalWrapper>
      <main className="flex items-center justify-center w-screen h-screen overflow-auto">
        {connections.map((conn, i) => (
          <Conn key={i} conn={conn} i={i} />
        ))}
        <Link to="/connect">
          <ConnWrap auto={false}>
            <div className="flex items-center justify-center w-32 h-32 text-4xl rounded-xl bg-neutral-300 dark:bg-neutral-700">
              +
            </div>
            <div className="my-4 break-words">New connection</div>
          </ConnWrap>
        </Link>
      </main>
    </MinimalWrapper>
  );
};

export default Welcome;
