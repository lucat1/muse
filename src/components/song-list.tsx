import * as React from "react";
import type { SubsonicSong } from "src/types";
import { usePlayer } from "../components/player";
import Song, { Field } from "./song-list-item";

const SongList: React.FC<{
  fields: Field[];
  songs: SubsonicSong[];
}> = ({ fields, songs }) => {
  const [player, dispatch] = usePlayer();
  const play = React.useCallback(
    (song: SubsonicSong) => dispatch({ type: "play", payload: song }),
    [dispatch]
  );

  return (
    <div
      className="grid auto-cols-min gap-x-4 gap-y-4"
      style={{
        gridTemplateColumns: fields.map((f) => f.size).join(" "),
      }}
    >
      {fields.map((f) => (
        <h4 key={f.name} className="font-bold">
          {f.name}
        </h4>
      ))}
      {songs.map((song) => (
        <Song
          key={song.id}
          fields={fields}
          props={{
            song,
            playing: player?.song?.id == song.id,
            play,
          }}
        />
      ))}
    </div>
  );
};

export default SongList;
