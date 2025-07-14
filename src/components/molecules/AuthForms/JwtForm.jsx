import { TextInput } from '../../atoms/TextInput';
import { Button } from '../../atoms/Button';

const FieldError = ({ message }) => (
  message ? <div className="mt-1 text-xs text-red-500">{message}</div> : null
);

const JwtForm = ({ formData, onChange, onSubmit, onBack, error, errors = {} }) => {
  return (
    <div className="space-y-6">
      <div className="relative space-y-4 rounded-md shadow-sm">
        <div>
          <TextInput
            name="signedJwt"
            type="text"
            value={formData.signedJwt || ''}
            onChange={onChange}
            placeholder="Signed JWT"
            className={errors.signedJwt ? 'ring-red-500 focus:ring-red-500' : ''}
          />
          <FieldError message={errors.signedJwt} />
        </div>
        
        <div>
          <TextInput
            name="partnerId"
            type="text"
            value={formData.partnerId || ''}
            onChange={onChange}
            placeholder="Partner ID"
            className={errors.partnerId ? 'ring-red-500 focus:ring-red-500' : ''}
          />
          <FieldError message={errors.partnerId} />
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

export default JwtForm; 