import * as React from "react"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { useAtom } from "jotai"
import { useSubsonicInfinite, hasNextPage as has } from "../fetcher"
import { GET_ALBUMS } from "../const"
import { titleAtom } from "../stores/title"
import type { SubsonicAlbumsResponse } from "../types"

import Album from "../components/album"
import Standard from "../components/standard"
import Loading from "../components/loading"

const PER_PAGE = 50
const types = [
  "recent",
  "random",
  "newest",
  "frequent",
  "starred",
  "alphabeticalByName",
  "alphabeticalByArtist"
]
const Albums = () => {
  const [selected, setSelected] = React.useState(0)
  const { data, size, setSize } = useSubsonicInfinite<SubsonicAlbumsResponse>(
    (index) =>
      `${GET_ALBUMS}?type=${types[selected]}&size=${PER_PAGE}&offset=${
        index * PER_PAGE
      }`
  )
  const hasNextPage = has(data?.length ? data[data.length - 1] : null)
  const [sentryRef] = useInfiniteScroll({
    loading: false,
    hasNextPage,
    onLoadMore: () => setSize(size + 1),
    rootMargin: "0px 0px 400px 0px"
  })
  const [_, setTitle] = useAtom(titleAtom)
  React.useEffect(() => {
    setTitle("Albums")
  }, [])

  return (
    <Standard>
      {/* TODO: use select from radix */}
      <select
        value={types[selected]}
        onChange={(e) => setSelected(types.indexOf(e.target.value))}
      >
        {types.map((type, i) => (
          <option key={i} value={type}>
            {type}
          </option>
        ))}
      </select>

      <div className="flex flex-row pb-4 pt-8 justify-between items-center">
        <h1 className="text-3xl font-bold">Albums</h1>
        test
      </div>
      <main className="flex flex-row flex-wrap">
        {data
          ?.map((d) => d.album)
          .filter((e) => !!e)
          .flat()
          .map((album, i) => (
            <Album key={i} album={album} />
          ))}
      </main>
      {hasNextPage && (
        <div className="flex flex-1 justify-center align-center m-32">
          <Loading />
        </div>
      )}
    </Standard>
  )
}

export default Albums
