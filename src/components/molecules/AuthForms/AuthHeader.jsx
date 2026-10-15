import { Logo } from "../../atoms/Logo";
import { Badge } from "../../atoms/Badge";

const AuthHeader = ({ sdkVersion }) => {
  return (
    <div className="flex items-center gap-3">
      <Logo />
      <Badge label="SDK" value={`v${sdkVersion}`} className="ml-auto" />
    </div>
  );
};

export default AuthHeader;
