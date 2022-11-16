import * as React from "react"
import {
  Root,
  PrimitiveDivProps,
  SeparatorProps
} from "@radix-ui/react-separator"

const Dot: React.FC<PrimitiveDivProps & SeparatorProps> = (props) => (
  <Root
    {...props}
    className={`inline-flex w-1 h-1 shrink-0 mx-2 rounded-full bg-current ${
      props.className || ""
    }`}
  />
)

export default Dot
