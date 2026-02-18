# Extreme Speed - VGC Companion

Welcome to Extreme Speed - VGC Companion! This is an RK9Labs Extension that allows you to use your showdown paste to submit your team for real life VGC events with ease.

Say goodbye to the tedious manual entry of each stat and the long 20-minute team sheet fill-outs. With our extension, you can efficiently submit your team in just about 40 seconds! Enjoy the added convenience of importing your team directly from Pokémon Showdown. 

Note: Extreme Speed - VGC Companion is not affiliated with RK9Labs, Nintendo, Game Freak, Pokémon Showdown or The Pokémon Company International. Please always make sure that the team submitted here matches the team in your console, and that your Pokémon are appropriately leveled prior to importing your team for accurate results. This tool does not submit your team for you, the user
is fully responsible for their submission. This application is client side only, and does not communicate with any kind of external server or user.

Credit to @Yugib0y on Twitter for the logo!

Patch Notes:
- Code cleanup to make CSS easier to read and more organized
- Reduced API calls for less laggy experience
- UI now matches RK9 website and new visual/audio effects 


## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Chrome Extension API | Manifest V3 | Browser extension framework and content script injection |
| JavaScript | ES6+ Modules | Core programming language with ES module syntax |
| CSS3 | - | Custom styling, animations, and responsive design |
| Fetch API | - | HTTP requests to RK9.gg API endpoints |
| Chrome Runtime API | V3 | Extension resource management (`chrome.runtime.getURL`) |
| SessionStorage API | - | Client-side caching of field maps for performance |
| DOM APIs | - | Content script manipulation and dynamic UI updates |
| Koffing | Custom | Pokémon Showdown team format parser |
| Custom Data Modules | - | Pokedex, Natures, Abilities, Moves, Held Items, Sprites |

## Project Structure

```
RK9ChromeExt/
├── assets/
│   └── audio/                  # Audio files for loading and completion sounds
│       ├── teamloading.mp3
│       └── pokecenterjingle.mp3
├── content_script.js            # Entry point - loads content_main.js as ES module
├── content_main.js              # Main extension logic - UI, API calls, Pokemon processing
├── extension-styles.css         # All extension UI styles and animations
├── manifest.json                # Chrome Extension Manifest V3 configuration
├── package.json                 # npm dependencies and project metadata
├── data/
│   ├── pokedex.js              # Pokemon base stats database
│   ├── abilities.js            # Ability name to RK9 ID mapping
│   ├── moves.js                # Move name to RK9 ID mapping
│   ├── heldItems.js            # Held item name to RK9 ID mapping
│   ├── natures.js              # Nature stat modifiers for stat calculation
│   ├── sprites.js              # Pokemon sprite URL mappings
│   ├── TranslatorPokes.js      # Pokemon name to RK9 ID translator 
│   └── legal-levels.js         # Legal level restrictions (not currently implemented)
├── parser/
│   └── koff.mjs                # Pokemon Showdown team format parser
├── utils/
│   └── (inline utilities)      # Helper functions in content_main.js
│       ├── getPokemonSpriteUrl()    # Sprite URL resolution
│       ├── validatePokemonIds()     # ID validation helper
│       ├── setPokemonValues()       # Batch value setting helper
│       └── getStats()               # Stat calculation
└── README.md                   # Project documentation
```

# Installation Instructions

If you are looking to run our extension, simply download from the [Google Chrome Web Store](https://chromewebstore.google.com/detail/extreme-speed-vgc-compani/bfbjgdkcihehcfcncnmecmlmijoomoio) and apply the extension to Chrome. The extension can also be run through the developer settings in the Extensions tab on Google Chrome, which requires you use a zip file of your current version of the code, which is what we use for testing new versions prior to publishing.