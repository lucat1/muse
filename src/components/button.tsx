import * as React from "react"

import { RING } from "../const"

const Button: React.FC<
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>
> = (props) => (
  <button
    {...props}
    className={`py-2 px-6 font-bold rounded-lg text-red-500 dark:text-red-400 bg-neutral-200 dark:bg-neutral-700 ${RING} ${
      props.className || ""
    }`}
  />
)

export default Button
