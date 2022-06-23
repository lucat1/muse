import * as React from "react";
import type {
  SubsonicArtistResponse,
  SubsonicTopSongsResponse,
} from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST, GET_TOP_SONGS } from "../const";

import ArtistSection from "../components/artist-section";
import { defaultFields } from "../components/song-list-item";
import SongList from "../components/song-list";

const RawArtistTopSongs: React.FC<{ id: string }> = ({ id }) => {
  const { data: artist } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  );
  const { data: topSongs } = useSubsonic<SubsonicTopSongsResponse>(
    `${GET_TOP_SONGS}?count=10&artist=${artist?.name}`
  );
  if (!topSongs?.song?.length) return null;
  return (
    <ArtistSection header="Top songs">
      <SongList fields={defaultFields} songs={topSongs.song} />
    </ArtistSection>
  );
};

export const ArtistTopSongsSkeleton: React.FC = () => {
  return null;
};

const ArtistTopSongs: React.FC<{ id: string }> = ({ id }) => {
  return (
    <React.Suspense fallback={<ArtistTopSongsSkeleton />}>
      <RawArtistTopSongs id={id} />
    </React.Suspense>
  );
};

export default ArtistTopSongs;
