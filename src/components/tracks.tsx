import * as React from "react";

import Track, { TrackProps } from "./track";
import type { SubsonicSong } from "../types";

const SongList: React.FC<{ songs: SubsonicSong[] } & TrackProps> = ({
  songs,
  ...props
}) => {
  return (
    <main className="w-full">
      {songs.map((song) => (
        <Track key={song.id} song={song} {...props} />
      ))}
    </main>
  );
};

export default SongList;
