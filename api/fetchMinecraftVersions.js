export const fetchMinecraftVersions = () => {
    const API_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            var filteredVersions = data.versions.filter(entry => 
                ['release', 'old_beta', 'old_alpha'].includes(entry.type)
            ).map(entry => ({
                "version": entry.id,
                "releaseTime": entry.releaseTime,
                "type": entry.type
            }));
            const today = new Date().toISOString()
            chrome.storage.local.set({ versions: filteredVersions, versionsLastUpdated: today });
        })
        .catch(error => {
            console.log(error)
        })
}