import * as React from "react"

import { RING } from "../const"

const Input = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ id, placeholder, className, ...props }, ref) => {
  return (
    <>
      <input
        ref={ref}
        id={id}
        className={`dark:bg-neutral-700 dark:placeholder:text-slate-100 w-full max-w-sm lg:max-w-md 2xl:max-w-xl rounded-full h-12 px-6 text-lg drop-shadow-lg ${RING} ${
          className || ""
        }`}
        placeholder={placeholder}
        {...props}
      />
      <label htmlFor={id} className="hidden">
        {placeholder}
      </label>
    </>
  )
})

export default Input
