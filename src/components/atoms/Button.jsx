import { cva } from "class-variance-authority";
import { cn } from "../../lib/style-utils";

const button = cva([
  "flex",
  "flex-col",
  "items-center",
  "justify-center",
  "flex-1",
  "gap-1",
  "px-3",
  "py-4",
  "text-sm",
  "font-semibold",
  "leading-6",
  "text-white",
  "rounded-md",
  "focus-visible:outline",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-violet-600",
], {
  variants: {
    variant: {
      primary: [
        "bg-violet-600",
        "hover:bg-violet-500",
      ],
      secondary: [
        "bg-white",
        "text-violet-600",
        "hover:bg-gray-100",
      ],
    },
    size: {
      md: [
        "px-2",
        "py-3",
      ],
      lg: [
        "px-3",
        "py-4",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
})

const Button = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={cn(button(props), className)} {...props}>
      {children}
    </button>
  );
};

export { Button };