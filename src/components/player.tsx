import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import formatDuration from "format-duration";
import { PauseIcon as Pause, PlayIcon as Play } from "@heroicons/react/outline";
import { getURL, fetcher } from "../fetcher";
import type { SubsonicSong } from "../types";
import { useConnection, SCROBBLE } from "../const";

import { StandardWidth } from "./standard";

enum PlayerState {
  None,
  Paused,
  Playing,
}

interface Player {
  song: SubsonicSong | undefined;
  state: PlayerState;
}
interface PlayerAction {
  type: "play" | "pause" | "toggle";
  payload?: SubsonicSong;
}

const Context = React.createContext<[Player, React.Dispatch<PlayerAction>]>([
  { song: undefined, state: PlayerState.None },
  void 0 as any,
]);

const reducer: React.Reducer<Player, PlayerAction> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "play":
      if (payload != null) state.song = payload;
      return { ...state, state: PlayerState.Playing };
    case "pause":
      return { ...state, state: PlayerState.Paused };
    case "toggle":
      return {
        ...state,
        state:
          state.state == PlayerState.None
            ? PlayerState.None
            : state.state == PlayerState.Paused
            ? PlayerState.Playing
            : PlayerState.Paused,
      };
    default:
      return state;
  }
};

export const PlayerContext: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const r = React.useReducer<React.Reducer<Player, PlayerAction>>(reducer, {
    song: undefined,
    state: PlayerState.None,
  });
  // TODO: save player state in the local storage
  // const { id } = useParams();
  // const [state, setState] = useLocalStorage(`player.${id}`, {});
  return <Context.Provider value={r}>{children}</Context.Provider>;
};

export const usePlayer = () => React.useContext(Context);

const Player: React.FunctionComponent = () => {
  const [player, dispatch] = usePlayer();
  const [connection] = useConnection();
  const audio = React.useRef<HTMLAudioElement>();
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
