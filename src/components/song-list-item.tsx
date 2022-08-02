import * as React from "react";
import { HeartIcon as HeartOutline,
  ChevronRightIcon as ChevronRight,
  ChevronDoubleRightIcon as ChevronDoubleRight,
  ChevronDoubleLeftIcon as ChevronDoubleLeft,
  ArrowNarrowDownIcon as ArrowDown,
  InformationCircleIcon as Info
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartSolid,
} from "@heroicons/react/solid";
import formatDuration from "format-duration";
import { Root, Trigger, Portal, Group, Separator, Content, Item, ItemIcon, ITEM_ICON_CLASS } from './contex-menu';


import type { SubsonicSong } from "../types";

export interface SongProps {
  song: SubsonicSong;
  playing: boolean;
  play: (song: SubsonicSong) => void;
}

export interface Field {
  name: string;
  size: string;
  value: React.FC<SongProps>;
}

export const defaultFields: Field[] = [
  {
    name: "Liked",
    size: "1fr",
    value: ({ song }) => {
      const Heart = song.starred != undefined ? HeartSolid : HeartOutline;
      return <Heart className="w-6" />;
    },
  },
  {
    name: "Title",
    size: "12fr",
    value: ({ song, play }) => {
      return (
        <a
          onClick={(e) => {
            e.preventDefault();
            play(song);
          }}
        >
          {song.title}
        </a>
      );
    },
  },
  {
    name: "Length",
    size: "1fr",
    value: ({ song }) => {
      return <a>{formatDuration(song.duration * 1000)}</a>;
    },
  },
];

const Song: React.FC<{ fields: Field[]; props: SongProps }> = ({
  fields,
  props,
}) => {
  return (
    <Root>
      <Trigger asChild={true}>
        <div className="contents">
          {fields.map(({ value: Value, name }) => (
            <Value key={name} {...props} />
          ))}
        </div>
      </Trigger>
    <Portal>
      <Content>
        <Group>
          <Item>
            <ItemIcon>
              <ChevronRight className={ITEM_ICON_CLASS}/>
            </ItemIcon>
            Play
          </Item>
          <Item>
            <ItemIcon>
              <ChevronDoubleLeft className={ITEM_ICON_CLASS}/>
            </ItemIcon>
            Play next
          </Item>
          <Item>
            <ItemIcon>
              <ChevronDoubleRight className={ITEM_ICON_CLASS}/>
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

export default Song;
