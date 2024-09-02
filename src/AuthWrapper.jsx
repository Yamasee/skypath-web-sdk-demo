import { useState } from "react";
import createSkyPathSDK from "@yamasee/skypath-sdk-web";
import icon from "../public/favicon.ico";
import { Button } from "./components/atoms/Button";
import { TextInput } from "./components/atoms/TextInput";
import pkg from "../package.json";

const sdkVersion = pkg.dependencies["@yamasee/skypath-sdk-web"]?.replace("^", "") || "N/A";

const SUPPORTED_AUTH_OPTIONS = {
  API_KEY: "API_KEY",
  SIGNED_JWT: "SIGNED_JWT",
};

const AuthWrapper = ({ children }) => {
  const [SDK, setSDK] = useState();
  const [authOption, setAuthOption] = useState(null);
  const [authData, setAuthData] = useState({
    apiBaseUrl: "",
    apiKey: "",
    userId: "",
    companyName: "",
    signedJwt: "",
    partnerId: "",
  });

  const handleSubmit = () => {
    const { apiBaseUrl, apiKey, userId, companyName, signedJwt, partnerId } =
      authData;

    let authParams = {};

    if (authOption === SUPPORTED_AUTH_OPTIONS.API_KEY) {
      authParams = {
        apiKey,
        userId,
        companyName,
      };
    }

    if (authOption === SUPPORTED_AUTH_OPTIONS.SIGNED_JWT) {
      authParams = {
        authCallback: () => ({ jwt: signedJwt, partnerId }),
      };
    }

    createSkyPathSDK({
      apiBaseUrl,
      ...authParams,
    })
      .then(setSDK)
      .catch((error) => {
        alert(error.message);
        setAuthData(null);
      });
  };

  const handleInputChange = (e) =>
    setAuthData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  if (SDK) return children(SDK);

  return (
    <div className="flex items-center justify-center flex-1 min-h-full px-4 py-12 select-none sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <img
            className="h-5 pointer-events-none"
            src={icon}
            alt="SkyPath LTD"
          />
          <h1 className="text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            SkyPath Web SDK Demo App
          </h1>
          <div className="px-2 py-1 text-xs font-semibold leading-4 text-center text-white rounded-md bg-violet-600 border border-gray-200">
            SDK v{sdkVersion}
          </div>
        </div>

        {!authOption && (
          <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold leading-6 text-center text-gray-900">
              Select authorization option
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setAuthOption(SUPPORTED_AUTH_OPTIONS.API_KEY)}
              >
                API Key
              </Button>
              <Button
                onClick={() => setAuthOption(SUPPORTED_AUTH_OPTIONS.SIGNED_JWT)}
              >
                Signed JWT
              </Button>
            </div>
          </div>
        )}

        {authOption === SUPPORTED_AUTH_OPTIONS.API_KEY && (
          <div className="space-y-6">
            <div className="relative -space-y-px rounded-md shadow-sm">
              <TextInput
                name="apiBaseUrl"
                type="text"
                value={authData.apiBaseUrl}
                onChange={handleInputChange}
                required
                placeholder="Base URL"
              />
              <TextInput
                name="apiKey"
                type="text"
                value={authData.apiKey}
                onChange={handleInputChange}
                required
                placeholder="API Key"
              />
              <TextInput
                name="userId"
                type="text"
                value={authData.userId}
                onChange={handleInputChange}
                required
                placeholder="User ID"
              />
              <TextInput
                name="companyName"
                type="text"
                value={authData.companyName}
                onChange={handleInputChange}
                required
                placeholder="Company name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button size="md" onClick={handleSubmit}>
                Start
              </Button>
              <Button
                size="md"
                variant="secondary"
                onClick={() => setAuthOption(null)}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {authOption === SUPPORTED_AUTH_OPTIONS.SIGNED_JWT && (
          <div className="space-y-6">
            <div className="relative -space-y-px rounded-md shadow-sm">
              <TextInput
                name="apiBaseUrl"
                type="text"
                value={authData.apiBaseUrl}
                onChange={handleInputChange}
                required
                placeholder="Base URL"
              />
              <TextInput
                name="signedJwt"
                type="text"
                value={authData.signedJwt}
                onChange={handleInputChange}
                required
                placeholder="Signed JWT"
              />
              <TextInput
                name="partnerId"
                type="text"
                value={authData.partnerId}
                onChange={handleInputChange}
                required
                placeholder="Partner ID"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button size="md" onClick={handleSubmit}>
                Start
              </Button>
              <Button
                size="md"
                variant="secondary"
                onClick={() => setAuthOption(null)}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        <p className="text-sm leading-6 text-center text-gray-500">
          {"Don't have credentials yet? "}
          <a
            href="https://skypath.io/contact/"
            target="_blank"
            className="font-semibold text-violet-600 hover:text-violet-500 focus:outline-violet-600"
          >
            Contact us
          </a>
          <a
            href="https://docs.skypath.io/js/introduction"
            target="_blank"
            className="block pt-3 text-xs font-semibold leading-4 text-center text-violet-600 hover:text-violet-500 focus:outline-violet-600"
          >
            SDK Documentation
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthWrapper;
