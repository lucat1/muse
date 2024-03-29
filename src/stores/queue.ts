import * as React from "react"
import { useAtom } from "jotai"
import { atomWithReducer } from "jotai/utils"
import update from "immutability-helper"

import type { SubsonicSong } from "../types"

export enum QueueActionType {
  APPEND,
  PREPEND,
  MOVE,
  NEXT,
  SHUFFLE,
  CLEAR
}
export enum StackActionType {
  PUSH,
  POP,
  CLEAR
}

export type QueueState = SubsonicSong[]
export type StackState = SubsonicSong[]

export interface QueueAction {
  type: QueueActionType
  payload?: SubsonicSong[] | [number, number]
}

export interface StackAction {
  type: StackActionType
  payload?: SubsonicSong[]
}

export const DEFAULT_STATE: SubsonicSong[] = []

// from https://stackoverflow.com/a/12646864
export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const queueReducer = (state: QueueState, { type, payload }: QueueAction) => {
  switch (type) {
    case QueueActionType.APPEND:
      return payload ? [...state, ...payload] : state
    case QueueActionType.PREPEND:
      return payload ? [...payload, ...state] : state
    case QueueActionType.MOVE:
      const [a, b] = payload as [number, number]
      return update(state, {
        $splice: [
          [a, 1],
          [b, 0, state[a]]
        ]
      })
    case QueueActionType.SHUFFLE:
      shuffle(state)
      return state
    case QueueActionType.NEXT:
      return state.slice(1)
    case QueueActionType.CLEAR:
      return DEFAULT_STATE
  }
}

const stackReducer = (state: StackState, { type, payload }: StackAction) => {
  switch (type) {
    case StackActionType.PUSH:
      return payload ? [...state, ...payload] : state
    case StackActionType.POP:
      return state.slice(0, -1)
    case StackActionType.CLEAR:
      return DEFAULT_STATE
  }
}

export const queueAtom = atomWithReducer(DEFAULT_STATE, queueReducer)
export const stackAtom = atomWithReducer(DEFAULT_STATE, stackReducer)

export const useQueue = () => {
  const [queue, dispatch] = useAtom(queueAtom)
  const [append, prepend, move, next, shuffle, clear] = React.useMemo(
    () => [
      (songs: SubsonicSong[]) =>
        dispatch({ type: QueueActionType.APPEND, payload: songs }),
      (songs: SubsonicSong[]) =>
        dispatch({ type: QueueActionType.PREPEND, payload: songs }),
      (a: number, b: number) =>
        dispatch({ type: QueueActionType.MOVE, payload: [a, b] }),
      () => dispatch({ type: QueueActionType.NEXT }),
      () => dispatch({ type: QueueActionType.SHUFFLE }),
      () => dispatch({ type: QueueActionType.CLEAR })
    ],
    [dispatch]
  )
  return { queue, append, prepend, move, next, shuffle, clear }
}

export const useStack = () => {
  const [stack, dispatch] = useAtom(stackAtom)
  const [push, pop, clear] = React.useMemo(
    () => [
      (songs: SubsonicSong[]) =>
        dispatch({ type: StackActionType.PUSH, payload: songs }),
      () => dispatch({ type: StackActionType.POP }),
      () => dispatch({ type: StackActionType.CLEAR })
    ],
    [dispatch]
  )
  return { stack, push, pop, clear }
}
