import * as React from "react";

import Track, { Fields, TrackProps } from "./track";
import type { SubsonicSong } from "../types";
import { usePlayer, useQueue } from "./player";

const SongList: React.FC<{ songs: SubsonicSong[] } & TrackProps> = ({
  songs,
  ...fields
}) => {
  const { load, play } = usePlayer();
  const { append, clear } = useQueue();
  const generatePlayTrack = React.useCallback(
    (i: number) => () => {
      clear();
      append(songs.slice(i + 1).concat(songs.slice(0, i)));
      load(songs[i]);
      play();
    },
    [load, play, songs]
  );

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
      {songs.map((song, i) => (
        <Track key={i} song={song} play={generatePlayTrack(i)} {...fields} />
      ))}
    </main>
  );
};

export default SongList;
