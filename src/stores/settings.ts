import { focusAtom } from "jotai/optics"

import { connectionAtom } from "./connection"

export interface Settings {
  scrobble: boolean
}

export const defaultSettings: Settings = {
  scrobble: import.meta.env.PROD
}

export const settingsAtom = focusAtom(connectionAtom, (optic) =>
  optic.prop("settings")
)

export const scrobbleAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop("scrobble")
)
