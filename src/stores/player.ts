import * as React from "react";
import { useAtom } from "jotai";
import { atomWithReducer } from "jotai/utils";

import type { SubsonicSong } from "../types";

export enum PlayerStatus {
  UNLOADED,
  LOADING,
  PAUSED,
  PLAYING,
}

export enum PlayerActionType {
  LOAD,
  LOADING,
  PLAY,
  PAUSE,
  UNLOAD,
}

export interface PlayerState {
  song?: SubsonicSong;
  status: PlayerStatus;
}

export interface PlayerAction {
  type: PlayerActionType;
  payload?: SubsonicSong;
}

export const DEFAULT_STATE: PlayerState = {
  song: undefined,
  status: PlayerStatus.UNLOADED,
};

const reducer = (state: PlayerState, { type, payload }: PlayerAction) => {
  switch (type) {
    case PlayerActionType.LOAD:
      return payload ? { song: payload, status: PlayerStatus.LOADING } : state;
    case PlayerActionType.LOADING:
      return { ...state, status: PlayerStatus.LOADING };
    case PlayerActionType.UNLOAD:
      return DEFAULT_STATE;
    case PlayerActionType.PLAY:
      return { ...state, status: PlayerStatus.PLAYING };
    case PlayerActionType.PAUSE:
      return { ...state, status: PlayerStatus.PAUSED };
  }
};

export const playerAtom = atomWithReducer(DEFAULT_STATE, reducer);

export const usePlayer = () => {
  const [{ song, status }, dispatch] = useAtom(playerAtom);
  const [load, loading, play, pause, unload] = React.useMemo(
    () => [
      (song: SubsonicSong) =>
        dispatch({ type: PlayerActionType.LOAD, payload: song }),
      () => dispatch({ type: PlayerActionType.LOADING }),
      () => dispatch({ type: PlayerActionType.PLAY }),
      () => dispatch({ type: PlayerActionType.PAUSE }),
      () => dispatch({ type: PlayerActionType.UNLOAD }),
    ],
    [dispatch]
  );
  return { song, status, load, loading, unload, play, pause };
};
