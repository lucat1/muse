import * as React from "react";
import { createResource, Resource } from "../util";

const cache = new Map<string, Resource<string>>();

const fetchImage = (source: string): Resource<string> => {
  let resource = cache.get(source);
  if (resource) return resource;

  resource = createResource<string>(async () => {
    const img = new window.Image();
    img.src = source;
    await img.decode();
    return source;
  });
  cache.set(source, resource);
  return resource;
};

const RawImage: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ className, src, ...props }) => {
  fetchImage(src!).read();
  return (
    <img
      {...props}
      src={src}
      className={`aspect-square rounded-lg drop-shadow-md ${className || ""}`}
    />
  );
};

export const ImageSkeleton: React.FC<{ className?: string; alt?: string }> = ({
  className,
  alt,
}) => {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`aspect-square rounded-lg drop-shadow-md ${
        className || ""
      } bg-neutral-200 dark:bg-neutral-700`}
    />
  );
};

const Image: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ className, alt, ...props }) => (
  <React.Suspense fallback={<ImageSkeleton className={className} alt={alt} />}>
    <RawImage className={className} alt={alt} {...props} />
  </React.Suspense>
);

export default Image;
