import * as React from "react"
import { PrimitiveAtom, useAtom } from "jotai"
import * as Switch from "@radix-ui/react-switch"
import { Setting, SettingProps } from "./settings"

const SettingBoolean: React.FC<
  SettingProps & { atom: PrimitiveAtom<boolean> }
> = ({ atom, ...props }) => {
  const [val, setVal] = useAtom(atom)
  return (
    <Setting {...props}>
      <Switch.Root
        checked={val}
        onCheckedChange={setVal}
        value={val ? "on" : "off"}
        className="w-14 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full"
      >
        <Switch.Thumb
          className={`block w-6 h-6 m-1 rounded-full transition-all ease-in-out [&[data-state="checked"]]:translate-x-6 ${
            val
              ? "bg-red-500 dark:bg-red-400"
              : "bg-neutral-900 dark:bg-neutral-100"
          }`}
        />
      </Switch.Root>
    </Setting>
  )
}

export default SettingBoolean
