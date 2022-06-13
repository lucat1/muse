import * as React from "react";
import { Link } from "react-router-dom";
import type { SubsonicArtistBase } from "../types";
import { useURL } from "../fetcher";

const Artist: React.FC<{ artist: SubsonicArtistBase }> = ({ artist }) => (
  <div className="w-32 lg:w-64 mx-8 my-4">
    <Link to={`../artist/${artist.id}`}>
      <img
        src={useURL(`getCoverArt?id=${artist.id}`)}
        className="w-32 lg:w-64 aspect-square rounded-md"
      />
    </Link>
    <div className="mt-2 truncate">
      <Link className="text-sm" to={`../artist/${artist.id}`}>
        {artist.name}
      </Link>{" "}
      {"\uFF65"} <span className="text-xs">{artist.albumCount}</span>
    </div>
  </div>
);

export default Artist;
