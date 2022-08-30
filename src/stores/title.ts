import { atom } from "jotai";

const TITLE_SUFFIX = " - Muse";

const rawTitleAtom = atom(document.title);
export const titleAtom = atom(
  (get) => get(rawTitleAtom),
  (_, set, newValue: string) => {
    set(rawTitleAtom, newValue + TITLE_SUFFIX);
    document.title = newValue + TITLE_SUFFIX;
  }
);
