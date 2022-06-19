import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import formatDuration from "format-duration";
import { gen } from "../fetcher";
import type { SubsonicSong } from "../types";
import { useConnection } from "../const";

import { StandardWidth } from "./standard";

interface Player {
  song: SubsonicSong | undefined;
  state: "none" | "paused" | "playing";
}
interface PlayerAction {
  type: "play" | "pause" | "toggle";
  payload?: SubsonicSong;
}

const Context = React.createContext<[Player, React.Dispatch<PlayerAction>]>([]);

const reducer: React.Reducer<Player, PlayerAction> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "play":
      if (payload != null) state.song = payload;
      return { ...state, state: "playing" };
    case "pause":
      return { ...state, state: "paused" };
    case "toggle":
      return {
        ...state,
        state:
          state.state == "none"
            ? "none"
            : state.state == "playing"
            ? "paused"
            : "playing",
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
    state: "none",
  });
  // TODO: save player state in the local storage
  // const { id } = useParams();
  // const [state, setState] = useLocalStorage(`player.${id}`, {});
  return <Context.Provider value={r}>{children}</Context.Provider>;
};

export const usePlayer = () => React.useContext(Context);

const Player: React.FunctionComponent = () => {
  const audio = React.useMemo(() => new Audio(), []);
  const [canPlay, setCanPlay] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [seek, setSeek] = React.useState(-1);
  React.useEffect(() => {
    const handleCanPlay = () => setCanPlay(true);
    const handleTimeUpdate = () => setTime(audio.currentTime);

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audio]);
  const [player, dispatch] = usePlayer();
  const timeScale = React.useMemo(
    () => 100 / (player.song?.duration || 1),
    [player.song?.duration]
  );
  const [connection] = useConnection();
  React.useEffect(() => {
    if (!player.song) return;

    audio.src = gen(`stream?id=${player.song.id}`, connection);
    audio.currentTime = 0;
  }, [connection, player.song?.id]);
  React.useEffect(() => {
    if (player.state == "playing") audio.play();
    if (player.state == "paused") audio.pause();
  }, [player.song?.id, player.state]);

  return (
    <section className="absolute left-0 right-0 bottom-8 flex">
      <StandardWidth className="m-auto">
        <div className="p-4 shadow-xl rounded-lg bg-neutral-200 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700">
          <button onClick={() => dispatch({ type: "toggle" })}>
            {player.state}
          </button>
          : {player.song?.title}
          {formatDuration(time * 1000)}/
          {formatDuration(
            (player.song?.duration || audio.duration || 0) * 1000
          )}
          <Slider.Root
            className="relative flex items-center"
            disabled={player.state == "none" || !canPlay}
            value={[(seek != -1 ? seek : time) * timeScale]}
            onValueChange={(value) => setSeek(value[0] / timeScale)}
            onPointerUp={() => {
              audio.currentTime = seek;
              setSeek(-1);
            }}
          >
            <Slider.Track className="bg-zinc-100 dark:bg-white-500 relative grow rounded-full h-2">
              <Slider.Range className="bg-zinc-200 dark:bg-white-400 absolute h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="bg-zinc-300 dark:bg-white-300 block rounded-full w-4 h-4" />
          </Slider.Root>
        </div>
      </StandardWidth>
    </section>
  );
};

export default Player;
