import * as React from "react";
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { ErrorBoundary } from "react-error-boundary";
import { createResource, Resource } from "../util";

const CLASSES = "aspect-square rounded-lg drop-shadow-md select-none pointer-events-none";
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

const RawImage = React.forwardRef<
  HTMLImageElement,
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
>(({ className, src, alt, ...props }, ref) => {
  src = fetchImage(src!).read();
  return (
    <img
      {...props}
      ref={ref}
      src={src}
      alt={alt}
      className={`${CLASSES} ${className || ""}`}
    />
  );
});

export const ImageSkeleton = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    alt?: string;
  }
>(({ className, alt }, ref) => (
  <div
    ref={ref}
    role="img"
    aria-label={alt}
    className={`${CLASSES} ${
      className || ""
    } bg-neutral-200 dark:bg-neutral-700`}
  />
));

const Image: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ className, alt, ...props }) => {
  const [ref, { entry }] = useIntersectionObserver();
  const inView = entry && entry.isIntersecting;
  const fallback = <ImageSkeleton ref={ref} className={className} alt={alt} />;
  return (
    <ErrorBoundary fallback={fallback}>
      <React.Suspense fallback={fallback}>
        {inView ? (
          <RawImage ref={ref} className={className} alt={alt} {...props} />
        ) : (
          fallback
        )}
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default Image;
