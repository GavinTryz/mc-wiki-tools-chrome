

const injectControls = () => {
    const CONTROLS_HTML = `
    <div class="msgbox msgbox-blue" >
        
        <div style="width: 100%; text-align:left" >
            <div id="msgbox-text">
                <label fir="dropdownMCVersion">View this page for Minecraft version:</label>
                <select id="dropdownMCVersion" style="width: auto; min-width: 200px;" disabled>
                    <option value="option1">Load version list...</option>
                </select>
                <button id="buttonRefreshVersionList">Refresh list</button>
            </div>
        </div>
    </div>
    `;

    var contentDiv = document.getElementById('content');
    if (contentDiv) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = CONTROLS_HTML.trim();

        contentDiv.insertBefore(tempDiv.firstChild, contentDiv.firstChild)
    } else {
        console.log("Div 'content' not found");
    }
}

injectControls()

// Elements
refreshButton = document.getElementById("buttonRefreshVersionList")
versionDropdown = document.getElementById("dropdownMCVersion")

refreshButton.onclick = () => {
    chrome.runtime.sendMessage({ event: 'getMinecraftVersions' })
}

//chrome.storage.local.get(['something that doesnt exist'])

        