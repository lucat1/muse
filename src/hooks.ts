import * as React from "react"

import { usePlayer } from "./stores/player"
import { useQueue, useStack, shuffle } from "./stores/queue"
import type { SubsonicSong } from "./types"

// Plays the i-th song from the list of given songs.
// If i is -1 it shuffles and plays the first one
export const usePlay = () => {
  const { load, play: start, ...otherPlayer } = usePlayer()
  const { append, clear: clearQueue, ...otherQueue } = useQueue()
  const { push, clear: clearStack, ...otherStack } = useStack()
  return {
    load,
    append,
    clearQueue,
    push,
    clearStack,
    play: React.useCallback(
      (songs: SubsonicSong[], i: number) => {
        clearStack()
        clearQueue()
        if (i >= 0) {
          push(songs.slice(0, i).reverse())
        } else {
          shuffle(songs)
          i = 0
        }
        append(songs.slice(i + 1))

        load(songs[i])
      },
      [load, append, clearQueue, clearStack, push]
    ),
    start,
    ...otherPlayer,
    ...otherQueue,
    ...otherStack
  }
}
