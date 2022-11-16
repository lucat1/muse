import { focusAtom } from "jotai/optics"

import { connectionAtom } from "./connection"

export interface Settings {
  scrobble: boolean
}

export const defaultSettings: Settings = {
  scrobble: false
}

export const settingsAtom = focusAtom(connectionAtom, (optic) =>
  optic.prop("settings")
)

export const scrobbleAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop("scrobble")
)
