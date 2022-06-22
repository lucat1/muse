import * as React from "react";
import { Link } from "react-router-dom";
import formatDuration from "format-duration";
import { useURL } from "../fetcher";
import type { SubsonicAlbumBase } from "../types";

import Image from "./img";

const Album: React.FC<{ album: SubsonicAlbumBase }> = ({ album }) => (
  <div className="w-32 lg:w-64 mx-8 my-4">
    <Link className="focus:outline-none" to={`../album/${album.id}`}>
      <Image
        src={useURL(`getCoverArt?id=${album.coverArt}`)}
        className="w-32 lg:w-64 hover:drop-shadow-lg focus:drop-shadow-lg focus:outline-none"
      />
    </Link>
    <div className="mt-2 truncate">
      <Link className="text-sm font-bold" to={`../album/${album.id}`}>
        {album.name}
      </Link>
      <br />
      <span className="text-xs">
        {album.year} {"\uFF65"} {formatDuration(album.duration * 1000)}
      </span>
    </div>
  </div>
);

export default Album;
