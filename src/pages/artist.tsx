import * as React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import type {
  SubsonicArtistInfoResponse,
  SubsonicArtistResponse,
  SubsonicAlbum,
  SubsonicTopSongsResponse,
} from "../types";
import useSubsonic from "../fetcher";
import { useTitle, GET_ARTIST, GET_ARTIST_INFO, GET_TOP_SONGS } from "../const";
import { albumCondition, epCondition, singleCondition } from "../util";

import Standard from "../components/standard";
import Album from "../components/album";
import Artist from "../components/artist";
import Image from "../components/img";

const ArtistPage: React.FC = () => {
  const { id } = useParams();
  const { data: artistInfo } = useSubsonic<SubsonicArtistInfoResponse>(
    `${GET_ARTIST_INFO}?id=${id}`
  );
  const { data: artist } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  );
  useTitle(artist?.name || "Unkown artist");
  // const { data: topSongs } = useSubsonic<SubsonicTopSongsResponse>(
  //   `${GET_TOP_SONGS}?count=10&artist=${artist?.name}`
  // );

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
      <section className="py-4 pt-8 flex flex-row items-end">
        <Image
          className="w-32 md:w-48 lg:w-64 aspect-square rounded-lg"
          src={artistInfo?.mediumImageUrl}
        />
        <h1 className="mx-8 text-2xl md:text-3xl xl:text-4xl font-extrabold">
          {artist?.name}
        </h1>
      </section>
      <article
        className="w-full prose prose-sm xl:prose-base max-w-none text-justify font-serif"
        dangerouslySetInnerHTML={{
          __html: artistInfo?.biography as string,
        }}
      />
      {sections.map((section) =>
        section[1].length ? (
          <section key={section[0]} className="py-4 flex flex-col">
            <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
              {section[0]}
            </h2>
            <main className="flex justify-center">
              <div className="flex flex-row flex-wrap">
                {section[1].map((album) => (
                  <Album key={album.id} album={album} />
                ))}
              </div>
            </main>
          </section>
        ) : null
      )}
      {artistInfo?.similarArtist && (
        <section className="py-8 flex flex-col">
          <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
            Similar Artists
          </h2>
          <main className="flex flex-row overflow-x-auto">
            <div className="flex">
              {artistInfo?.similarArtist.map((artist) => (
                <Artist key={artist.id} artist={artist} />
              ))}
            </div>
          </main>
        </section>
      )}
    </Standard>
  );
};

export default ArtistPage;
