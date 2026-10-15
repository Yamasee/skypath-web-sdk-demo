import { cn } from "../../lib/style-utils";

const Divider = ({ className }) => {
  return <div className={cn("h-px w-full bg-white/8", className)}></div>;
};

export { Divider };
