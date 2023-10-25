import { Koffing } from './koff.mjs';
import { Pokedex } from './pokedex.js';
import { Natures } from './natures.js';

var pokedex = Pokedex();
var natures = Natures();

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

export function main() {

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
    showDownButton.addEventListener("click", async function () {
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
        convertButton.addEventListener("click", async function () {
            showLoadingOverlay(); // Show loading overlay
            try {
                convertShowDownList(showDownListBox.value);

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
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            };

            hideLoadingOverlay(); // Hide loading overlay when the process is complete
            //location.reload();
        });

        var cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", function () {
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
}

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



// function getBaseStats(pokemon, evs, level, nature) {

//     var ret = { 'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0 };

//     var baseStats = pokedex[poke];
//     var nature = natures[nat];

//     for (const [key, value] of Object.entries(baseStats)) {
//         if (key == 'hp') {
//             var stat = Math.floor(((((2 * baseStats.hp) + (evs.hp / 4) + ivs.hp) * level) / 100) + level + 10);
//             ret['hp'] = stat;
//         } else {
//             var stat = Math.floor(Math.floor((((((2 * baseStats[key]) + (evs[key] / 4) + ivs[key]) * level) / 100) + 5)) * nature[key]);
//             ret[key] = stat;
//         }
//     }

//     return ret

// }

function getStats(poke, ivs, evs, level, nat) {

    var ret = {'hp': 0, 'atk': 0, 'def': 0, 'spa': 0, 'spd': 0, 'spe': 0};

    var baseStats = pokedex[poke];
    var nature = natures[nat];

    for (const [key, value] of Object.entries(baseStats)){
        if (key == 'hp'){
            var stat = Math.floor(((((2 * baseStats.hp) + (evs.hp/4) + ivs.hp) * level)/100) + level + 10);
            ret['hp'] = stat;
        } else {
            var stat = Math.floor(Math.floor((((((2 * baseStats[key]) + (evs[key]/4) + ivs[key]) * level) / 100) + 5)) * nature[key]);
            ret[key] = stat;
        }
    }

    return ret

}

// Function to remove the container
function convertShowDownList(paste) {
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

        if (!pokedex[pokes[i].name]) {
            document.getElementById('error').innerText = 'ERROR IN PASTE';
            return;
        }

        var stats = getStats(name, ivs, evs, level, nature);

        var move1 = pokes[i].moves[0];
        var move2 = pokes[i].moves[1];
        var move3 = pokes[i].moves[2];
        var move4 = pokes[i].moves[3];
        // const lines = textContent.split('\n').map(line => line.trim());

        // // Remove gender and shiny indication
        // const filteredLines = lines.filter(line => !line.includes('Shiny: ')).map(line => line.replace(/\s+\(M\)|\s+\(F\)/, ''));

        // // Extract nickname, pokemon, and item
        // let [firstLine, abilityLine, ...restLines] = filteredLines;

        // const match = /^(?:(.+?)\s*\(([^()]+)\)\s*|\s*([^@]+))?(?:@\s*(.+))?/.exec(firstLine);
        // const nickname = match[1] || "";
        // const pokemon = (match[2] || match[3] || "").trim();
        // const item = match[4] || "None";

        // // Extract level, tera type, evs, and nature
        // const level = parseInt((restLines.find(line => line.startsWith("Level: ")) || "Level: 100").replace("Level: ", ""));
        // const tera = (restLines.find(line => line.startsWith("Tera Type: ")) || "Tera Type: None").replace("Tera Type: ", "");
        // const evsString = (restLines.find(line => line.startsWith("EVs: ")) || "EVs: 0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe").replace('EVs: ', '');
        // const nature = (restLines.find(line => /Nature$/.test(line)) || "Hardy Nature").replace(' Nature', '').trim();

        // // Convert EVs string to array
        // const evsObject = Object.fromEntries(evsString.split('/').map(ev => ev.trim().split(' ')).map(([value, stat]) => [stat, parseInt(value)]));
        // const evs = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map(stat => evsObject[stat] || 0);

        // // Extract IVs
        // const ivsString = (restLines.find(line => line.startsWith("IVs: ")) || "IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe").replace('IVs: ', '');
        // const ivsObject = Object.fromEntries(ivsString.split('/').map(iv => iv.trim().split(' ')).map(([value, stat]) => [stat, parseInt(value)]));
        // const ivs = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map(stat => ivsObject[stat] || 31);

        // // Extract attacks
        // const attacks = restLines.slice(restLines.findIndex(line => line.startsWith("- ")) || restLines.length).map(attack => attack.replace('- ', '').trim());
        // const ability = abilityLine.replace('Ability: ', '').trim()
        // Logs for debugging
        console.log('nickname: ' + nickname);
        console.log('name: ' + name);
        console.log('item: ' + item);
        console.log('teraType: ' + teraType);
        console.log('level: ' + level);
        console.log('ability: ' + ability);
        console.log('evs: ' + JSON.stringify(evs));
        console.log('ivs: ' + JSON.stringify(ivs));
        console.log('nature: ' + nature);
        console.log('stats:' + JSON.stringify(stats));
        console.log('move1: ' + move1);
        console.log('move2: ' + move2);
        console.log('move3: ' + move3);
        console.log('move4: ' + move4);

        // const baseStats = getBaseStats(nameId);

        //const rk9Stats = getTrueStats(baseStats, nature, evs)



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
