import { cva } from "class-variance-authority";
import { cn } from "../../../lib/style-utils";

const panel = cva([
  "w-[450px]",
  "bg-slate-800",
  "flex flex-col",
  "items-center",
  "justify-start",
  "pt-8",
  "rounded-lg",
  "h-24",
  "px-9",
  "text-sky-100",
  "shadow-light",
]);

const Panel = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn(panel(props), className)} {...props}>
      {children}
    </div>
  );
}

export { Panel };