import * as React from "react";
import type { SubsonicArtistInfoResponse } from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST_INFO } from "../const";

import ArtistSection from "../components/artist-section";
import ScrollView from "./scroll-view";
import Button from "./button";
import Artist from "../components/artist";

const ArtistSimilars: React.FC<{ id: string }> = ({ id }) => {
  const { data: artistInfo } = useSubsonic<SubsonicArtistInfoResponse>(
    `${GET_ARTIST_INFO}?id=${id}`
  );

  const [expanded, setExpanded] = React.useState(false);
  const artists = React.useMemo(
    () =>
      artistInfo?.similarArtist?.map((artist) => (
        <Artist key={artist.id} artist={artist} />
      )),
    [artistInfo?.similarArtist]
  );
  if (!artistInfo?.similarArtist?.length) return null;

  return (
    <ArtistSection
      header="Similar Artists"
      extra={
        <Button onClick={(_) => setExpanded(!expanded)}>
          {expanded ? "Collapse" : "Expand"}
        </Button>
      }
    >
      {expanded ? (
        <div className="flex items-center justify-center flex-nowrap">
          <div className="flex flex-row flex-wrap shrink basis-11/12">
            {artists}
          </div>
        </div>
      ) : (
        <ScrollView className="flex flex-row overflow-x-auto">
          {artists}
        </ScrollView>
      )}
    </ArtistSection>
  );
};

export const ArtistSimilarsSkeleton: React.FC = () => {
  return null;
};

export default ArtistSimilars;
