import * as React from "react";
import { gen, useURL } from "../fetcher";
import type { SubsonicSong } from "../types";
import { useParams } from "react-router";
import useLocalStorage from "use-local-storage";
import { useConnection } from "../const";
import * as Slider from "@radix-ui/react-slider";

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
  const [player, dispatch] = usePlayer();
  const [connection] = useConnection();
  React.useEffect(() => {
    if (player.song) audio.src = gen(`stream?id=${player.song.id}`, connection);
  }, [connection, player.song?.id]);
  React.useEffect(() => {
    if (player.state == "playing") audio.play();
    if (player.state == "paused") audio.pause();
  }, [player.song?.id, player.state]);

  return (
    <div className="dark:bg-zinc-900 bg-zinc-500 p-6">
      <button onClick={() => dispatch({ type: "toggle" })}>
        {player.state}
      </button>
      : {player.song?.title}
      <Slider.Root>
        <Slider.Track className="bg-zinc-200 dark:bg-white-400 relative grow rounded-full h-3">
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb className="bg-zinc-300 dark:bg-white-300 block rounded-full w-3 h-3" />
      </Slider.Root>
    </div>
  );
};

export default Player;
