import * as React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import tinydate from "tinydate";
import formatDuration from "format-duration";
import type {
  SubsonicArtistInfoResponse,
  SubsonicArtistResponse,
} from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST, GET_ARTIST_INFO } from "../const";

const Artist = () => {
  const { id } = useParams();
  const { data: artist } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  );
  const { data: artistInfo } = useSubsonic<SubsonicArtistInfoResponse>(
    `${GET_ARTIST_INFO}?id=${id}`
  );

  return (
    <>
      <Link to="../artists">artists</Link>
      <h3>artist {id}</h3>
      <h1>{artist?.name}</h1>
      <img src={artist?.coverArt} />
      <p
        dangerouslySetInnerHTML={{
          __html: artistInfo?.biography,
        }}
      ></p>
      <ul>
        {artist?.album.map((album) => (
          <li key={album.id}>
            <Link to={`../album/${album.id}`}>title:{album.name}</Link>
            <br />
            year:{album.year}
            <br />
            duration:{formatDuration(album.duration * 1000)}minutes
            <br />
            tracks:{album.songCount}
            <br />
            created: {tinydate("{DD}/{MM}/{YYYY}")(new Date(album.created))}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Artist;
