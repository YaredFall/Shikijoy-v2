console.log("injected player fixes");

// try {
//     // let tabId: number | undefined = undefined;
//     // const port = chrome.runtime.connect({ name: "fixes" });
//     // port.onMessage.addListener(function (msg) {
//     //     // console.log("Fixes got message: ", msg);
//     //     if (msg.tabId) {
//     //         tabId ||= msg.tabId;
//     //     } else if (tabId && tabId === msg.to) {
//     //         // idk
//     //     }
//     // });
//     // port.postMessage({ request: "tabId" });


//     const observer = new MutationObserver((mutationRecords) => {
//         if (!document.body) return;

//         const domain = document.domain;
//         let onKeyUp = undefined;
//         switch (domain) {
//             // AllVideo
//             case "secvideo1.online": {
//                 const frame = document.querySelector("iframe");
//                 if (frame) {
//                     frame.setAttribute("tabindex", "-1");
//                     onKeyUp = dealWithPlayerJS(15, 62, { playFlags: [mouseIn => !mouseIn], fsFlags: [mouseIn => !mouseIn] });
//                 }
//                 break;
//             }
//             // UStore
//             case "red.uboost.one": {
//                 // ! id of the buttons changed 1 number down. So it can be unstable
//                 const frame = document.querySelector("iframe");
//                 if (frame) {
//                     document.querySelectorAll("iframe").forEach(e => e.setAttribute("tabindex", "-1"));
//                     onKeyUp = dealWithPlayerJS(17, 99, { playFlags: [mouseIn => !mouseIn], fsFlags: [mouseIn => !mouseIn] });
//                 }
//                 break;
//             }
//             case "video.sibnet.ru": {
//                 const wrapper = document.querySelector("div#video_html5_wrapper");
//                 const videoEl = document.querySelector("video");
//                 if (wrapper && videoEl) {
//                     window.addEventListener("focus", () => {
//                         setTimeout(() => {
//                             wrapper.focus();
//                         }, 0);
//                     });
//                     observer.disconnect();
//                 }
//                 break;
//             }
//             case "animejoy.ru": {
//                 if (document.URL.startsWith("https://animejoy.ru/player/playerjs.html")) {
//                     onKeyUp = dealWithPlayerJS(17, 83, { playFlags: [mouseIn => !mouseIn], fsFlags: [mouseIn => !mouseIn] });
//                 }
//                 break;
//             }
//             case "vk.com": {
//                 const div = document.querySelector("div.videoplayer");
//                 if (div) {
//                     observer.disconnect();

//                     document.querySelectorAll(':is([tabindex="0"], a)').forEach((e) => {
//                         e.setAttribute("tabindex", "-1");
//                     });

//                     window.addEventListener("focus", () => {
//                         div.focus();
//                         console.log("focus");
//                     });
//                 }
//                 break;
//             }
//             case "dzen.ru": {
//                 const div = document.querySelectorAll(`div[tabindex="-1"]`)[1];
//                 if (div) {
//                     document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
//                         .forEach(e => e.setAttribute("tabindex", "-1"));
//                     observer.disconnect();
//                     let active = false;
//                     let muted = true;
//                     window.onfocus = (e) => {
//                         if (document.activeElement !== document.querySelector("._1gZJUfw"))
//                             active = false;
//                     };
//                     document.onclick = (e) => {
//                         if (!active && e.isTrusted) {
//                             active = true;
//                         }
//                     };
//                     onKeyUp = (e) => {
//                         console.log({ active });
//                         if (e.code === "Space" && !active) {
//                             const playBtn = document.querySelector('[data-control-name="play"]');
//                             if (playBtn) {
//                                 playBtn.click();
//                             } else {
//                                 div.click();
//                             }
//                             if (muted) {
//                                 const interval = setInterval(() => {
//                                     const muteDiv = document.querySelector('div[class][style="pointer-events: auto;"]');
//                                     if (muteDiv) {
//                                         muteDiv.click();
//                                         setTimeout(() => {
//                                             document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
//                                                 .forEach(e => e.setAttribute("tabindex", "-1"));
//                                         }, 0);
//                                         muted = false;
//                                         clearInterval(interval);
//                                     }
//                                 }, 50);
//                             }
//                         } else if (e.code === "KeyF") {
//                             const fsBtn = document.querySelector('[data-control-name="fullscreen"]');
//                             if (fsBtn) {
//                                 fsBtn.click();
//                                 if (muted && !active) {
//                                     const interval = setInterval(() => {
//                                         const mdivs = document.querySelectorAll('div[class][style="pointer-events: auto;"]');
//                                         if (mdivs.length > 1) {
//                                             mdivs[1].click();
//                                             let paused = false;
//                                             let noJokePaused = false;
//                                             const pauseInterval = setInterval(() => {
//                                                 document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
//                                                     .forEach(e => e.setAttribute("tabindex", "-1"));
//                                                 const videoEl = document.querySelector("video");
//                                                 if (videoEl.paused && noJokePaused) {
//                                                     clearInterval(pauseInterval);
//                                                 }
//                                                 if (paused && !videoEl.paused) {
//                                                     videoEl.pause();
//                                                     noJokePaused = true;
//                                                 }
//                                                 if (!paused && !videoEl.paused) {
//                                                     videoEl.pause();
//                                                     paused = true;
//                                                 }


