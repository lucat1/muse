import * as React from "react"

import Standard, { StandardWidth } from "../components/standard"
import Tracks from "../components/tracks"
import Song from "../components/song"
import { usePlayer } from "../stores/player"
import { useStack, useQueue } from "../stores/queue"

const Queue: React.FC = () => {
  const { stack } = useStack()
  const { song } = usePlayer()
  const { queue } = useQueue()

  return (
    <main className="flex flex-1 flex-col items-center overflow-hidden">
      <StandardWidth className="grid grid-cols-1 md:grid-cols-4 overflow-auto">
        <section className="flex flex-col items-center justify-center">
          {song && (
            <>
              <h2 className="text-xl font-bold">Currently playing</h2>
              <Song song={song} />
            </>
          )}
        </section>
        <section className="col-span-3 overflow-y-auto">
          {stack.length > 0 && (
            <>
              <h2 className="text-xl font-bold">Previous</h2>
              <Tracks
                songs={stack}
                art={-1}
                title={9}
                heart={-1}
                album={3}
                artist={3}
                length={-1}
              />
            </>
          )}
          {queue.length > 0 && (
            <>
              <h2 className="text-xl font-bold">Next</h2>
              <Tracks
                songs={queue}
                art={-1}
                title={9}
                heart={-1}
                album={3}
                artist={3}
                length={-1}
              />
            </>
          )}
        </section>
      </StandardWidth>
    </main>
  )
}

export default Queue
