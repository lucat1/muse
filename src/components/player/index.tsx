import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import formatDuration from "format-duration";
import {
  PauseIcon as Pause,
  PlayIcon as Play,
  QueueListIcon as QueueIcon,
} from "@heroicons/react/24/outline";

import Audio from "./audio";
import IconButton from "../icon-button";
import { connectionAtom } from "../../stores/connection";
import { usePlayer, PlayerStatus } from "../../stores/player";
import { useQueue, useStack } from "../../stores/queue";
import { StandardWidth } from "../standard";

const Player: React.FunctionComponent = () => {
  const connection = useAtomValue(connectionAtom);
  const navigate = useNavigate();
  const { song, status, load, play, pause } = usePlayer();
  const { queue, next } = useQueue();
  const { push } = useStack();
  const [seek, setSeek] = React.useState(-1);
  const [time, setTime] = React.useState(0);
  const [seekTime, setSeekTime] = React.useState<number | undefined>(undefined);

  const handleEnd = React.useCallback(() => {
    push([song!]);
    load(queue[0]);
    next();
  }, [queue, next, load]);
  React.useEffect(() => setSeekTime(undefined), [song]);

  return (
    <section className="fixed left-48 md:left-64 xl:left-72 right-0 bottom-0 h-24 flex border-t dark:border-neutral-700">
      <Audio onTime={setTime} seek={seekTime} onEnd={handleEnd} />
      <StandardWidth className="mx-auto align-center justify-between py-2">
        <div className="flex flex-row justify-center">
          <IconButton
            disabled={status == PlayerStatus.UNLOADED /* || !canPlay*/}
            aria-label={status == PlayerStatus.PAUSED ? "Play" : "Pause"}
            onClick={status == PlayerStatus.PAUSED ? play : pause}
          >
            {status == PlayerStatus.PLAYING ? <Pause /> : <Play />}
          </IconButton>
          <IconButton
            aria-label="Queue"
            onClick={() => navigate(`/${connection.id}/queue`)}
          >
            <QueueIcon />
          </IconButton>
        </div>
        <div className="flex flex-row">
          <span className="mr-4">{formatDuration(time * 1000)}</span>
          <Slider.Root
            className="relative w-full flex items-center"
            disabled={status == PlayerStatus.UNLOADED /* || !canPlay*/}
            value={[seek != -1 ? seek : time]}
            max={song?.duration || 0}
            onValueChange={(value) => setSeek(value[0])}
            onPointerUp={() => {
              setSeekTime(seek);
              setSeek(-1);
            }}
          >
            <Slider.Track className="bg-neutral-900 dark:bg-neutral-100 relative grow h-1">
              <Slider.Range className="bg-red-500 dark:bg-red-400 absolute h-full" />
            </Slider.Track>
            <Slider.Thumb className="bg-zinc-300 dark:bg-white-300 block rounded-full w-1 h-5 focus:w-2" />
          </Slider.Root>
          <span className="ml-4">
            {formatDuration((song?.duration || 0) * 1000)}
          </span>
        </div>
      </StandardWidth>
    </section>
  );
};

export default Player;
