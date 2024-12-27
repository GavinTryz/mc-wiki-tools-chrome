

const injectControls = () => {
    const CONTROLS_HTML = `
    <div class="msgbox msgbox-yellow" style="max-width: 90%;">
        <div style="width: 100%; text-align:left" >
            <div id="msgbox-text">
                <div>
                <label for="dropdownMCVersion">View this page for Minecraft Java Edition version:</label>
                    <select id="dropdownMCVersion" style="width: auto; min-width: 200px;" disabled>
                        <option value="x" id="dropdownMCVersionPlaceholder">Failed to load version list!</option>
                    </select>
                    <button id="buttonGo" disabled>Go</button>
                    <p id="errorMessage" style="color: red;" hidden>Error message</p>
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


    // Elements
    let goButton = document.getElementById("buttonGo");
    let versionDropdown = document.getElementById("dropdownMCVersion");
    let errorMessage = document.getElementById("errorMessage")

    // Populate 
    chrome.storage.local.get(["versions", "selectedVersion", "fetchVersionsError"], (results) => {
        const {versions, selectedVersion, fetchVersionsError} = results
        console.log("DEBUG: versions:", versions)
        console.log("DEBUG: selectedVersion:", selectedVersion)
        console.log("DEBUG: fetchVersionsError:", fetchVersionsError)
    
        if (versions === null || versions === undefined) {
            errorMessage.innerText = "Encountered an error while trying to get the list of Minecraft versions: " + fetchVersionsError
            errorMessage.hidden = false;
            versionDropdown.disabled = true;
            goButton.disabled = true;
            return
        }

        // Create option groups
        let releaseOptGroup = document.createElement("optgroup");
        releaseOptGroup.label = "Release";
        versionDropdown.appendChild(releaseOptGroup);
        let betaOptGroup = document.createElement("optgroup");
        betaOptGroup.label = "Beta";
        versionDropdown.appendChild(betaOptGroup);
        let alphaOptGroup = document.createElement("optgroup");
        alphaOptGroup.label = "Alpha";
        versionDropdown.appendChild(alphaOptGroup);
    
        versions.forEach(version => {
            let optionElement = document.createElement("option");
            optionElement.innerHTML = version.versionId;
            optionElement.value = version.versionId;
            switch (version.releaseType) {
                case 'release':
                    releaseOptGroup.appendChild(optionElement);
                    break;
                case 'old_beta':
                    betaOptGroup.appendChild(optionElement);
                    break;
                case 'old_alpha':
                    alphaOptGroup.appendChild(optionElement);
                    break;
                default:
                    alphaOptGroup.appendChild(optionElement);
                    break;
            }
        })
    
        let placeholderElement = document.getElementById("dropdownMCVersionPlaceholder")
        versionDropdown.removeChild(placeholderElement)
    
        versionDropdown.disabled = false;
        goButton.disabled = false;
        errorMessage.hidden = true;

    })

    goButton.onclick = () => {
        selection = versionDropdown.value
        chrome.storage.local.set({ selectedVersion: selection });
        chrome.runtime.sendMessage({ event: 'go' })
    }
}

chrome.runtime.onMessage.addListener(data => {
    const { action } = data

    switch (action) {
        case 'injectControls':
            console.log("DEBUG: injecting controls...");
            injectControls();
            break;
            
    }
});