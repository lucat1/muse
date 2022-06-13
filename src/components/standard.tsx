import * as React from "react";

const Standard: React.FC<React.PropsWithChildren<{ nopad?: boolean }>> = ({
  children,
  nopad,
}) => (
  <main className="flex flex-col items-center shrink-0">
    <div className="flex flex-col flex-1 w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-2-6xl 2xl:max-w-7xl">
      {children}
    </div>
    {!(nopad == undefined ? false : nopad) && <div className="w-screen h-64" />}
  </main>
);

export default Standard;
