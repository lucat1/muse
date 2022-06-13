import * as React from "react";
import { useParams, Link } from "react-router-dom";
import formatDuration from "format-duration";
import type { SubsonicAlbumResponse } from "../types";
import useSubsonic, { useURL } from "../fetcher";
import { GET_ALBUM } from "../const";

import Standard from "../components/standard";
import {defaultFields} from "../components/song";
import Songs from "../components/songs";

const Album = () => {
  const { id } = useParams();
  const { data: album } = useSubsonic<SubsonicAlbumResponse>(
    `${GET_ALBUM}?id=${id}`
  );
  const albumArt = useURL(`getCoverArt?id=${album?.coverArt}`);
  // const { data: albumInfo } = useSubsonic<SubsonicAlbumInfoResponse>(
  //   `${GET_ALBUM_INFO}?id=${id}`
  // );
  return (
    <Standard>
      <section className="py-4 flex flex-row items-start">
        <img
          className="w-32 md:w-48 lg:w-64 aspect-square rounded-lg border-2"
          src={albumArt}
        />
        <div className="flex flex-col mx-8">
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold">
            {album?.name}
          </h1>
          <h3 className="text-lg md:text-xl xl:text-2xl">
            <Link to={`../artist/${album?.artistId}`}>{album?.artist}</Link>
          </h3>
          <span className="text-sm md:text-md">
            {album?.year} {"\uFF65"}{" "}
            {formatDuration((album?.duration || 0) * 1000)}
          </span>
        </div>
      </section>
      <Songs
        fields={defaultFields}
        songs={album?.song || []}
      />
    </Standard>
  );
};

export default Album;
