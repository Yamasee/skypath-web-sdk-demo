import { cva } from "class-variance-authority";
import { cn } from "../../lib/style-utils";

const input = cva("relative text-center block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:outline-violet-600 sm:text-sm sm:leading-6 px-8");

const TextInput = ({ children, className, ...props }) => {
  return (
    <input
      className={cn(input(props), className)}
      {...props}
    >{children}</input>
  )
}

export { TextInput };