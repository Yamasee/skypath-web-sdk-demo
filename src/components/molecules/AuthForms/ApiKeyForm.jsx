import { TextInput } from '../../atoms/TextInput';
import { Button } from '../../atoms/Button';

const FieldError = ({ message }) => (
  message ? <div className="mt-1 text-xs text-red-500">{message}</div> : null
);

const ApiKeyForm = ({ formData, onChange, onSubmit, onBack, error, errors = {} }) => {
  return (
    <div className="space-y-6">
      <div className="relative space-y-4 rounded-md shadow-sm">
        <div>
          <TextInput
            name="apiKey"
            type="text"
            value={formData.apiKey || ''}
            onChange={onChange}
            placeholder="API Key"
            className={errors.apiKey ? 'ring-red-500 focus:ring-red-500' : ''}
          />
          <FieldError message={errors.apiKey} />
        </div>
        
        <div>
          <TextInput
            name="userId"
            type="text"
            value={formData.userId || ''}
            onChange={onChange}
            placeholder="User ID"
            className={errors.userId ? 'ring-red-500 focus:ring-red-500' : ''}
          />
          <FieldError message={errors.userId} />
        </div>
        
        <div>
          <TextInput
            name="companyName"
            type="text"
            value={formData.companyName || ''}
            onChange={onChange}
            placeholder="Company name"
            className={errors.companyName ? 'ring-red-500 focus:ring-red-500' : ''}
          />
          <FieldError message={errors.companyName} />
        </div>
        
        <div>
          <TextInput
            name="proxyUrl"
            type="text"
            value={formData.proxyUrl || ''}
            onChange={onChange}
            placeholder="Proxy URL (Optional)"
            className={errors.proxyUrl ? 'ring-red-500 focus:ring-red-500' : ''}
          />
          <FieldError message={errors.proxyUrl} />
        </div>
      </div>

      {error && (
        <div className="p-2 text-sm font-semibold leading-4 text-center text-red-500 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button size="md" onClick={onSubmit}>
          Start
        </Button>
        <Button
          size="md"
          variant="secondary"
          onClick={onBack}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyForm;
