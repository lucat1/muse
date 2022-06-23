import * as React from "react";
import type {
  SubsonicArtistResponse,
  SubsonicAlbum,
  SubsonicArtist,
} from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST } from "../const";
import { albumCondition, epCondition, singleCondition } from "../util";

import ArtistSection from "../components/artist-section";
import Album from "../components/album";

const RawArtistReleases: React.FC<{
  id: string;
}> = ({ id }) => {
  const { data: artist } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  );
  const albums = React.useMemo(
    () => artist!.album.filter(albumCondition),
    [artist?.album]
  );
  const eps = React.useMemo(
    () => artist!.album.filter(epCondition),
    [artist?.album]
  );
  const singles = React.useMemo(
    () => artist!.album.filter(singleCondition),
    [artist?.album]
  );

  const sections: [string, SubsonicAlbum[]][] = [
    ["Albums", albums],
    ["EPs", eps],
    ["Singles", singles],
  ];
  return (
    <>
      {sections.map((section) =>
        section[1].length ? (
          <ArtistSection key={section[0]} header={section[0]}>
            {section[1].map((album) => (
              <Album key={album.id} album={album} />
            ))}
          </ArtistSection>
        ) : null
      )}
    </>
  );
};

export const ArtistReleasesSkeleton: React.FC = () => {
  return null;
};

const ArtistReleases: React.FC<{
  id: string;
}> = ({ id }) => (
  <React.Suspense fallback={<ArtistReleasesSkeleton />}>
    <RawArtistReleases id={id} />
  </React.Suspense>
);

export default ArtistReleases;
