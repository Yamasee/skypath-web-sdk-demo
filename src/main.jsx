import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App.jsx";
import AuthWrapper from "./AuthWrapper.jsx";
import Fallback from "./components/template/Fallback.jsx";

import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <AuthWrapper>
        {(sdk) => <App sdk={sdk} />}
      </AuthWrapper>
    </ErrorBoundary>
  </React.StrictMode>
);
