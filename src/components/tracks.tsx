import * as React from "react";

import Track, { Fields, TrackProps } from "./track";
import type { SubsonicSong } from "../types";

const SongList: React.FC<{ songs: SubsonicSong[] } & TrackProps> = ({
  songs,
  ...fields
}) => {
  return (
    <main
      className="w-full grid gap-y-2"
      style={{
        gridTemplateColumns: `auto ${Object.values(Fields)
          .map((f) => fields[f] || 0)
          .filter((f) => f != 0)
          .map((f) => (f < 0 ? "auto" : `${f}fr`))
          .join(" ")} auto`,
      }}
    >
      {songs.map((song) => (
        <Track key={song.id} song={song} {...fields} />
      ))}
    </main>
  );
};

export default SongList;
