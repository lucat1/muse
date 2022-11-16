import * as React from "react"
import { Link } from "react-router-dom"
import { useAtomValue } from "jotai"

import { usePlayer } from "../stores/player"
import { connectionAtom } from "../stores/connection"
import { getURL } from "../fetcher"
import { GET_COVER_ART } from "../const"
import Image, { ImageSkeleton } from "./img"
import Dot from "./dot"

const IMAGE_CLASS = "w-16 h-16"

const PlayerInfo: React.FC = () => {
  const connection = useAtomValue(connectionAtom)
  const { song } = usePlayer()
  return (
    <section className="hidden md:flex flex items-center px-4 border-t dark:border-neutral-700">
      {song ? (
        <Link
          className="shrink-0 mr-2"
          to={`/${connection.id}/album/${song.albumId}`}
        >
          <Image
            className={IMAGE_CLASS}
            src={getURL(`${GET_COVER_ART}?id=${song?.coverArt}`, connection)}
          />
        </Link>
      ) : (
        <ImageSkeleton className={`${IMAGE_CLASS} mr-2`} />
      )}
      <div
        className={`flex flex-1 flex-col justify-between text-sm truncate ${
          song ? "" : "h-10"
        }`}
      >
        {song ? (
          <Link
            to={`/${connection.id}/album/${song.albumId}?song=${song.id}`}
            className="truncate mb-2"
          >
            {song.title}
          </Link>
        ) : (
          <p className="w-full h-4 rounded-md bg-neutral-200 dark:bg-neutral-700" />
        )}
        <div className="flex w-full flex-row items-center text-xs">
          {song ? (
            <Link
              to={`/${connection.id}/album/${song.albumId}`}
              className="truncate text-red-500 dark:text-red-400"
            >
              {song.album}
            </Link>
          ) : (
            <p className="w-1/3 h-4 rounded-md bg-neutral-200 dark:bg-neutral-700" />
          )}
          <Dot />
          {song ? (
            <Link
              to={`/${connection.id}/artist/${song.artistId}`}
              className="truncate"
            >
              {song.artist}
            </Link>
          ) : (
            <p className="w-1/3 h-4 rounded-md bg-neutral-200 dark:bg-neutral-700" />
          )}
        </div>
      </div>
    </section>
  )
}

export default PlayerInfo
