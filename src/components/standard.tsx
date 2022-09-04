import * as React from "react";

export const StandardWidth: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div
    className={`flex flex-col flex-1 w-full max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl px-4 ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const Standard: React.FC<
  React.PropsWithChildren<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      parentClassName?: string;
    }
  >
> = ({ children, parentClassName, ...props }) => (
  <main className={`flex flex-col items-center ${parentClassName || ""}`}>
    <StandardWidth {...props}>{children}</StandardWidth>
  </main>
);

export default Standard;
