import icon from "../../../public/favicon.ico";

const Logo = () => {
  return (
    <span className="flex items-center gap-3">
      <img className="pointer-events-none h-7 w-6 object-contain" src={icon} alt="" />
      <span className="font-display text-lg tracking-[-0.01em]">SkyPath</span>
    </span>
  );
};

export { Logo };
