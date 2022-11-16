import * as React from "react"
import {
  Root,
  PrimitiveDivProps,
  SeparatorProps
} from "@radix-ui/react-separator"

const Separator: React.FC<PrimitiveDivProps & SeparatorProps> = (props) => (
  <Root
    {...props}
    className={`flex-1 ${
      props.orientation == "horizontal" ? "mx-4 h-px" : "my-4 w-px"
    } bg-neutral-200 dark:bg-neutral-700 ${props.className || ""}`}
  />
)

export default Separator
