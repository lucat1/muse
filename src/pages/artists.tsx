import * as React from "react";
import { useAtom } from "jotai";
import useSubsonic from "../fetcher";
import { GET_ARTISTS } from "../const";
import { titleAtom } from "../stores/title";
import type { SubsonicArtistsResponse } from "../types";

import Artist from "../components/artist";
import Standard from "../components/standard";

const Artists = () => {
  const { data } = useSubsonic<SubsonicArtistsResponse>(GET_ARTISTS);
  const [_, setTitle] = useAtom(titleAtom);
  React.useEffect(() => {
    setTitle("Artists");
  }, []);

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
