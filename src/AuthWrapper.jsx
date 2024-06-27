import { useState } from "react";

const AuthWrapper = ({children}) => {
  const [credentials, setCredentials] = useState();

  const handleSubmitCredentials = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const skypathApiKey = formData.get("skypath-api-key");
    const mapboxApiKey = formData.get("mapbox-api-key");
    const skypathBaseUrl = formData.get("skypath-base-url");

    if (skypathApiKey?.trim()?.length < 20) {
      alert("Please provide a valid SkyPath API Key");
      return;
    }
    if (mapboxApiKey?.trim()?.length < 80) {
      alert("Please provide a valid Mapbox API Key");
      return;
    }
    if (skypathBaseUrl?.trim()?.length < 5) {
      alert("Please provide a valid SkyPath Base URL");
      return;
    }

    setCredentials({
      skypathApiKey,
      mapboxApiKey,
      skypathBaseUrl,
    });
  };

  if (credentials) {
    return children(credentials);
  }

  return (
    <div className="flex items-center justify-center flex-1 min-h-full px-4 py-12 select-none sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div>
          <img
            className="w-auto h-5 mx-auto pointer-events-none"
            src="/public/favicon.ico"
            alt="SkyPath LTD"
          />
          <h2 className="mt-3 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            Provide your credentials
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmitCredentials}>
          <div className="relative -space-y-px rounded-md shadow-sm">
            <div className="absolute inset-0 z-10 rounded-md pointer-events-none ring-1 ring-inset ring-gray-300" />
            <div>
              <label htmlFor="skypath-api-key" className="sr-only">
                SkyPath API Key
              </label>
              <input
                id="skypath-api-key"
                name="skypath-api-key"
                type="text"
                required
                className="relative text-center block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:outline-violet-600 sm:text-sm sm:leading-6 px-8"
                placeholder="SkyPath API Key"
              />
            </div>
            <div>
              <label htmlFor="mapbox-api-key" className="sr-only">
                Mapbox API Key
              </label>
              <input
                id="mapbox-api-key"
                name="mapbox-api-key"
                type="text"
                required
                className="relative text-ellipsis text-center block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:outline-violet-600 sm:text-sm sm:leading-6 px-8"
                placeholder="Mapbox API Key"
              />
            </div>
            <div>
              <label htmlFor="skypath-base-url" className="sr-only">
                SkyPath Base URL
              </label>
              <input
                id="skypath-base-url"
                name="skypath-base-url"
                defaultValue={"api.skypath.io"}
                type="text"
                required
                className="relative text-center block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:outline-violet-600 sm:text-sm sm:leading-6 px-8"
                placeholder="SkyPath Base URL"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Start
            </button>
          </div>
        </form>

        <p className="text-sm leading-6 text-center text-gray-500">
          {"Don't have credentials yet? "}
          <a
            href="https://skypath.io/start_a_trial/"
            className="font-semibold text-violet-600 hover:text-violet-500 focus:outline-violet-600"
          >
            Start a trial
          </a>
        </p>
      </div>
    </div>
  );
}

export default AuthWrapper;