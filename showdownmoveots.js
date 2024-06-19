// showdownmovetots.js
//this version technically works, but the OTS has to be loaded prior, as when starting a new game it will load in the bo3 tab
console.log("EXTREMESPEED DETECTS SHOWDOWN REG G GAME");

let lastCheckedURL = '';
let opponentUsername = '';

// Function to check if the current page is a Regulation G game
function checkRegulationGGame() {
    const urlPattern = /https:\/\/play\.pokemonshowdown\.com\/battle-gen9vgc2024regg(?:bo3)?-/;
    const suffixPattern = /https:\/\/play\.pokemonshowdown\.com\/battle-gen9vgc2024regg(?:bo3)?-(.*)/;

    if (urlPattern.test(window.location.href)) {
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

            // Start checking for the infobox every 2 seconds
            const infoboxCheckInterval = setInterval(() => {
                console.log("Checking for infobox...");
                const infoboxes = document.querySelectorAll('.infobox details summary');
                let infoboxFound = false;

                infoboxes.forEach(summary => {
                    const summaryText = summary.textContent || summary.innerText;
                    const opponentNameMatch = summaryText.match(/Open Team Sheet for (.+)/);
                    if (opponentNameMatch) {
                        const opponentName = opponentNameMatch[1].trim();
                        if (opponentName === opponentUsername) {
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

                                    infoboxFound = true;
                                    clearInterval(infoboxCheckInterval);
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

                if (!infoboxFound) {
                    console.log("Infobox not found, continuing to check...");
                }
            }, 2000);
        } else {
            console.log("Username element not found.");
        }
    }
}

// Initial check when the script loads
checkRegulationGGame();

// Listen for URL changes using history API methods
const pushState = history.pushState;
history.pushState = function() {
    pushState.apply(history, arguments);
    checkRegulationGGame();
};

const replaceState = history.replaceState;
history.replaceState = function() {
    replaceState.apply(history, arguments);
    checkRegulationGGame();
};

window.addEventListener('popstate', checkRegulationGGame);

// MutationObserver to detect changes in the DOM that may correspond to URL changes
const observer = new MutationObserver(checkRegulationGGame);
observer.observe(document.body, { childList: true, subtree: true });
