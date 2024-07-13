import { fetchMinecraftVersions } from "./api/fetchMinecraftVersions.js";

chrome.runtime.onInstalled.addListener(() => {

    // Default to the latest
    chrome.storage.local.set({ versions: null, versionsLastUpdated: new Date(0), fetchVersionsError: null, lastSelected: null });

    console.log("DEBUG: Extension onInstalled! Refreshing versions list...")
    fetchMinecraftVersions();
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    const TAB_URL = new URL(tab.url)
    const BASE_URL = "https://minecraft.wiki"

    if (!TAB_URL.href.startsWith(BASE_URL)) { console.log("Does not start with base URL. Returning."); return }
    if (changeInfo.status !== 'complete') { console.log("Not complete. Returning."); return }
    if (!TAB_URL.pathname.startsWith("/w/")) { console.log("Path does not start with /w/. Returning"); return }
    if (TAB_URL.searchParams.has("veaction")) { console.log("Has veaction param. Returning."); return }
    if (TAB_URL.searchParams.has("action")) { console.log("Has action param. Returning."); return }
    if (TAB_URL.searchParams.has("oldid")) { console.log("Has oldid param. Returning."); return }
    if (/^\/w\/[^\/]*:([^\/]*\/)?/.test(TAB_URL.pathname)) { console.log("Has category. Returning."); return } // Test pathname for semicolons, indicating category. Don't run if there's a category (User:, Talk:, etc)

    // If the last version check failed or was over 12 hours old, get the list of versions again
    const { versions, versionsLastUpdated } = chrome.storage.local.get(["versions", "versionsLastUpdated"]);
    const HOURS_BETWEEN_FETCH = 12
    const today = new Date().toISOString()
    if ( versions === null || today - versionsLastUpdated > (1000 * 60 * 60 * HOURS_BETWEEN_FETCH)) {
        console.log("DEBUG: versions is null or old! Refreshing versions list...")
        fetchMinecraftVersions();
    }



    //chrome.tabs.sendMessage(tabId, { action: 'injectControls' });
});

chrome.runtime.onMessage.addListener(data => {
    const { event } = data

    switch (event) {
        case 'go':
            console.log("Clicked Go!");
            
    }
});


