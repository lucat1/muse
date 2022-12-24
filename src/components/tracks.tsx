import * as React from "react"

import Track, { Fields, TrackProps, TrackActions } from "./track"
import type { SubsonicSong } from "../types"
import { usePlayer } from "../stores/player"
import { useQueue, useStack } from "../stores/queue"

interface SongListProps {
  songs: SubsonicSong[]
}

export const SongList: React.FC<SongListProps & TrackProps & TrackActions> = ({
  songs,
  ...fields
}) => {
  const renderTrack = React.useCallback(
    (song: SubsonicSong, i: number) => (
      <Track key={i} index={i} song={song} {...fields} />
    ),
    [fields]
  )

  return (
    <main
      className="w-full grid gap-y-2"
      style={{
        gridTemplateColumns: `auto ${Object.values(Fields)
          .map((f) => fields[f] || 0)
          .filter((f) => f != 0)
          .map((f) => (f < 0 ? "auto" : `${f}fr`))
          .join(" ")} auto`
      }}
    >
      {songs.map(renderTrack)}
    </main>
  )
}

const Tracks: React.FC<SongListProps & TrackProps> = ({ songs, ...fields }) => {
  const { song, load } = usePlayer()
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
