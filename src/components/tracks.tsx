import * as React from "react"
import update from "immutability-helper"

import Track, { TrackProps, TrackActions } from "./track"
import type { SubsonicSong } from "../types"

interface TracksProps {
  songs: SubsonicSong[]
  index?: (n: number) => number
}

export interface AugmentedSubsonicSong extends SubsonicSong {
  i: number
}

const augment = (s: SubsonicSong, i: number) => ({ i, ...s })

const Tracks: React.FC<TracksProps & TrackProps & TrackActions> = ({
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
        songs={songs}
        song={song}
        {...fields}
      />
    ),
    [fields]
  )

  return <main>{songs.map(renderTrack)}</main>
}

export default Tracks
