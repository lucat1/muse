import * as React from "react";

export const StandardWidth: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div
    className={`flex flex-col flex-1 w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-2-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl px-4 ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const Standard: React.FC<React.PropsWithChildren<{ nopad?: boolean }>> = ({
  children,
  nopad,
}) => (
  <main className="flex flex-col items-center overflow-y-auto">
    <StandardWidth className={nopad == undefined ? "mb-32" : ""}>
      {children}
    </StandardWidth>
  </main>
);

export default Standard;
