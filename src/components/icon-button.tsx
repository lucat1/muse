import * as React from "react";

import { RING } from "../const";

const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    {...props}
    className={`w-7 h-7 p-1 flex items-center justify-center rounded-full focus:bg-neutral-200 hover:bg-neutral-200 dark:focus:bg-neutral-800 dark:hover:bg-neutral-800 ${RING} ${
      className || ""
    }`}
  />
));

export default IconButton;
