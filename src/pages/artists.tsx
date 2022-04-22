import * as React from "react";
import { SubsonicArtistsResponse } from "../types";
import useSubsonic from "../fetcher";
import { Link } from "react-router-dom";
import { GET_ARTISTS } from "../const";

const Artists = () => {
  const { data } = useSubsonic<SubsonicArtistsResponse>(GET_ARTISTS);

  return (
    <>
      <h1>artists</h1>
      <ul>
        {data!.index.map((letter, i) => (
          <li key={i}>
            <h3>{letter.name}</h3>
            <ul>
              {letter.artist.map((artist, i) => (
                <li key={i}>
                  <Link to={`../artist/${artist.id}`}>{artist.name}</Link> #
                  {artist.albumCount}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Artists;
