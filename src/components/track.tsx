import * as React from "react"
import { Link } from "react-router-dom"
import type { Identifier } from "dnd-core"
import { useDrag, useDrop } from "react-dnd"
import { useAtomValue } from "jotai"
import {
  HeartIcon as HeartOutline,
  ChevronRightIcon as ChevronRight,
  ChevronDoubleRightIcon as ChevronDoubleRight,
  ChevronDoubleLeftIcon as ChevronDoubleLeft,
  ArrowLongDownIcon as ArrowDown,
  InformationCircleIcon as Info
} from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import formatDuration from "format-duration"

import { fetcher, useURL } from "../fetcher"
import { Connection, connectionAtom } from "../stores/connection"
import { STAR, UNSTAR, DragType } from "../const"
import Image from "./img"
import {
  Root,
  Trigger,
  Portal,
  Group,
  Separator,
  Content,
  Item,
  ItemIcon,
  ITEM_ICON_CLASS
} from "./contex-menu"
import type { SubsonicSong } from "../types"
import IconButton from "./icon-button"

export enum Fields {
  NUMBER = "number",
  ART = "art",
  TITLE = "title",
  HEART = "heart",
  ALBUM = "album",
  ARTIST = "artist",
  LENGTH = "length",
  FORMAT = "format"
}
export type TrackProps = {
  [key in Fields]?: number
}
export type TrackAction = (song: SubsonicSong, i: number) => void
export interface TrackActions {
  swap?: (a: SubsonicSong, ia: number, b: SubsonicSong, ib: number) => void
  play?: TrackAction
  remove?: TrackAction
}

const show = (val: number | undefined) => val && val != 0
const Center: React.FC<
  React.PropsWithChildren<React.HTMLProps<HTMLElement> & { as?: string }>
> = ({ as, ...props }) => {
  const AS = as || ("div" as any)
  return (
    <AS
      {...props}
      className={`flex flex-row items-center ${props.className || ""}`}
    />
  )
}

const Like: React.FC<{ song: SubsonicSong; connection: Connection }> = ({
  song,
  connection
}) => {
  const Heart = song.starred ? HeartSolid : HeartOutline
  const [starring, isStarring] = React.useState(false)
  const like = React.useCallback(async () => {
    isStarring(true)
    try {
      await fetcher(`${song.starred ? UNSTAR : STAR}?id=${song.id}`, connection)
      song.starred = song.starred ? undefined : new Date().toString()
    } catch (err) {
      // TODO: handle fetch errors
      console.warn(`Could not like track ${song.id}:`, err)
    }
    isStarring(false)
  }, [song, isStarring])

  return (
    <IconButton
      role="switch"
      aria-label={`${song.starred ? "Unlike" : "Like"} this song`}
      aria-checked={song.starred ? true : false}
      disabled={starring}
      className={`w-7 h-7 ${
        song.starred ? "text-red-500 dark:text-red-400" : ""
      }`}
      onClick={like}
    >
      <Heart />
    </IconButton>
  )
}

const BASE_BG =
  "group-focus:bg-neutral-200 group-hover:bg-neutral-200 dark:group-focus:bg-neutral-800 dark:group-hover:bg-neutral-800"
const BASE = `min-h-[3.5rem] min-h-fit p-2 lg:px-4 ${BASE_BG}`
const TrackContent = React.forwardRef<
  HTMLDivElement,
  TrackProps & { song: SubsonicSong; index: number } & TrackActions & {
      handlerId?: string
    }
