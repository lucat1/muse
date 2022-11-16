import * as React from "react"
import { useAtomValue } from "jotai"

import { PlayerStatus, usePlayer } from "../stores/player"
import { fetcher, getURL } from "../fetcher"
import { SCROBBLE } from "../const"
import { connectionAtom } from "../stores/connection"
import { scrobbleAtom } from "../stores/settings"

export interface AudioProps {
  onTime(time: number): void
  seek?: number
  onEnd(): void
}

const Audio: React.FC<AudioProps> = ({ onTime, seek, onEnd }) => {
  const connection = useAtomValue(connectionAtom)
  const shouldScrobble = useAtomValue(scrobbleAtom)
  const { song, status, loading, play } = usePlayer()
  const audio = React.useRef<HTMLAudioElement>(null)
  React.useEffect(() => {
    if (!audio.current) return
    const handleTime = () => onTime(audio.current?.currentTime || 0)
    const handleLoading = () => loading()
    const handleNotLoading = () => play()

    audio.current.addEventListener("canplay", play)
    audio.current.addEventListener("timeupdate", handleTime)
    audio.current.addEventListener("ended", onEnd)
    audio.current.addEventListener("waiting", handleLoading)
    audio.current.addEventListener("loadeddata", handleNotLoading)
    return () => {
      if (!audio.current) return

      audio.current.removeEventListener("canplay", play)
      audio.current.removeEventListener("timeupdate", handleTime)
      audio.current.removeEventListener("ended", onEnd)
      audio.current.removeEventListener("waiting", handleLoading)
      audio.current.removeEventListener("loadeddata", handleNotLoading)
    }
  }, [audio.current, loading, play, onTime, onEnd])

  // TODO: debounce scrobble
  const scrobble = () => {
    if (song?.id && shouldScrobble)
      fetcher(`${SCROBBLE}?id=${song.id}`, connection, {
        method: "POST"
      })
  }
  React.useEffect(() => {
    if (audio.current) audio.current.currentTime = 0
    scrobble()
  }, [audio.current?.src])
  React.useEffect(() => {
    if (!audio.current) return

    if (status == PlayerStatus.PLAYING) audio.current.play()
    if (status == PlayerStatus.PAUSED) audio.current.pause()
  }, [audio.current, song, status])

  React.useEffect(() => {
    if (audio.current && seek) audio.current.currentTime = seek
  }, [audio.current, seek])

  return (
    <audio
      ref={audio}
      src={
        status == PlayerStatus.UNLOADED
          ? ""
          : getURL(`stream?id=${song!.id}`, connection)
      }
    />
  )
}

export default Audio
