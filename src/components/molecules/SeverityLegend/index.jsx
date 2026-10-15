import { SeverityDot } from "../../atoms/SeverityDot";

const SeverityLegend = ({ options }) => {
  return (
    <div className="flex w-[236px] flex-col gap-2.5 rounded-[18px] bg-[rgba(18,18,18,.9)] px-[18px] py-4">
      <span className="text-xs font-medium text-ink-secondary">Severity</span>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[12.5px]">
        {options.map((option) => (
          <li key={option.value} className="flex items-center gap-2.5">
            <SeverityDot severity={option.value} className="h-2.5 w-[18px] rounded-[3px] opacity-85" />
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeverityLegend;
