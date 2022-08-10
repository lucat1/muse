import * as React from "react";
import { useLocation, useParams, Link } from "react-router-dom";

import useSubsonic from "../fetcher";
import { GET_PLAYLISTS, useConnection } from "../const";
import type { SubsonicPlaylistsResponse } from "../types";

const Playlists: React.FC = () => {
  const [connection] = useConnection();
  const path = useParams()["*"];
  const matches = path?.match(/playlist\/(.*)(\?.*)?(\/)?/);
  const id = matches ? matches[1] : null;
  const { data } = useSubsonic<SubsonicPlaylistsResponse>(GET_PLAYLISTS);
  return (
    <>
      {data?.playlist.map((playlist, i) => (
        <Link
          key={i}
          className={`flex felx-row items-center rounded-full my-1 p-1 px-3 font-semibold focus:bg-neutral-200 focus:dark:bg-neutral-800 hover:bg-neutral-200 hover:dark:bg-neutral-800 ${
            playlist.id == id ? "text-red-500 dark:text-red-400" : ""
          }`}
          to={`/${connection.id}/playlist/${playlist.id}`}
        >
          {playlist.name}
        </Link>
      ))}
    </>
  );
};

export default Playlists;
