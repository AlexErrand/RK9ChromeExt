// showdownmovetots.js
//Issue for loading in tab other than battle tab fixed, but need to fix issues regarding the agreement of open sheet
//issue staying loaded on the page after the user begins selecting pokemon or moves on Best of 3 ladder
console.log("EXTREMESPEED DETECTS SHOWDOWN REG G GAME");

let lastCheckedURL = '';
let opponentUsername = '';
let infoboxCloned = false;

function checkURL() {
    const urlPattern = /https:\/\/play\.pokemonshowdown\.com\/battle-gen9vgc2024regg(?:bo3)?-/;
    const suffixPattern = /https:\/\/play\.pokemonshowdown\.com\/battle-gen9vgc2024regg(?:bo3)?-(.*)/;
    const excludePattern = /https:\/\/play\.pokemonshowdown\.com\/game-bestof3-gen9vgc2024regg-/;

    if (urlPattern.test(window.location.href) && !excludePattern.test(window.location.href)) {
        const match = window.location.href.match(suffixPattern);
        const suffix = match ? match[1] : 'No suffix found';

        console.log("New Pokémon Showdown Regulation G game detected.");
        console.log("URL suffix:", suffix);

        lastCheckedURL = window.location.href; // Update the last checked URL

        // Extract the opponent's username from the right trainer bar
        const opponentTrainerBar = document.querySelector('.rightbar[aria-label="Opponent\'s Team"]');
        if (opponentTrainerBar) {
            const strongElement = opponentTrainerBar.querySelector('strong');
            if (strongElement) {
                opponentUsername = strongElement.textContent.trim();
                console.log("OPPONENT USERNAME IS: " + opponentUsername);
            } else {
                console.log("No strong element found in opponent's trainer bar.");
            }
        } else {
            console.log("Opponent's trainer bar not found.");
        }

        // Get the current user's username from the data-name attribute
        const usernameElement = document.querySelector('.userbar .username');
        if (usernameElement) {
            const currentUsername = usernameElement.getAttribute('data-name').trim();
            console.log("CURRENT USER IS: " + currentUsername);

            // Check for the infobox with the opponent's name
            const infoboxes = document.querySelectorAll('.infobox details summary');
            infoboxes.forEach(summary => {
                const summaryText = summary.textContent || summary.innerText;
                const opponentNameMatch = summaryText.match(/Open Team Sheet for (.+)/);
                if (opponentNameMatch) {
                    const opponentName = opponentNameMatch[1].trim();
                    if (opponentName === opponentUsername && !infoboxCloned) {
                        console.log(`Open Team sheet for ${opponentName} is present`);

                        // Find the infobox element
                        const infoboxElement = summary.parentElement;
                        if (infoboxElement) {
                            // Find the battle controls element
                            const battleControls = document.querySelector('.battle-controls');
                            if (battleControls) {
                                // Remove any existing cloned infoboxes
                                const existingClones = battleControls.querySelectorAll('.infobox.clone');
                                existingClones.forEach(clone => clone.remove());

                                // Clone the infobox element and retain its class
                                const infoboxClone = infoboxElement.cloneNode(true);
                                infoboxClone.classList.add('infobox', 'clone');
                                
                                // Adjust the styles
                                infoboxClone.style.fontSize = '10px';
                                infoboxClone.style.display = 'block';

                                // Append the cloned infobox below the battle controls
                                battleControls.appendChild(infoboxClone);
                                console.log("Infobox cloned, styled, and moved below battle controls.");

                                // Mark the infobox as cloned
                                infoboxCloned = true;
                            } else {
                                console.log("Battle controls element not found.");
                            }
                        } else {
                            console.log("Infobox element not found.");
                        }
                    } else {
                        console.log(`Skipping infobox for: ${opponentName}`);
                    }
                }
            });
        } else {
            console.log("Username element not found.");
        }
    } else {
        console.log("URL does not match the pattern for Regulation G game or is a Best of 3 game.");
    }
}

// Function to check periodically if the infobox is loaded
function checkForInfobox() {
    console.log("Checking for infobox...");
    checkURL();
}

// Initial check when the script loads
checkURL();

// Listen for URL changes using history API methods
const pushState = history.pushState;
history.pushState = function() {
    pushState.apply(history, arguments);
    checkURL();
};

const replaceState = history.replaceState;
history.replaceState = function() {
    replaceState.apply(history, arguments);
    checkURL();
};

window.addEventListener('popstate', checkURL);

// MutationObserver to detect changes in the DOM that may correspond to URL changes
const observer = new MutationObserver(checkURL);
observer.observe(document.body, { childList: true, subtree: true });

// Set an interval to check for the infobox periodically
setInterval(checkForInfobox, 2000);
