import * as React from "react";
import { useParams } from "react-router";
import { SubsonicArtistResponse } from "../types";
import useSubsonic from "../fetcher";
import { GET_ARTIST, GET_ARTIST_INFO } from "../const";

const Artist = () => {
  const { id } = useParams();
  const { data } = useSubsonic<SubsonicArtistResponse>(
    `${GET_ARTIST}?id=${id}`
  );
  const { data: d } = useSubsonic(`${GET_ARTIST_INFO}?id=${id}`);

  console.log(data);
  console.log(d);
  return <h1>artist {id}</h1>;
};

export default Artist;
