import * as React from "react";
import { SubsonicArtistsResponse } from "../types";
import useSubsonic from "../fetcher";

const Artists = () => {
  const {
    data: _data,
    error,
    isValidating,
  } = useSubsonic<SubsonicArtistsResponse>("getArtists");
  if (error) return <h1 color="red">Error</h1>;

  const data = _data!;
  console.log(data.index);
  return <h1>artists</h1>;
};

export default Artists;
