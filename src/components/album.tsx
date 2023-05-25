import * as React from "react"
import { Link } from "react-router-dom"
import formatDuration from "format-duration"
import { useAtomValue } from "jotai"

import { useURL } from "../fetcher"
import type { SubsonicAlbumBase } from "../types"
import { connectionAtom } from "../stores/connection"

import Image from "./img"
import Dot from "./dot"

const Album: React.FC<{ album: SubsonicAlbumBase }> = ({ album }) => {
  const connection = useAtomValue(connectionAtom)
  return (
    <div className="w-32 lg:w-64 mx-8 my-4 flex-shrink-0">
      <Link
        className="focus:outline-none"
        to={`/${connection.id}/album/${album.id}`}
      >
        <Image
          src={useURL(`getCoverArt?id=${album.coverArt}`)}
          className="w-32 lg:w-64 hover:drop-shadow-lg focus:drop-shadow-lg focus:outline-none"
        />
      </Link>
      <div className="mt-2 truncate">
        <Link className="text-sm font-bold" to={`../album/${album.id}`}>
          {album.name}
        </Link>
        <br />
        <span className="flex flex-row items-center text-xs">
          {album.year}
          <Dot />
          {formatDuration(album.duration * 1000)}
        </span>
      </div>
    </div>
  )
}

export default Album
