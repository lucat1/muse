import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import formatDuration from "format-duration";
import { PauseIcon as Pause, PlayIcon as Play } from "@heroicons/react/outline";

import Audio from "./audio";
import { PlayerStatus, usePlayer } from "./player-context";
import { useQueue } from "./queue-context";
import { StandardWidth } from "../standard";

const Player: React.FunctionComponent = () => {
  const { song, status, load, play, pause } = usePlayer();
  const { queue, next } = useQueue();
  const [seek, setSeek] = React.useState(-1);
  const [time, setTime] = React.useState(0);
  const [seekTime, setSeekTime] = React.useState<number | undefined>(undefined);

  const timeScale = React.useMemo(
    () => 100 / (song?.duration || 1),
    [song?.duration]
  );
  const handleEnd = React.useCallback(() => {
    const song = queue[0];
    next();
    load(song);
    play();
  }, [queue, next, load, play]);
  React.useEffect(() => setSeekTime(undefined), [song]);

  return (
    <section className="fixed left-48 md:left-64 xl:left-72 right-0 bottom-0 h-24 flex border-t dark:border-neutral-700">
      <Audio
        onTime={(time) => setTime(time)}
        seek={seekTime}
        onEnd={handleEnd}
      />
      <StandardWidth className="m-auto">
        <div className="flex flex-row justify-center pt-2">
          <button
            disabled={status == PlayerStatus.UNLOADED /* || !canPlay*/}
            className="w-12 aspect-square rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700"
            onClick={status == PlayerStatus.PAUSED ? play : pause}
          >
            {status == PlayerStatus.PLAYING ? <Pause /> : <Play />}
          </button>
        </div>
        <div className="flex flex-row py-2">
          <span className="pr-4">{formatDuration(time * 1000)}</span>
          <Slider.Root
            className="relative w-full flex items-center"
            disabled={status == PlayerStatus.UNLOADED /* || !canPlay*/}
            value={[(seek != -1 ? seek : time) * timeScale]}
            onValueChange={(value) => setSeek(value[0] / timeScale)}
            onPointerUp={() => {
              setSeekTime(seek);
              setSeek(-1);
            }}
          >
            <Slider.Track className="bg-zinc-300 dark:bg-white-500 relative grow rounded-full h-2">
              <Slider.Range className="bg-zinc-400 dark:bg-white-400 absolute h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="bg-zinc-300 dark:bg-white-300 block rounded-full w-4 h-4" />
          </Slider.Root>
          <span className="pl-4">
            {formatDuration((song?.duration || 0) * 1000)}
          </span>
        </div>
      </StandardWidth>
    </section>
  );
};

export default Player;

export { PlayerContext, usePlayer } from "./player-context";
export { QueueContext, useQueue } from "./queue-context";
