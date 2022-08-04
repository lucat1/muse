import * as React from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon as HeartOutline,
  ChevronRightIcon as ChevronRight,
  ChevronDoubleRightIcon as ChevronDoubleRight,
  ChevronDoubleLeftIcon as ChevronDoubleLeft,
  ArrowNarrowDownIcon as ArrowDown,
  InformationCircleIcon as Info,
} from "@heroicons/react/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/solid";
import formatDuration from "format-duration";

import { STAR, UNSTAR, useConnection } from "../const";
import { usePlayer } from "./player";
import { fetcher, useURL } from "../fetcher";
import Image from "./img";
import {
  Root,
  Trigger,
  Portal,
  Group,
  Separator,
  Content,
  Item,
  ItemIcon,
  ITEM_ICON_CLASS,
} from "./contex-menu";
import type { SubsonicSong } from "../types";

export enum Fields {
  ART = "art",
  NUMBER = "number",
  TITLE = "title",
  HEART = "heart",
  ARTIST = "artist",
  LENGTH = "length",
  FORMAT = "format",
}
export type TrackProps = { [key in Fields]?: number };

const show = (val: number | undefined) => val && val != 0;
const Center: React.FC<
  React.PropsWithChildren<React.HTMLProps<HTMLElement> & { as?: string }>
> = ({ as, ...props }) => {
  const AS = as || ("div" as any);
  return (
    <AS
      {...props}
      className={`flex flex-row items-center ${props.className || ""}`}
    />
  );
};

const Track: React.FC<TrackProps & { song: SubsonicSong }> = ({
  song,
  ...fields
}) => {
  const [connection] = useConnection();
  const [_, dispatch] = usePlayer();
  const Heart = song.starred ? HeartSolid : HeartOutline;

  const play = React.useCallback(
    () => dispatch({ type: "play", payload: song }),
    [dispatch, song]
  );
  const [starring, isStarring] = React.useState(false);
  const like = React.useCallback(async () => {
    isStarring(true);
    try {
      await fetcher(
        `${song.starred ? UNSTAR : STAR}?id=${song.id}`,
        connection
      );
      song.starred = song.starred ? undefined : new Date().toString();
    } catch (err) {
      // TODO: handle fetch errors
      console.warn(`Could not like track ${song.id}:`, err);
    }
    isStarring(false);
  }, [song, isStarring]);

  return (
    <Root>
      <Trigger asChild={true}>
        <div className="p-3 my-1 rounded-lg focus:bg-neutral-200 hover:bg-neutral-200 dark:focus:bg-neutral-800 dark:hover:bg-neutral-800">
          <div
            className="h-10 w-full grid gap-x-6"
            style={{
              gridTemplateColumns: Object.values(Fields)
                .map((f) => fields[f] || 0)
                .filter((f) => f != 0)
                .map((f) => (f < 0 ? "auto" : `${f}fr`))
                .join(" "),
            }}
          >
            {/* Fields.ART */}
            {show(fields[Fields.ART]) && (
              <Link to={`/${connection.id}/album/${song.albumId}`}>
                <Image
                  className="w-10"
                  src={useURL(`getCoverArt?id=${song.coverArt}`)}
                />
              </Link>
            )}
            {/* Fields.NUMBER */}
            {show(fields[Fields.NUMBER]) && (
              <Center className="px-2">{song.track}</Center>
            )}
            {/* Fields.TITLE */}
            {show(fields[Fields.TITLE]) && (
              <Center className="cursor-pointer" onClick={play}>
                <span className="font-semibold">{song.title}</span>
              </Center>
            )}
            {/* Fields.HEART */}
            {show(fields[Fields.HEART]) && (
              <Center as="button" disabled={starring} onClick={like}>
                <Heart
                  className={`w-7 h-7 ${
                    song.starred ? "text-red-500 dark:text-red-400" : ""
                  }`}
                />
              </Center>
            )}
            {/* Fields.ARTIST */}
            {show(fields[Fields.ARTIST]) && (
              <Center className="text-red-500 dark:text-red-400">
                <Link
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
        </div>
      </Trigger>
      <Portal>
        <Content>
          <Group>
            <Item onSelect={play}>
              <ItemIcon>
                <ChevronRight className={ITEM_ICON_CLASS} />
              </ItemIcon>
              Play
            </Item>
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
  );
};
export default Track;
