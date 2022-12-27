import * as React from "react"
import { Link } from "react-router-dom"
import { useDrag, useDrop } from "react-dnd"
import { useAtomValue } from "jotai"
import {
  HeartIcon as HeartOutline,
  ChevronRightIcon as ChevronRight,
  ChevronDoubleRightIcon as ChevronDoubleRight,
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
import { usePlay } from "../hooks"
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
import type { AugmentedSubsonicSong } from "./tracks"
import IconButton from "./icon-button"
import type { SubsonicSong } from "src/types"

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
export type TrackAction = (songs: SubsonicSong[], i: number) => void
export interface TrackActions {
  previewMove?: (ia: number, ib: number) => void
  move?: (ia: number, ib: number) => void
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

export interface TrackContentProps {
  song: AugmentedSubsonicSong
  index: number
  songs: SubsonicSong[]
}
const TrackContent = React.memo(
  React.forwardRef<
    HTMLDivElement,
    TrackProps & { song: SubsonicSong; index: number } & TrackActions &
      TrackContentProps & {
        play: TrackAction
        handlerId?: Identifier | null
        dragging: boolean
      }
  >(
    (
      { song, index, songs, remove, handlerId, dragging, play, ...fields },
      ref
    ) => {
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
          <Center className="w-7 p-1 justify-end group-hover:hidden">
            {index + 1}
          </Center>
          <Center className={`p-0 hidden group-hover:flex justify-end`}>
            <IconButton className="p-1" onClick={() => play(songs, index)}>
              <Play />
            </IconButton>
          </Center>
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
            <Center className="truncate">
              <span className="font-semibold truncate">{song.title}</span>
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
            <Center className="text-red-500 dark:text-red-400 truncate">
              <Link
                className="truncate"
                to={
                  song.albumId ? `/${connection.id}/album/${song.albumId}` : ""
                }
              >
                {song.album}
              </Link>
            </Center>
          )}
          {/* Fields.ARTIST */}
          {show(fields[Fields.ARTIST]) && (
            <Center className="text-red-500 dark:text-red-400 truncate">
              <Link
                className="truncate"
                to={
                  song.artistId
                    ? `/${connection.id}/artist/${song.artistId}`
                    : ""
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
    }
  )
)

interface DragItem {
  id: number
  oid: number
}

const DraggableTrackContent: React.FC<
  TrackProps &
    TrackActions &
    TrackContentProps & {
      play: TrackAction
    }
> = ({ move, previewMove, song, index, ...fields }) => {
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
      const dragIndex = item.id
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return
      }

      previewMove!(dragIndex, hoverIndex)
      item.id = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: DragType.TRACK,
    item: () => {
      return { id: index, oid: song.i }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        // If dragged outside, reset
        previewMove!(item.id, item.oid)
      } else {
        // Else, apply the move
        move!(item.oid, index)
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

const Track: React.FC<TrackProps & TrackContentProps & TrackActions> = ({
  move,
  song,
  index,
  songs,
  ...fields
}) => {
  const { play, prepend, append } = usePlay()

  return (
    <Root>
      <Trigger>
        {move ? (
          <DraggableTrackContent
            move={move}
            song={song}
            songs={songs}
            play={play}
            index={index}
            {...fields}
          />
        ) : (
          <TrackContent
            dragging={false}
            song={song}
            songs={songs}
            play={play}
            index={index}
            {...fields}
          />
        )}
      </Trigger>
      <Portal>
        <Content>
          <Group>
            <Item onSelect={() => play(songs, index)}>
              <ItemIcon>
                <Play className={ITEM_ICON_CLASS} />
              </ItemIcon>
              Play
            </Item>
            <Item onSelect={() => prepend([song])}>
              <ItemIcon>
                <ChevronRight className={ITEM_ICON_CLASS} />
              </ItemIcon>
              Play next
            </Item>
            <Item onSelect={() => append([song])}>
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
}

export default Track
