import * as React from "react"
import { useAtomValue, useAtom } from "jotai"

import { GET_ALBUMS } from "../const"
import useSubsonic from "../fetcher"
import type { SubsonicAlbumsResponse } from "../types"
import { connectionAtom } from "../stores/connection"
import { titleAtom } from "../stores/title"

import Standard from "../components/standard"
import ScrollView from "../components/scroll-view"
import Separator from "../components/separator"
import Album from "../components/album"

const Section: React.FC<React.PropsWithChildren<{ extra?: any }>> = ({
  extra,
  children
}) => {
  return (
    <section className="py-4 flex flex-col">
      <div className="flex flex-row items-center">{extra}</div>
      {children}
    </section>
  )
}

const Index: React.FC = () => {
  const { data: albums } = useSubsonic<SubsonicAlbumsResponse>(
    `${GET_ALBUMS}?type=recent`
  )
  const connection = useAtomValue(connectionAtom)
  const [_, setTitle] = useAtom(titleAtom)
  React.useEffect(() => {
    setTitle("Home")
  }, [])
  return (
    <Standard>
      <h1 className="mt-12 mb-4 font-bold text-4xl font-logo tracking-wider">
        Hi, {connection.username}
      </h1>

      <Section>
        <ScrollView className="flex flex-row overflow-x-auto">
          {albums?.album?.map((album, i) => (
            <Album key={i} album={album} />
          ))}
        </ScrollView>
      </Section>
      <Separator decorative={true} orientation="horizontal" />
    </Standard>
  )
}

export default Index
