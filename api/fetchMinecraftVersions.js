export const fetchMinecraftVersions = () => {
    const API_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            var filteredVersions = data.versions.filter(entry => 
                ['release', 'old_beta', 'old_alpha'].includes(entry.type)
            ).map(entry => ({
                "versionId": entry.id,
                "releaseTime": entry.releaseTime,
                "releaseType": entry.type
            }));
            const today = new Date().toISOString()
            console.log("DEBUG: fetchMinecraftVersions filteredVersions:", filteredVersions)
            chrome.storage.local.set({ versions: filteredVersions, versionsLastUpdated: today });
        })
        .catch(error => {
            console.log("Encountered an error while trying to fetch Minecraft versions list:", error.toString())
            chrome.storage.local.set({ versions: null, versionsLastUpdated: new Date(0), fetchVersionsError: error.toString() });
        })
}