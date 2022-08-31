import * as React from "react";

import { RING } from "../const";

const IconButton: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = (props) => (
  <button
    {...props}
    className={`w-8 h-8 p-1 flex items-center justify-center rounded-full focus:bg-neutral-200 hover:bg-neutral-200 dark:focus:bg-neutral-800 dark:hover:bg-neutral-800 ${RING} ${
      props.className || ""
    }`}
  />
);

export default IconButton;
