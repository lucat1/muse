import * as React from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import debounce from "debounce"
import { useAtom } from "jotai"

import useAuthenticatedSWR from "../fetcher"
import { SEARCH } from "../const"
import { titleAtom } from "../stores/title"
import type { SubsonicSearchResponse } from "../types"

import Loading from "../components/loading"
import Standard from "../components/standard"
import Input from "../components/input"
import Album from "../components/album"
import Tracks from "../components/tracks"
import Artist from "../components/artist"
import ScrollView from "../components/scroll-view"
import ArtistSection from "../components/artist-section"
import Button from "../components/button"

interface FormData {
  query?: string
}

const Results: React.FC<{ query: string | undefined }> = ({ query }) => {
  if (!query) {
    return null
  }
  const { data: search } = useAuthenticatedSWR<SubsonicSearchResponse>(
    `${SEARCH}?query=${encodeURIComponent(query)}`
  )
  const sections: [
    "Artists" | "Albums" | "Songs",
    React.FC<any>,
    "artist" | "album" | "song",
    any[]
  ][] = [
    ["Artists", Artist, "artist", search?.artist || []],
    ["Albums", Album, "album", search?.album || []]
  ]

  const [more, setMore] = React.useState(false)
  const songs = (search?.song || [])
    .sort((a, b) =>
      a.starred && !b.starred ? -1 : !a.starred && b.starred ? 1 : 0
    )
    .filter((_, i) => i < (more ? 10 : 5))
  return (
    <>
      {songs.length > 0 && (
        <ArtistSection
          header="Songs"
          extra={<Button onClick={(_) => setMore(!more)}>More</Button>}
        >
          <Tracks
            songs={songs}
            art={-1}
            heart={-1}
            title={12}
            artist={5}
            album={5}
            length={2}
          />
        </ArtistSection>
      )}
      {sections.map((section, i) => {
        if (section[3].length == 0) return null
        const [Element, key] = [section[1], section[2]]
        return (
          <ArtistSection key={i} header={section[0]}>
            <ScrollView className="flex flex-row overflow-x-auto">
              {section[3].map((data, i) => (
                <Element key={i} {...{ [key]: data }} />
              ))}
            </ScrollView>
          </ArtistSection>
        )
      })}
    </>
  )
}

const QUERY_KEY = "q"
const Search: React.FC = () => {
  const [_, setTitle] = useAtom(titleAtom)
  React.useEffect(() => {
    setTitle("Search")
  }, [])
  const [qs, setQs] = useSearchParams()
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      query: qs.get(QUERY_KEY) || undefined
    }
  })
  const [query, setQuery] = React.useState<string | undefined>(
    qs.get(QUERY_KEY) || undefined
  )

  const onSubmit = React.useCallback(
    ({ query }: FormData) => {
      if (!query) return

      setQuery(query)
      qs.set(QUERY_KEY, query)
      setQs(qs)
    },
    [setQuery]
  )
  const debouncedOnSubmit = React.useCallback(debounce(onSubmit, 400), [
    onSubmit
  ])
  const watchQuery = watch("query")
  React.useEffect(() => {
    debouncedOnSubmit({ query: watchQuery })
    return () => debouncedOnSubmit.clear()
  }, [debouncedOnSubmit, watchQuery])

  return (
    <Standard>
      <form
        className="flex flex-col p-8 items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          id="query"
          type="text"
          placeholder="Search through your library"
          {...register("query", { required: true })}
        />
      </form>
      <React.Suspense
        fallback={
          <div className="m-32 flex flex-1 items-center">
            <Loading />
          </div>
        }
      >
        <Results query={query} />
      </React.Suspense>
    </Standard>
  )
}

export default Search
