import * as React from "react";
import type { SubsonicArtistInfoResponse } from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST_INFO } from "../const";

import ArtistSection from "../components/artist-section";
import Artist from "../components/artist";

const ArtistSimilars: React.FC<{ id: string }> = ({ id }) => {
  const { data: artistInfo } = useSubsonic<SubsonicArtistInfoResponse>(
    `${GET_ARTIST_INFO}?id=${id}`
  );
  if (!artistInfo?.similarArtist?.length) return null;
  return (
    <ArtistSection header="Similar Artists">
      {artistInfo.similarArtist.map((artist) => (
        <Artist key={artist.id} artist={artist} />
      ))}
    </ArtistSection>
  );
};

export const ArtistSimilarsSkeleton: React.FC = () => {
  return null;
};

export default ArtistSimilars;
