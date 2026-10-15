import { Button } from "../../atoms/Button";
import { Icon } from "../../atoms/Icon";

const SubmitSection = () => (
  <div className="flex flex-col gap-[clamp(10px,2vh,18px)]">
    <Button type="submit" className="mt-1 w-full">
      Start the demo
      <Icon name="arrowRight" />
    </Button>
    <p className="m-0 flex items-center gap-[7px] text-[11.5px] text-ink-dim">
      <Icon name="lock" size={13} />
      Credentials are remembered in this browser only.
    </p>
  </div>
);

export default SubmitSection;
