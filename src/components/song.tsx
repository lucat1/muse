import * as React from "react";
import { Link } from "react-router-dom";
import formatDuration from "format-duration";
import { getURL } from "../fetcher";
import type { SubsonicSong } from "../types";
import { GET_COVER_ART, useConnection } from "../const";

import { usePlayer } from "./player";
import Image from "./img";

const Song: React.FC<{ song: SubsonicSong }> = ({ song }) => {
  const [conn] = useConnection();
  const [_, dispatch] = usePlayer();
  const play = React.useCallback(
    (e: any) => {
      e.preventDefault();
      dispatch({ type: "play", payload: song });
    },
    [song]
  );

  console.log(song);
  return (
    <div className="w-32 lg:w-64 mx-8 my-4 flex-shrink-0">
      <a onClick={play}>
        <Image
          src={getURL(`${GET_COVER_ART}?id=${song.coverArt}`, conn)}
          className="w-32 lg:w-64 hover:drop-shadow-lg focus:drop-shadow-lg focus:outline-none"
        />
      </a>
      <div className="mt-2 truncate">
        <a onClick={play}>{song.title}</a>
        <br />
        <span className="text-xs">
          <Link to={`/${conn.id}/album/${song.albumId}`}>{song.album}</Link>{" "}
          {"\uFF65"} {formatDuration(song.duration * 1000)}
        </span>
      </div>
    </div>
  );
};

export default Song;
