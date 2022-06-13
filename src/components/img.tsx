import * as React from "react";

const Image: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ className, ...props }) => (
  <img
    {...props}
    className={`aspect-square rounded-lg drop-shadow-md ${className || ""}`}
  />
);

export default Image;
