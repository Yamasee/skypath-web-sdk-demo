import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";
import AuthWrapper from "./AuthWrapper.jsx";
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./components/template/Fallback.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <AuthWrapper>
        {(sdk) => <App sdk={sdk} />}
      </AuthWrapper>
    </ErrorBoundary>
  </React.StrictMode>
);
