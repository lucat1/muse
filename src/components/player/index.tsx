import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import formatDuration from "format-duration";
import { PauseIcon as Pause, PlayIcon as Play } from "@heroicons/react/outline";

import Audio from "./audio";
import { usePlayer } from "./player-context";
import { StandardWidth } from "../standard";
import { getURL, fetcher } from "../../fetcher";
import { useConnection, SCROBBLE } from "../../const";

const Player: React.FunctionComponent = () => {
  const [player, dispatch] = usePlayer();
  const [connection] = useConnection();
  const audio = React.useRef<HTMLAudioElement>(null);
  const [canPlay, setCanPlay] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [seek, setSeek] = React.useState(-1);
  React.useEffect(() => {
    if (!audio.current) return;
    const handleCanPlay = () => setCanPlay(true);
    const handleTimeUpdate = () => setTime(audio.current?.currentTime || 0);

    audio.current.addEventListener("canplay", handleCanPlay);
    audio.current.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.current?.removeEventListener("canplay", handleCanPlay);
      audio.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audio]);
  React.useEffect(() => {
    if (audio.current) audio.current.currentTime = 0;
    if (player.song)
      fetcher(`${SCROBBLE}?id=${player.song.id}`, connection, {
        method: "POST",
      });
  }, [audio.current?.src]);
  React.useEffect(() => {
    if (player.song == undefined || audio.current == undefined) return;

    if (player.state == PlayerState.Playing && canPlay) audio.current.play();
    if (player.state == PlayerState.Paused) audio.current.pause();
  }, [audio, player.song?.id, player.state, canPlay]);
  const timeScale = React.useMemo(
    () => 100 / (player.song?.duration || 1),
    [player.song?.duration]
  );

  return (
    <section className="fixed left-48 md:left-64 xl:left-72 right-0 bottom-0 h-24 flex border-t dark:border-neutral-700">
      <audio
        ref={audio}
        src={
          player.song?.id
            ? getURL(`stream?id=${player.song.id}`, connection)
            : ""
        }
      />
      <StandardWidth className="m-auto">
        <div className="flex flex-row justify-center pt-2">
          <button
            className="w-12 aspect-square rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700"
            onClick={() => dispatch({ type: "toggle" })}
          >
            {player.state == PlayerState.Playing ? <Pause /> : <Play />}
          </button>
        </div>
        <div className="flex flex-row py-2">
          <span className="pr-4">{formatDuration(time * 1000)}</span>
          <Slider.Root
            className="relative w-full flex items-center"
            disabled={player.state == PlayerState.None || !canPlay}
            value={[(seek != -1 ? seek : time) * timeScale]}
            onValueChange={(value) => setSeek(value[0] / timeScale)}
            onPointerUp={() => {
              audio.current!.currentTime = seek;
              setSeek(-1);
            }}
          >
            <Slider.Track className="bg-zinc-300 dark:bg-white-500 relative grow rounded-full h-2">
              <Slider.Range className="bg-zinc-400 dark:bg-white-400 absolute h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="bg-zinc-300 dark:bg-white-300 block rounded-full w-4 h-4" />
          </Slider.Root>
          <span className="pl-4">
            {formatDuration(
              (player.song?.duration || audio.current?.duration || 0) * 1000
            )}
          </span>
        </div>
      </StandardWidth>
    </section>
  );
};

export default Player;

export { PlayerContext, usePlayer } from "./player-context";
export { QueueContext, useQueue } from "./queue-context";
