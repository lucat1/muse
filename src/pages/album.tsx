import * as React from "react"
import { useParams, Link } from "react-router-dom"
import formatDuration from "format-duration"
import { useAtom } from "jotai"
import type { SubsonicAlbumResponse } from "../types"
import useSubsonic, { useURL } from "../fetcher"
import { GET_ALBUM } from "../const"
import { titleAtom } from "../stores/title"

import Standard from "../components/standard"
import Tracks from "../components/tracks"
import Button from "../components/button"
import Image from "../components/img"
import Dot from "../components/dot"

const Album = () => {
  const { id } = useParams()
  const { data: album } = useSubsonic<SubsonicAlbumResponse>(
    `${GET_ALBUM}?id=${id}`
  )
  const albumArt = useURL(`getCoverArt?id=${album?.coverArt}`)
  const [_, setTitle] = useAtom(titleAtom)
  React.useEffect(() => {
    setTitle(
      `${album?.name || "Unkown Album"} - ${album?.artist || "Unkown Artist"}`
    )
  }, [album])

  return (
    <Standard>
      <section className="py-4 pt-8 flex flex-row">
        <Image
          className="w-32 md:w-48 lg:w-64 hover:drop-shadow-lg"
          src={albumArt}
        />
        <div className="flex flex-col px-8 py-4 justify-between">
          <div>
            <h1 className="mb-3 text-2xl md:text-3xl xl:text-4xl font-extrabold">
              {album?.name}
            </h1>
            <h3 className="mb-2 text-lg md:text-xl xl:text-2xl">
              <Link
                className="text-red-500 dark:text-red-400"
                to={`../artist/${album?.artistId}`}
              >
                {album?.artist}
              </Link>
            </h3>
            <span className="flex flex-row items-center text-sm md:text-md">
              {album?.year}
              <Dot />
              {formatDuration((album?.duration || 0) * 1000)}
            </span>
          </div>
          <div className="flex flex-row items-center">
            <Button className="mr-2">Play</Button>
            <Dot />
            <Button className="ml-2">Shuffle</Button>
          </div>
        </div>
      </section>
      <Tracks
        songs={album?.song || []}
        title={16}
        heart={-1}
        artist={5}
        length={2}
        format={1}
      />
    </Standard>
  )
}

export default Album
