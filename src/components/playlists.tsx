import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { useAtomValue } from "jotai";

import useSubsonic from "../fetcher";
import { connectionAtom } from "../stores/connection";
import { GET_PLAYLISTS } from "../const";
import type { SubsonicPlaylistsResponse } from "../types";

const Playlists: React.FC = () => {
  const connection = useAtomValue(connectionAtom);
  const path = useParams()["*"];
  const matches = path?.match(/playlist\/(.*)(\?.*)?(\/)?/);
  const id = matches ? matches[1] : null;
  const { data } = useSubsonic<SubsonicPlaylistsResponse>(GET_PLAYLISTS);
  return (
    <>
      {data?.playlist.map((playlist, i) => (
        <Link
          key={i}
          className={`flex felx-row items-center rounded-full p-2 px-3 focus:bg-neutral-200 focus:dark:bg-neutral-800 hover:bg-neutral-200 hover:dark:bg-neutral-800 ${playlist.id == id ? "text-red-500 dark:text-red-400" : ""
            } outline-none`}
          to={`/${connection.id}/playlist/${playlist.id}`}
        >
          <span className="font-semibold truncate">{playlist.name}</span>
        </Link>
      ))}
    </>
  );
};

export default Playlists;
