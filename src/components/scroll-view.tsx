import * as React from "react";

interface Position {
  left: number;
  top: number;
  x: number;
  y: number;
}

const ScrollView: React.FC<
  React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>
> = ({ children, ...props }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = React.useState<Position | null>(null);
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setStart({
        left: ref.current!.scrollLeft,
        top: ref.current!.scrollTop,
        x: e.clientX,
        y: e.clientY,
      });
    },
    [setStart]
  );
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      ref.current!.scrollLeft = start!.left - e.clientX + start!.x;
      ref.current!.scrollTop = start!.top - e.clientY + start!.y;
    },
    [ref.current, start]
  );
  const handleMouseUp = React.useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setStart(null);
    },
    [setStart]
  );
  React.useEffect(() => {
    if (!start) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [start]);
  return (
    <div
      ref={ref}
      {...props}
      className={`${props.className || ""} ${
        start != null ? "cursor-grabbing select-none" : ""
      }`}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default ScrollView;
