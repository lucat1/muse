import * as React from "react"
import type { SubsonicArtistResponse } from "../types"
import useSubsonic from "../fetcher"
import { GET_ARTIST } from "../const"

import ArtistSection from "../components/artist-section"
import ScrollView from "./scroll-view"
import Button from "./button"
import Album from "../components/album"

const RawArtistReleases: React.FC<{
  id: string
}> = ({ id }) => {
  const { data: artist } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  )
  const [expanded, setExpanded] = React.useState(false)
  const albums = React.useMemo(
    () => artist?.album.map((album) => <Album key={album.id} album={album} />),
    [artist?.album]
  )

  return (
    <ArtistSection
      header={"Releases"}
      extra={
        <Button onClick={(_) => setExpanded(!expanded)}>
          {expanded ? "Collapse" : "Expand"}
        </Button>
      }
    >
      {expanded ? (
        <div className="flex items-center justify-center flex-nowrap">
          <div className="flex flex-row flex-wrap shrink basis-11/12">
            {albums}
          </div>
        </div>
      ) : (
        <ScrollView className="flex flex-row overflow-x-auto">
          {albums}
        </ScrollView>
      )}
    </ArtistSection>
  )
}

export const ArtistReleasesSkeleton: React.FC = () => {
  return null
}

const ArtistReleases: React.FC<{
  id: string
}> = ({ id }) => (
  <React.Suspense fallback={<ArtistReleasesSkeleton />}>
    <RawArtistReleases id={id} />
  </React.Suspense>
)

export default ArtistReleases
