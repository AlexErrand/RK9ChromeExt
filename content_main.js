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

// CSS classes are now defined in extension-styles.css

export function main() {
    addDisclaimer();
    updateSprites();

    // Create a new button element
    var showDownButton = document.createElement("button");
    showDownButton.innerText = "Load Showdown List";
    showDownButton.className = "btn btn-sm btn-primary mx-2 rk9-ext-main-button";

    // Get a reference to the existing buttons
    var existingAddButton = document.getElementById("add");
    var existingSubmitButton = document.getElementById("submit");

    // Add a click event listener to the button
    showDownButton.addEventListener("click", async function () {
        // Disable the "New Button"
        showDownButton.disabled = true;

        var showDownContainer = document.createElement("div");
        showDownContainer.className = "rk9-ext-showdown-container";

        // Create a new text box
        var showDownListBox = document.createElement("textarea");
        showDownListBox.rows = 18;
        showDownListBox.cols = 50;
        showDownListBox.className = "rk9-ext-textarea";

        function updateButtonState() {
            const inputValue = showDownListBox.value.trim();
            convertButton.disabled = inputValue === "";
        }

        // Add input event listener to text area
        showDownListBox.addEventListener("input", updateButtonState);

        // Append the text area to the document body (or another container element)
        document.body.appendChild(showDownListBox);

        // Create a container div for the buttons
        var buttonContainer = document.createElement("div");
        buttonContainer.className = "rk9-ext-button-group";

        document.body.appendChild(buttonContainer);

        var convertButton = document.createElement("button");
        convertButton.innerText = "Convert List";
        convertButton.className = " rk9-ext-button primary";

        // Append the button to the button container
        buttonContainer.appendChild(convertButton);


        var select = document.createElement("select");
        select.className = "rk9-ext-select";

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
        cancelButton.className = "btn btn-sm btn-primary mx-2 rk9-ext-button secondary";
        cancelButton.addEventListener("click", function () {
            showDownContainer.parentNode.removeChild(showDownContainer);
            showDownButton.disabled = false; // Re-enable the "New Button"
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
    validationOverlay.className = "rk9-ext-overlay";

    const container = document.createElement("div");
    container.className = "rk9-ext-overlay-container alert alert-warning";

    const title = document.createElement("p");
    title.textContent = "Warning";
    title.className = "rk9-ext-overlay-title warning";
    container.appendChild(title);

    const header = document.createElement("p");
    header.textContent = "Some of your Pokemon may be the incorrect level. Please check the following:"
    header.className = "rk9-ext-overlay-content";
    container.appendChild(header);

    const validationErrorsList = document.createElement("ul");
    validationErrorsList.className = "rk9-ext-overlay-content";

    convertedPokemons.forEach((pokemon) => {
        if (pokemon.validations.length > 0) {
            const pokeItem = document.createElement("li");
            pokeItem.textContent = pokemon.name + ':';
            pokeItem.className = "rk9-ext-validation-item";
            const validationList = document.createElement("ul");
            validationList.className = "rk9-ext-validation-sublist";
            pokemon.validations.forEach((validation) => {
                const valItem = document.createElement("li");
                valItem.textContent = validation;
                validationList.appendChild(valItem)
            });
            pokeItem.appendChild(validationList);
            validationErrorsList.appendChild(pokeItem);
        }

    });

    container.appendChild(validationErrorsList);

    // Create a container div for the buttons
    var buttonContainer = document.createElement("div");
    buttonContainer.className = "rk9-ext-button-container";
    container.appendChild(buttonContainer);

    // Create "Continue" and "Cancel" buttons
    const continueButton = document.createElement("button");
    continueButton.textContent = "Continue";
    continueButton.className = "rk9-ext-button primary";
    continueButton.addEventListener("click", function () {
        // Handle the "Continue" button click
        loadingJingle.play();
        loadingJingle.loop = true;
        validationOverlay.classList.add("rk9-ext-hidden");
        allowSubmission = true;
    });
    buttonContainer.appendChild(continueButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "rk9-ext-button secondary";
    cancelButton.addEventListener("click", function () {
        loadingJingle.currentTime = 0;
        // Handle the "Cancel" button click
        validationOverlay.classList.add("rk9-ext-hidden");
        // Handle the cancellation as needed
    });
    buttonContainer.appendChild(cancelButton);

    // Append the overlay to the document body
    validationOverlay.appendChild(container);
    document.body.appendChild(validationOverlay);

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
    confirmationOverlay.className = "rk9-ext-overlay";

    const container = document.createElement("div");
    container.className = "rk9-ext-overlay-container alert alert-warning";

    const title = document.createElement("p");
    title.textContent = "Congratulations";
    title.className = "rk9-ext-overlay-title success";
    container.appendChild(title);

    const confirmationMessage = document.createElement("p");
    confirmationMessage.innerHTML = 'Your Pokemon have been added.';
    confirmationMessage.className = "rk9-ext-overlay-content";
    container.appendChild(confirmationMessage);

    const disclaimerMessage = document.createElement("p");
    disclaimerMessage.innerHTML = 'Please check the stats of added Pokemon after the page is refreshed.';
    disclaimerMessage.className = "rk9-ext-disclaimer";
    container.appendChild(disclaimerMessage);

    // Create a container div for the buttons
    var buttonContainer = document.createElement("div");
    buttonContainer.className = "rk9-ext-button-container";
    container.appendChild(buttonContainer);

    // Create "Ok" buttons
    const okButton = document.createElement("button");
    okButton.textContent = "Ok";
    okButton.className = "rk9-ext-button primary";
    okButton.addEventListener("click", function () {
        location.reload();
    });
    buttonContainer.appendChild(okButton);

    // Append the overlay to the document body
    confirmationOverlay.appendChild(container);
    document.body.appendChild(confirmationOverlay);

    // Wait for the user to click either button
    await Promise.race([createPromiseForButtonClick(okButton)]);
}

async function showErrorOverlay(message) {
    const errorOverlay = document.createElement("div");
    errorOverlay.id = "error-overlay";
    errorOverlay.className = "rk9-ext-overlay";

    const container = document.createElement("div");
    container.className = "rk9-ext-overlay-container alert alert-warning";

    const title = document.createElement("p");
    title.textContent = "Error";
    title.className = "rk9-ext-overlay-title error";
    container.appendChild(title);

    const errorMessage = document.createElement("p");
    errorMessage.innerHTML = message;
    errorMessage.className = "rk9-ext-overlay-content";
    container.appendChild(errorMessage);

    // Create a container div for the buttons
    var buttonContainer = document.createElement("div");
    buttonContainer.className = "rk9-ext-button-container";
    container.appendChild(buttonContainer);

    // Create "Ok" buttons
    const okButton = document.createElement("button");
    okButton.textContent = "Ok";
    okButton.className = "rk9-ext-button primary";
    okButton.addEventListener("click", function () {
        // Handle the "Continue" button click
        errorOverlay.classList.add("rk9-ext-hidden");
    });
    buttonContainer.appendChild(okButton);

    // Append the overlay to the document body
    errorOverlay.appendChild(container);
    document.body.appendChild(errorOverlay);

    // Wait for the user to click either button
    await Promise.race([createPromiseForButtonClick(okButton)]);
}

function showLoadingOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.className = "rk9-ext-loading-overlay";

    const container = document.createElement("div");
    container.className = "rk9-ext-loading-container";

    const loadingImage = document.createElement("img");
    loadingImage.src = "https://media.tenor.com/8vuqpD3Ir-IAAAAC/catching-pokemon.gif";
    loadingImage.className = "rk9-ext-loading-image";

    const messageElement = document.createElement("p");
    messageElement.className = "rk9-ext-loading-message";

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
            hasValidations = hasValidations || (pokemon.validations.length > 0);

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

    // Fetch field maps once before processing Pokémon (still sequential, but only once)
    // We need a token first, so add the first Pokémon to get it
    if (convertedPokemons.length === 0) {
        hideLoadingOverlay();
        return;
    }

    var firstPokeToken = await addSinglePokemon(convertedPokemons[0]);
    if (firstPokeToken == "") {
        hideLoadingOverlay();
        return;
    }

    // Fetch all field maps sequentially (only once, not per Pokémon)
    if (pokemonMap == '')
        pokemonMap = await getRk9FieldMap(firstPokeToken, "pokemon");
    if (teraMap == '')
        teraMap = await getRk9FieldMap(firstPokeToken, "teratype");
    if (abilityMap == '')
        abilityMap = await getRk9FieldMap(firstPokeToken, "ability");
    if (itemMap == '')
        itemMap = await getRk9FieldMap(firstPokeToken, "helditem");
    if (moveMap == '')
        moveMap = await getRk9FieldMap(firstPokeToken, "move");

    // Process first Pokémon (already added, just need to set values)
    var pokemon = convertedPokemons[0];
    var pokemonStartTime = new Date().getTime();
    
    // Validate IDs exist in RK9 maps
    var ids = validatePokemonIds(pokemon);
    await setPokemonValues(firstPokeToken, pokemon, ids);

    console.log('Pokemon "' + pokemon.name + '" submitted (' + getDuration(pokemonStartTime) + ')');

    // Process remaining Pokémon
    for (let i = 1; i < convertedPokemons.length; i++) {
        pokemon = convertedPokemons[i];
        pokemonStartTime = new Date().getTime();

        var pokeToken = await addSinglePokemon(pokemon);
        if (pokeToken == "") {
            hideLoadingOverlay();
            return;
        }

        // Validate IDs exist in RK9 maps
        ids = validatePokemonIds(pokemon);
        await setPokemonValues(pokeToken, pokemon, ids);

        console.log('Pokemon "' + pokemon.name + '" submitted (' + getDuration(pokemonStartTime) + ')');
    }
    
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

// Helper function to validate and get IDs for a Pokémon
function validatePokemonIds(pokemon) {
    var pokemonId = pokeTranslator[pokemon.name];
    if (!(pokemonId in pokemonMap))
        pokemonId = '';

    var abilityId = abilities[pokemon.ability];
    if (!(abilityId in abilityMap))
        abilityId = '';

    var itemId = heldItems[pokemon.item];
    if (!(itemId in itemMap))
        itemId = '';

    var teraType = pokemon.teraType;
    if (!(pokemon.teraType in teraMap))
        teraType = ''

    var move1Id = moves[pokemon.moves[0]];
    if (!(move1Id in moveMap))
        move1Id = '';
    var move2Id = moves[pokemon.moves[1]];
    if (!(move2Id in moveMap))
        move2Id = '';
    var move3Id = moves[pokemon.moves[2]];
    if (!(move3Id in moveMap))
        move3Id = '';
    var move4Id = moves[pokemon.moves[3]];
    if (!(move4Id in moveMap))
        move4Id = '';

    return {
        pokemonId: pokemonId,
        abilityId: abilityId,
        itemId: itemId,
        teraType: teraType,
        move1Id: move1Id,
        move2Id: move2Id,
        move3Id: move3Id,
        move4Id: move4Id
    };
}

// Helper function to set all values for a Pokémon
async function setPokemonValues(pokeToken, pokemon, ids) {
    await setValue(pokeToken, 'name', pokemon.nickname, 'Nickname');
    await setValue(pokeToken, 'level', pokemon.level, 'Level');
    await setValue(pokeToken, 'hp', pokemon.stats.hp, 'HP');
    await setValue(pokeToken, 'attack', pokemon.stats.atk, 'Attack');
    await setValue(pokeToken, 'defense', pokemon.stats.def, 'Defense');
    await setValue(pokeToken, 'spatk', pokemon.stats.spa, 'Sp. Atk');
    await setValue(pokeToken, 'spdef', pokemon.stats.spd, 'Sp. Def');
    await setValue(pokeToken, 'speed', pokemon.stats.spe, 'Speed');
    await selectValue(pokeToken, 'pokemon', ids.pokemonId, 'Pokemon', pokemon.name);
    await selectValue(pokeToken, 'teratype', ids.teraType, 'Tera Type', pokemon.teraType);
    await selectValue(pokeToken, 'ability', ids.abilityId, 'Ability', pokemon.ability);
    await selectValue(pokeToken, 'helditem', ids.itemId, 'Held Item', pokemon.item);
    await selectValue(pokeToken, 'move1', ids.move1Id, 'Move 1', pokemon.moves[0]);
    await selectValue(pokeToken, 'move2', ids.move2Id, 'Move 2', pokemon.moves[1]);
    await selectValue(pokeToken, 'move3', ids.move3Id, 'Move 3', pokemon.moves[2]);
    await selectValue(pokeToken, 'move4', ids.move4Id, 'Move 4', pokemon.moves[3]);
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
        return "";
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

        // Make the GET request
        try {
            const response = await fetch(getUrl, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            storageValue = responseData;

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
        newParagraph.className = "rk9-ext-disclaimer";
        newParagraph.style.fontSize = '1.25rem'; // Keep larger size for disclaimer

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
        imgElement.className = "rk9-ext-pokemon-sprite";
        // Clear any inline styles that might override our CSS
        imgElement.style.height = "";
        imgElement.style.width = "";
        imgElement.style.maxWidth = "";
    });
}

function createPromiseForButtonClick(button) {
    return new Promise((resolve) => {
        button.addEventListener("click", () => {
            resolve();
        });
    });
}