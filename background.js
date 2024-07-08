import { fetchMinecraftVersions } from "./api/fetchMinecraftVersions.js";

chrome.runtime.onInstalled.addListener(() => {
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

    // Update the list of versions if this is the first time minecraft.wiki was visited today
    const today = new Date().toISOString();
    const { versionsLastUpdated } = chrome.storage.local.get(["versionsLastUpdated"]);

    if (versionsLastUpdated !== today) {
        fetchMinecraftVersions();
    }



    //chrome.tabs.sendMessage(tabId, { action: 'injectControls' });
});

chrome.runtime.onMessage.addListener(data => {
    const { event } = data

    switch (event) {
        case 'getMinecraftVersions':
            console.log("Clicked!")
            fetchMinecraftVersions();
            chrome.storage.local.get("versionsLastUpdated", (result) => {
                console.log("result:", result)
            });
            
    }
});


