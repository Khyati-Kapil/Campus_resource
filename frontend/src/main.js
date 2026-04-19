import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
const container = document.getElementById("root");
if (container) {
    createRoot(container).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }));
}
