import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAtom } from "jotai";
import debounce from "debounce";

import { RING_ALWAYS } from "../const";
import { Connection, connectionsAtom } from "../stores/connection";
import { titleAtom } from "../stores/title";
import MinimalWrapper from "../components/minimal-wrapper";

const ConnWrap: React.FC<
  React.PropsWithChildren<{ active: boolean; onClick?: any }>
> = ({ active, onClick, children }) => (
  <div
    className={`rounded-xl p-8 w-48 h-64 mx-6 cursor-pointer bg-neutral-200 dark:bg-neutral-800 ${active ? RING_ALWAYS : ""
      }`}
    onClick={onClick}
  >
    {children}
  </div>
);

let debouncer: (Function & { clear(): void }) | null;
const Conn: React.FC<{
  conn: Connection;
}> = ({ conn }) => {
  const [conns, setConns] = useAtom(connectionsAtom);
  const navigate = useNavigate();
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    switch (e.detail) {
      case 1:
        debouncer = debounce(() => {
          setConns((s) => ({ ...s, default: conn.id }));
        }, 200);
        debouncer();
        break;
      case 2:
        if (debouncer) {
          debouncer.clear();
          debouncer = null;
        }
        navigate(`/${conn.id}/`);
        break;
    }
  };

  return (
    <ConnWrap active={conn.id == conns.default} onClick={handleClick}>
      <div className="flex items-center justify-center w-32 h-32 text-4xl rounded-xl bg-neutral-300 dark:bg-neutral-700">
        #{conn.id}
      </div>
      <div className="my-4 break-words">
        <span className="text-red-500 dark:text-red-400">{conn.username}</span>
        <br />
        <span className="text-xs">{new URL(conn.host).hostname}</span>
      </div>
    </ConnWrap>
  );
};

const Welcome = () => {
  const [_, setTitle] = useAtom(titleAtom);
  React.useEffect(() => {
    setTitle("Home");
  }, []);
  const navigate = useNavigate();
  const [conns] = useAtom(connectionsAtom);
  const memo = React.useMemo(() => conns, []);
  React.useEffect(() => {
    if (memo.list.length == 0) return navigate("/connect", { replace: true });
    if (memo.default != undefined)
      navigate(`/${memo.default}/`, { replace: true });
  }, [memo]);

  return (
    <MinimalWrapper>
      <main className="flex flex-col justify-center w-screen h-screen p-8">
        <div>
          <section
            role="row"
            className="flex flex-row items-center justify-center overflow-x-auto overflow-y-hidden py-4"
          >
            {conns.list.map((conn, i) => (
              <Conn key={i} conn={conn} />
            ))}
            <Link to="/connect">
              <ConnWrap active={false}>
                <div className="flex items-center justify-center w-32 h-32 text-4xl rounded-xl bg-neutral-300 dark:bg-neutral-700">
                  +
                </div>
                <div className="my-4 break-words">New connection</div>
              </ConnWrap>
            </Link>
          </section>
          <footer className="flex mt-16 items-center justify-center">
            <article className="prose dark:prose-invert prose-neutral xl:max-w-2xl">
              You can click on one connection to set it as{" "}
              <span className="text-red-500 dark:text-red-400">default</span>.
              The next time you come to{" "}
              <span className="font-logo text-black dark:text-white">muse</span>{" "}
              you'll be{" "}
              <span className="text-red-500 dark:text-red-400">
                automatically connected
              </span>
              .
              <br />
              Double clicking on an item will connect to it.
            </article>
          </footer>
        </div>
      </main>
    </MinimalWrapper>
  );
};

export default Welcome;
