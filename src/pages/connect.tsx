import * as React from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { useAtom } from "jotai"

import { PING } from "../const"
import { Connection, connectionsAtom } from "../stores/connection"
import { defaultSettings } from "../stores/settings"
import { titleAtom } from "../stores/title"
import { getURL } from "../fetcher"
import type {
  SubsonicWrapperResponse,
  SubsonicBaseResponse,
  SubsonicPingResponse,
  SubsonicErrorResponse
} from "../types"

import Input from "../components/input"
import Button from "../components/button"
import MinimalWrapper from "../components/minimal-wrapper"

const salt = (len: number) => {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < len; ++i)
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  return result
}

const Label: React.FC<
  React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
> = ({ className, ...props }) => (
  <label
    className={`text-red-500 dark:text-red-400 ${className || ""}`}
    {...props}
  />
)

interface FormData {
  host: string
  username: string
  password: string
}

const SALT_LENGTH = 32
const Welcome = () => {
  const [_, setTitle] = useAtom(titleAtom)
  React.useEffect(() => {
    setTitle("New connection")
  }, [])
  const navigate = useNavigate()
  const [conns, setConns] = useAtom(connectionsAtom)
  const [loading, setLoading] = React.useState(false)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<FormData & { account: any }>()
  const onSubmit = React.useCallback(
    async (conn: FormData) => {
      setLoading(true)
      clearErrors("account")
      const id = conns.list.length
      const connection: Connection = {
        ...conn,
        id,
        salt: salt(SALT_LENGTH),
        settings: defaultSettings
      }
      try {
        const res = await fetch(getURL(PING, connection))
        const json: SubsonicWrapperResponse<
          SubsonicBaseResponse<SubsonicPingResponse | SubsonicErrorResponse>
        > = await res.json()
        if (res.status == 200 && json["subsonic-response"].status == "ok") {
          setConns({
            ...conns,
            default: conns.default != undefined ? conns.default : id,
            list: conns.list.concat(connection)
          })
          navigate(`/${id}/`)
        } else {
          const err = json["subsonic-response"].error as SubsonicErrorResponse
          setError("account", {
            type: "custom",
            message: `${err.message} (code: ${err.code})`
          })
        }
      } catch (err) {
        setError("host", { type: "custom", message: "Host unreachable" })
      }
      setLoading(false)
    },
    [conns, setConns]
  )

  return (
    <MinimalWrapper>
      <main className="flex items-center justify-center w-screen h-screen">
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold my-4">New connection</h1>
          </div>
          <Input
            type="url"
            id="host"
            placeholder="Subsonic host URL"
            className="my-3"
            disabled={loading}
            {...register("host", {
              required: true,
              pattern:
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i
            })}
          />
          {errors.host && <Label htmlFor="host">Invalid host</Label>}
          <Input
            type="text"
            id="username"
            placeholder="Username"
            className="my-3"
            disabled={loading}
            {...register("username", { required: true })}
          />
          {errors.username && (
            <Label htmlFor="username">A password is required</Label>
          )}
          <Input
            type="password"
            placeholder="Password"
            className="my-3"
            disabled={loading}
            {...register("password", { required: true })}
          />
          {errors.username && (
            <Label htmlFor="password">A password is required</Label>
          )}

          {errors.account && <Label>{errors.account.message as string}</Label>}
          <Button type="submit" className="my-3" disabled={loading}>
            Submit
          </Button>
        </form>
      </main>
    </MinimalWrapper>
  )
}

export default Welcome
