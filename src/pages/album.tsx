import * as React from "react";
import { useParams, Link } from "react-router-dom";
import formatDuration from "format-duration";
import type { SubsonicAlbumResponse } from "../types";
import useSubsonic, { useURL } from "../fetcher";
import { useTitle, GET_ALBUM } from "../const";

import Standard from "../components/standard";
import { defaultFields } from "../components/song-list-item";
import SongList from "../components/song-list";
import Image from "../components/img";

const Album = () => {
  const { id } = useParams();
  const { data: album } = useSubsonic<SubsonicAlbumResponse>(
    `${GET_ALBUM}?id=${id}`
  );
  useTitle(
    `${album?.name || "Unkown Album"} - ${album?.artist || "Unkown Artist"}`
  );
  const albumArt = useURL(`getCoverArt?id=${album?.coverArt}`);
  // const { data: albumInfo } = useSubsonic<SubsonicAlbumInfoResponse>(
  //   `${GET_ALBUM_INFO}?id=${id}`
  // );
  return (
    <Standard>
      <section className="py-4 pt-8 flex flex-row items-end">
        <Image
          className="w-32 md:w-48 lg:w-64 hover:drop-shadow-lg"
          src={albumArt}
        />
        <div className="flex flex-col mx-8">
          <h1 className="my-2 text-2xl md:text-3xl xl:text-4xl font-extrabold">
            {album?.name}
          </h1>
          <h3 className="my-1 text-lg md:text-xl xl:text-2xl">
            <Link className="text-red-500 dark:text-red-400" to={`../artist/${album?.artistId}`}>{album?.artist}</Link>
          </h3>
          <span className="text-sm md:text-md">
            {album?.year} {"\uFF65"}{" "}
            {formatDuration((album?.duration || 0) * 1000)}
          </span>
        </div>
      </section>
      <SongList fields={defaultFields} songs={album?.song || []} />
    </Standard>
  );
};

export default Album;
