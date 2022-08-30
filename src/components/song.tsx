import * as React from "react";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import formatDuration from "format-duration";

import { getURL } from "../fetcher";
import type { SubsonicSong } from "../types";
import { connectionAtom } from "../stores/connection";
import { usePlayer } from "../stores/player";
import { GET_COVER_ART } from "../const";

import Image from "./img";
import Dot from "./dot";

const Song: React.FC<{ song: SubsonicSong }> = ({ song }) => {
  const conn = useAtomValue(connectionAtom);
  const { play, load } = usePlayer();
  const handlePlay = React.useCallback(
    (e: any) => {
      e.preventDefault();
      load(song);
      play();
    },
    [song]
  );

  return (
    <div className="w-32 lg:w-64 mx-8 my-4 flex-shrink-0">
      <a onClick={play}>
        <Image
          src={getURL(`${GET_COVER_ART}?id=${song.coverArt}`, conn)}
          className="w-32 lg:w-64 hover:drop-shadow-lg focus:drop-shadow-lg focus:outline-none"
        />
      </a>
      <div className="mt-2 truncate">
        <a onClick={handlePlay}>{song.title}</a>
        <br />
        <span className="text-xs">
          <Link to={`/${conn.id}/album/${song.albumId}`}>{song.album}</Link>
          <Dot />
          {formatDuration(song.duration * 1000)}
        </span>
      </div>
    </div>
  );
};

export default Song;
