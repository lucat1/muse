import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  SunIcon as Sun,
  MoonIcon as Moon,
  HomeIcon as HomeFull,
  MusicNoteIcon as MusicFull,
  SearchIcon as SearchFull,
} from "@heroicons/react/solid";
import {
  HomeIcon as HomeOutline,
  MusicNoteIcon as MusicOutline,
  SearchIcon as SearchOutline,
} from "@heroicons/react/outline";

import { GET_COVER_ART, useConnection } from "../const";
import { getURL } from "../fetcher";

import { usePlayer } from "../components/player";
import Image from "../components/img";

export const NavbarContent: React.FC<
  React.PropsWithChildren<React.PropsWithRef<{}>>
> = React.forwardRef(({ children }, ref) => (
  <main
    ref={ref}
    className="fixed left-48 md:left-64 xl:left-72 top-0 bottom-0 right-0 flex flex-col"
  >
    {children}
  </main>
));

const Navbar: React.FC = () => {
  const [connection] = useConnection();
  const [player, _] = usePlayer();
  const { pathname } = useLocation();
  const section = React.useMemo(() => {
    if (/(artist|artists|album|albums)/.test(pathname)) return "music";
    if (/search/.test(pathname)) return "search";
    else return "home";
  }, [pathname]);
  const [isDark, setDark] = React.useState(
    document.documentElement.classList.contains("dark")
  );
  const toggleDarkMode = () => {
    localStorage.setItem("theme", isDark ? "light" : "dark");
    setDark(!isDark);
    (window as any).updateTheme();
  };

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
        selected: section == "music",
        link: `/${connection.id}/artists`,
        name: "Music",
        icon: section == "music" ? MusicFull : MusicOutline,
      },
    ],
    [section]
  );

  return (
    <nav className="fixed w-48 md:w-64 xl:w-72 h-screen flex flex-col border-r dark:border-neutral-700">
      <section className="flex flex-row justify-between items-center p-4 border-b dark:border-neutral-700">
        <Link to={`/${connection.id}/`}>
          <h1 className="text-3xl font-bold font-logo">Muse</h1>
        </Link>
        <button
          role="switch"
          aria-label="Toggle dark mode"
          aria-checked={isDark}
          className="w-8 h-8 p-1 rounded-full focus:bg-neutral-200 hover:bg-neutral-200 dark:focus:bg-neutral-800 dark:hover:bg-neutral-800"
          onClick={toggleDarkMode}
        >
          {isDark ? <Moon /> : <Sun />}
        </button>
      </section>
      <section className="flex flex-col py-6 p-4">
        {paths.map((path, i) => (
          <Link
            key={i}
            className={`flex felx-row items-center rounded-full my-2 p-3 px-4 bg-neutral-200 dark:bg-neutral-800 ${
              path.selected ? "text-red-500 dark:text-red-400" : ""
            }`}
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
      {player.song && (
        <section className="flex flex-1 flex-row justify-center">
          <main className="flex flex-col m-4 mb-8 w-full truncate self-end">
            <Link
              className="flex justify-center"
              to={`/${connection.id}/album/${player.song.albumId}`}
            >
              <Image
                className="w-full"
                src={getURL(
                  `${GET_COVER_ART}?id=${player.song.coverArt}`,
                  connection
                )}
              />
            </Link>
            <div className="flex flex-0 flex-col">
              <h2 className="text-lg md:text-xl xl:text-2xl pt-2">
                <Link
                  to={`/${connection.id}/album/${player.song.albumId}?song=${player.song.id}`}
                >
                  {player.song.title}
                </Link>
              </h2>
              <Link
                className="pt-1 text-md"
                to={`/${connection.id}/album/${player.song.albumId}`}
              >
                {player.song.album}
              </Link>
              <Link
                className="pt-1 text-xs"
                to={`/${connection.id}/artist/${player.song.artistId}`}
              >
                {player.song.artist}
              </Link>
            </div>
          </main>
        </section>
      )}
    </nav>
  );
};

export default Navbar;
