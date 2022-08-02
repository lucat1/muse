import * as React from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useSubsonicInfinite, hasNextPage as has } from "../fetcher";
import { useTitle, GET_ALBUMS } from "../const";
import type { SubsonicAlbumsResponse } from "../types";

import Album from "../components/album";
import Standard from "../components/standard";

const PER_PAGE = 50
const Albums = () => {
  const { data, size, setSize } = useSubsonicInfinite<SubsonicAlbumsResponse>(index => `${GET_ALBUMS}?type=recent&size=${PER_PAGE}&offset=${index * PER_PAGE}`);
  const hasNextPage = has(data?.length ? data[data.length-1] : null);
  const [sentryRef] = useInfiniteScroll({
    loading: false,
    hasNextPage,
    onLoadMore: () => setSize(size+1),
    rootMargin: '0px 0px 400px 0px',
  });
  useTitle("Albums");

  return (
    <Standard>
      <h1 className="text-lg font-bold">Albums</h1>
      <main className="flex flex-row flex-wrap">
      {data?.map(d => d.album).filter(e => !!e).flat().map((album, i) => (
          <Album key={i} album={album} />
        ))}
      </main>
      {hasNextPage && (
          <div ref={sentryRef} className="flex flex-1 justify-center align-center">
          LOADING DATA TODO
          </div>
      )}
    </Standard>
  );
};

export default Albums;
