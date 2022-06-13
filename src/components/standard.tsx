import * as React from "react";

const Standard: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <main className="flex justify-center">
    <div className="flex flex-1 max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-2-6xl 2xl:max-w-7xl flex flex-col">
      {children}
    </div>
  </main>
);

export default Standard;
