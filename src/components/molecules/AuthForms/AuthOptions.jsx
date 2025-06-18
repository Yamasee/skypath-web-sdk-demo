import { Button } from '../../atoms/Button';
import { AUTH_OPTIONS } from '../../../lib/validation/authSchemas';

const AuthOptions = ({ onSelectOption }) => {
  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md">
      <h3 className="text-lg font-semibold leading-6 text-center text-gray-900">
        Select authorization option
      </h3>
      <div className="flex gap-2">
        <Button onClick={() => onSelectOption(AUTH_OPTIONS.API_KEY)}>
          API Key
        </Button>
        <Button onClick={() => onSelectOption(AUTH_OPTIONS.SIGNED_JWT)}>
          Signed JWT
        </Button>
      </div>
    </div>
  );
};

export default AuthOptions;
