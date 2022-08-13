import * as React from "react";

import type { SubsonicSong } from "../../types";

export enum PlayerStatus {
  UNLOADED,
  PAUSED,
  PLAYING,
}

export enum PlayerActionType {
  LOAD,
  UNLOAD,
  PLAY,
  PAUSE,
}

export interface PlayerState {
  song?: SubsonicSong;
  status: PlayerStatus;
}

export interface PlayerAction {
  type: PlayerActionType;
  payload?: SubsonicSong;
}

const DEFAULT_STATE: PlayerState = {
  song: undefined,
  status: PlayerStatus.UNLOADED,
};

const reducer: React.Reducer<PlayerState, PlayerAction> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case PlayerActionType.LOAD:
      return payload ? { song: payload, status: PlayerStatus.PAUSED } : state;
    case PlayerActionType.UNLOAD:
      return DEFAULT_STATE;
    case PlayerActionType.PLAY:
      return { ...state, status: PlayerStatus.PLAYING };
    case PlayerActionType.PAUSE:
      return { ...state, status: PlayerStatus.PAUSED };
  }
};

const Context = React.createContext<
  [PlayerState, React.Dispatch<PlayerAction>]
>([DEFAULT_STATE, (_) => { }]);

export const PlayerContext: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const r = React.useReducer<React.Reducer<PlayerState, PlayerAction>>(
    reducer,
    DEFAULT_STATE
  );
  // TODO: save player state in the local storage:
  // save in another localStorage key and load only at first load when the
  // localStorage context is created.
  return <Context.Provider value={r}>{children}</Context.Provider>;
};

export const usePlayer = () => {
  const [{ song, status }, dispatch] = React.useContext(Context);
  const [load, unload, play, stop] = React.useMemo(
    () => [
      (song: SubsonicSong) =>
        dispatch({ type: PlayerActionType.LOAD, payload: song }),
      () => dispatch({ type: PlayerActionType.UNLOAD }),
      () => dispatch({ type: PlayerActionType.PLAY }),
      () => dispatch({ type: PlayerActionType.PAUSE }),
    ],
    [dispatch]
  );
  return { song, status, load, unload, play, stop };
};
