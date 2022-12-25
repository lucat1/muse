import * as React from "react"
import update from "immutability-helper"

import Track, { TrackProps, TrackActions } from "./track"
import type { SubsonicSong } from "../types"
import { usePlayer } from "../stores/player"
import { useQueue, useStack } from "../stores/queue"

interface SongListProps {
  songs: SubsonicSong[]
  index?: (n: number) => number
}

export interface AugmentedSubsonicSong extends SubsonicSong {
  i: number
}

const augment = (s: SubsonicSong, i: number) => ({ i, ...s })

export const SongList: React.FC<SongListProps & TrackProps & TrackActions> = ({
  songs: s,
  move,
  index,
  ...fields
}) => {
  const [songs, setSongs] = React.useState(s.map(augment))
  React.useEffect(() => {
    setSongs(s.map(augment))
  }, [s])
  const previewMove = React.useCallback(
    (a: number, b: number) =>
      setSongs((songs) =>
        update(songs, {
          $splice: [
            [a, 1],
            [b, 0, songs[a]]
          ]
        })
      ),
    [setSongs]
  )

  const renderTrack = React.useCallback(
    (song: AugmentedSubsonicSong, i: number) => (
      <Track
        key={song.i}
        index={index ? index(i) : i}
        previewMove={move ? previewMove : undefined}
        move={move}
        song={song}
        {...fields}
      />
    ),
    [fields]
  )

  return <main>{songs.map(renderTrack)}</main>
}

const Tracks: React.FC<SongListProps & TrackProps> = ({ songs, ...fields }) => {
  const { /*song,*/ load } = usePlayer()
  const { append, clear: clearQueue } = useQueue()
  const { push, clear: clearStack } = useStack()
  const play = React.useCallback(
    (_: SubsonicSong, i: number) => {
      // TODO: add a setting for this
      // don't play if the song is already playing
      // if (s == song) return

      clearStack()
      clearQueue()
      push(songs.slice(0, i).reverse())
      append(songs.slice(i + 1))
      load(songs[i])
    },
    [songs, /* TODO song,*/ load, append, clearQueue, clearStack, push]
  )
  return <SongList songs={songs} play={play} {...fields} />
}

export default Tracks
