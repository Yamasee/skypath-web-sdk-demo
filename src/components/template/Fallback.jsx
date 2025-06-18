import { DOCS_URL } from '../../lib/constants';

const Fallback = ({ error, resetErrorBoundary }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-red-500">An error occurred</h1>
      <pre className="block p-4 mt-4 overflow-auto text-sm text-red-500 bg-red-100 rounded max-h-40">
        <code>{error.message || "An error occurred"}</code>
      </pre>
      <div className="flex flex-col items-center gap-4">
        <button
          className="px-4 py-2 mt-4 text-white transition-colors bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
        <p className="text-gray-600">
          Please check the{" "}
          <a
            href={DOCS_URL}
            className="mt-4 text-blue-500 underline transition-colors hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            documentation
          </a>{" "}
          for more information.
        </p>
      </div>
    </div>
  </div>
);

export default Fallback;
