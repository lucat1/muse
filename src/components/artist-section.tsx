import * as React from "react";

const ArtistSection: React.FC<React.PropsWithChildren<{ header: string }>> = ({
  header,
  children,
}) => {
  return (
    <section className="py-4 flex flex-col">
      <h2 className="text-lg md:text-xl xl:text-2xl font-semibold py-4">
        {header}
      </h2>
      <main className="flex justify-center">
        <div className="flex flex-row flex-wrap">{children}</div>
      </main>
    </section>
  );
};

export default ArtistSection;
