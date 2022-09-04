import * as React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import * as Switch from "@radix-ui/react-switch";
import { Setting, SettingProps } from "./settings";

const SettingBoolean: React.FC<
  SettingProps & { atom: PrimitiveAtom<boolean> }
> = ({ atom, ...props }) => {
  const [val, setVal] = useAtom(atom);
  return (
    <Setting {...props}>
      <Switch.Root
        checked={val}
        onCheckedChange={setVal}
        value={val ? "on" : "off"}
      >
        <Switch.Thumb />
      </Switch.Root>
    </Setting>
  );
};

export default SettingBoolean;
