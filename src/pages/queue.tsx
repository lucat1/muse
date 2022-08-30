import * as React from "react";

import Standard from "../components/standard";
import Tracks from "../components/tracks";
import { usePlayer } from "../stores/player";
import { useStack, useQueue } from "../stores/queue";

const Queue: React.FC = () => {
  const { stack } = useStack();
  const { song } = usePlayer();
  const { queue } = useQueue();
  const tracks = React.useMemo(
    () => [...[...stack].reverse(), ...(song ? [song] : []), ...queue],
    [stack, song, queue]
  );

  return (
    <Standard>
      <h1>queue</h1>
      <Tracks
        songs={tracks}
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

export default Queue;
