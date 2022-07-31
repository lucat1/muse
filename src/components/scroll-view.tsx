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
  const ref = React.useRef<HTMLDivElement>();
  const [start, setStart] = React.useState<Position | null>(null);
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setStart({
        left: ref.current!.scrollLeft,
        top: ref.current!.scrollTop,
        x: e.clientX,
        y: e.clientY,
      });
    },
    [setStart]
  );
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    ref.current!.scrollLeft = start!.left - e.clientX + start!.x;
    ref.current!.scrollTop = start!.top - e.clientY + start!.y;
  };
  const handleMouseUp = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
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
