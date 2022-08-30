import * as React from "react";
import { useAtomValue } from "jotai";

import { PlayerStatus, usePlayer } from "../../stores/player";
import { getURL } from "../../fetcher";
import { connectionAtom } from "../../stores/connection";

export interface AudioProps {
  onTime(time: number): void;
  seek?: number;
  onEnd(): void;
}

const Audio: React.FC<AudioProps> = ({ onTime, seek, onEnd }) => {
  const connection = useAtomValue(connectionAtom);
  const { song, status, play } = usePlayer();
  const audio = React.useRef<HTMLAudioElement>(null);
  React.useEffect(() => {
    if (!audio.current) return;
    const handleTime = () => onTime(audio.current?.currentTime || 0);

    audio.current.addEventListener("canplay", play);
    audio.current.addEventListener("timeupdate", handleTime);
    audio.current.addEventListener("ended", onEnd);
    return () => {
      if (!audio.current) return;

      audio.current.removeEventListener("canplay", play);
      audio.current.removeEventListener("timeupdate", handleTime);
      audio.current.removeEventListener("ended", onEnd);
    };
  }, [audio.current, play, onTime, onEnd]);

  React.useEffect(() => {
    if (audio.current) audio.current.currentTime = 0;
    // TODO: reintroduce scrobbling
    // if (player.song)
    //   fetcher(`${SCROBBLE}?id=${player.song.id}`, connection, {
    //     method: "POST",
    //   });
  }, [audio.current?.src]);
  React.useEffect(() => {
    if (!audio.current) return;

    if (status == PlayerStatus.PLAYING) audio.current.play();
    if (status == PlayerStatus.PAUSED) audio.current.pause();
  }, [audio.current, song, status]);

  React.useEffect(() => {
    if (audio.current && seek) audio.current.currentTime = seek;
  }, [audio.current, seek]);

  return (
    <audio
      ref={audio}
      src={
        status == PlayerStatus.UNLOADED
          ? ""
          : getURL(`stream?id=${song!.id}`, connection)
      }
    />
  );
};

export default Audio;
