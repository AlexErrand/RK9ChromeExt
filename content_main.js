import { Koffing } from './koff.mjs';
import { Pokedex } from './pokedex.js';
import { Natures } from './natures.js';
import { PokeTranslator } from './TranslatorPokes.js';

// Global variables
var pokedex = Pokedex();
var natures = Natures();
var pokeTranslator = PokeTranslator();
var pokemonMap = '';
var teraMap = '';
var abilityMap = '';
var itemMap = '';
var moveMap = '';

var cookies = document.cookie;
//console.log("Cookie:", cookies);

// Add this style to your script
const overlayStyle = `
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.7);
display: flex;
justify-content: center;
align-items: center;
z-index: 9999;`;

const loadingImageStyle = `
width: 498px; /* Adjust the size as needed */
height: 305px; /* Adjust the size as needed */`;

export function main() {
    // Create a new button element
    var showDownButton = document.createElement("button");
    showDownButton.innerText = "Load Showdown List";
    showDownButton.className = "btn btn-sm btn-primary mx-2"; // Add the desired classes
    showDownButton.style.backgroundColor = "lightblue";

    // Get a reference to the existing buttons
    var existingAddButton = document.getElementById("add");
    var existingSubmitButton = document.getElementById("submit");

    // Add a click event listener to the button
    showDownButton.addEventListener("click", async function () {
        // Disable the "New Button"
        showDownButton.disabled = true;
        // Change the background color to gray to indicate it's disabled
        showDownButton.style.backgroundColor = "gray";

        var showDownContainer = document.createElement("div");
        showDownContainer.style.marginTop = "1em"; // Adjust the margin as needed
        showDownContainer.style.display = "flex"; // Set the container to use flex layout
        showDownContainer.style.alignItems = "flex-end"; // Align items vertically in the center

        // Create a new text box
        var showDownListBox = document.createElement("textarea");
        showDownListBox.rows = 18; // Set the number of rows
        showDownListBox.cols = 50; // Set the number of columns (width)
        showDownListBox.style.borderRadius = "5px";
        showDownListBox.style.overflowY = "scroll"; // Add a scrollbar to the text area
        showDownListBox.addEventListener("keyup", function () {
            const inputValue = showDownListBox.value.trim();

            // Check if there's some input in the text box to enable/disable the button
            if (inputValue !== "") {
                convertButton.disabled = false; // Enable the button
                convertButton.style.backgroundColor = "lightblue";
            } else {
                convertButton.disabled = true; // Disable the button
                convertButton.style.backgroundColor = "gray";
            }
        });

        // Create a container div for the buttons
        var buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex"; // Set the container to use flex layout
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.marginLeft = "0.5em"; // Adjust the margin as needed

        // Create "Convert List" and "Cancel" buttons
        var convertButton = document.createElement("button");
        convertButton.innerText = "Convert List";
        convertButton.disabled = true;
        convertButton.className = "btn btn-sm btn-primary mx-2"; // Add the desired classes
        convertButton.style.backgroundColor = "gray";
        convertButton.addEventListener("click", async function () {
            var startTime = new Date().getTime(); // Get the current time
            showLoadingOverlay(); // Show loading overlay
            try {
                await convertShowDownList(showDownListBox.value);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            };

            hideLoadingOverlay(); // Hide loading overlay when the process is complete
            console.log("Totally taken " + getDuration(startTime));
            location.reload();
        });

        var cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.className = "btn btn-sm btn-primary mx-2"; // Add the desired classes
        cancelButton.style.backgroundColor = "lightblue";
        cancelButton.style.marginTop = "0.5em"; // Adjust the margin as needed
        cancelButton.addEventListener("click", function () {
            showDownContainer.parentNode.removeChild(showDownContainer);
            showDownButton.disabled = false; // Re-enable the "New Button"
            showDownButton.style.backgroundColor = "lightblue"; // Restore the background color
        });

        // Append the text box to the container
        showDownContainer.appendChild(showDownListBox);

        // Append both buttons to the buttonContainer
        buttonContainer.appendChild(convertButton);
        buttonContainer.appendChild(cancelButton);

        // Append the buttonContainer to the showDownContainer
        showDownContainer.appendChild(buttonContainer);

        // Insert the text box after the submit button
        existingSubmitButton.parentNode.insertBefore(showDownContainer, existingSubmitButton.nextSibling);
    });

    // Insert the new button after the existing button
    existingAddButton.parentNode.insertBefore(showDownButton, existingAddButton.nextSibling);
}

function showLoadingOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.style = overlayStyle;

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";

    const loadingImage = document.createElement("img");
    loadingImage.src = "https://media.tenor.com/8vuqpD3Ir-IAAAAC/catching-pokemon.gif"; // Replace with the URL of your loading image
    loadingImage.style = loadingImageStyle;

    const messageElement = document.createElement("p");
    messageElement.style.color = "white";
    messageElement.style.marginTop = "0.5em"; // Adjust the margin as needed

    const messageElement2 = document.createElement("p");
    messageElement2.style.color = "white";
    messageElement2.style.marginTop = "0.5em"; // Adjust the margin as needed

    container.appendChild(loadingImage);
    container.appendChild(messageElement);
    container.appendChild(messageElement2);

    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

