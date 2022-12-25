import * as React from "react"
import { Link } from "react-router-dom"
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
import {
  HeartIcon as HeartSolid,
  PlayIcon as Play
} from "@heroicons/react/24/solid"
import formatDuration from "format-duration"
import type { Identifier, XYCoord } from "dnd-core"

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
  move?: (ia: number, ib: number) => void
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
      className={`min-h-fit p-2 flex flex-row items-center ${
        props.className || ""
      }`}
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
      className={song.starred ? "text-red-500 dark:text-red-400" : ""}
      onClick={like}
    >
      <Heart />
    </IconButton>
  )
}

const TrackContent = React.forwardRef<
  HTMLDivElement,
  TrackProps & { song: SubsonicSong; index: number } & TrackActions & {
      handlerId?: Identifier | null
      dragging: boolean
    }
>(({ song, index, play, remove, handlerId, dragging, ...fields }, ref) => {
  const connection = useAtomValue(connectionAtom)
  return (
    <div
      ref={ref as any}
      data-handler-id={handlerId}
      className={`w-full my-1 px-2 lg:px-4 rounded-lg group grid gap-x-2 focus:bg-neutral-200 hover:bg-neutral-200 dark:focus:bg-neutral-800 dark:hover:bg-neutral-800 ${
        dragging ? "opacity-0" : ""
      }`}
      style={{
        gridTemplateColumns: `auto ${Object.values(Fields)
          .map((f) => fields[f] || 0)
          .filter((f) => f != 0)
          .map((f) => (f < 0 ? "auto" : `${f}fr`))
          .join(" ")}`
      }}
    >
      <Center
        className={`w-7 p-1 justify-end ${play ? "group-hover:hidden" : ""}`}
      >
        {index + 1}
      </Center>
      {play && (
        <Center className={`p-0 hidden group-hover:flex justify-end`}>
          <IconButton className="p-1" onClick={() => play(song, index)}>
            <Play />
          </IconButton>
        </Center>
      )}
      {/* Fields.ART */}
      {show(fields[Fields.ART]) && (
        <Center>
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
        <Center>
          <span className="font-semibold">{song.title}</span>
        </Center>
      )}
      {/* Fields.HEART */}
      {show(fields[Fields.HEART]) && (
        <Center>
          <Like song={song} connection={connection} />
        </Center>
      )}
      {/* Fields.ALBUM */}
      {show(fields[Fields.ALBUM]) && (
        <Center className="text-red-500 dark:text-red-400">
          <Link
            to={song.albumId ? `/${connection.id}/album/${song.albumId}` : ""}
          >
            {song.album}
          </Link>
        </Center>
      )}
      {/* Fields.ARTIST */}
      {show(fields[Fields.ARTIST]) && (
        <Center className="text-red-500 dark:text-red-400">
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
        <Center>{formatDuration(song.duration * 1000)}</Center>
      )}
      {/* Fields.FORMAT */}
      {show(fields[Fields.FORMAT]) && <Center>{song.suffix}</Center>}
    </div>
  )
})

interface DragItem {
  song: SubsonicSong
  index: number
  originalIndex: number
  type: string
}

const DraggableTrackContent: React.FC<
  TrackProps & { song: SubsonicSong; index: number } & TrackActions
> = ({ move, song, index, ...fields }) => {
  const originalIndex = React.useMemo(() => index, [song.id])
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
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      move!(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: DragType.TRACK,
    item: () => {
      return { song, index, originalIndex }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        move!(item.index, item.originalIndex)
      }
    }
  })

  drag(drop(ref))
  return (
    <TrackContent
      ref={ref}
      handlerId={handlerId}
      song={song}
      index={index}
      dragging={isDragging}
      {...fields}
    />
  )
}

const Track: React.FC<
  TrackProps & { song: SubsonicSong; index: number } & TrackActions
> = ({ move, play, ...fields }) => (
  <Root>
    <Trigger>
      {move ? (
        <DraggableTrackContent move={move} play={play} {...fields} />
      ) : (
        <TrackContent play={play} dragging={false} {...fields} />
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
