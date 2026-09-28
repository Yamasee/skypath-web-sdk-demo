import { CursorHeadline } from "../CursorHeadline";

const AuthIntro = () => {
  return (
    <div>
      <CursorHeadline muted="Web SDK" highlighted="Demo App" />
      <p className="mt-[18px] mb-0 max-w-[40ch] text-sm leading-[1.55] text-ink-muted">
        Sign in with your SkyPath credentials to see{" "}
        <span className="font-medium text-ink">live turbulence layers</span> on a map, filtered by{" "}
        <span className="font-medium text-ink">altitude, severity and time</span>.
      </p>
    </div>
  );
};

export default AuthIntro;
