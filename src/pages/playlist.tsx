import * as React from "react";
import { useParams } from "react-router-dom";
import formatDuration from "format-duration";
import { useAtom } from "jotai";

import useSubsonic from "../fetcher";
import { GET_PLAYLIST } from "../const";
import { titleAtom } from "../stores/title";
import type { SubsonicPlaylistResponse } from "../types";

import Standard from "../components/standard";
import Tracks from "../components/tracks";
import Dot from "../components/dot";
import Button from "../components/button";

const Playlist = () => {
  const { id } = useParams();
  console.log('drawing a playlist', id)
  const { data } = useSubsonic<SubsonicPlaylistResponse>(
    `${GET_PLAYLIST}?id=${id}`
  );
  const [_, setTitle] = useAtom(titleAtom);
  React.useEffect(() => {
    setTitle(data?.name || "Unkown playlist");
  }, [data]);

  return (
    <Standard>
      <section className="py-4 pt-8 flex flex-row">
        <div className="flex flex-col px-8 py-4 justify-between">
          <div>
            <h1 className="mb-8 text-2xl md:text-3xl xl:text-4xl font-extrabold">
              {data?.name}
            </h1>
          </div>
          <div className="flex flex-row items-center">
            <span className="mr-2">{data?.songCount}</span>
            <Dot />
            <span className="mx-2">
              {formatDuration((data?.duration || 0) * 1000)}
            </span>
            <Dot />
            <Button className="mx-2">Play</Button>
            <Dot />
            <Button className="mx-2">Shuffle</Button>
          </div>
        </div>
      </section>
      <Tracks
        songs={
          data?.entry.map((entry, i) => ({ ...entry, track: i + 1 })) || []
        }
        art={-1}
        number={-1}
        title={9}
        heart={-1}
        album={3}
        artist={3}
        length={-1}
        format={-1}
      />
    </Standard>
  );
};

export default Playlist;
