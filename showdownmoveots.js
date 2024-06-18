// showdownmovetots.js

console.log("EXTREMESPEED DETECTS SHOWDOWN REG G GAME");

let lastCheckedURL = '';

function checkURL() {
    const urlPattern = /https:\/\/play\.pokemonshowdown\.com\/battle-gen9vgc2024regg-/;
    const suffixPattern = /https:\/\/play\.pokemonshowdown\.com\/battle-gen9vgc2024regg-(.*)/;

    if (urlPattern.test(window.location.href) && window.location.href !== lastCheckedURL) {
        const match = window.location.href.match(suffixPattern);
        const suffix = match ? match[1] : 'No suffix found';

        console.log("New Pokémon Showdown Regulation G game detected.");
        console.log("URL suffix:", suffix);

        lastCheckedURL = window.location.href; // Update the last checked URL

        // Check for the infobox with the opponent's name
        const infoboxes = document.querySelectorAll('.infobox details summary');
        
        infoboxes.forEach(summary => {
            const summaryText = summary.textContent || summary.innerText;
            const opponentNameMatch = summaryText.match(/Open Team Sheet for (.+)/);
            if (opponentNameMatch) {
                const opponentName = opponentNameMatch[1];
                console.log(`Open Team sheet for ${opponentName} is present`);
            }
        });
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
