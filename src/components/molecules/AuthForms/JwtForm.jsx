import Field from "./Field";

const JwtForm = ({ formData, onChange, errors = {} }) => {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
      <Field
        wide
        multiline
        rows={3}
        label="Signed JWT"
        name="signedJwt"
        placeholder="eyJhbGciOi…"
        value={formData.signedJwt || ""}
        onChange={onChange}
        error={errors.signedJwt}
      />
      <Field
        label="Partner ID"
        name="partnerId"
        type="text"
        placeholder="Partner ID"
        value={formData.partnerId || ""}
        onChange={onChange}
        error={errors.partnerId}
      />
      <Field
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

export default JwtForm;
