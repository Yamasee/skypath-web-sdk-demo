import { useState } from "react";
import createSkyPathSDK from "@skypath-io/web-sdk";
import icon from "../public/favicon.ico";
import { Button } from "./components/atoms/Button";
import { TextInput } from "./components/atoms/TextInput";
import pkg from "../package.json";

const INITIAL_FROM_VALUES = {
  proxyUrl: "",
  apiKey: "",
  userId: "",
  companyName: "",
  signedJwt: "",
  partnerId: "",
};

const SUPPORTED_AUTH_OPTIONS = {
  API_KEY: "API_KEY",
  SIGNED_JWT: "SIGNED_JWT",
};

const ERROR_MESSAGES = {
  BASE_URL: "Base URL is required",
  API_KEY: "Missing required fields",
  SIGNED_JWT: "Missing required fields",
};

const SDK_VERSION = pkg.dependencies["@skypath-io/web-sdk"]?.replace("^", "") || "N/A";

const AUTH_KEY = "sdk-auth";
const restoreAuth = () => localStorage.getItem("sdk-auth") ? JSON.parse(localStorage.getItem(AUTH_KEY)) : INITIAL_FROM_VALUES;
const preserveAuth = (authData) => localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

const AuthWrapper = ({ children }) => {
  const [SDK, setSDK] = useState();
  const [authOption, setAuthOption] = useState(null);
  const [error, setError] = useState(null);
  const [authData, setAuthData] = useState(restoreAuth);

  const handleSubmit = () => {
    const { proxyUrl, apiKey, userId, companyName, signedJwt, partnerId } =
      authData;

    let authParams = {};

    if (authOption === SUPPORTED_AUTH_OPTIONS.API_KEY) {
      if ([apiKey, userId, companyName].some((v) => !v)) {
        setError({ message: ERROR_MESSAGES.API_KEY });
        return;
      }
      authParams = {
        apiKey,
        userId,
        companyName,
      };
    }

    if (authOption === SUPPORTED_AUTH_OPTIONS.SIGNED_JWT) {
      if ([signedJwt, partnerId].some((v) => !v)) {
        setError({ message: ERROR_MESSAGES.SIGNED_JWT });
        return;
      }
      authParams = {
        authCallback: () => ({ jwt: signedJwt, partnerId }),
      };
    }

    createSkyPathSDK({
      proxyUrl,
      ...authParams,
    })
      .then((_sdk) => {
        setSDK(_sdk);
        setError(null);
        preserveAuth(authData);
      })
      .catch((error) => {
        setSDK(null);
        setError(error);
      })
      .finally(() => {
        setAuthData({ ...INITIAL_FROM_VALUES});
      }
    );
  };

  const handleInputChange = (e) =>
    setAuthData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  if (SDK && !error) return children(SDK);

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
          <div className="px-2 py-1 text-xs font-semibold leading-4 text-center text-white border border-gray-200 rounded-md bg-violet-600">
            SDK v{SDK_VERSION}
          </div>
        </div>

        {!authOption && (
          <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold leading-6 text-center text-gray-900">
              Select authorization option
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setAuthOption(SUPPORTED_AUTH_OPTIONS.API_KEY);
                  setError(null);
                }}
              >
                API Key
              </Button>
              <Button
                onClick={() => {
                  setAuthOption(SUPPORTED_AUTH_OPTIONS.SIGNED_JWT);
                  setError(null);
                }}
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
                name="apiKey"
                type="text"
                value={authData.apiKey}
                onChange={handleInputChange}
                placeholder="API Key"
              />
              <TextInput
                name="userId"
                type="text"
                value={authData.userId}
                onChange={handleInputChange}
                placeholder="User ID"
              />
              <TextInput
                name="companyName"
                type="text"
                value={authData.companyName}
                onChange={handleInputChange}
                placeholder="Company name"
              />
              <TextInput
                name="proxyUrl"
                type="text"
                value={authData.proxyUrl}
                onChange={handleInputChange}
                placeholder="Proxy URL (Optional)"
              />
            </div>
            {error?.message && (
              <div className="p-2 text-sm font-semibold leading-4 text-center text-red-500 bg-red-100 rounded-md">
                {error.message}
              </div>
            )}
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
                name="signedJwt"
                type="text"
                value={authData.signedJwt}
                onChange={handleInputChange}
                placeholder="Signed JWT"
              />
              <TextInput
                name="partnerId"
                type="text"
                value={authData.partnerId}
                onChange={handleInputChange}
                placeholder="Partner ID"
              />
              <TextInput
                name="proxyUrl"
                type="text"
                value={authData.proxyUrl}
                onChange={handleInputChange}
                placeholder="Proxy URL (Optional)"
              />
            </div>
            {error?.message && (
              <div className="p-2 text-sm font-semibold leading-4 text-center text-red-500 bg-red-100 rounded-md">
                {error.message}
              </div>
            )}
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

        <div className="flex flex-col justify-center w-full gap-2 align-center">
          <p className="text-sm leading-6 text-center text-gray-500">
            {"Don't have credentials yet? "}
            <a
              href="https://skypath.io/contact/"
              target="_blank"
              className="font-semibold text-violet-600 hover:text-violet-500 focus:outline-violet-600"
            >
              Contact us
            </a>
          </p>
          <a
            href="https://docs.skypath.io/js/introduction"
            target="_blank"
            className="text-xs font-semibold leading-4 text-center text-violet-600 hover:text-violet-500 focus:outline-violet-600"
          >
            SDK Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
