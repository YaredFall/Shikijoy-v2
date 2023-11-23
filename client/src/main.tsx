import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const appEL = document.createElement("div");
appEL.setAttribute("id", "app");
document.body.appendChild(appEL);

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
