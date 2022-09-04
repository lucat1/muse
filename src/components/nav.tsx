import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import {
  HomeIcon as HomeFull,
  MagnifyingGlassIcon as SearchFull,
  UsersIcon as UsersFull,
  RectangleStackIcon as CollectionFull,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as HomeOutline,
  MagnifyingGlassIcon as SearchOutline,
  UsersIcon as UsersOutline,
  RectangleStackIcon as CollectionOutline,
} from "@heroicons/react/24/outline";

import { connectionAtom } from "../stores/connection";
import { RING } from "../const";
import Playlists from "./playlists";

const Navbar: React.FC = () => {
  const connection = useAtomValue(connectionAtom);
  const { pathname } = useLocation();
  const section = React.useMemo(() => {
    if (/artists?/.test(pathname)) return "artists";
    else if (/albums?/.test(pathname)) return "albums";
    else if (/playlists?/.test(pathname)) return "playlists";
    else if (/search/.test(pathname)) return "search";
    else return "home";
  }, [pathname]);

  const paths = React.useMemo(
    () => [
      {
        selected: section == "home",
        link: `/${connection.id}/`,
        name: "Home",
        icon: section == "home" ? HomeFull : HomeOutline,
      },
      {
        selected: section == "search",
        link: `/${connection.id}/search`,
        name: "Search",
        icon: section == "search" ? SearchFull : SearchOutline,
      },
      {
        selected: section == "artists",
        link: `/${connection.id}/artists`,
        name: "Artists",
        icon: section == "artists" ? UsersFull : UsersOutline,
      },
      {
        selected: section == "albums",
        link: `/${connection.id}/albums`,
        name: "Albums",
        icon: section == "albums" ? CollectionFull : CollectionOutline,
      },
    ],
    [section]
  );

  return (
    <nav className="hidden col-start-1 col-end-1 md:flex flex-col border-r dark:border-neutral-700">
      <section className="flex flex-col py-6 p-4 border-b dark:border-neutral-700">
        {paths.map((path, i) => (
          <Link
            key={i}
            className={`flex felx-row items-center rounded-full my-2 p-3 px-4 bg-neutral-200 dark:bg-neutral-800 ${
              path.selected ? "text-red-500 dark:text-red-400" : ""
            } ${RING}`}
            to={path.link}
          >
            <path.icon className="w-6 h-6" />
            <span
              className={`ml-3 ${
                path.selected ? "font-extrabold" : "font-semibold"
              }`}
            >
              {path.name}
            </span>
          </Link>
        ))}
      </section>
      <section className="flex flex-1 overflow-y-auto flex-col py-2 p-4">
        <Link
          className={`text-xl font-bold my-3 ${RING}`}
          to={`/${connection.id}/playlists`}
        >
          Playlists
        </Link>
        <Playlists />
      </section>
    </nav>
  );
};

export default Navbar;
