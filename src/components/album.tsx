import * as React from "react";
import { Link } from "react-router-dom";
import formatDuration from "format-duration";
import type { SubsonicAlbum } from "../types";
import { useURL } from "../fetcher";

const Album: React.FC<{ album: SubsonicAlbum }> = ({ album }) => (
  <div className="w-32 lg:w-64 mx-8 my-4">
    <Link to={`../album/${album.id}`}>
      <img
        src={useURL(`getCoverArt?id=${album.coverArt}`)}
        className="w-32 lg:w-64 aspect-square rounded-md border-1"
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
