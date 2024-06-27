import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";
import AuthWrapper from "./AuthWrapper.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AuthWrapper>
      {(credentials) => <App credentials={credentials} />}
    </AuthWrapper>
  </React.StrictMode>
);