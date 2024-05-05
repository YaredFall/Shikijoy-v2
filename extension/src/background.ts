// @ts-expect-error: crx specific api to load files
import playersFixes from "./playersFixes?script&module";

console.log("loaded bg script");
chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        chrome.storage.local.set({ enabled: true, usePlayersFixes: true });
    } else if (details.reason === "update") {
        const data = await chrome.storage.local.get(["enabled", "usePlayersFixes"]);
        if (data.enabled) {
            if (data.usePlayersFixes) {
                injectFixes();
            }
            injectMainScript();
            refreshAnimeJoyTabs();
        }
    }
});

const injectMainScript = async () => {
    const script = {
        id: "clientScript",
        matches: ["https://*.animejoy.ru/*"],
        excludeMatches: [
            "https://*.animejoy.ru/engine/*",
            "https://*.animejoy.ru/uploads/*",
            "https://*.animejoy.ru/*.png",
        ],
        runAt: "document_start" as const,
        js: ["/client/index.js"],
        css: ["/client/index.css"],
    };
    return await chrome.scripting.registerContentScripts([script], () => {
        console.log("injected React client script");
    });
};

const ejectMainScript = async () => {
    return await chrome.scripting.unregisterContentScripts({ ids: ["clientScript"] }, () => {
        console.log("ejected React client script");
    });
};

const injectFixes = async () => {
    const script = {
        id: "playersFixes",
        allFrames: true,
        matches: [
            "*://animejoy.ru/*",
            "*://secvideo1.online/*",
            "*://red.uboost.one/*",
            "*://video.sibnet.ru/*",
            "*://vk.com/*",
            "*://dzen.ru/*",
            "*://ok.ru/*",
            "*://*.mail.ru/*",
            "*://aniqit.com/*",
            "*://kodik.cc/*",
            "*://politician.as.alloeclub.com/*",
        ],
        runAt: "document_start" as const,
        js: [playersFixes],
    };
    return await chrome.scripting.registerContentScripts([script], () => {
        console.log("injected Player fixes script");
    });
};

const ejectFixes = async () => {
    return await chrome.scripting.unregisterContentScripts({ ids: ["playersFixes"] }, () => {
        console.log("ejected Player fixes script");
    });
};

chrome.storage.onChanged.addListener(async (changes, area) => {
    console.log({ changes, area });

    if (changes.enabled && changes.enabled.newValue === true) {
        const data = await chrome.storage.local.get(["usePlayersFixes"]);
        if (data.usePlayersFixes)
            injectFixes();
        injectMainScript();
        refreshAnimeJoyTabs();
    } else if (changes.enabled && changes.enabled.newValue === false) {
        const data = await chrome.storage.local.get(["usePlayersFixes"]);
        if (data.usePlayersFixes)
            ejectFixes();
        ejectMainScript();
        refreshAnimeJoyTabs();
    } else if (changes.usePlayersFixes && changes.usePlayersFixes.newValue === true) {
        const data = await chrome.storage.local.get(["enabled"]);
        if (data.enabled) {
            injectFixes();
            refreshAnimeJoyTabs();
        }
    } else if (changes.usePlayersFixes && changes.usePlayersFixes.newValue === false) {
        const data = await chrome.storage.local.get(["enabled"]);
        if (data.enabled) {
            ejectFixes();
            refreshAnimeJoyTabs();
        }
    }
});

async function refreshAnimeJoyTabs() {
    const queryOptions = { url: "https://animejoy.ru/*" };
    const tabs = await chrome.tabs.query(queryOptions);
    if (tabs) {
        tabs.forEach(tab => tab.id && chrome.tabs.reload(tab.id, { bypassCache: true }));
    }
}