>(({ song, index, play, remove, handlerId, ...fields }, ref) => {
  const connection = useAtomValue(connectionAtom)

  return (
    <div
      ref={ref as any}
      data-handler-id={handlerId}
      className="w-full grid gap-y-2"
      style={{
        gridTemplateColumns: `auto ${Object.values(Fields)
          .map((f) => fields[f] || 0)
          .filter((f) => f != 0)
          .map((f) => (f < 0 ? "auto" : `${f}fr`))
          .join(" ")} auto`
      }}
    >
      <div className={`${BASE_BG} rounded-l-lg w-2`} />
      {/* Fields.NUMBER */}
      {show(fields[Fields.NUMBER]) && (
        <Center className={`${BASE} justify-end`}>{song.track}</Center>
      )}
      {/* Fields.ART */}
      {show(fields[Fields.ART]) && (
        <Center className={BASE}>
          <Link to={`/${connection.id}/album/${song.albumId}`}>
            <Image
              className="w-10"
              src={useURL(`getCoverArt?id=${song.coverArt}`)}
            />
          </Link>
        </Center>
      )}
      {/* Fields.TITLE */}
      {show(fields[Fields.TITLE]) && (
        <Center
          as="button"
          className={`${BASE} cursor-pointer`}
          onClick={play ? () => play(song, index) : undefined}
        >
          <span className="font-semibold">{song.title}</span>
        </Center>
      )}
      {/* Fields.HEART */}
      {show(fields[Fields.HEART]) && (
        <Center className={BASE}>
          <Like song={song} connection={connection} />
        </Center>
      )}
      {/* Fields.ALBUM */}
      {show(fields[Fields.ALBUM]) && (
        <Center className={`${BASE} text-red-500 dark:text-red-400`}>
          <Link
            to={song.albumId ? `/${connection.id}/album/${song.albumId}` : ""}
          >
            {song.album}
          </Link>
        </Center>
      )}
      {/* Fields.ARTIST */}
      {show(fields[Fields.ARTIST]) && (
        <Center className={`${BASE} text-red-500 dark:text-red-400`}>
          <Link
            to={
              song.artistId ? `/${connection.id}/artist/${song.artistId}` : ""
            }
          >
            {song.artist}
          </Link>
        </Center>
      )}
      {/* Fields.LENGTH */}
      {show(fields[Fields.LENGTH]) && (
        <Center className={BASE}>{formatDuration(song.duration * 1000)}</Center>
      )}
      {/* Fields.FORMAT */}
      {show(fields[Fields.FORMAT]) && (
        <Center className={BASE}>{song.suffix}</Center>
      )}
      <div className={`${BASE_BG} rounded-r-lg w-2`} />
    </div>
  )
})

interface DragItem {
  song: SubsonicSong
  index: number
  type: string
}

const DraggableTrackContent = React.forwardRef<
  HTMLDivElement,
  TrackProps & { song: SubsonicSong; index: number } & TrackActions
>(({ swap, song, index, ...fields }, rref) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: DragType.TRACK,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: DragType.TRACK,
    item: () => {
      return { song, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))
  console.log(handlerId, isDragging)
  return (
    <TrackContent
      ref={ref}
      handlerId={handlerId}
      song={song}
      index={index}
      {...fields}
    />
  )
})

const Track: React.FC<
  TrackProps & { song: SubsonicSong; index: number } & TrackActions
> = ({ swap, play, ...fields }) => (
  <Root>
    <Trigger asChild={true}>
      {swap ? (
        <DraggableTrackContent swap={swap} play={play} {...fields} />
      ) : (
        <TrackContent play={play} {...fields} />
      )}
    </Trigger>
    <Portal>
      <Content>
        <Group>
          {play && (
            <Item onSelect={() => play}>
              <ItemIcon>
                <ChevronRight className={ITEM_ICON_CLASS} />
              </ItemIcon>
              Play
            </Item>
          )}
          <Item>
            <ItemIcon>
              <ChevronDoubleLeft className={ITEM_ICON_CLASS} />
            </ItemIcon>
            Play next
          </Item>
          <Item>
            <ItemIcon>
              <ChevronDoubleRight className={ITEM_ICON_CLASS} />
            </ItemIcon>
            Add to queue
          </Item>
        </Group>
        <Separator />
        <Group>
          <Item>
            <ItemIcon>
              <ArrowDown className={ITEM_ICON_CLASS} />
            </ItemIcon>
            Download
          </Item>
          <Item>
            <ItemIcon>
              <Info className={ITEM_ICON_CLASS} />
            </ItemIcon>
            Get Info
          </Item>
        </Group>
      </Content>
    </Portal>
  </Root>
)

export default Track
