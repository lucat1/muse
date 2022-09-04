import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CogIcon as Cog, XMarkIcon as X } from "@heroicons/react/24/outline";

import IconButton from "./icon-button";
import Sep from "./separator";

import SettingBoolean from "./setting-boolean";
import { scrobbleAtom } from "../stores/settings";

export type SettingProps = React.PropsWithChildren<{
  title: string;
  description: string;
}>;
export const Setting: React.FC<SettingProps> = ({
  title,
  description,
  children,
}) => (
  <section role="listitem" className="contents">
    <h3 className="col-span-2 font-semibold text-lg my-2">{title}</h3>
    <span className="prose prose-neutral dark:prose-invert">{description}</span>
    <div>{children}</div>
  </section>
);

const Separator: React.FC = () => (
  <Sep orientation="horizontal" className="col-span-2 mx-0 my-2" />
);

const Settings: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ ref: _, ...props }) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <IconButton {...props}>
        <Cog />
      </IconButton>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-80" />
      <Dialog.Content className="fixed flex flex-col px-8 w-10/12 md:w-9/12 xl:w-8/12 2xl:w-7/12 4xl:w-6/12 h-2/3 inset-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <Dialog.Title asChild>
          <nav className="flex flex-row items-center justify-between text-3xl font-bold pt-4">
            Settings
          </nav>
        </Dialog.Title>
        <Dialog.Description />
        <Dialog.Close asChild>
          <IconButton className="fixed top-4 right-4">
            <X />
          </IconButton>
        </Dialog.Close>
        <main
          role="list"
          className="grid grid-cols-[auto,fit-content(8rem)] py-4 overflow-y-auto"
        >
          <SettingBoolean
            title="Scrobble"
            description="Scrobble to last.fm or listembrainz.org when listeinig to tracks"
            atom={scrobbleAtom}
          ></SettingBoolean>
          <Separator />
          <SettingBoolean
            title="Scrobble"
            description="Scrobble to last.fm or listembrainz.org when listeinig to tracks"
            atom={scrobbleAtom}
          ></SettingBoolean>
        </main>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Settings;
