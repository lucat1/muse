import * as React from "react";
import useSubsonic from "../fetcher";
import { useTitle, GET_ARTISTS } from "../const";
import type { SubsonicArtistsResponse } from "../types";

import Artist from "../components/artist";
import Standard from "../components/standard";

const Artists = () => {
  const { data } = useSubsonic<SubsonicArtistsResponse>(GET_ARTISTS);
  useTitle("Artists");

  return (
    <Standard>
      {data!.index.map((letter, i) => (
        <section key={i}>
          <h2 className="text-lg font-bold">{letter.name}</h2>
          <main className="flex flex-row flex-wrap">
            {letter.artist.map((artist, i) => (
              <Artist key={i} artist={artist} />
            ))}
          </main>
        </section>
      ))}
    </Standard>
  );
};

export default Artists;
