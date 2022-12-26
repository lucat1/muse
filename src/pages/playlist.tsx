import * as React from "react"
import { useParams } from "react-router-dom"
import formatDuration from "format-duration"
import { useAtom } from "jotai"
import {
  PlayIcon as Play,
  ArrowsRightLeftIcon as Shuffle
} from "@heroicons/react/24/solid"

import useSubsonic from "../fetcher"
import { usePlay } from "../hooks"
import { GET_PLAYLIST } from "../const"
import { titleAtom } from "../stores/title"
import type { SubsonicPlaylistResponse } from "../types"

import Standard from "../components/standard"
import Tracks from "../components/tracks"
import Dot from "../components/dot"
import Button from "../components/button"

const Playlist = () => {
  const { id } = useParams()
  const { data } = useSubsonic<SubsonicPlaylistResponse>(
    `${GET_PLAYLIST}?id=${id}`
  )
  const { play } = usePlay()
  const [_, setTitle] = useAtom(titleAtom)
  React.useEffect(() => {
    setTitle(data?.name || "Unkown playlist")
  }, [data])

  return (
    <Standard>
      <section className="py-4 pt-8 flex flex-row">
        <div className="flex flex-col px-8 py-4 justify-between">
          <div>
            <h1 className="mb-8 text-2xl md:text-3xl xl:text-4xl font-extrabold">
              {data?.name}
            </h1>
          </div>
          <div className="flex flex-row items-center">
            <span className="mr-2">{data?.songCount} tracks</span>
            <Dot />
            <span className="mx-2">
              {formatDuration((data?.duration || 0) * 1000)}
            </span>
            <Dot />
            <Button
              className="mx-2 pl-5 flex flex-row items-center"
              onClick={(_) => play(data?.entry || [], 0)}
            >
              <Play className="w-5 h-5 mr-2" />
              Play
            </Button>
            <Dot />
            <Button
              className="mx-2 pl-5 flex flex-row items-center"
              onClick={(_) => play(data?.entry || [], -1)}
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>
      </section>
      <Tracks
        songs={data?.entry || []}
        art={-1}
        title={13}
        heart={-1}
        album={4}
        artist={4}
        length={2}
        format={1}
      />
    </Standard>
  )
}

export default Playlist
