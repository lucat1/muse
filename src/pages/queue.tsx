import * as React from "react";

import Standard from "../components/standard";
import Song from "../components/song";
import { useQueue } from "../components/player";

const Queue: React.FC = () => {
  const { queue } = useQueue();
  return (
    <Standard>
      <h1>queue</h1>
      {queue.map((song, i) => (
        <Song key={i} song={song} />
      ))}
    </Standard>
  );
};

export default Queue;
