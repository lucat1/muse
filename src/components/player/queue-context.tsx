import * as React from "react";

import type { SubsonicSong } from "../../types";

export enum QueueActionType {
  APPEND,
  CLEAR,
  NEXT,
  SHUFFLE,
}

export type QueueState = SubsonicSong[];

export interface QueueAction {
  type: QueueActionType;
  payload?: SubsonicSong[];
}

const DEFAULT_STATE: SubsonicSong[] = [];

// from https://stackoverflow.com/a/12646864
const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const reducer: React.Reducer<QueueState, QueueAction> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case QueueActionType.APPEND:
      return payload ? [...state, ...payload] : state;
    case QueueActionType.CLEAR:
      return DEFAULT_STATE;
    case QueueActionType.SHUFFLE:
      shuffle(state);
      return state;
    case QueueActionType.NEXT:
      return state.slice(1);
  }
};

const Context = React.createContext<[QueueState, React.Dispatch<QueueAction>]>([
  DEFAULT_STATE,
  (_) => {},
]);

export const QueueContext: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const r = React.useReducer<React.Reducer<QueueState, QueueAction>>(
    reducer,
    DEFAULT_STATE
  );
  // TODO: maybe save queue in localStorage
  return <Context.Provider value={r}>{children}</Context.Provider>;
};

export const useQueue = () => {
  const [queue, dispatch] = React.useContext(Context);
  const [append, clear, next, shuffle] = React.useMemo(
    () => [
      (song: SubsonicSong[]) =>
        dispatch({ type: QueueActionType.APPEND, payload: song }),
      () => dispatch({ type: QueueActionType.CLEAR }),
      () => dispatch({ type: QueueActionType.NEXT }),
      () => dispatch({ type: QueueActionType.SHUFFLE }),
    ],
    [dispatch]
  );
  return { queue, append, clear, next, shuffle };
};
