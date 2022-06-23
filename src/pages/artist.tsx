import * as React from "react";
import { useParams } from "react-router";

import NotFound from "./not-found";
import Standard from "../components/standard";
import ArtistInfo from "../components/artist-info";
import ArtistTopSongs from "../components/artist-top-songs";
import ArtistSimilars from "../components/artist-similars";
import ArtistReleases from "../components/artist-releases";

const ArtistPage: React.FC = () => {
  const { id } = useParams();
  if (!id) return <NotFound />;

  return (
    <Standard>
      <ArtistInfo id={id!} />
      <ArtistTopSongs id={id!} />
      <ArtistReleases id={id!} />
      <ArtistSimilars id={id!} />
    </Standard>
  );
};

export default ArtistPage;
