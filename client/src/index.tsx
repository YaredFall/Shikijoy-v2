import { prepareAndRender, render } from "./app/init-utils";

console.log("ShikiJoy React app starting!");

if (document.querySelector("#app")) {
    // in dev (vite) environment
    render();
} else {
    // in build (extension) environment
    prepareAndRender();
}