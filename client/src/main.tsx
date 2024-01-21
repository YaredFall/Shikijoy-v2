import App from "@/app";
import React from "react";
import ReactDOM from "react-dom/client";

let appEL = document.getElementById("app");
if (!appEL) {
    appEL = document.createElement("div");
    appEL.setAttribute("id", "app");
    document.body.appendChild(appEL);
}

ReactDOM.createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);