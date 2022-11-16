import * as React from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { useNavigate } from "react-router-dom"
import {
  Bars3Icon as Menu,
  ArrowLeftOnRectangleIcon as LogoutIcon
} from "@heroicons/react/24/outline"

import { connectionsAtom, connectionAtom } from "../stores/connection"
import ThemeButton from "./theme-button"
import Logo from "./logo"
import IconButton from "./icon-button"
import Settings from "./settings"

const Header: React.FC = () => {
  const connection = useAtomValue(connectionAtom)
  const setConns = useSetAtom(connectionsAtom)
  const navigate = useNavigate()

  return (
    <section className="col-start-1 col-end-2 md:col-end-2 flex flex-row justify-between items-center p-4 border-b md:border-r dark:border-neutral-700">
      <div className="flex items-center">
        <IconButton className="md:hidden mr-3">
          <Menu />
        </IconButton>
        <Logo to={`/${connection.id}/`} />
      </div>
      <div className="flex">
        <Settings className="mr-3" />
        <ThemeButton className="mr-3" />
        <IconButton
          aria-label="Logout"
          onClick={(_) => {
            setConns((c) => ({ ...c, default: undefined }))
            navigate("/")
          }}
        >
          <LogoutIcon />
        </IconButton>
      </div>
    </section>
  )
}

export default Header
