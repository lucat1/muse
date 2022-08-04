import * as React from "react";

import Separator from "./separator";

const ArtistSection: React.FC<
  React.PropsWithChildren<{ header: string; extra?: any }>
> = ({ header, extra, children }) => {
  return (
    <section className="py-4 flex flex-col">
      <div className="flex flex-row items-center">
        <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
          {header}
        </h2>
        <Separator decorative={true} />
        {extra}
      </div>
      <main className="flex justify-center">{children}</main>
    </section>
  );
};

export default ArtistSection;
