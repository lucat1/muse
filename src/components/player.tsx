import * as React from "react"
import * as Slider from "@radix-ui/react-slider"
import { useNavigate } from "react-router-dom"
import { useAtomValue } from "jotai"
import formatDuration from "format-duration"
import {
  QueueListIcon as Queue,
  MicrophoneIcon as Microphone
} from "@heroicons/react/24/outline"
import {
  PauseIcon as Pause,
  PlayIcon as Play,
  ForwardIcon as Forward,
  BackwardIcon as Backward
} from "@heroicons/react/24/solid"

import { connectionAtom } from "../stores/connection"
import { usePlayer, PlayerStatus } from "../stores/player"
import { useQueue, useStack } from "../stores/queue"
import { RING } from "../const"

import { StandardWidth } from "./standard"
import Audio from "./player-audio"
import IconButton from "./icon-button"
import { Spinner } from "./loading"

const Player: React.FunctionComponent = () => {
  const connection = useAtomValue(connectionAtom)
  const navigate = useNavigate()
  const { song, status, load, play, pause } = usePlayer()
  const { queue, next, prepend } = useQueue()
  const { stack, push, pop } = useStack()
  const [seek, setSeek] = React.useState(-1)
  const [time, setTime] = React.useState(0)
  const [seekTime, setSeekTime] = React.useState<number | undefined>(undefined)
  React.useEffect(() => setSeekTime(undefined), [song])

  const nextTrack = React.useCallback(() => {
    push([song!])
    if (queue.length > 0) {
      load(queue[0])
      next()
    }
  }, [queue, next, load])

  const previousTrack = React.useCallback(() => {
    prepend([song!])
    if (stack.length > 0) {
      load(stack[0])
      pop()
    }
  }, [queue, next, load])

  const PlayButtonIcon =
    status == PlayerStatus.PLAYING
      ? Pause
      : status == PlayerStatus.LOADING
      ? Spinner
      : Play
  return (
    <section className="flex border-t dark:border-neutral-700">
      <Audio onTime={setTime} seek={seekTime} onEnd={nextTrack} />
      <StandardWidth className="mx-auto align-center justify-between py-3">
        <div className="flex flex-1 flex-row items-center justify-between">
          <IconButton disabled={true} aria-label="Lyrics">
            <Microphone />
          </IconButton>
          <div className="flex items-center">
            <IconButton
              aria-label="Previous"
              onClick={previousTrack}
              disabled={status == PlayerStatus.UNLOADED || stack.length <= 0}
            >
              <Backward />
            </IconButton>
            <button
              className={`w-11 h-11 mx-4 flex items-center justify-center rounded-full bg-neutral-700 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-700 ${RING}`}
              disabled={status == PlayerStatus.UNLOADED /* || !canPlay*/}
              aria-label={status == PlayerStatus.PAUSED ? "Play" : "Pause"}
              onClick={status == PlayerStatus.PAUSED ? play : pause}
            >
              <PlayButtonIcon className="w-6 h-6" />
            </button>
            <IconButton
              aria-label="Next"
              onClick={nextTrack}
              disabled={status == PlayerStatus.UNLOADED || queue.length <= 0}
            >
              <Forward />
            </IconButton>
          </div>
          <IconButton
            aria-label="Queue"
            onClick={() => navigate(`/${connection.id}/queue`)}
          >
            <Queue />
          </IconButton>
        </div>
        <div className="flex flex-row">
          <span className="mr-4">
            {formatDuration((seek != -1 ? seek : time) * 1000)}
          </span>
          <Slider.Root
            className="relative w-full flex items-center group"
            disabled={
              status == PlayerStatus.UNLOADED || status == PlayerStatus.LOADING
            }
            value={[seek != -1 ? seek : time]}
            max={song?.duration || 0}
            onValueChange={(value) => setSeek(value[0])}
            onPointerUp={() => {
              setSeekTime(seek)
              setSeek(-1)
            }}
          >
            <Slider.Track className="relative grow h-1 rounded-full bg-neutral-700 dark:bg-neutral-300">
              <Slider.Range className="absolute h-full rounded-full bg-red-500 dark:bg-red-400" />
            </Slider.Track>
            <Slider.Thumb className="hidden group-hover:block bg-red-500 dark:bg-red-400 block rounded-full w-1 h-5 focus:w-2" />
          </Slider.Root>
          <span className="ml-4">
            {formatDuration((song?.duration || 0) * 1000)}
          </span>
        </div>
      </StandardWidth>
    </section>
  )
}

export default Player
