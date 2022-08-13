import * as React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  HomeIcon as HomeFull,
  SearchIcon as SearchFull,
  UsersIcon as UsersFull,
  CollectionIcon as CollectionFull,
  LogoutIcon,
} from "@heroicons/react/solid";
import {
  HomeIcon as HomeOutline,
  SearchIcon as SearchOutline,
  UsersIcon as UsersOutline,
  CollectionIcon as CollectionOutline,
} from "@heroicons/react/outline";

import { GET_COVER_ART, RING, useConnection, useConnections } from "../const";
import { getURL } from "../fetcher";

import { usePlayer } from "./player";
import Image from "./img";
import Playlists from "./playlists";
import ThemeButton from "./theme-button";
import Logo from "./logo";
import IconButton from "./icon-button";

export const NavbarContent = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<{}>
>(({ children }, ref) => (
  <main
    ref={ref}
    className="fixed left-48 md:left-64 xl:left-72 top-0 bottom-24 right-0 flex flex-col"
  >
    {children}
  </main>
));

const Navbar: React.FC = () => {
  const [connections, setConnections] = useConnections();
  const [connection] = useConnection();
  const { song } = usePlayer();
  const navigate = useNavigate();
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
    <nav className="fixed w-48 md:w-64 xl:w-72 h-screen flex flex-col border-r dark:border-neutral-700">
      <section className="flex flex-row justify-between items-center p-4 border-b dark:border-neutral-700">
        <Logo to={`/${connection.id}/`} />
        <div>
          <ThemeButton className="mr-3" />
          <IconButton
            aria-label="Logout"
            onClick={(_) => {
              setConnections(connections.map((c) => ({ ...c, auto: false })));
              navigate("/");
            }}
          >
            <LogoutIcon />
          </IconButton>
        </div>
      </section>
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
      <section className="flex flex-1 overflow-auto flex-col py-2 p-4">
        <Link
          className={`text-xl font-bold my-3 ${RING}`}
          to={`/${connection.id}/playlists`}
        >
          Playlists
        </Link>
        <Playlists />
      </section>
      {song && (
        <section className="flex flex-1 flex-row justify-center">
          <main className="flex flex-col m-4 mb-8 w-full truncate self-end">
            <Link
              className="flex justify-center"
              to={`/${connection.id}/album/${song.albumId}`}
            >
              <Image
                className="w-full"
                src={getURL(`${GET_COVER_ART}?id=${song.coverArt}`, connection)}
              />
            </Link>
            <div className="flex flex-0 flex-col">
              <h2 className="text-2xl lg:text-3xl pt-2 truncate">
                <Link
                  to={`/${connection.id}/album/${song.albumId}?song=${song.id}`}
                >
                  {song.title}
                </Link>
              </h2>
              <Link
                className="pt-2 text-lg"
                to={`/${connection.id}/album/${song.albumId}`}
              >
                {song.album}
              </Link>
              <Link
                className="pt-1 text-md text-red-500 dark:text-red-400"
                to={`/${connection.id}/artist/${song.artistId}`}
              >
                {song.artist}
              </Link>
            </div>
          </main>
        </section>
      )}
    </nav>
  );
};

export default Navbar;
