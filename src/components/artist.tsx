import * as React from "react";
import { Link } from "react-router-dom";
import type { SubsonicArtistBase } from "../types";
import { GET_COVER_ART } from "../const";
import { useURL } from "../fetcher";

import Image from "./img";
import Dot from "./dot";

const Artist: React.FC<{ artist: SubsonicArtistBase }> = ({ artist }) => (
  <div className="w-32 lg:w-64 mx-8 my-4 flex-shrink-0">
    <Link to={`../artist/${artist.id}`}>
      <Image
        src={
          artist.artistImageUrl || useURL(`${GET_COVER_ART}?id=${artist.id}`)
        }
        className="w-32 lg:w-64 aspect-square rounded-md"
      />
    </Link>
    <div className="mt-2 truncate">
      <Link className="text-sm" to={`../artist/${artist.id}`}>
        {artist.name}
      </Link>
      <Dot />
      <span className="text-xs">{artist.albumCount}</span>
    </div>
  </div>
);

export default Artist;
