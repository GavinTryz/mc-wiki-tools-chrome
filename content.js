

const injectControls = () => {
    const CONTROLS_HTML = `
    <div class="msgbox msgbox-blue" style="max-width: 90%;">
        <div style="width: 100%; text-align:left" >
            <div id="msgbox-text">
                <div>
                <label for="dropdownMCVersion">View this page for Minecraft Java Edition version:</label>
                    <select id="dropdownMCVersion" style="width: auto; min-width: 200px;" disabled>
                        <option value="x" id="dropdownMCVersionPlaceholder">Failed to load version list!</option>
                    </select>
                    <button id="buttonGo" disabled>Go</button>
                </div>
                <div style="padding-top: 10px;">
                    <p id="errorMessage" style="color: red;" disabled></p>
                </div>
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
let goButton = document.getElementById("buttonGo");
let versionDropdown = document.getElementById("dropdownMCVersion");
let errorMessage = document.getElementById("errorMessage")

goButton.onclick = () => {
    chrome.runtime.sendMessage({ event: 'go' })
}

const setVersions = () => {
    chrome.storage.local.get(["versions", "lastSelected", "fetchVersionsError"], (results) => {
        const {versions, lastSelected, fetchVersionsError} = results
        console.log("DEBUG: versions:", versions)
        console.log("DEBUG: lastSelected:", lastSelected)
        console.log("DEBUG: fetchVersionsError:", fetchVersionsError)
    
    
        if (versions === null || versions === undefined) {
            errorMessage.innerText = "Encountered an error while trying to get the list of Minecraft versions: " + fetchVersionsError
            errorMessage.disabled = false;
            versionDropdown.disabled = true;
            goButton.disabled = true;
            return
        }
    
        versions.forEach(version => {
            let optionElement = document.createElement("option");
            optionElement.innerHTML = version.version_id;
            optionElement.value = version.releaseTime;
            versionDropdown.appendChild(optionElement);
        })
    
        let placeholderElement = document.getElementById("dropdownMCVersionPlaceholder")
        versionDropdown.removeChild(placeholderElement)
    
        versionDropdown.disabled = false;
        goButton.disabled = false;
        errorMessage.disabled = true;

    })
}

setVersions()

        