//                                             }, 50);
//                                             muted = false;
//                                             clearInterval(interval);
//                                         }
//                                     }, 50);
//                                 }
//                                 active = true;
//                             }
//                         }
//                     };
//                 }

//                 break;
//             }
//             case "ok.ru": {
//                 const img = document.querySelector("img");
//                 if (img) {
//                     observer.disconnect();

//                     let active = false;

//                     img.parentElement.addEventListener("click", () => {
//                         active = true;
//                         setTimeout(() => {
//                             document.querySelectorAll(':is([tabindex="999"], a)').forEach((e) => {
//                                 e.setAttribute("tabindex", "-1");
//                             });
//                         }, 800);
//                     }, { once: true });

//                     onKeyUp = (e) => {
//                         if (e.code === "Space" && document.head.querySelector('script[src*="//ad.mail.ru"]')) {
//                             if (!active) {
//                                 img?.click();

//                                 setTimeout(() => {
//                                     document.querySelectorAll(':is([tabindex="999"], a)').forEach((e) => {
//                                         e.setAttribute("tabindex", "-1");
//                                     });
//                                 }, 800);
//                             }
//                             if (document.activeElement !== document.querySelector("#embedVideoE"))
//                                 document.querySelector(".html5-vpl_panel_btn.html5-vpl_play")?.click();
//                         }
//                         if (e.code === "KeyF" && document.head.querySelector('script[src*="//ad.mail.ru"]')) {
//                             if (!active) {
//                                 img?.click();
//                                 const interval = setInterval(() => {
//                                     const video = document.querySelector("video");
//                                     if (video) {
//                                         document.querySelector(".html5-vpl_panel_btn.html5-vpl_fullscreen")?.click();

//                                         const btn = document.querySelector(".html5-vpl_panel_btn.html5-vpl_play");
//                                         if (btn) {
//                                             setTimeout(() => {
//                                                 btn.click();
//                                                 document.querySelectorAll(':is([tabindex="999"], a)').forEach((e) => {
//                                                     e.setAttribute("tabindex", "-1");
//                                                 });
//                                             }, 800);
//                                             clearInterval(interval);
//                                         }
//                                     }
//                                 }, 50);
//                             } else {
//                                 if (document.activeElement !== document.querySelector("#embedVideoE"))
//                                     document.querySelector(".html5-vpl_panel_btn.html5-vpl_fullscreen")?.click();
//                             }
//                         }
//                     };
//                 }
//                 break;
//             }
//             case "mail.ru": {
//                 const video = document.querySelector("video");
//                 const fsBtn = document.querySelector(".b-video-controls__fullscreen-button");
//                 const playBtn = document.querySelector(".b-video-controls__play-button");


//                 if (video && fsBtn && playBtn) {
//                     document.querySelectorAll(':is([tabindex="0"], [tabindex="1"], a)').forEach((e) => {
//                         e.setAttribute("tabindex", "-1");
//                     });

//                     onKeyUp = (e) => {
//                         if (e.code === "KeyF") {
//                             fsBtn.click();
//                         }
//                         if (e.code === "Space") {
//                             if (document.activeElement !== document.querySelector("video")) {
//                                 playBtn.click();
//                             }
//                         }
//                     };

//                     observer.disconnect();
//                 }
//                 break;
//             }
//             // Kodik
//             case "aniqit.com":
//             case "kodik.cc": {
//                 const episodeSelect = document.querySelector(".serial-series-box>select");
//                 const dropdownContent = document.querySelector(".serial-series-box .dropdown-content");
//                 if (episodeSelect && dropdownContent) {
//                     observer.disconnect();

//                     port.postMessage({
//                         currentEpisodeID: episodeSelect.value - 1,
//                         episodesAvailable: episodeSelect.children.length,
//                     });

//                     dropdownContent.childNodes.forEach((div) => {
//                         div.addEventListener("click", () => {
//                             port.postMessage({
//                                 currentEpisodeID: div.getAttribute("data-link") - 1,
//                             });
//                         });
//                     });

//                     document.querySelector(".serial-next-button").addEventListener("click", () => {
//                         port.postMessage({
//                             currentEpisodeID: episodeSelect.value - 1,
//                         });
//                     });

//                     onKeyUp = (e) => {
//                         if (e.code === "Space") {
//                             document.querySelector(".fp-x-play")?.click() || document.querySelector(".play_button")?.click();
//                         }
//                     };
//                 }
//                 break;
//             }
//             // Alloha
//             case "politician.as.alloeclub.com": {
//                 const error = document.querySelector(".error_player");
//                 if (error) {
//                     port.postMessage({
//                         currentEpisodeID: 0,
//                         episodesAvailable: 0,
//                     });
//                 }

