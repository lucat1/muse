import * as React from "react";
import useAPI from "../fetcher";

const Artists = () => {
  const { data, errors } = useAPI("getArtists");
  console.log("data", data);
  console.log("errors", errors);
  return <h1>artists</h1>;
};

export default Artists;
