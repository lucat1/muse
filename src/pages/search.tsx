import * as React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import debounce from "debounce";
import useAuthenticatedSWR from "../fetcher";
import { useTitle, SEARCH } from "../const";
import type { SubsonicSearchResponse } from "../types";

import Standard from "../components/standard";
import Album from "../components/album";
import Tracks from "../components/tracks";
import Artist from "../components/artist";
import ScrollView from "../components/scroll-view";

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
  ];
  const songs = (search?.song || []).sort((a,b) => (a.starred && !b.starred) ? -1 : (!a.starred && b.starred) ? 1 : 0)
  return (
    <>
          <section>
            <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
              Songs
            </h2>
            <Tracks
              songs={songs}
              art={-1}
              heart={-1}
              title={8}
              artist={6}
              length={1}
            />
          </section>
      {sections.map((section, i) => {
        if (section[3].length == 0) return null;
        const [Element, key] = [section[1], section[2]];
        return (
          <section key={i}>
            <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
              {section[0]}
            </h2>
            <ScrollView className="flex flex-row overflow-x-auto">
              {section[3].map((data, i) => (
                <Element key={i} {...{ [key]: data }} />
              ))}
            </ScrollView>
          </section>
        );
      })}
    </>
  );
};

const QUERY_KEY = "q";
const Search: React.FC = () => {
  useTitle("Search");
  const [qs, setQs] = useSearchParams();
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      search: qs.get(QUERY_KEY) || undefined,
    },
  });
  const [query, setQuery] = React.useState<string | null>(qs.get(QUERY_KEY));

  const onSubmit = React.useCallback(
    ({ search }: FormData) => {
      setQuery(search);
      qs.set(QUERY_KEY, search);
      setQs(qs);
    },
    [setQuery]
  );
  React.useEffect(() => {
    const subscription = watch(debounce(handleSubmit(onSubmit), 400));
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <Standard>
      <form
        className="flex flex-col p-8 items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          id="search"
          type="text"
          className="dark:bg-neutral-700 dark:placeholder:text-slate-100 w-full max-w-sm lg:max-w-md 2xl:max-w-xl rounded-full h-12 px-6 text-lg drop-shadow-lg outline-none focus:ring focus:ring-red-500 dark:focus:ring-red-400"
          placeholder="Search through your music..."
          {...register("search", { required: true })}
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
