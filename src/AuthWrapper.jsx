import { useState, useCallback } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import createSkyPathSDK from "@skypath-io/web-sdk";
import { z } from "zod";
import {
  ApiKeyForm,
  JwtForm,
  AuthOptions,
  AuthHeader,
  AuthIntro,
  AuthFooter,
  FormError,
  SubmitSection,
} from "./components/molecules/AuthForms";
import { LoginPreview } from "./components/organisms/LoginPreview";
import pkg from "../package.json";
import {
  apiKeyAuthSchema,
  jwtAuthSchema,
  AUTH_OPTIONS,
  restoreAuth,
  preserveAuth
} from "./lib/validation/authSchemas";
import {
  SDK_PACKAGE_NAME,
  ERROR_MESSAGES
} from "./lib/constants";

const SDK_VERSION = pkg.dependencies[SDK_PACKAGE_NAME]?.replace("^", "") || "N/A";

const getValidationErrors = (zodError) => {
  const { formErrors, fieldErrors } = z.flattenError(zodError);

  if (formErrors.length > 0) {
    return { general: formErrors[0] };
  }

  const firstFieldErrors = Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0]])
  );

  return Object.keys(firstFieldErrors).length > 0
    ? firstFieldErrors
    : { general: ERROR_MESSAGES.REQUIRED_FIELDS };
};

const INITIAL_FORM_VALUES = {
  proxyUrl: "",
  apiKey: "",
  userId: "",
  companyName: "",
  signedJwt: "",
  partnerId: "",
};

const getInitialAuthOption = (formData) =>
  formData.signedJwt && !formData.apiKey ? AUTH_OPTIONS.SIGNED_JWT : AUTH_OPTIONS.API_KEY;

const AuthWrapper = ({ children }) => {
  const [SDK, setSDK] = useState(null);
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState(() => {
    const savedData = restoreAuth();
    return savedData || INITIAL_FORM_VALUES;
  });
  const [authOption, setAuthOption] = useState(() => getInitialAuthOption(formData));

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors && errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return Object.keys(newErrors).length > 0 ? newErrors : null;
      });
    }
  }, [errors]);

  const handleAuthOptionSelect = useCallback((option) => {
    setAuthOption(option);
    setErrors(null);
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    let validationResult;
    let authParams = {};

    if (authOption === AUTH_OPTIONS.API_KEY) {
      validationResult = apiKeyAuthSchema.safeParse(formData);

      if (!validationResult.success) {
        setErrors(getValidationErrors(validationResult.error));
        return;
      }

      authParams = {
        apiKey: formData.apiKey,
        userId: formData.userId,
        companyName: formData.companyName,
      };
    } else if (authOption === AUTH_OPTIONS.SIGNED_JWT) {
      validationResult = jwtAuthSchema.safeParse(formData);

      if (!validationResult.success) {
        setErrors(getValidationErrors(validationResult.error));
        return;
      }

      authParams = {
        authCallback: () => ({
          jwt: formData.signedJwt,
          partnerId: formData.partnerId
        }),
      };
    }

    createSkyPathSDK({
      proxyUrl: formData.proxyUrl || undefined,
      ...authParams,
    })
      .then((sdk) => {
        setSDK(sdk);
        setErrors(null);
        preserveAuth(formData);
      })
      .catch((err) => {
        setSDK(null);
        setErrors({ general: err.message || ERROR_MESSAGES.AUTHORIZATION_ERROR });
      });
  }, [authOption, formData]);

  const handleLogout = useCallback(() => setSDK(null), []);

  if (SDK && !errors) {
    return children(SDK, SDK_VERSION, handleLogout);
  }

  const fieldErrors = errors || {};

  return (
    <div className="flex h-dvh max-h-dvh gap-4 overflow-hidden bg-page p-4 select-none">
      <LoginPreview />

      <main className="flex min-h-0 w-full max-w-[clamp(560px,46vw,820px)] shrink-0 flex-col justify-between gap-[clamp(16px,3vh,40px)] overflow-y-auto px-6 pt-[clamp(12px,4vh,40px)] pb-[clamp(12px,4vh,36px)] sm:pr-14 sm:pl-12">
        <AuthHeader sdkVersion={SDK_VERSION} />

        <div className="flex flex-col gap-[clamp(16px,3vh,28px)]">
          <AuthIntro />

          <Tabs.Root value={authOption} onValueChange={handleAuthOptionSelect} className="flex flex-col gap-[18px]">
            <AuthOptions />
            <FormError message={fieldErrors.general} />
            <form onSubmit={handleSubmit} noValidate className="m-0 flex flex-col gap-[18px]">
              <Tabs.Content value={AUTH_OPTIONS.API_KEY} className="outline-none">
                <ApiKeyForm formData={formData} onChange={handleInputChange} errors={fieldErrors} />
              </Tabs.Content>
              <Tabs.Content value={AUTH_OPTIONS.SIGNED_JWT} className="outline-none">
                <JwtForm formData={formData} onChange={handleInputChange} errors={fieldErrors} />
              </Tabs.Content>
              <SubmitSection />
            </form>
          </Tabs.Root>
        </div>

        <AuthFooter />
      </main>
    </div>
  );
};

export default AuthWrapper;
