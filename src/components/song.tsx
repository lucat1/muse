import * as React from "react";
import type { SubsonicSongBase } from "../types";

const Song: React.FC<{ song: SubsonicSongBase }> = ({ song }) => {
  return <div>{song.title}</div>;
};

export default Song;
