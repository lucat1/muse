import * as React from "react";
import { useParams } from "react-router";
import type {
  SubsonicArtistResponse,
  SubsonicAlbum,
  SubsonicTopSongsResponse,
} from "../types";
import useSubsonic from "../fetcher";
import { useTitle, GET_ARTIST, GET_TOP_SONGS } from "../const";
import { albumCondition, epCondition, singleCondition } from "../util";

import Standard from "../components/standard";
import ArtistSection from "../components/artist-section";
import ArtistInfo from "../components/artist-info";
import ArtistSimilars from "../components/artist-similars";
import Album from "../components/album";
import { defaultFields } from "../components/song-list-item";
import SongList from "../components/song-list";

const ArtistPage: React.FC = () => {
  const { id } = useParams();
  const { data: artist } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  );
  useTitle(artist?.name || "Unkown artist");
  const { data: topSongs } = useSubsonic<SubsonicTopSongsResponse>(
    `${GET_TOP_SONGS}?count=10&artist=${artist?.name}`
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
    <Standard>
      <ArtistInfo artist={artist!} />
      {topSongs && (
        <ArtistSection header="Top songs">
          <SongList fields={defaultFields} songs={topSongs.song} />
        </ArtistSection>
      )}
      {sections.map((section) =>
        section[1].length ? (
          <ArtistSection key={section[0]} header={section[0]}>
            {section[1].map((album) => (
              <Album key={album.id} album={album} />
            ))}
          </ArtistSection>
        ) : null
      )}
      <ArtistSimilars id={id!} />
    </Standard>
  );
};

export default ArtistPage;
