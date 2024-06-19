// showdownmovetots.js

console.log("EXTREMESPEED DETECTS SHOWDOWN REG G GAME");

let lastCheckedURL = '';
let opponentUsername = '';

function checkURL() {
    const urlPattern = /https:\/\/play\.pokemonshowdown\.com\/battle-gen9vgc2024regg-/;
    const suffixPattern = /https:\/\/play\.pokemonshowdown\.com\/battle-gen9vgc2024regg-(.*)/;

    if (urlPattern.test(window.location.href) && window.location.href !== lastCheckedURL) {
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
                    if (opponentName === opponentUsername) {
                        console.log(`Open Team sheet for ${opponentName} is present`);

                        // Find the infobox element
                        const infoboxElement = summary.parentElement;
                        if (infoboxElement) {
                            // Find the battle controls element
                            const battleControls = document.querySelector('.battle-controls');
                            if (battleControls) {
                                // Clone the infobox element and retain its class
                                const infoboxClone = infoboxElement.cloneNode(true);
                                infoboxClone.classList.add('infobox');
                                
                                // Adjust the styles
                                infoboxClone.style.fontSize = '10px';
                                infoboxClone.style.display = 'block';

                                // Trying to extract only the first Pokémon entry, not working atm
                                const details = infoboxClone.querySelector('details');
                                if (details) {
                                    const piconElements = details.querySelectorAll('.picon');
                                    if (piconElements.length > 1) {
                                        let firstPokemonHtml = '';
                                        let foundFirst = false;
                                        details.childNodes.forEach(node => {
                                            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('picon')) {
                                                if (!foundFirst) {
                                                    foundFirst = true;
                                                    firstPokemonHtml += node.outerHTML;
                                                }
                                            } else if (foundFirst) {
                                                firstPokemonHtml += node.outerHTML;
                                            }
                                        });
                                        details.innerHTML = firstPokemonHtml;
                                    }
                                }

                                // Append the cloned infobox below the battle controls
                                battleControls.appendChild(infoboxClone);
                                console.log("Infobox cloned, styled, and moved below battle controls with only the first Pokémon.");
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
    }
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
