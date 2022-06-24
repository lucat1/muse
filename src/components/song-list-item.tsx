import * as React from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/solid";
import type { SubsonicSong } from "src/types";
import formatDuration from "format-duration";

export interface SongProps {
  song: SubsonicSong;
  playing: boolean;
  play: (song: SubsonicSong) => void;
}

export interface Field {
  name: string;
  size: string;
  value: React.FC<SongProps>;
}

export const defaultFields: Field[] = [
  {
    name: "Liked",
    size: "1fr",
    value: ({ song }) => {
      const Heart = song.starred != undefined ? HeartSolid : HeartOutline;
      return <Heart className="w-6" />;
    },
  },
  {
    name: "Title",
    size: "12fr",
    value: ({ song, play }) => {
      return (
        <a
          onClick={(e) => {
            e.preventDefault();
            play(song);
          }}
        >
          {song.title}
        </a>
      );
    },
  },
  {
    name: "Length",
    size: "1fr",
    value: ({ song }) => {
      return <a>{formatDuration(song.duration * 1000)}</a>;
    },
  },
];

const Song: React.FC<{ fields: Field[]; props: SongProps }> = ({
  fields,
  props,
}) => {
  return (
    <div className="contents">
      {fields.map(({ value: Value, name }) => (
        <Value key={name} {...props} />
      ))}
    </div>
  );
};

export default Song;
