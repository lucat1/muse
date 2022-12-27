import * as React from "react"

import Standard from "../components/standard"
import Tracks from "../components/tracks"
import Song from "../components/song"
import { usePlayer } from "../stores/player"
import { useStack, useQueue } from "../stores/queue"

const Queue: React.FC = () => {
  const { stack } = useStack()
  const { song } = usePlayer()
  const { queue, move } = useQueue()

  return (
    <Standard className="grid grid-cols-1 md:grid-cols-4 overflow-hidden">
      <section className="flex flex-col items-center justify-center">
        {song && (
          <>
            <h2 className="text-xl font-bold">Currently playing</h2>
            <Song song={song} />
          </>
        )}
      </section>
      <section className="md:col-span-3 overflow-y-auto py-8">
        {stack.length > 0 && (
          <>
            <h2 className="text-xl font-bold">Previous</h2>
            <Tracks
              songs={stack}
              index={(n) => -(stack.length - n + 1)}
              art={-1}
              title={16}
              artist={6}
              length={2}
            />
          </>
        )}
        {queue.length > 0 && (
          <>
            <h2 className="text-xl font-bold">Next</h2>
            <Tracks
              songs={queue}
              art={-1}
              title={16}
              artist={6}
              length={2}
              move={move}
            />
          </>
        )}
      </section>
    </Standard>
  )
}

export default Queue
