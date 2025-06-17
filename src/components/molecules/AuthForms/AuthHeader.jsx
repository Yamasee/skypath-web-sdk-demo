import icon from "../../../../public/favicon.ico";

const AuthHeader = ({ sdkVersion }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <img
        className="h-5 pointer-events-none"
        src={icon}
        alt="SkyPath LTD"
      />
      <h1 className="text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
        SkyPath Web SDK Demo App
      </h1>
      <div className="px-2 py-1 text-xs font-semibold leading-4 text-center text-white border border-gray-200 rounded-md bg-violet-600">
        SDK v{sdkVersion}
      </div>
    </div>
  );
};

export default AuthHeader;
