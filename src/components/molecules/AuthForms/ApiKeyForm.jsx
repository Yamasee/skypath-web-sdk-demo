import Field from "./Field";

const ApiKeyForm = ({ formData, onChange, errors = {} }) => {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
      <Field
        wide
        label="API key"
        name="apiKey"
        type="password"
        autoComplete="off"
        placeholder="Your SkyPath API key"
        value={formData.apiKey || ""}
        onChange={onChange}
        error={errors.apiKey}
      />
      <Field
        label="User ID"
        name="userId"
        type="text"
        placeholder="user@company"
        value={formData.userId || ""}
        onChange={onChange}
        error={errors.userId}
      />
      <Field
        label="Company name"
        name="companyName"
        type="text"
        placeholder="Company"
        value={formData.companyName || ""}
        onChange={onChange}
        error={errors.companyName}
      />
      <Field
        wide
        optional
        label="Proxy URL"
        name="proxyUrl"
        type="url"
        placeholder="https://"
        value={formData.proxyUrl || ""}
        onChange={onChange}
        error={errors.proxyUrl}
      />
    </div>
  );
};

export default ApiKeyForm;