function updateLoadingOverlayPokemon(message) {
    var loadingOverlay = document.getElementById("loading-overlay");

    if (loadingOverlay) {
        var messageElement = loadingOverlay.querySelector("p");
        if (messageElement) {
            messageElement.innerText = message;
        }
    }
}

function updateLoadingOverlayProgress(message) {
    var loadingOverlay = document.getElementById("loading-overlay");

    if (loadingOverlay) {
        var messageElement = loadingOverlay.querySelectorAll("p")[1];
        if (messageElement) {
            messageElement.innerText = message;
        }
    }
}

function hideLoadingOverlay() {
    const overlay = document.querySelector("#loading-overlay");
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

// async function getBaseStats(pokemonName) {
//     try {
//         const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/`);
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         const data = await response.json();
//         const stats = data.stats;

//         // Mapping the names used by the API to the order you want
//         const statOrder = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
//         const baseStats = statOrder.map(statName => {
//             const stat = stats.find(s => s.stat.name === statName);
//             return stat ? stat.base_stat : 0;
//         });

//         console.log('Base Stats:', baseStats);
//         return baseStats;
//     } catch (error) {
//         console.error('There has been a problem with your fetch operation:', error);
//     }
// }

function getStats(poke, ivs, evs, level, nat) {
    var ret = { 'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0 };

    var baseStats = pokedex[poke];
    var nature = natures[nat];

    for (const [key, value] of Object.entries(baseStats)) {
        if (key == 'hp') {
            var stat = Math.floor(((((2 * baseStats.hp) + (evs.hp / 4) + ivs.hp) * level) / 100) + level + 10);
            ret['hp'] = stat;
        } else {
            var stat = Math.floor(Math.floor((((((2 * baseStats[key]) + (evs[key] / 4) + ivs[key]) * level) / 100) + 5)) * nature[key]);
            ret[key] = stat;
        }
    }

    return ret
}

// Function to remove the container
async function convertShowDownList(paste) {
    var parsedTeam = Koffing.parse(paste);

    var pokes = parsedTeam.teams[0].pokemon;

    for (let i = 0; i < pokes.length; i++) {
        var pokemon = pokes[i].name;
        var ability = pokes[i].ability;
        var teraType = pokes[i].teraType;
        var nickname = pokes[i].nickname;
        var item = pokes[i].item
        var nature = pokes[i].nature;

        var level = 100;
        if (pokes[i].level) {
            level = pokes[i].level;
        }

        var ivs = { 'hp': 31, 'atk': 31, 'def': 31, 'spa': 31, 'spd': 31, 'spe': 31 };
        if (pokes[i].ivs) {
            for (const [key, value] of Object.entries(pokes[i].ivs)) {
                ivs[key] = value;
            }
        }

        var evs = { 'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0 };
        if (pokes[i].evs) {
            for (const [key, value] of Object.entries(pokes[i].evs)) {
                evs[key] = value;
            }
        }

        var stats = getStats(pokemon, ivs, evs, level, nature);

        var move1 = pokes[i].moves[0];
        var move2 = pokes[i].moves[1];
        var move3 = pokes[i].moves[2];
        var move4 = pokes[i].moves[3];

        var startTime = new Date().getTime(); // Get the current time
        console.log('============== Adding Pokemon ' + pokemon + ' ============');
        var pokeToken = await addPokemon(pokemon);
        if (pokeToken == "") {
            return;
        }

        if (pokemonMap == '')
            pokemonMap = await getRk9FieldMap(pokeToken, "pokemon");
        if (teraMap == '')
            teraMap = await getRk9FieldMap(pokeToken, "teratype");
        if (abilityMap == '')
            abilityMap = await getRk9FieldMap(pokeToken, "ability");
        if (itemMap == '')
            itemMap = await getRk9FieldMap(pokeToken, "helditem");
        if (moveMap == '')
            moveMap = await getRk9FieldMap(pokeToken, "move");

        var abilityId = await getId(ability, abilityMap)
        var teraTypeId = await getId(teraType, teraMap)
        var itemId = await getId(item, itemMap)
        var move1Id = await getId(move1, moveMap)
        var move2Id = await getId(move2, moveMap)
        var move3Id = await getId(move3, moveMap)
        var move4Id = await getId(move4, moveMap)

        // If RK9 uses different ID, we can't automatically find the name
        // user need to manually choose the pokemon from RK9
        var pokemonId = pokeTranslator[pokemon]
        if (!pokemonId in pokemonMap)
            pokemonId = ''

        // Logs for debuggin
        console.log('pokemon: ' + pokemon + '(' + pokemonId + ')');
        console.log('nickname: ' + nickname);
        console.log('item: ' + item + '(' + itemId + ')');
        console.log('teraType: ' + teraType + '(' + teraTypeId + ')');
        console.log('level: ' + level);
        console.log('ability: ' + ability + '(' + abilityId + ')');
        console.log('evs: ' + JSON.stringify(evs));
        console.log('ivs: ' + JSON.stringify(ivs));
        console.log('nature: ' + nature);
        console.log('stats:' + JSON.stringify(stats));
        console.log('move1: ' + move1 + '(' + move1Id + ')');
        console.log('move2: ' + move2 + '(' + move2Id + ')');
        console.log('move3: ' + move3 + '(' + move3Id + ')');
        console.log('move4: ' + move4 + '(' + move4Id + ')');
        await setValue(pokeToken, 'name', nickname);
        await setValue(pokeToken, 'level', level);
        await setValue(pokeToken, 'hp', stats.hp);
        await setValue(pokeToken, 'attack', stats.atk);
        await setValue(pokeToken, 'defense', stats.def);
        await setValue(pokeToken, 'spatk', stats.spa);
        await setValue(pokeToken, 'spdef', stats.spd);
        await setValue(pokeToken, 'speed', stats.spe);
        await selectValue(pokeToken, 'pokemon', pokemonId);
        await selectValue(pokeToken, 'teratype', teraTypeId);
        await selectValue(pokeToken, 'ability', abilityId);
        await selectValue(pokeToken, 'helditem', itemId);
        await selectValue(pokeToken, 'move1', move1Id);
        await selectValue(pokeToken, 'move2', move2Id);
        await selectValue(pokeToken, 'move3', move3Id);
        await selectValue(pokeToken, 'move4', move4Id);

        // Display the timer in the desired format
        console.log('!!!!!!!!Pokemon ' + pokemon + ' Added!!!!!!!! (' + getDuration(startTime) + ')');
    }
}

async function addPokemon(pokemon) {
    // Define the URL and headers
    const postUrl = "https://rk9.gg/teamlist/add";
    const headers = {
        "Cookie": cookies
    };

    // Define the POST request options
    const requestOptions = {
        method: 'POST',
        headers: new Headers(headers),
    };

    // Make the POST request
    try {
        const response = await fetch(postUrl, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        updateLoadingOverlayPokemon("Adding " + pokemon + "...");
        return response.text();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function setValue(pokemonId, field, value) {
    if (value) {
        // Define the URL and headers
        const postUrl = "https://rk9.gg/teamlist/update";
        const headers = {
            "Cookie": cookies
        };

        const formData = new FormData();
        formData.append("id", pokemonId + "-" + field);
        formData.append("value", value);

        // Define the POST request options
        const requestOptions = {
            method: 'POST',
            headers: new Headers(headers),
            body: formData,
        };

        // Make the POST request
        try {
            const response = await fetch(postUrl, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData.msg !== "ok") {
                throw new Error("Response does not contain 'msg' or it's not 'ok'");
            }
            updateLoadingOverlayProgress("Set " + field + " -> " + value);// Response data captured in the 'data' variable
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

async function selectValue(pokemonId, field, value) {
    if (value) {
        // Define the URL and headers
        const postUrl = "https://rk9.gg/teamlist/select?lang=EN";
        const headers = {
            "Cookie": cookies
        };

        const formData = new FormData();
        formData.append("id", pokemonId + "-" + field);
        formData.append("value", value);

        // Define the POST request options
        const requestOptions = {
            method: 'POST',
            headers: new Headers(headers),
            body: formData,
        };

        // Make the POST request
        try {
            const response = await fetch(postUrl, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData.msg !== "ok") {
                throw new Error("Response does not contain 'msg' or it's not 'ok'");
            }
            updateLoadingOverlayProgress("Select " + field + " -> " + value);// Response data captured in the 'data' variable
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

async function getRk9FieldMap(token, field) {
    // check session storage first
    var storageValue = null;
    if (sessionStorage.getItem(field)) {
        storageValue = JSON.parse(sessionStorage.getItem(field));
    }
    else {
        const getUrl = "https://rk9.gg/teamlist/select?lang=EN&id=" + token + "-" + field;
        const headers = {
            "Cookie": cookies
        };

        // Define the POST request options
        const requestOptions = {
            method: 'GET',
            headers: new Headers(headers),
        };

        // Make the POST request
        try {
            const response = await fetch(getUrl, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            storageValue = responseData
            sessionStorage.setItem(field, JSON.stringify(storageValue));
        } catch (error) {
            console.error("Error:", error);
        }
    }
    return storageValue;
}

async function getId(targetValue, fieldMap) {
    let resultKey = null;

    for (const key in fieldMap) {
        if (fieldMap[key] === targetValue) {
            resultKey = key;
            break; // Stop the loop once a match is found
        }
    }

    if (resultKey == null)
        throw new Error(`Cannot find a mapping key for: ${targetValue}`);

    return resultKey
}

function getDuration(startTime) {
    var elapsedTime = new Date().getTime() - startTime; // Calculate elapsed time in milliseconds
    // Format the elapsed time into a user-friendly format (e.g., minutes:seconds)
    var minutes = Math.floor(elapsedTime / 60000);
    var seconds = Math.floor((elapsedTime % 60000) / 1000);
    var milliseconds = elapsedTime % 1000;

    // Display the timer in the desired format
    return minutes + "m " + seconds + "s " + milliseconds + "ms";
}

