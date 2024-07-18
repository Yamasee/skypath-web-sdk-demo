const DOCS_URL = "https://docs.skypath.io/js/introduction/";

const Fallback = ({ error, resetErrorBoundary }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-red-500">An error occurred</h1>
      <code className="block p-4 mt-4 text-red-500 bg-red-100 rounded">
        {error.message || "An error occurred"}
      </code>
      <div className="flex flex-col items-center gap-4">
        <button
          className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
        <p>
          Please check the{" "}
          <a
            href={DOCS_URL}
            className="mt-4 text-blue-500 underline"
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
