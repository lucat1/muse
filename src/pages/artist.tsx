import * as React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import type {
  SubsonicArtistInfoResponse,
  SubsonicArtistResponse,
  SubsonicAlbum,
} from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST, GET_ARTIST_INFO } from "../const";
import { albumCondition, epCondition, singleCondition } from "../util";

import Album from "../components/album";
import Artist from "../components/artist";

const ArtistPage: React.FC = () => {
  const { id } = useParams();
  const { data: artistInfo } = useSubsonic<SubsonicArtistInfoResponse>(
    `${GET_ARTIST_INFO}?id=${id}`
  );
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
    <main className="mx-8 md:mx-16 lg:mx-32 xl:mx-64 2xl:mx-96 flex flex-col">
      <Link to="../artists">artists</Link>
      <section className="py-4 flex flex-row items-end">
        <img
          className="w-32 md:w-48 lg:w-64 aspect-square rounded-lg border-2"
          src={artistInfo?.mediumImageUrl}
        />
        <h1 className="mx-8 text-2xl md:text-3xl xl:text-4xl font-extrabold">
          {artist?.name}
        </h1>
      </section>
      <article
        className="w-full prose prose-sm xl:prose-base max-w-none"
        dangerouslySetInnerHTML={{
          __html: artistInfo?.biography as string,
        }}
      />
      {sections.map(
        (section) =>
          section[1].length && (
            <section key={section[0]} className="py-4 flex flex-col">
              <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
                {section[0]}
              </h2>
              <main className="flex flex-row flex-wrap justify-center">
                {section[1].map((album) => (
                  <Album key={album.id} album={album} />
                ))}
              </main>
            </section>
          )
      )}
      {artistInfo?.similarArtist && (
        <section className="py-8 flex flex-col">
          <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
            Similar Artists
          </h2>
          <main className="flex flex-row flex-wrap">
            {artistInfo?.similarArtist.map((artist) => (
              <Artist key={artist.id} artist={artist} />
            ))}
          </main>
        </section>
      )}
    </main>
  );
};

export default ArtistPage;
