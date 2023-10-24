// ==UserScript==
// @name         RK9 Team List Creator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert showdown list to rk9 team
// @author       Joe Zhu/Michael Arand
// @match        https://rk9.gg/teamlist/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

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
    z-index: 9999;
`;

const loadingImageStyle = `
    width: 498px; /* Adjust the size as needed */
    height: 305px; /* Adjust the size as needed */
`;

var pokemonDB = {
  "": "",
  "460_000": "Abomasnow",
  "190_000": "Aipom",
  "594_000": "Alomomola",
  "334_000": "Altaria",
  "424_000": "Ambipom",
  "591_000": "Amoonguss"
}

var itemDB = {
  "": "",
  "208": "Ability Shield",
  "106": "Absorb Bulb",
  "118": "Adrenaline Orb",
  "155": "Aguav Berry",
  "102": "Air Balloon",
  "167": "Apicot Berry",
  "146": "Aspear Berry",
  "111": "Assault Vest",
  "185": "Babiri Berry",
  "226": "Big Nugget",
  "96": "Big Root",
  "105": "Binding Band",
  "20": "Black Belt",
  "19": "Black Glasses",
  "81": "Black Sludge",
  "190": "Blunder Policy",
  "209": "Booster Energy",
  "1": "Bright Powder",
  "130": "Bug Memory",
  "107": "Cell Battery",
  "28": "Charcoal",
  "181": "Charti Berry",
  "142": "Cheri Berry",
  "143": "Chesto Berry",
  "186": "Chilan Berry",
  "39": "Choice Band",
  "87": "Choice Scarf",
  "97": "Choice Specs",
  "175": "Chople Berry",
  "203": "Clear Amulet",
  "244": "Clever Mochi",
  "178": "Coba Berry",
  "184": "Colbur Berry",
  "237": "Cornerstone Mask",
  "206": "Covert Cloak",
  "198": "Custap Berry",
}

var moveDB = {

  "": "",
  "71": "Absorb",
  "709": "Accelerock",
  "51": "Acid",
  "151": "Acid Armor",
  "491": "Acid Spray",
  "512": "Acrobatics",
  "367": "Acupressure",
  "332": "Aerial Ace",
  "495": "After You",
  "97": "Agility",
  "314": "Air Cutter",
  "403": "Air Slash",
  "502": "Ally Switch",
  "133": "Amnesia",
  "677": "Anchor Shot",
  "246": "Ancient Power",
  "787": "Apple Acid",
  "1133": "Aqua Cutter",
  "453": "Aqua Jet",
  "392": "Aqua Ring",
  "1141": "Aqua Step",
  "401": "Aqua Tail",
  "292": "Arm Thrust",
  "1130": "Armor Cannon",
  "312": "Aromatherapy",
  "597": "Aromatic Mist",
  "372": "Assurance",
  "310": "Astonish",
  "454": "Attack Order",
  "213": "Attract",
  "396": "Aura Sphere",
  "783": "Aura Wheel",
  "62": "Aurora Beam",
  "694": "Aurora Veil",
  "475": "Autotomize",
  "419": "Avalanche",
  "1102": "Axe Kick",
  "608": "Baby-Doll Eyes",
  "661": "Baneful Bunker",
  "839": "Barb Barrage",
  "226": "Baton Pass",
  "251": "Beat Up",
  "562": "Belch",
  "187": "Belly Drum",
  "20": "Bind",
  "44": "Bite",
  "1131": "Bitter Blade",
  "841": "Bitter Malice",
  "307": "Blast Burn",
  "299": "Blaze Kick",
  "846": "Bleakwind Storm",
  "59": "Blizzard",
  "335": "Block",
  "1150": "Blood Moon",
  "776": "Body Press",
  "34": "Body Slam",
  "754": "Bolt Beak",
  "198": "Bone Rush",
  "155": "Bonemerang",
  "586": "Boomburst",
  "340": "Bounce",
  "785": "Branch Poke",
  "413": "Brave Bird",
  "784": "Breaking Swipe",
  "280": "Brick Break",
  "362": "Brine",
  "693": "Brutal Swing",
  "61": "Bubble Beam",
  "450": "Bug Bite",
  "405": "Bug Buzz",
  "339": "Bulk Up",
  "523": "Bulldoze",
  "418": "Bullet Punch",
  "331": "Bullet Seed",
  "682": "Burn Up",
  "1009": "Burning Jealousy"

}

var abilityDB = {
  "91": "Adaptability",
  "106": "Aftermath",
  "148": "Analytic",
  "83": "Anger Point",
  "303": "Anger Shell",
  "107": "Anticipation",
  "117": "Snow Warning",
  "53": "Pickup",
  "144": "Regenerator",

}
var teraDB = {
  "": "",
  "Bug": "Bug",
  "Dark": "Dark",
  "Dragon": "Dragon",
  "Electric": "Electric",
  "Fairy": "Fairy",
  "Fighting": "Fighting",
  "Fire": "Fire",
  "Flying": "Flying",
  "Ghost": "Ghost",
  "Grass": "Grass",
  "Ground": "Ground",
  "Ice": "Ice",
  "Normal": "Normal",
  "Poison": "Poison",
  "Psychic": "Psychic",
  "Rock": "Rock",
  "Steel": "Steel",
  "Water": "Water",
  "selected": null

}

(function() {
    'use strict';
    var cookies = document.cookie;
    console.log("Cookie:", cookies);
    // Create a new button element
    var showDownButton = document.createElement("button");
    showDownButton.innerText = "Load Showdown List";
    showDownButton.className = "btn btn-sm btn-primary mx-2"; // Add the desired classes
    showDownButton.style.backgroundColor = "lightblue";

    // Get a reference to the existing button with the ID "submit"
    var existingSubmitButton = document.getElementById("submit");

    // Add a click event listener to the button
    showDownButton.addEventListener("click", async function() {
        // Disable the "New Button"
        showDownButton.disabled = true;
        // Change the background color to gray to indicate it's disabled
        showDownButton.style.backgroundColor = "gray";

        var showDownContainer = document.createElement("div");

        // Create a new text box
        var showDownListBox = document.createElement("textarea");
        showDownListBox.rows = 20; // Set the number of rows
        showDownListBox.cols = 50; // Set the number of columns (width)
        showDownListBox.style.overflowY = "scroll"; // Add a scrollbar to the text area

        // Create "Convert List" and "Cancel" buttons
        var convertButton = document.createElement("button");
        convertButton.innerText = "Convert List";
        convertButton.addEventListener("click", async function() {
            showLoadingOverlay(); // Show loading overlay
            convertShowDownList(showDownListBox)

            // var pokemonId = await addPokemon(cookies);
            // if (pokemonId == "" ) {
            //     return;
            // }
            // await setValue(cookies, pokemonId, 'name', 'testname');
            // await setValue(cookies, pokemonId, 'level', 100);
            // await setValue(cookies, pokemonId, 'hp', 50);
            // await setValue(cookies, pokemonId, 'attack', 100);
            // await setValue(cookies, pokemonId, 'defense', 150);
            // await setValue(cookies, pokemonId, 'spatk', 200);
            // await setValue(cookies, pokemonId, 'spdef', 250);
            // await setValue(cookies, pokemonId, 'speed', 300);
            // await selectValue(cookies, pokemonId, 'pokemon', '478_000');
            // await selectValue(cookies, pokemonId, 'teratype', 'Fighting');
            // await selectValue(cookies, pokemonId, 'ability', 71);
            // await selectValue(cookies, pokemonId, 'helditem', 102);
            // await selectValue(cookies, pokemonId, 'move1', 51);
            // await selectValue(cookies, pokemonId, 'move2', 155);
            // await selectValue(cookies, pokemonId, 'move3', 238);
            // await selectValue(cookies, pokemonId, 'move4', 314);
            console.log("Pokemon added");
            hideLoadingOverlay(); // Hide loading overlay when the process is complete
            location.reload();
        });

        var cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", function() {
            showDownContainer.parentNode.removeChild(showDownContainer);
            showDownButton.disabled = false; // Re-enable the "New Button"
            showDownButton.style.backgroundColor = "lightblue"; // Restore the background color
        });

        // Append the text box to the container
        showDownContainer.appendChild(showDownListBox);

        // Append the "Convert List" and "Cancel" buttons to the container
        showDownContainer.appendChild(convertButton);
        showDownContainer.appendChild(cancelButton);

        // Insert the text box after the button
        showDownButton.parentNode.insertBefore(showDownContainer, showDownButton.nextSibling);
    });

    // Insert the new button after the existing button
    existingSubmitButton.parentNode.insertBefore(showDownButton, existingSubmitButton.nextSibling);
})();

function showLoadingOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay"
    overlay.style = overlayStyle;

    const loadingImage = document.createElement("img");
    loadingImage.src = "https://media.tenor.com/8vuqpD3Ir-IAAAAC/catching-pokemon.gif"; // Replace with the URL of your loading image
    loadingImage.style = loadingImageStyle;

    var messageElement = document.createElement("p");
    messageElement.style.color = "white";
    messageElement.style.marginTop = "2em";

    overlay.appendChild(loadingImage);
    overlay.appendChild(messageElement);
    document.body.appendChild(overlay);
}

function updateLoadingOverlay(message) {
    var loadingOverlay = document.getElementById("loading-overlay");

    if (loadingOverlay) {
        var messageElement = loadingOverlay.querySelector("p");
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

// Function to remove the container
function convertShowDownList(showDownListBox) {

  const pokeData = document.getElementById('textarea');
  const textContent = pokeData.textContent || pokeData.innerText;
  const lines = textContent.split('\n').map(line => line.trim());
  
  const filteredLines = lines.filter(line => !line.includes('Shiny: ')); // Remove shiny indication
  
  const firstLine = filteredLines[0].replace(/\s+\(M\)|\s+\(F\)/, ''); // Removing gender indications
  const secondLine = filteredLines[1];
  const thirdLine = filteredLines[2];
  const fourthLine = filteredLines[3];
  const fifthLine = filteredLines[4];
  const sixthLine = filteredLines[5];
  const seventhLine = filteredLines[6];
  const eigthLine = filteredLines[7];
  const ninethLine = filteredLines[8];
  
  const splitFirstLine = firstLine.split(/@\s+/);
  
  const pokemon = splitFirstLine[0].trim();
  const item = splitFirstLine[1].trim();
  const ability = secondLine.replace('Ability: ', '').trim();
  const tera = thirdLine.replace('Tera Type: ','' ).trim()

  const evsString = fourthLine.replace('EVs: ', '');
  
  const evsArray = evsString.split('/').map(ev => ev.trim().split(' '));
  const evsObject = Object.fromEntries(evsArray.map(([value, stat]) => [stat, parseInt(value)]));
  
  const evs = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map(stat => evsObject[stat] || 0);

  const nature = fifthLine.replace(' Nature', '').trim();

  const attack1 = sixthLine.replace('- ', '').trim();
  const attack2 = seventhLine.replace('- ', '').trim();
  const attack3 = eigthLine.replace('- ', '').trim();
  const attack4 = ninethLine.replace('- ', '').trim();

  console.log(pokemon);
  console.log(item);
  console.log(tera);
  console.log(ability);
  console.log(evs);
  console.log(nature);
  console.log(attack1);
  console.log(attack2);
  console.log(attack3);
  console.log(attack4);

  // await setValue(cookies, pokemonId, 'name', 'testname');
            // await setValue(cookies, pokemonId, 'level', 100);
            // await setValue(cookies, pokemonId, 'hp', 50);
            // await setValue(cookies, pokemonId, 'attack', 100);
            // await setValue(cookies, pokemonId, 'defense', 150);
            // await setValue(cookies, pokemonId, 'spatk', 200);
            // await setValue(cookies, pokemonId, 'spdef', 250);
            // await setValue(cookies, pokemonId, 'speed', 300);
            // await selectValue(cookies, pokemonId, 'pokemon', '478_000');
            // await selectValue(cookies, pokemonId, 'teratype', 'Fighting');
            // await selectValue(cookies, pokemonId, 'ability', 71);
            // await selectValue(cookies, pokemonId, 'helditem', 102);
            // await selectValue(cookies, pokemonId, 'move1', 51);
            // await selectValue(cookies, pokemonId, 'move2', 155);
            // await selectValue(cookies, pokemonId, 'move3', 238);
            // await selectValue(cookies, pokemonId, 'move4', 314);

  





}

// generate unique documentId of the header
function generateDocumentId() {
    const timestamp = new Date().getTime(); // Current timestamp
    const randomString = Math.random().toString(36).substring(2, 15); // Random alphanumeric string

    // Combine the timestamp and random string
    const documentId = timestamp + randomString;

    return documentId;
}

async function addPokemon(cookies) {
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
        console.log("Response:", response);// Response data captured in the 'data' variable
        updateLoadingOverlay("Add pokemon");
        return response.text();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function setValue(cookies, pokemonId, field, value) {
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
        console.log("Response:", response);// Response data captured in the 'data' variable

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.msg !== "ok") {
            throw new Error("Response does not contain 'msg' or it's not 'ok'");
        }
        updateLoadingOverlay("Set " + field + " -> " + value);// Response data captured in the 'data' variable
    } catch (error) {
        console.error("Error:", error);
    }
}

async function selectValue(cookies, pokemonId, field, value) {
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
        console.log("Response:", response);// Response data captured in the 'data' variable

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.msg !== "ok") {
            throw new Error("Response does not contain 'msg' or it's not 'ok'");
        }
        updateLoadingOverlay("Select " + field + " -> " + value);// Response data captured in the 'data' variable
    } catch (error) {
        console.error("Error:", error);
    }
}