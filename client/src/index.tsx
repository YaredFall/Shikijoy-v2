import { prepareAndRender, render } from "./init-utils";

console.log("ShikiJoy React app starting!");

if (document.querySelector("#app")) {
    // in dev (vite) environment
    render();
} else {
    // in build (extension) environment
    prepareAndRender();
}