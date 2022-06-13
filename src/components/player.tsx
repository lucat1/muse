import * as React from "react";
import { Link } from "react-router-dom";
import { gen } from "../fetcher";
import type { SubsonicSong } from "../types";
import { useURL } from "../fetcher";
import formatDuration from "format-duration";
import { useConnection } from "../const";
import * as Slider from "@radix-ui/react-slider";

import Standard from "./standard";
import Image from "./img";

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
    seek: null,
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
    <>
      <div className="fixed bottom-8 w-screen">
        <Standard nopad>
          <div className="p-4 border rounded-lg bg-neutral-200 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700">
            <button onClick={() => dispatch({ type: "toggle" })}>
              {player.state}
            </button>
            : {player.song?.title}
            {formatDuration(time * 1000)}/
            {formatDuration(
              (player.song?.duration || audio.duration || 0) * 1000
            )}
            <Slider.Root
              className="relative flex items-center w-full"
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
        </Standard>
      </div>
      <section className="hidden 2xl:flex fixed flex-col bottom-8 left-8 p-4 border rounded-lg truncate bg-neutral-200 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700">
        <Link to={`/${connection.id}/album/${player.song?.albumId}`}>
          <Image
            className="w-32 3xl:w-64"
            src={useURL(`getCoverArt?id=${player.song?.coverArt}`)}
          />
        </Link>
        <div className="flex flex-0 flex-col">
          <h2 className="text-lg md:text-xl xl:text-2xl pt-2">
            <Link
              to={`/${connection.id}/album/${player.song?.albumId}?song=${player.song?.id}`}
            >
              {player.song?.title}
            </Link>
          </h2>
          <Link
            className="pt-1 text-md"
            to={`/${connection.id}/album/${player.song?.albumId}`}
          >
            {player.song?.album}
          </Link>
          <Link
            className="pt-1 text-xs"
            to={`/${connection.id}/artist/${player.song?.artistId}`}
          >
            {player.song?.artist}
          </Link>{" "}
        </div>
      </section>
    </>
  );
};

export default Player;
