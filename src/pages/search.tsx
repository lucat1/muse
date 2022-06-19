import * as React from "react";
import { useForm } from "react-hook-form";
import { fetcher } from "../fetcher";
import { useTitle, SEARCH, useConnection } from "../const";
import type { SubsonicSearchResponse } from "../types";

import Standard from "../components/standard";

interface FormData {
  search: string;
}

const Results: React.FC<{ query: string | null }> = () => {
  return null;
};

const Search: React.FC = () => {
  useTitle("Search");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Connection>();
  const [query, setQuery] = React.useState<string | null>(null);
  const onSubmit = ({ search }: FormData) => {
    setQuery(search);
  };

  return (
    <Standard>
      <form className="flex flex-col p-16" onSubmit={handleSubmit(onSubmit)}>
        <input
          id="search"
          type="text"
          className="w-full rounded-full h-12 px-6 text-lg drop-shadow-lg outline-2"
          placeholder="Search your music..."
          {...register("search", {
            required: true,
          })}
        />
        {errors.host && <label for="host">invalid host</label>}
        <label htmlFor="search" className="hidden">
          Search for your music
        </label>
      </form>
      <Results query={query} />
    </Standard>
  );
};

export default Search;
