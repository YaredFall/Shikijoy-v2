console.log("injected player fixes");

type Message = {
    type: "KeyboardEvent";
    data: {
        type: "keydown" | "keyup";
        code: "Space";
    };
};

try {
    let hasInitialFocus = false;

    const handlers: {
        current: { keydown?: (e: KeyboardEvent) => void; keyup?: (e: KeyboardEvent) => void; };
    } = {
        current: {},
    };

    document.addEventListener("keydown", (e) => {
        hasInitialFocus = true;
        handlers.current["keydown"]?.(e);
    });
    document.addEventListener("keyup", (e) => {
        handlers.current["keyup"]?.(e);
    });
    window.addEventListener("blur", () => {
        console.warn("blur");
        hasInitialFocus = false;
    });

    window.addEventListener("message", (e) => {
        if (e.origin !== "https://animejoy.ru") return;

        console.log(e);

        const message = e.data as Message;

        if (message.type === "KeyboardEvent") {
            handlers.current[message.data.type]?.(new KeyboardEvent(message.data.type, message.data));
        }
    });

    const observer = new MutationObserver((/* mutationRecords */) => {
        if (!document.body) return;

        const domain = document.domain;
        switch (domain) {
            // AllVideo
            case "secvideo1.online": {
                const frame = document.querySelector("iframe");
                if (frame) {
                    frame.setAttribute("tabindex", "-1");
                    // ! id of the buttons has changed once. So it can be unreliable
                    handlers.current = getPlayerJSHandlers(17, 69, { playFlags: [mouseIn => !mouseIn], fsFlags: [mouseIn => !mouseIn] });
                }
                break;
            }
            // UStore
            case "red.uboost.one": {
                // ! id of the buttons has changed once. So it can be unreliable
                const frame = document.querySelector("iframe");
                if (frame) {
                    document.querySelectorAll("iframe").forEach(e => e.setAttribute("tabindex", "-1"));
                    handlers.current = getPlayerJSHandlers(17, 99, { playFlags: [mouseIn => !mouseIn], fsFlags: [mouseIn => !mouseIn] });
                }
                break;
            }
            // case "video.sibnet.ru": {
            //     const wrapper = document.querySelector("div#video_html5_wrapper");
            //     const videoEl = document.querySelector("video");
            //     if (wrapper && videoEl) {
            //         window.addEventListener("focus", () => {
            //             setTimeout(() => {
            //                 wrapper.focus();
            //             }, 0);
            //         });
            //         observer.disconnect();
            //     }
            //     break;
            // }
            case "animejoy.ru": {
                if (document.URL.startsWith("https://animejoy.ru/player/playerjs.html")) {
                    handlers.current = getPlayerJSHandlers(17, 83, { playFlags: [mouseIn => !mouseIn], fsFlags: [mouseIn => !mouseIn] });
                }
                break;
            }
            // case "vk.com": {
            //     const div = document.querySelector("div.videoplayer");
            //     if (div) {
            //         observer.disconnect();

            //         document.querySelectorAll(':is([tabindex="0"], a)').forEach((e) => {
            //             e.setAttribute("tabindex", "-1");
            //         });

            //         window.addEventListener("focus", () => {
            //             div.focus();
            //             console.log("focus");
            //         });
            //     }
            //     break;
            // }
            // case "dzen.ru": {
            //     const div = document.querySelectorAll(`div[tabindex="-1"]`)[1];
            //     if (div) {
            //         document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
            //             .forEach(e => e.setAttribute("tabindex", "-1"));
            //         observer.disconnect();
            //         let active = false;
            //         let muted = true;
            //         window.onfocus = (e) => {
            //             if (document.activeElement !== document.querySelector("._1gZJUfw"))
            //                 active = false;
            //         };
            //         document.onclick = (e) => {
            //             if (!active && e.isTrusted) {
            //                 active = true;
            //             }
            //         };
            //         onKeyUp = (e) => {
            //             console.log({ active });
            //             if (e.code === "Space" && !active) {
            //                 const playBtn = document.querySelector('[data-control-name="play"]');
            //                 if (playBtn) {
            //                     playBtn.click();
            //                 } else {
            //                     div.click();
            //                 }
            //                 if (muted) {
            //                     const interval = setInterval(() => {
            //                         const muteDiv = document.querySelector('div[class][style="pointer-events: auto;"]');
            //                         if (muteDiv) {
            //                             muteDiv.click();
            //                             setTimeout(() => {
            //                                 document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
            //                                     .forEach(e => e.setAttribute("tabindex", "-1"));
            //                             }, 0);
            //                             muted = false;
            //                             clearInterval(interval);
            //                         }
            //                     }, 50);
            //                 }
            //             } else if (e.code === "KeyF") {
            //                 const fsBtn = document.querySelector('[data-control-name="fullscreen"]');
            //                 if (fsBtn) {
            //                     fsBtn.click();
            //                     if (muted && !active) {
            //                         const interval = setInterval(() => {
            //                             const mdivs = document.querySelectorAll('div[class][style="pointer-events: auto;"]');
            //                             if (mdivs.length > 1) {
            //                                 mdivs[1].click();
            //                                 let paused = false;
            //                                 let noJokePaused = false;
            //                                 const pauseInterval = setInterval(() => {
            //                                     document.querySelectorAll(':is(a, button, iframe, [tabindex="0"])')
            //                                         .forEach(e => e.setAttribute("tabindex", "-1"));
            //                                     const videoEl = document.querySelector("video");
            //                                     if (videoEl.paused && noJokePaused) {
            //                                         clearInterval(pauseInterval);
            //                                     }
            //                                     if (paused && !videoEl.paused) {
            //                                         videoEl.pause();
            //                                         noJokePaused = true;
            //                                     }
            //                                     if (!paused && !videoEl.paused) {
            //                                         videoEl.pause();
            //                                         paused = true;
            //                                     }


            //                                 }, 50);
            //                                 muted = false;
            //                                 clearInterval(interval);
            //                             }
            //                         }, 50);
            //                     }
            //                     active = true;
            //                 }
            //             }
            //         };
            //     }

            //     break;
            // }
            // case "ok.ru": {
            //     const img = document.querySelector("img");
            //     if (img) {
            //         observer.disconnect();

            //         let active = false;

            //         img.parentElement.addEventListener("click", () => {
            //             active = true;
            //             setTimeout(() => {
            //                 document.querySelectorAll(':is([tabindex="999"], a)').forEach((e) => {
            //                     e.setAttribute("tabindex", "-1");
            //                 });
            //             }, 800);
            //         }, { once: true });

            //         onKeyUp = (e) => {
            //             if (e.code === "Space" && document.head.querySelector('script[src*="//ad.mail.ru"]')) {
            //                 if (!active) {
            //                     img?.click();

            //                     setTimeout(() => {
            //                         document.querySelectorAll(':is([tabindex="999"], a)').forEach((e) => {
            //                             e.setAttribute("tabindex", "-1");
            //                         });
            //                     }, 800);
            //                 }
            //                 if (document.activeElement !== document.querySelector("#embedVideoE"))
            //                     document.querySelector(".html5-vpl_panel_btn.html5-vpl_play")?.click();
            //             }
            //             if (e.code === "KeyF" && document.head.querySelector('script[src*="//ad.mail.ru"]')) {
            //                 if (!active) {
            //                     img?.click();
            //                     const interval = setInterval(() => {
            //                         const video = document.querySelector("video");
            //                         if (video) {
            //                             document.querySelector(".html5-vpl_panel_btn.html5-vpl_fullscreen")?.click();

            //                             const btn = document.querySelector(".html5-vpl_panel_btn.html5-vpl_play");
            //                             if (btn) {
            //                                 setTimeout(() => {
            //                                     btn.click();
            //                                     document.querySelectorAll(':is([tabindex="999"], a)').forEach((e) => {
            //                                         e.setAttribute("tabindex", "-1");
            //                                     });
            //                                 }, 800);
            //                                 clearInterval(interval);
            //                             }
            //                         }
            //                     }, 50);
            //                 } else {
            //                     if (document.activeElement !== document.querySelector("#embedVideoE"))
            //                         document.querySelector(".html5-vpl_panel_btn.html5-vpl_fullscreen")?.click();
            //                 }
            //             }
            //         };
            //     }
            //     break;
            // }
            // case "mail.ru": {
            //     const video = document.querySelector("video");
            //     const fsBtn = document.querySelector(".b-video-controls__fullscreen-button");
            //     const playBtn = document.querySelector(".b-video-controls__play-button");


            //     if (video && fsBtn && playBtn) {
            //         document.querySelectorAll(':is([tabindex="0"], [tabindex="1"], a)').forEach((e) => {
            //             e.setAttribute("tabindex", "-1");
            //         });

            //         onKeyUp = (e) => {
            //             if (e.code === "KeyF") {
            //                 fsBtn.click();
            //             }
            //             if (e.code === "Space") {
            //                 if (document.activeElement !== document.querySelector("video")) {
            //                     playBtn.click();
            //                 }
            //             }
            //         };

            //         observer.disconnect();
            //     }
            //     break;
            // }
            // // Kodik
            // case "aniqit.com":
            // case "kodik.cc": {
            //     const episodeSelect = document.querySelector(".serial-series-box>select");
            //     const dropdownContent = document.querySelector(".serial-series-box .dropdown-content");
            //     if (episodeSelect && dropdownContent) {
            //         observer.disconnect();

            //         port.postMessage({
            //             currentEpisodeID: episodeSelect.value - 1,
            //             episodesAvailable: episodeSelect.children.length,
            //         });

            //         dropdownContent.childNodes.forEach((div) => {
            //             div.addEventListener("click", () => {
            //                 port.postMessage({
            //                     currentEpisodeID: div.getAttribute("data-link") - 1,
            //                 });
            //             });
            //         });

            //         document.querySelector(".serial-next-button").addEventListener("click", () => {
            //             port.postMessage({
            //                 currentEpisodeID: episodeSelect.value - 1,
            //             });
            //         });

            //         onKeyUp = (e) => {
            //             if (e.code === "Space") {
            //                 document.querySelector(".fp-x-play")?.click() || document.querySelector(".play_button")?.click();
            //             }
            //         };
            //     }
            //     break;
            // }
            // // Alloha
            // case "politician.as.alloeclub.com": {
            //     const error = document.querySelector(".error_player");
            //     if (error) {
            //         port.postMessage({
            //             currentEpisodeID: 0,
            //             episodesAvailable: 0,
            //         });
            //     }

            //     const episodesSelect = document.querySelector(".list[data-episodes]");

            //     const a = document.querySelectorAll("pjsdiv");

            //     if (episodesSelect && a.length > 0) {
            //         observer.disconnect();

            //         const selectItems = episodesSelect.querySelectorAll(".list__drop button");

            //         try {
            //             port.postMessage({
            //                 currentEpisodeID: episodesSelect.getAttribute("data-episodes") - 1,
            //                 episodesAvailable: selectItems.length,
            //             });
            //         } catch (e) {
            //             location.reload(); // ?
            //         }

            //         const episodeObserver = new MutationObserver((mutationRecords) => {
            //             const newId = document.querySelector(".list[data-episodes]").getAttribute("data-episodes") - 1;
            //             port.postMessage({ currentEpisodeID: newId });
            //         });
            //         episodeObserver.observe(document.querySelector("[data-episodes]"), {
            //             attributeFilter: ["data-episodes"],
            //         });

            //         let mouseIn = false;
            //         document.addEventListener("mouseenter", () => {
            //             mouseIn = true;
            //         });
            //         document.addEventListener("mouseleave", () => {
            //             mouseIn = false;
            //         });

            //         const playBtn = a[17];
            //         const fsBtn = a[104];
            //         let evenSpacePress = false;

            //         onKeyUp = (e) => {
            //             console.log({ e, mouseIn });
            //             if (e.code === "Space" && !mouseIn) {
            //                 if (!evenSpacePress) {
            //                     playBtn?.click();
            //                 }
            //                 evenSpacePress = !evenSpacePress;
            //             }
            //             if (e.code === "KeyF" && !mouseIn) {
            //                 fsBtn?.click();
            //             }
            //         };

            //         // prevents unwanted behavior after player being clicked
            //         document.body.addEventListener("click", () => {
            //             document.removeEventListener("keyup", onKeyUp);
            //             evenSpacePress = false;
            //         });
            //     }
            //     break;
            // }
            default: {
                console.warn("Unhandled domain:", domain);
                observer.disconnect();
                break;
            }
        }

    });

    // window.addEventListener("DOMContentLoaded", () => {
    observer.observe(document, {
        childList: true,
        subtree: true,
    });

    // })

    /**
     *
     * @param {number} playBtnId - play button id in document.querySelectorAll("pjsdiv") array
     * @param {number} fsBtnId - fullscreen button id in document.querySelectorAll("pjsdiv") array
     * @param {Object} [options] - options to tweak behavior
     * @param {Array<(mouseIn?: boolean) => boolean>} [options.playFlags = []] - prevents play button click if at least one flag is false
     * @param {Array<(mouseIn?: boolean) => boolean>} [options.fsFlags = []] - prevents fullscreen button click if at least one flag is false
     */
    // eslint-disable-next-line no-inner-declarations
    function getPlayerJSHandlers(
        playBtnId: number,
        fsBtnId: number,
        options: {
            playFlags: Array<(mouseIn?: boolean) => boolean>;
            fsFlags: Array<(mouseIn?: boolean) => boolean>;
        },
    ) {
        options = {
            playFlags: options?.playFlags || [],
            fsFlags: options?.fsFlags || [],
        };

        const els = document.querySelectorAll("pjsdiv");


        if (!els.length) return {};

        observer.disconnect();

        let mouseIn = false;
        document.addEventListener("mouseenter", () => {
            mouseIn = true;
        });
        document.addEventListener("mouseleave", () => {
            mouseIn = false;
        });

        const playBtn = els[playBtnId] as HTMLElement;
        const fsBtn = els[fsBtnId] as HTMLElement;

        console.log({ playBtn, fsBtn });

        let clicked = false;

        const onKeyUp = (e: KeyboardEvent) => {


            if (e.code === "KeyF" && options.fsFlags.every(f => f(mouseIn) === true) && !clicked) {
                console.log("F", { clicked, hasInitialFocus });
                if (!hasInitialFocus) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                } else {

                    fsBtn?.click();
                }
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {

            if (clicked) return;

            const v = document.querySelector("video");

            switch (e.code) {
                case "Space":
                    if (!options.playFlags.every(f => f(mouseIn) === true)) return;

                    console.log("SPACE", { clicked, hasInitialFocus });
                    playBtn?.click();
                    break;
                case "ArrowRight":
                    v && (v.currentTime += 5);
                    break;
                case "ArrowLeft":
                    v && (v.currentTime -= 5);
                    break;
                default:
                    break;
            } /* else if (e.code === "Escape") {
                console.log("ESCAPE");
                if (document.fullscreenElement) {
                    fsBtn?.click();
                }
            } */
        };

        // prevents unwanted behavior after player being clicked
        document.body.addEventListener("click", (e) => {
            if (e.isTrusted) {
                clicked = true;
                // document.removeEventListener("keyup", onKeyUp);
                // document.removeEventListener("keydown", onKeyDown);
            }
        }, true);

        window.addEventListener("blur", () => {
            clicked = false;
        });

        return {
            keyup: onKeyUp,
            keydown: onKeyDown,
        };
    }


} catch (e) {
    console.error(e);
}