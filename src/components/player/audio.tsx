import * as React from "react";
import { useAtomValue } from "jotai";

import { PlayerStatus, usePlayer } from "./player-context";
import { getURL } from "../../fetcher";
import { connectionAtom } from "../../stores/connection";

export interface AudioProps {
  onTime(time: number): void;
  seek?: number;
  onEnd(): void;
}

const Audio: React.FC<AudioProps> = ({ onTime, seek, onEnd }) => {
  const connection = useAtomValue(connectionAtom);
  const { song, status } = usePlayer();
  const [canPlay, setCanPlay] = React.useState(false);
  const audio = React.useRef<HTMLAudioElement>(null);
  const handleTime = React.useCallback(
    () => onTime(audio.current?.currentTime || 0),
    [onTime, audio.current]
  );
  React.useEffect(() => {
    if (!audio.current) return;
    const handleCanPlay = () => setCanPlay(true);

    audio.current.addEventListener("canplay", handleCanPlay);
    audio.current.addEventListener("timeupdate", handleTime);
    audio.current.addEventListener("ended", onEnd);
    return () => {
      audio.current?.removeEventListener("canplay", handleCanPlay);
      audio.current?.removeEventListener("timeupdate", handleTime);
      audio.current?.removeEventListener("end", onEnd);
    };
  }, [audio.current]); // TODO: used to be audio.current

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

    if (status == PlayerStatus.PLAYING && canPlay) audio.current.play();
    if (status == PlayerStatus.PAUSED) audio.current.pause();
  }, [audio.current, song, status, canPlay]);

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
