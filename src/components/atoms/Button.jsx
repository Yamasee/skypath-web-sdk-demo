import { cva } from "class-variance-authority";
import { cn } from "../../lib/style-utils";

const button = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2.5",
    "rounded-full",
    "font-sans",
    "font-semibold",
    "whitespace-nowrap",
    "cursor-pointer",
    "transition-colors",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-[#F2F2F2]", "text-page", "hover:bg-white"],
        secondary: ["bg-chip", "text-ink", "hover:bg-chip-active"],
      },
      size: {
        md: ["h-[52px]", "px-6", "text-sm"],
        lg: ["h-[54px]", "px-7", "text-[15px]"],
        icon: ["size-11", "shrink-0", "p-0"],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

const Button = ({ children, className, variant, size, type = "button", ...props }) => {
  return (
    <button type={type} className={cn(button({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
};

export { Button };
