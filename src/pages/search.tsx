import * as React from "react";
import { useForm } from "react-hook-form";
import useAuthenticatedSWR from "../fetcher";
import { useTitle, SEARCH } from "../const";
import type { SubsonicSearchResponse } from "../types";

import Standard from "../components/standard";
import Album from "../components/album";
import Song from "../components/song";
import Artist from "../components/artist";

interface FormData {
  search: string;
}

const Results: React.FC<{ query: string | null }> = ({ query }) => {
  if (query == null) {
    return null;
  }
  const { data: search } = useAuthenticatedSWR<SubsonicSearchResponse>(
    `${SEARCH}?query=${encodeURIComponent(query)}`
  );
  const sections: [
    "Artists" | "Albums" | "Songs",
    React.FC<any>,
    "artist" | "album" | "song",
    any[]
  ][] = [
    ["Artists", Artist, "artist", search?.artist || []],
    ["Albums", Album, "album", search?.album || []],
    ["Songs", Song, "song", search?.song || []],
  ];
  return (
    <>
      {sections.map((section, i) => {
        const [Element, key] = [section[1], section[2]];
        return (
          <section key={i}>
            <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
              {section[0]}
            </h2>
            {section[3].map((data, i) => (
              <Element key={i} {...{ [key]: data }} />
            ))}
          </section>
        );
      })}
    </>
  );
};

const Search: React.FC = () => {
  useTitle("Search");
  const { register, handleSubmit } = useForm<FormData>();
  const [query, setQuery] = React.useState<string | null>(null);
  const onSubmit = ({ search }: FormData) => {
    setQuery(search);
  };

  return (
    <Standard>
      <form
        className="flex flex-col p-8 items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          id="search"
          type="text"
          className="dark:bg-neutral-700 dark:placeholder:text-slate-100 w-full max-w-sm lg:max-w-md 2xl:max-w-xl rounded-full h-12 px-6 text-lg drop-shadow-lg outline-2"
          placeholder="Search through your music..."
          {...register("search", {
            required: true,
          })}
        />
        <label htmlFor="search" className="hidden">
          Search for your music
        </label>
      </form>
      <React.Suspense fallback={<h1>loading</h1>}>
        <Results query={query} />
      </React.Suspense>
    </Standard>
  );
};

export default Search;
