import { CONTACT_URL, DOCS_URL } from "../../../lib/constants";
import { Icon } from "../../atoms/Icon";

const LINK = "text-accent hover:text-white";

const AuthFooter = () => {
  return (
    <div className="flex flex-wrap items-center gap-5 text-[12.5px] text-ink-muted">
      <span>
        No credentials yet?{" "}
        <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
          Contact us
        </a>
      </span>
      <span className="h-3.5 w-px bg-white/12"></span>
      <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 ${LINK}`}>
        SDK documentation
        <Icon name="external" size={13} />
      </a>
    </div>
  );
};

export default AuthFooter;