//                 const episodesSelect = document.querySelector(".list[data-episodes]");

//                 const a = document.querySelectorAll("pjsdiv");

//                 if (episodesSelect && a.length > 0) {
//                     observer.disconnect();

//                     const selectItems = episodesSelect.querySelectorAll(".list__drop button");

//                     try {
//                         port.postMessage({
//                             currentEpisodeID: episodesSelect.getAttribute("data-episodes") - 1,
//                             episodesAvailable: selectItems.length,
//                         });
//                     } catch (e) {
//                         location.reload(); // ?
//                     }

//                     const episodeObserver = new MutationObserver((mutationRecords) => {
//                         const newId = document.querySelector(".list[data-episodes]").getAttribute("data-episodes") - 1;
//                         port.postMessage({ currentEpisodeID: newId });
//                     });
//                     episodeObserver.observe(document.querySelector("[data-episodes]"), {
//                         attributeFilter: ["data-episodes"],
//                     });

//                     let mouseIn = false;
//                     document.addEventListener("mouseenter", () => {
//                         mouseIn = true;
//                     });
//                     document.addEventListener("mouseleave", () => {
//                         mouseIn = false;
//                     });

//                     const playBtn = a[17];
//                     const fsBtn = a[104];
//                     let evenSpacePress = false;

//                     onKeyUp = (e) => {
//                         console.log({ e, mouseIn });
//                         if (e.code === "Space" && !mouseIn) {
//                             if (!evenSpacePress) {
//                                 playBtn?.click();
//                             }
//                             evenSpacePress = !evenSpacePress;
//                         }
//                         if (e.code === "KeyF" && !mouseIn) {
//                             fsBtn?.click();
//                         }
//                     };

//                     // prevents unwanted behavior after player being clicked
//                     document.body.addEventListener("click", () => {
//                         document.removeEventListener("keyup", onKeyUp);
//                         evenSpacePress = false;
//                     });
//                 }
//                 break;
//             }
//             default: {
//                 console.warn("Unhandled domain:", domain);
//                 observer.disconnect();
//                 break;
//             }
//         }
//         if (onKeyUp) {
//             document.removeEventListener("keyup", onKeyUp);
//             document.body.addEventListener("focus", () => {
//                 document.removeEventListener("keyup", onKeyUp);
//                 console.log("got focus", document);
//             });
//             document.body.addEventListener("blur", () => {
//                 if (!document.fullscreenElement) {
//                     document.addEventListener("keyup", onKeyUp);
//                 }
//                 console.log("lost focus", document);
//             });
//             document.addEventListener("keyup", onKeyUp);
//             console.log("added keyup to", document);
//         }
//     });

//     // window.addEventListener("DOMContentLoaded", () => {
//     observer.observe(document, {
//         childList: true,
//         subtree: true,
//     });

//     // })


//     /**
//      *
//      * @param {number} playBtnId - play button id in document.querySelectorAll("pjsdiv") array
//      * @param {number} fsBtnId - fullscreen button id in document.querySelectorAll("pjsdiv") array
//      * @param {Object} [options] - options to tweak behavior
//      * @param {Array<(mouseIn?: boolean) => boolean>} [options.playFlags = []] - prevents play button click if at least one flag is false
//      * @param {Array<(mouseIn?: boolean) => boolean>} [options.fsFlags = []] - prevents fullscreen button click if at least one flag is false
//      */
//     function dealWithPlayerJS(
//         playBtnId,
//         fsBtnId,
//         options,
//     ) {
//         options = {
//             playFlags: options?.playFlags || [],
//             fsFlags: options?.fsFlags || [],
//         };

//         const a = document.querySelectorAll("pjsdiv");

//         if (a.length > 0) {
//             observer.disconnect();

//             let mouseIn = false;
//             document.addEventListener("mouseenter", () => {
//                 mouseIn = true;
//             });
//             document.addEventListener("mouseleave", () => {
//                 mouseIn = false;
//             });

//             const playBtn = a[playBtnId];
//             const fsBtn = a[fsBtnId];
//             const handler = (e) => {
//                 if (e.code === "Space" && options.playFlags.every(f => f(mouseIn) === true)) {
//                     playBtn?.click();
//                 }
//                 if (e.code === "KeyF" && options.fsFlags.every(f => f(mouseIn) === true)) {
//                     fsBtn?.click();
//                 }
//             };

//             // prevents unwanted behavior after player being clicked
//             document.body.addEventListener("click", (e) => {
//                 if (e.isTrusted) {
//                     document.removeEventListener("keyup", handler);
//                 }
//             }, true);
//             return handler;
//         } else
//             return undefined;
//     }
// } catch (e) {
//     console.error(e);
// }