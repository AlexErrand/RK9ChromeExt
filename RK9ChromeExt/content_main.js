import { Koffing } from './koff.mjs';
import { Pokedex } from './pokedex.js';
import { Natures } from './natures.js';
import { Abilities } from './abilities.js';
import { HeldItems } from './heldItems.js';
import { Moves } from './moves.js';
import { PokeTranslator } from './TranslatorPokes.js';
import { SpritesLink } from './sprites.js';

// Global variables
var pokedex = Pokedex();
var natures = Natures();
var abilities = Abilities();
var moves = Moves();
var heldItems = HeldItems();
var pokeTranslator = PokeTranslator();
var spritesLink = SpritesLink();
var pokemonMap = '';
var teraMap = '';
var abilityMap = '';
var itemMap = '';
var moveMap = '';
var convertedPokemons = [];
var allowSubmission = false;
var languageOption = '';
const loadingJingle = new Audio(chrome.runtime.getURL("assets/audio/teamloading.mp3"));
loadingJingle.loop = true;
const finishedJingle = new Audio(chrome.runtime.getURL("assets/audio/pokecenterjingle.mp3"));
var cookies = document.cookie;
console.log("Cookie:", cookies);

var Pokemon = class {
    constructor() {
        this.moves = [];
        this.validations = [];
    }
    static fromObject(obj) {
        const p = new Pokemon();
        p.name = obj.name;
        p.nickname = obj.nickname;
        p.item = obj.item;
        p.ability = obj.ability;
        p.level = obj.level;
        p.stats = obj.stats;
        p.teraType = obj.teraType;
        p.moves = Array.isArray(obj.moves) ? obj.moves : [];
        p.validations = Array.isArray(obj.validations) ? obj.validations : [];
        return p;
    }
    toJson(indentation = 2) {
        return JSON.stringify(this, null, indentation);
    }
}

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
    addDisclaimer();
    updateSprites();

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

        function updateButtonState() {
            const inputValue = showDownListBox.value.trim();
            convertButton.disabled = inputValue === "";
            convertButton.style.backgroundColor = inputValue !== "" ? "lightblue" : "gray";
        }

        // Add input event listener to text area
        showDownListBox.addEventListener("input", updateButtonState);

        // Append the text area to the document body (or another container element)
        document.body.appendChild(showDownListBox);

        // Create a container div for the buttons
        var buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex"; // Set the container to use flex layout
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.marginLeft = "0.5em"; // Adjust the margin as needed

        document.body.appendChild(buttonContainer);

        var convertButton = document.createElement("button");
        convertButton.innerText = "Convert List";
        convertButton.className = "btn btn-sm btn-primary mx-2";

        // Append the button to the button container
        buttonContainer.appendChild(convertButton);


        var select = document.createElement("select");
        select.style.display = "flex"; // Set the container to use flex layout
        select.style.flexDirection = "column";
        select.style.marginLeft = "0.5em"; // Adjust the margin as needed
        select.style.marginBottom = "0.5em";

        // Define an array with the language options
        var languages = ["EN", "DE", "ES", "FR", "IT", "JP", "KO", "SC", "TC"];

        // Iterate through the languages array and create an option for each language
        languages.forEach(function (language) {
            var option = document.createElement("option");
            option.value = language;
            option.text = language;
            select.appendChild(option);
        });

        // Event listener to update the global variable when a new option is selected
        select.addEventListener('change', function () {
            languageOption = this.value;
        });


        // Append the select element to the body of the document
        buttonContainer.appendChild(select);

        // Set initial state of the button
        updateButtonState();

        convertButton.addEventListener("click", async function () {
            try {
                var [convertedPokemons, hasValidations] = await convertShowDownList(showDownListBox.value);
                if (hasValidations) {
                    await showValidationOverlay(convertedPokemons);
                } else {
                    allowSubmission = true;
                }

                if (!allowSubmission)
                    return

                await addPokemons(convertedPokemons);
            } catch (error) {
                await showErrorOverlay(error.message);
                return
            };
            await showConfirmationOverlay(); // Display a confirmation page to the user
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

async function showValidationOverlay(convertedPokemons) {
    loadingJingle.pause();
    const validationOverlay = document.createElement("div");
    validationOverlay.id = "validation-overlay";
    validationOverlay.style = overlayStyle; // Apply your desired styles
    validationOverlay.style.display = "flex";
    validationOverlay.style.flexDirection = "column";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "50%";
    container.style.top = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.className = "alert alert-warning";

    const title = document.createElement("p");
    title.textContent = "Warning";
    title.style.fontWeight = 'bold';
    container.appendChild(title);

    const header = document.createElement("p");
    header.textContent = "Some of your Pokemon may be the incorrect level. Please check the following:"
    container.appendChild(header);

    const validationErrorsList = document.createElement("ul");

    convertedPokemons.forEach((pokemon) => {
        if (pokemon.validations.length > 0) {
            const pokeItem = document.createElement("li");
            pokeItem.textContent = pokemon.name + ':';
            pokeItem.style.marginTop = '10px'
            const validationList = document.createElement("ul");
            pokemon.validations.forEach((validation) => {
                const valItem = document.createElement("li");
                valItem.textContent = '- ' + validation;
                valItem.style.textIndent = '20px';
                validationList.appendChild(valItem)
            });
            pokeItem.appendChild(validationList);
            validationErrorsList.appendChild(pokeItem);
        }

    });

    container.appendChild(validationErrorsList);

    // Create a container div for the buttons
    var buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex"; // Set the container to use flex layout
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.marginTop = "2em"; // Adjust the margin as needed
    container.appendChild(buttonContainer);

    // Create "Continue" and "Cancel" buttons
    const continueButton = document.createElement("button");
    continueButton.textContent = "Continue";
    continueButton.className = "btn btn-sm btn-primary mx-2";
    continueButton.style.backgroundColor = "lightblue";
    continueButton.addEventListener("click", function () {
        // Handle the "Continue" button click
        loadingJingle.play();
        loadingJingle.loop = true;
        validationOverlay.style.display = "none"; // Hide the overlay
        allowSubmission = true;
    });
    buttonContainer.appendChild(continueButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "btn btn-sm btn-primary mx-2";
    cancelButton.style.marginLeft = "0.5em"; // Adjust the margin as needed
    cancelButton.style.backgroundColor = "lightblue";
    cancelButton.addEventListener("click", function () {
        loadingJingle.currentTime = 0;
        // Handle the "Cancel" button click
        validationOverlay.style.display = "none"; // Hide the overlay
        // Handle the cancellation as needed
    });
    buttonContainer.appendChild(cancelButton);

    // Append the overlay to the document body
    validationOverlay.appendChild(container);
    document.body.appendChild(validationOverlay);

    // Show the overlay
    validationOverlay.style.display = "block";

    // Wait for the user to click either button
    await Promise.race([
        createPromiseForButtonClick(continueButton),
        createPromiseForButtonClick(cancelButton),
    ]);
}

async function showConfirmationOverlay() {
    loadingJingle.pause()
    finishedJingle.play();
    const confirmationOverlay = document.createElement("div");
    confirmationOverlay.id = "confirmation-overlay";
    confirmationOverlay.style = overlayStyle; // Apply your desired styles
    confirmationOverlay.style.display = "flex";
    confirmationOverlay.style.flexDirection = "column";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "50%";
    container.style.top = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.className = "alert alert-warning";

    const title = document.createElement("p");
    title.textContent = "Congratulations";
    title.style.fontWeight = 'bold';
    container.appendChild(title);

    const confirmationMessage = document.createElement("p");
    confirmationMessage.innerHTML = 'Your Pokemon have been added.';
    container.appendChild(confirmationMessage);

    const disclaimerMessage = document.createElement("p");
    disclaimerMessage.innerHTML = 'Please check the stats of added Pokemon after the page is refreshed.';
    disclaimerMessage.style.color = 'red';
    disclaimerMessage.style.fontWeight = 'bold';
    disclaimerMessage.style.fontSize = '80%'; // This reduces the font size by 20%
    container.appendChild(disclaimerMessage);

    // Create a container div for the buttons
    var buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex"; // Set the container to use flex layout
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.marginTop = "2em"; // Adjust the margin as needed
    container.appendChild(buttonContainer);

    // Create "Ok" buttons
    const okButton = document.createElement("button");
    okButton.textContent = "Ok";
    okButton.className = "btn btn-sm btn-primary mx-2";
    okButton.style.backgroundColor = "lightblue";
    okButton.addEventListener("click", function () {
        location.reload();
    });
    buttonContainer.appendChild(okButton);

    // Append the overlay to the document body
    confirmationOverlay.appendChild(container);
    document.body.appendChild(confirmationOverlay);

    // Show the overlay
    confirmationOverlay.style.display = "block";

    // Wait for the user to click either button
    await Promise.race([createPromiseForButtonClick(okButton)]);
}

async function showErrorOverlay(message) {
    const errorOverlay = document.createElement("div");
    errorOverlay.id = "error-overlay";
    errorOverlay.style = overlayStyle; 
    errorOverlay.style.display = "flex";
    errorOverlay.style.flexDirection = "column";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "50%";
    container.style.top = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.className = "alert alert-warning";

    const title = document.createElement("p");
    title.textContent = "Error";
    title.style.fontWeight = 'bold';
    container.appendChild(title);

    const errorMessage = document.createElement("p");
    errorMessage.innerHTML = message;
    container.appendChild(errorMessage);

    // Create a container div for the buttons
    var buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex"; // Set the container to use flex layout
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.marginTop = "2em"; // Adjust the margin as needed
    container.appendChild(buttonContainer);

    // Create "Ok" buttons
    const okButton = document.createElement("button");
    okButton.textContent = "Ok";
    okButton.className = "btn btn-sm btn-primary mx-2";
    okButton.style.backgroundColor = "lightblue";
    okButton.style.display = "flex"; // Set the container to use flex layout
    okButton.style.justifyContent = 'center';
    okButton.style.marginTop = "2em"; // Adjust the margin as needed
    okButton.addEventListener("click", function () {
        // Handle the "Continue" button click
        errorOverlay.style.display = "none"; // Hide the overlay
    });
    buttonContainer.appendChild(okButton);

    // Append the overlay to the document body
    errorOverlay.appendChild(container);
    document.body.appendChild(errorOverlay);

    // Show the overlay
    errorOverlay.style.display = "block";

    // Wait for the user to click either button
    await Promise.race([createPromiseForButtonClick(okButton)]);
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

    container.appendChild(loadingImage);
    container.appendChild(messageElement);

    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

function resetLoadingOverlayProgress(message) {
    var loadingOverlay = document.getElementById("loading-overlay");

    if (loadingOverlay) {
        var messageElement = loadingOverlay.querySelector("p");
        if (messageElement) {
            messageElement.innerHTML = message + '<br>';
        }
    }
}

function updateLoadingOverlayProgress(message) {
    var loadingOverlay = document.getElementById("loading-overlay");

    if (loadingOverlay) {
        var messageElement = loadingOverlay.querySelector("p");
        if (messageElement) {
            messageElement.innerHTML += message + '<br>';
        }
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

function getStats(poke, ivs, evs, level, nat) {
    var ret = { 'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0 };

    var baseStats = pokedex[poke];
    var nature = natures[nat];

    for (const [key, value] of Object.entries(baseStats)) {
        if (key == 'hp') {
            var stat = Math.floor(((((2 * baseStats.hp) + Math.floor(evs.hp / 4) + ivs.hp) * level) / 100) + level + 10);
            ret['hp'] = stat;
        } else {
            var stat = Math.floor(Math.floor((((((2 * baseStats[key]) + Math.floor(evs[key] / 4) + ivs[key]) * level) / 100) + 5)) * nature[key]);
            ret[key] = stat;
        }
    }

    return ret
}

async function fetchPokepasteContent(url) {
    try {
        if (!url.trim().endsWith('/json')) {
            url = url.trim() + '/json';
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch PokePaste content");
            
        }

        const data = await response.json();
        return data.paste.replaceAll('\r', '');
    } catch (error) {
        loadingJingle.pause();
        console.error("Error fetching PokePaste content:", error.message);
        throw new Error("Could not fetch Pokémon data from the URL.");
    }
}

function isValidUrl(input) {
    try {
        new URL(input);
        return true;
    } catch {
        loadingJingle.pause();
        return false;
    }
}

// Function to remove the container
async function convertShowDownList(paste) {
    try {

        // Check if the input is a URL
        if (isValidUrl(paste)) {
            paste = await fetchPokepasteContent(paste);
        }
        loadingJingle.play();
        loadingJingle.loop = true;
        paste = paste.replace(/Vivillon-\w+/g, "Vivillon");

        convertedPokemons = [];
        var hasValidations = false;
        var parsedTeam = Koffing.parse(paste);

        var pokes = parsedTeam.teams[0].pokemon;

        for (let i = 0; i < pokes.length; i++) {
            var name = pokes[i].name;
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

            if (ability.includes("As One")) {
                ability = "As One";
            }

            var stats = getStats(name, ivs, evs, level, nature);

            var pokemon = new Pokemon()
            pokemon.name = name;
            pokemon.nickname = nickname;
            pokemon.item = item;
            pokemon.ability = ability;
            pokemon.level = level;
            pokemon.stats = stats;
            pokemon.teraType = teraType;
            pokemon.moves = pokes[i].moves;

            pokemon.validations = validatePokemon(pokemon);
            hasValidations = hasValidations ? hasValidations : (pokemon.validations.length > 0)

            convertedPokemons.push(pokemon);
        }
    }
    catch (error) {
        loadingJingle.pause();
        console.log('Error converting list: ' + error.message);
        throw new Error(`Error converting this list`);
    }
    return [convertedPokemons, hasValidations];
}

async function addPokemons(convertedPokemons) {
    loadingJingle.play();
    showLoadingOverlay(); // Show loading overlay
    var startTime = new Date().getTime(); // Get the current time

    for (const pokemon of convertedPokemons) {
        var startTime = new Date().getTime(); // Get the current time

        var pokeToken = await addSinglePokemon(pokemon);
        if (pokeToken == "") {
            return;
        }

        if (pokemonMap == '')
            pokemonMap = await getRk9FieldMap(pokeToken, "pokemon");
        console.log(pokemonMap)
        if (teraMap == '')
            teraMap = await getRk9FieldMap(pokeToken, "teratype");

        if (abilityMap == '')
            abilityMap = await getRk9FieldMap(pokeToken, "ability");
        console.log(abilityMap)
        if (itemMap == '')
            itemMap = await getRk9FieldMap(pokeToken, "helditem");
        console.log(itemMap)
        if (moveMap == '')
            moveMap = await getRk9FieldMap(pokeToken, "move");
        console.log(moveMap)

        // validate the id we use exists in RK9 list
        // otherwise, we don't submit the request
        var pokemonId = pokeTranslator[pokemon.name];
        if (!pokemonId in pokemonMap)
            pokemonId = '';

        var abilityId = abilities[pokemon.ability];
        if (!abilityId in abilityMap)
            abilityId = '';

        var itemId = heldItems[pokemon.item];
        if (!itemId in itemMap)
            itemId = '';

        var teraType = pokemon.teraType;
        if (!pokemon.teraType in teraMap)
            teraType = ''

        var move1Id = moves[pokemon.moves[0]];
        if (!move1Id in moveMap)
            move1Id = '';
        var move2Id = moves[pokemon.moves[1]];
        if (!move2Id in moveMap)
            move2Id = '';
        var move3Id = moves[pokemon.moves[2]];
        if (!move3Id in moveMap)
            move3Id = '';
        var move4Id = moves[pokemon.moves[3]];
        if (!move4Id in moveMap)
            move4Id = '';

        await setValue(pokeToken, 'name', pokemon.nickname, 'Nickname');
        await setValue(pokeToken, 'level', pokemon.level, 'Level');
        await setValue(pokeToken, 'hp', pokemon.stats.hp, 'HP');
        await setValue(pokeToken, 'attack', pokemon.stats.atk, 'Attack');
        await setValue(pokeToken, 'defense', pokemon.stats.def, 'Defense');
        await setValue(pokeToken, 'spatk', pokemon.stats.spa, 'Sp. Atk');
        await setValue(pokeToken, 'spdef', pokemon.stats.spd, 'Sp. Def');
        await setValue(pokeToken, 'speed', pokemon.stats.spe, 'Speed');
        await selectValue(pokeToken, 'pokemon', pokemonId, 'Pokemon', pokemon.name);
        await selectValue(pokeToken, 'teratype', teraType, 'Tera Type', pokemon.teraType);
        await selectValue(pokeToken, 'ability', abilityId, 'Ability', pokemon.ability);
        await selectValue(pokeToken, 'helditem', itemId, 'Held Item', pokemon.item);
        await selectValue(pokeToken, 'move1', move1Id, 'Move 1', pokemon.moves[0]);
        await selectValue(pokeToken, 'move2', move2Id, 'Move 2', pokemon.moves[1]);
        await selectValue(pokeToken, 'move3', move3Id, 'Move 3', pokemon.moves[2]);
        await selectValue(pokeToken, 'move4', move4Id, 'Move 4', pokemon.moves[3]);

        // Display the timer in the desired format
        console.log('Pokemon "' + pokemon.name + '" submitted (' + getDuration(startTime) + ')');
    };
    console.log("Totally taken " + getDuration(startTime));
    hideLoadingOverlay(); // Hide loading overlay when the process is complete
}

function validatePokemon(pokemon) {
    var validations = [];

    if (pokemon.level < 100) {
        validations.push("Current level is " + pokemon.level);
    }

    return validations;
}

async function addSinglePokemon(pokemon) {
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
        resetLoadingOverlayProgress("Adding " + pokemon.name + ' ...');
        return response.text();
    } catch (error) {
        loadingJingle.pause();
        console.log("Error:", error.message);
    }
}

async function setValue(pokemonId, field, value, fieldDisplay) {
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
            updateLoadingOverlayProgress("Set " + fieldDisplay + " -> " + value);// Response data captured in the 'data' variable
        } catch (error) {
            loadingJingle.pause();
            console.log("Error:", error.message);
        }
    }
}

async function selectValue(pokemonId, field, value, fieldDisplay, valueDisplay) {
    if (value) {
        // Define the URL and headers
        const postUrl = "https://rk9.gg/teamlist/select?lang=" + languageOption;
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
            updateLoadingOverlayProgress("Choose " + fieldDisplay + " -> " + valueDisplay);// Response data captured in the 'data' variable
        } catch (error) {
            loadingJingle.pause();
            console.log("Error:", error.message);
        }
    }
}

async function setLanguage(language, value, fieldDisplay, valueDisplay) {
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
            updateLoadingOverlayProgress("Choose " + fieldDisplay + " -> " + valueDisplay);// Response data captured in the 'data' variable
        } catch (error) {
            loadingJingle.pause();
            console.log("Error:", error.message);
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
            console.log(response)


            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData)
            storageValue = responseData

            sessionStorage.setItem(field, JSON.stringify(storageValue));
        } catch (error) {
            loadingJingle.pause();
            console.log("Error:", error.message);
        }
    }
    return storageValue;
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

function addDisclaimer() {
    // Find the div element with the class "alert alert-warning"
    var warningDiv = document.querySelector('.alert.alert-warning');

    // Check if the div element is found
    if (warningDiv) {
        // Create a new paragraph element
        var newParagraph = document.createElement('p');

        // Add content to the new paragraph
        newParagraph.innerHTML = 'Note: Extreme Speed - VGC Companion is not affiliated with RK9Labs, Nintendo, Game Freak, Pokémon Showdown or The Pokémon Company International. <br>Please always make sure that the team submitted here matches the team in your console, and that your Pokémon are appropriately leveled prior to importing your team for accurate results. <br>This extension does not submit your team for you, please make sure to do that before the appropriate deadline.';
        newParagraph.style.color = 'red';
        newParagraph.style.fontSize = '30px';
        newParagraph.style.fontWeight = 'bold';

        // Append the new paragraph to the warning div
        warningDiv.appendChild(newParagraph);
    }
}

function updateSprites() {
    // Get all the div elements with the class "pokemon"
    var pokemonDivs = document.querySelectorAll(".pokemon");

    // Loop through each div element
    pokemonDivs.forEach(function (div) {
        // Get the data attributes for data-number and data-form
        var dataNumber = div.getAttribute("data-number");
        var dataForm = div.getAttribute("data-form");
        var imgElement = div.querySelector("img");

        // Create a new img link based on data-number and data-form
        if (dataNumber == null) {
            // this is the sprites from the "Show Team List"
            // existing link looks like: https://storage.googleapis.com/files.rk9labs.com/sprites/broadcast/987_000.png
            var existingImgUrl = imgElement.src;
            var url = new URL(existingImgUrl);
            var pathParts = url.pathname.split('/');
            // 987_000.png
            var fileName = pathParts[pathParts.length - 1];
            // 987_000
            var fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

            // Extract the numeric part
            var parts = fileNameWithoutExtension.split("_");
            dataNumber = parts[0];
            // default to 000 if rk9 doesn't provide us the form
            dataForm = parts.length > 1 ? parts[1] : "000";
        }

        var newImgLink = "https://www.serebii.net/scarletviolet/pokemon/new/" + dataNumber + ".png";

        var index = dataNumber + "_" + dataForm;
        if (spritesLink[index])
            newImgLink = spritesLink[index];

        // Reset the margin height for the img
        imgElement.src = newImgLink;
        imgElement.style.margin = "12"; // Set margin to 12px
        imgElement.style.height = "128px"; // Set height to 128px
    });
}

function createPromiseForButtonClick(button) {
    return new Promise((resolve) => {
        button.addEventListener("click", () => {
            resolve();
        });
    });
}