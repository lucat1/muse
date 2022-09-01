import * as React from "react";

import Track, { Fields, TrackProps } from "./track";
import type { SubsonicSong } from "../types";
import { usePlayer } from "../stores/player";
import { useQueue, useStack } from "../stores/queue";

const SongList: React.FC<{ songs: SubsonicSong[] } & TrackProps> = ({
  songs,
  ...fields
}) => {
  const { song, load } = usePlayer();
  const { append, clear: clearQueue } = useQueue();
  const { push, clear: clearStack } = useStack();
  const playTrack = React.useCallback(
    (i: number) => {
      if (songs[i] == song) return;

      clearStack();
      clearQueue();
      push(songs.slice(0, i).reverse());
      append(songs.slice(i + 1));
      load(songs[i]);
    },
    [songs, song, load, append, clearQueue, clearStack, push]
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
        <Track key={i} song={song} play={() => playTrack(i)} {...fields} />
      ))}
    </main>
  );
};

export default SongList;
