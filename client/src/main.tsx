import { prepareAndRender, render } from "./init";

console.log("ShikiJoy React app starting!");

if (!document.querySelector("#app")) {
    prepareAndRender();
} else {
    render();
}