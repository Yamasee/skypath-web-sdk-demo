import { normalizeAltitude } from "../../lib/general-utils";

const AltRangeDisplay = ({ bottomAlt, topAlt }) => {
  return (
    <div className="
      text-[11px]
      flex
      flex-col
      leading-none
      gap-1
      justify-center
      items-center
      bg-blue-500
      text-white
      px-1
      py-1.5
      rounded-md
      min-w-14
    ">
      <div className="font-light">FL</div>
      <div className="font-normal whitespace-nowrap">
        {normalizeAltitude(bottomAlt)}-{normalizeAltitude(topAlt)}
      </div>
    </div>
  );
};

export { AltRangeDisplay };