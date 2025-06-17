import { useState, useCallback } from "react";
import createSkyPathSDK from "@skypath-io/web-sdk";
import { 
  ApiKeyForm, 
  JwtForm, 
  AuthOptions, 
  AuthHeader, 
  AuthFooter 
} from "./components/molecules/AuthForms";
import pkg from "../package.json";
import { 
  apiKeyAuthSchema, 
  jwtAuthSchema, 
  AUTH_OPTIONS, 
  restoreAuth,
  preserveAuth
} from "./lib/validation/authSchemas";

const SDK_PACKAGE_NAME = "@skypath-io/web-sdk";
const SDK_VERSION = pkg.dependencies[SDK_PACKAGE_NAME]?.replace("^", "") || "N/A";
const REQUIRED_FIELDS_ERROR_MESSAGE = "Required fields are not filled";
const AUTHORIZATION_ERROR_MESSAGE = "Authorization error";

const getValidationErrors = (zodError) => {
  if (!zodError.format) return { general: REQUIRED_FIELDS_ERROR_MESSAGE };
  
  const formatted = zodError.format();
  
  if (formatted._errors && formatted._errors.length > 0) {
    return { general: formatted._errors[0] };
  }
  
  const fieldErrors = {};
  Object.entries(formatted)
    .filter(([key]) => key !== '_errors')
    .forEach(([field, error]) => {
      if (error._errors && error._errors.length > 0) {
        fieldErrors[field] = error._errors[0];
      }
    });
  
  return Object.keys(fieldErrors).length > 0 
    ? fieldErrors 
    : { general: REQUIRED_FIELDS_ERROR_MESSAGE };
};

const INITIAL_FORM_VALUES = {
  proxyUrl: "",
  apiKey: "",
  userId: "",
  companyName: "",
  signedJwt: "",
  partnerId: "",
};

const AuthWrapper = ({ children }) => {
  const [SDK, setSDK] = useState(null);
  const [authOption, setAuthOption] = useState(null);
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState(() => {
    const savedData = restoreAuth();
    return savedData || INITIAL_FORM_VALUES;
  });

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

  const handleGoBack = useCallback(() => {
    setAuthOption(null);
    setErrors(null);
  }, []);

  const handleSubmit = useCallback(() => {
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
        setErrors({ general: err.message || AUTHORIZATION_ERROR_MESSAGE });
      });
  }, [authOption, formData]);

  if (SDK && !errors) {
    return children(SDK);
  }

  return (
    <div className="flex items-center justify-center flex-1 min-h-full px-4 py-12 select-none sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <AuthHeader sdkVersion={SDK_VERSION} />

        {!authOption && (
          <AuthOptions onSelectOption={handleAuthOptionSelect} />
        )}

        {authOption === AUTH_OPTIONS.API_KEY && (
          <ApiKeyForm 
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onBack={handleGoBack}
            error={errors && errors.general}
            errors={errors || {}}
          />
        )}

        {authOption === AUTH_OPTIONS.SIGNED_JWT && (
          <JwtForm 
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onBack={handleGoBack}
            error={errors && errors.general}
            errors={errors || {}}
          />
        )}

        <AuthFooter />
      </div>
    </div>
  );
};

export default AuthWrapper;
