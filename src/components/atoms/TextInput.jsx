import { cva } from "class-variance-authority";
import { cn } from "../../lib/style-utils";

const input = cva(
  [
    "block",
    "w-full",
    "box-border",
    "px-4",
    "rounded-[14px]",
    "border",
    "bg-field",
    "text-sm",
    "text-ink",
    "font-sans",
    "transition-[border-color,box-shadow]",
    "focus:outline-none",
    "focus:border-accent/55",
    "focus:shadow-[0_0_0_3px_rgba(194,217,255,.12)]",
  ],
  {
    variants: {
      multiline: {
        true: ["min-h-[88px]", "py-3", "leading-[1.45]", "resize-none"],
        false: ["h-12"],
      },
      invalid: {
        true: ["border-danger-ink/55"],
        false: ["border-white/8"],
      },
    },
    defaultVariants: {
      multiline: false,
      invalid: false,
    },
  }
);

const TextInput = ({ className, multiline = false, invalid = false, ...props }) => {
  const Element = multiline ? "textarea" : "input";

  return (
    <Element
      className={cn(input({ multiline, invalid }), className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
};

export { TextInput };
