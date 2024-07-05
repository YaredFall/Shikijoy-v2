import App from "@/app/react-app";
import ReactDOM from "react-dom/client";

function removeDefaultStyles() {
    const toDelete = Array<Element>();

    Array.from(document.head.children).forEach((c) => {
        if (c.tagName === "STYLE" || (c.tagName === "LINK" && c.getAttribute("type") === "text/css")) {
            toDelete.push(c);
        }
    });

    toDelete.forEach(c => document.head.removeChild(c));
}

function prepareDOM() {
    const usefulNodes = document.createElement("div");
    usefulNodes.classList.add("animejoy-original-dom", "hidden");
    usefulNodes.append(
        ...document.body.children,
    );

    document.body.textContent = null;

    const appEL = document.createElement("div");
    appEL.setAttribute("id", "app");
    document.body.appendChild(appEL);
    document.body.appendChild(usefulNodes);

    document.body.classList.add("show");
}

export function render() {
    ReactDOM.createRoot(document.getElementById("app")!).render(<App />);
}

export function prepareAndRender() {
    window.addEventListener("DOMContentLoaded", () => {

        if (document.title === "Just a moment...") {
            document.body.classList.add("show");
            return;
        }

        removeDefaultStyles();
        setTimeout(() => {
            prepareDOM();
            render();
        }, 0);

    });
}