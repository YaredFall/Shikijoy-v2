// @ts-expect-error: crx specific api to load files
import playersFixes from "./playersFixes?script&module";

console.log("loaded bg script");
chrome.runtime.onInstalled.addListener(async (details) => {

    // let reactPorts = [];
    // let fixesPorts = [];
    // chrome.runtime.onConnect.addListener(function (port) {
    //     console.assert(port.name === "react" || port.name === "fixes");
    //     if (port.name === "react") {

    //         reactPorts = reactPorts.filter(rp => rp.sender.tab.id !== port.sender.tab.id);
    //         reactPorts.push(port);

    //         reactPorts.at(-1).onMessage.addListener(function (msg, sender) {
    //             if (msg.request) {
    //                 if (msg.request === "tabId") {
    //                     reactPorts.at(-1).postMessage({ tabId: sender.sender.tab.id });
    //                 }
    //             } else {
    //                 fixesPorts.find(fp => fp.sender.tab.id === sender.sender.tab.id)?.postMessage({ ...msg, to: sender.sender.tab.id });
    //             }
    //         });
    //     } else if (port.name === "fixes") {

    //         fixesPorts = fixesPorts.filter(fp => fp.sender.tab.id !== port.sender.tab.id);
    //         fixesPorts.push(port);

    //         fixesPorts.at(-1).onMessage.addListener(function (msg, sender) {
    //             if (msg.request) {
    //                 if (msg.request === "tabId") {
    //                     fixesPorts.at(-1).postMessage({ tabId: sender.sender.tab.id });
    //                 }
    //             } else {
    //                 reactPorts.find(rp => rp.sender.tab.id === sender.sender.tab.id)?.postMessage({ ...msg, to: sender.sender.tab.id });
    //             }
    //         });
    //     }
    // });

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