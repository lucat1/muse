import * as React from "react"
import type { SubsonicArtistResponse, SubsonicTopSongsResponse } from "../types"
import useSubsonic from "../fetcher"
import { GET_ARTIST, GET_TOP_SONGS } from "../const"

import Button from "./button"
import ArtistSection from "./artist-section"
import Tracks from "./tracks"

const RawArtistTopSongs: React.FC<{ id: string }> = ({ id }) => {
  const { data: artist } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  )
  const [more, setMore] = React.useState(false)
  const { data: topSongs } = useSubsonic<SubsonicTopSongsResponse>(
    `${GET_TOP_SONGS}?count=10&artist=${artist?.name}`
  )
  if (!topSongs?.song?.length) return null
  return (
    <ArtistSection
      header="Top songs"
      extra={
        <Button onClick={(_) => setMore(!more)}>
          {more ? "Less" : "More"}
        </Button>
      }
    >
      <Tracks
        songs={topSongs.song.filter((_, i) => i < (more ? 10 : 5))}
        art={-1}
        title={14}
        heart={-1}
        length={2}
      />
    </ArtistSection>
  )
}

export const ArtistTopSongsSkeleton: React.FC = () => {
  return null
}

const ArtistTopSongs: React.FC<{ id: string }> = ({ id }) => {
  return (
    <React.Suspense fallback={<ArtistTopSongsSkeleton />}>
      <RawArtistTopSongs id={id} />
    </React.Suspense>
  )
}

export default ArtistTopSongs
