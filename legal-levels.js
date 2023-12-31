const levels = {
    Charmander: 1,
    Charmeleon: 16,
    Charizard: 36,
    Ekans: 9,
    Arbok: 22,
    Pikachu: 4,
    Raichu: 4,
    Sandshrew: 1,
    Sandslash: 1,
    Clefairy: 2,
    Clefable: 2,
    Vulpix: 1,
    Ninetales: 1,
    Jigglypuff: 2,
    Wigglytuff: 2,
    Venonat: 12,
    Venomoth: 31,
    Diglett: 1,
    Dugtrio: 26,
    Meowth: 5,
    Persian: 2,
    Psyduck: 5,
    Golduck: 33,
    Mankey: 9,
    Primeape: 28,
    Growlithe: 1,
    Arcanine: 1,
    Poliwag: 9,
    Poliwhirl: 25,
    Poliwrath: 25,
    Bellsprout: 11,
    Weepinbell: 21,
    Victreebel: 21,
    Geodude: 1,
    Graveler: 25,
    Golem: 25,
    Slowpoke: 1,
    Slowbro: 1,
    Magnemite: 19,
    Magneton: 30,
    Grimer: 1,
    Muk: 38,
    Shellder: 15,
    Cloyster: 1,
    Gastly: 4,
    Haunter: 25,
    Gengar: 25,
    Drowzee: 4,
    Hypno: 26,
    Voltorb: 1,
    Electrode: 1,
    Koffing: 14,
    Weezing: 38,
    Chansey: 2,
    Scyther: 16,
    Tauros: 25,
    Magikarp: 2,
    Gyarados: 20,
    Ditto: 28,
    Eevee: 11,
    Vaporeon: 1,
    Jolteon: 1,
    Flareon: 1,
    Snorlax: 2,
    Articuno: 70,
    Zapdos: 70,
    Moltres: 70,
    Dratini: 37,
    Dragonair: 30,
    Dragonite: 55,
    Mewtwo: 100,
    Mew: 5,
    Cyndaquil: 1,
  Quilava: 14,
  Typhlosion: 36,
  Sentret: 7,
  Furret: 15,
  Hoothoot: 12,
  Noctowl: 20,
  Spinarak: 9,
  Ariados: 22,
  Pichu: 5,
  Cleffa: 12,
  Igglybuff: 5,
  Mareep: 9,
  Flaaffy: 15,
  Ampharos: 30,
  Marill: 2,
  Azumarill: 18,
  Sudowoodo: 2,
  Politoed: 25,
  Hoppip: 2,
  Skiploom: 18,
  Jumpluff: 27,
  Aipom: 13,
  Sunkern: 5,
  Sunflora: 1,
  Yanma: 9,
  Wooper: 5,
  Quagsire: 20,
  Espeon: 2,
  Umbreon: 2,
  Murkrow: 15,
  Slowking: 1,
  Misdreavus: 10,
  Girafarig: 22,
  Pineco: 17,
  Forretress: 31,
  Dunsparce: 12,
  Gligar: 18,
  Qwilfish: 1,
  Scizor: 1,
  Heracross: 13,
  Sneasel: 1,
  Teddiursa: 16,
  Ursaring: 30,
  Slugma: 20,
  Magcargo: 38,
  Swinub: 13,
  Piloswine: 33,
  Delibird: 34,
  Houndour: 3,
  Houndoom: 24,
  Phanpy: 13,
  Donphan: 25,
  Stantler: 13,
  Blissey: 3,
  Larvitar: 16,
  Pupitar: 30,
  Tyranitar: 45,
  Poochyena: 9,
  Mightyena: 18,
  Lotad: 14,
  Lombre: 14,
  Ludicolo: 14,
  Seedot: 13,
  Nuzleaf: 14,
  Shiftry: 14,
  Wingull: 2,
  Pelipper: 25,
  Ralts: 5,
  Kirlia: 20,
  Gardevoir: 30,
  Surskit: 8,
  Masquerain: 22,
  Shroomish: 12,
  Breloom: 23,
  Slakoth: 7,
  Vigoroth: 18,
  Slaking: 36,
  Makuhita: 10,
  Hariyama: 24,
  Azurill: 5,
  Nosepass: 18,
  Sableye: 15,
  Meditite: 20,
  Medicham: 37,
  Volbeat: 9,
  Illumise: 9,
  Gulpin: 12,
  Swalot: 26,
  Numel: 18,
  Camerupt: 33,
  Torkoal: 28,
  Spoink: 10,
  Grumpig: 32,
  Cacnea: 19,
  Cacturne: 32,
  Swablu: 12,
  Altaria: 35,
  Zangoose: 20,
  Seviper: 20,
  Barboach: 12,
  Whiscash: 30,
  Corphish: 9,
  Crawdaunt: 30,
  Feebas: 20,
  Milotic: 1,
  Shuppet: 16,
  Banette: 37,
  Duskull: 20,
  Dusclops: 37,
  Tropius: 28,
  Chimecho: 2,
  Snorunt: 20,
  Glalie: 42,
  Luvdisc: 15,
  Bagon: 16,
  Shelgon: 30,
  Salamence: 45,
  Kyogre: 60,
  Groudon: 60,
  Rayquaza: 60,
  Jirachi: 5,
  Turtwig: 1,
  Grotle: 16,
  Torterra: 36,
  Chimchar: 1,
  Monferno: 16,
  Infernape: 36,
  Piplup: 1,
  Prinplup: 16,
  Empoleon: 36,
  Starly: 7,
  Staravia: 14,
  Staraptor: 34,
  Kricketot: 7,
  Kricketune: 10,
  Shinx: 7,
  Luxio: 15,
  Luxray: 30,
  Combee: 5,
  Vespiquen: 21,
  Pachirisu: 13,
  Buizel: 2,
  Floatzel: 26,
  Shellos: 20,
  Gastrodon: 30,
  Ambipom: 2,
  Drifloon: 14,
  Drifblim: 28,
  Mismagius: 1,
  Honchkrow: 1,
  Chingling: 12,
  Stunky: 20,
  Skuntank: 34,
  Bronzor: 9,
  Bronzong: 33,
  Bonsly: 5,
  Happiny: 5,
  Spiritomb: 49,
  Gible: 13,
  Gabite: 24,
  Garchomp: 48,
  Munchlax: 9,
  Riolu: 16,
  Lucario: 2,
  Hippopotas: 20,
  Hippowdon: 34,
  Croagunk: 16,
  Toxicroak: 37,
  Finneon: 12,
  Lumineon: 31,
  Snover: 34,
  Abomasnow: 40,
  Weavile: 2,
  Magnezone: 30,
  Yanmega: 2,
  Leafeon: 1,
  Glaceon: 1,
  Gliscor: 2,
  Mamoswine: 34,
  Gallade: 20,
  Probopass: 1,
  Dusknoir: 37,
  Froslass: 2,
  Rotom: 20,
  Uxie: 60,
  Mesprit: 60,
  Azelf: 60,
  Dialga: 60,
  Palkia: 60,
  Heatran: 60,
  Giratina: 60,
  Cresselia: 60,
  Arceus: 1,
  Oshawott: 1,
  Dewott: 17,
  Samurott: 36,
  Timburr: 13,
  Gurdurr: 25,
  Conkeldurr: 25,
  Sewaddle: 9,
  Swadloon: 20,
  Leavanny: 21,
  Petilil: 12,
  Lilligant: 1,
  Basculin: 35,
  Sandile: 20,
  Krokorok: 29,
  Krookodile: 40,
  Zorua: 1,
  Zoroark: 25,
  Gothita: 20,
  Gothorita: 32,
  Gothitelle: 41,
  Ducklett: 12,
  Swanna: 35,
  Deerling: 16,
  Sawsbuck: 34,
  Foongus: 20,
  Amoonguss: 39,
  Alomomola: 38,
  Tynamo: 12,
  Eelektrik: 39,
  Eelektross: 39,
  Litwick: 20,
  Lampent: 41,
  Chandelure: 41,
  Axew: 16,
  Fraxure: 38,
  Haxorus: 48,
  Cubchoo: 34,
  Beartic: 37,
  Cryogonal: 34,
  Mienfoo: 9,
  Mienshao: 50,
  Pawniard: 19,
  Bisharp: 45,
  Rufflet: 21,
  Braviary: 54,
  Vullaby: 19,
  Mandibuzz: 54,
  Deino: 35,
  Zweilous: 45,
  Hydreigon: 64,
  Larvesta: 24,
  Volcarona: 59,
  Tornadus: 70,
  Thundurus: 70,
  Landorus: 70,
  Chespin: 1,
  Quilladin: 16,
  Chesnaught: 36,
  Fennekin: 1,
  Braixen: 16,
  Delphox: 36,
  Froakie: 1,
  Frogadier: 16,
  Greninja: 36,
  Fletchling: 2,
  Fletchinder: 17,
  Talonflame: 35,
  Scatterbug: 4,
  Spewpa: 8,
  Vivillon: 12,
  Litleo: 12,
  Pyroar: 35,
  'Flabébé': 10,
  Floette: 19,
  Florges: 19,
  Skiddo: 12,
  Gogoat: 32,
  Skrelp: 20,
  Dragalge: 48,
  Clauncher: 20,
  Clawitzer: 37,
  Sylveon: 2,
  Hawlucha: 45,
  Dedenne: 28,
  Carbink: 25,
  Goomy: 14,
  Sliggoo: 40,
  Goodra: 50,
  Klefki: 36,
  Phantump: 13,
  Trevenant: 1,
  Bergmite: 34,
  Avalugg: 37,
  Noibat: 13,
  Noivern: 48,
  Rowlet: 1,
  Dartrix: 17,
  Decidueye: 36,
  Yungoos: 3,
  Gumshoos: 20,
  Grubbin: 9,
  Charjabug: 20,
  Vikavolt: 20,
  Crabrawler: 13,
  Crabominable: 1,
  Oricorio: 5,
  Cutiefly: 9,
  Ribombee: 25,
  Rockruff: 7,
  Lycanroc: 25,
  Mareanie: 16,
  Toxapex: 38,
  Mudbray: 16,
  Mudsdale: 30,
  Fomantis: 11,
  Lurantis: 34,
  Salandit: 13,
  Salazzle: 33,
  Bounsweet: 5,
  Steenee: 18,
  Tsareena: 28,
  Oranguru: 25,
  Passimian: 25,
  Sandygast: 19,
  Palossand: 42,
  Komala: 20,
  Mimikyu: 20,
  Bruxish: 20,
  'Jangmo-o': 19,
  'Hakamo-o': 35,
  'Kommo-o': 45,
  Grookey: 1,
  Thwackey: 16,
  Rillaboom: 36,
  Scorbunny: 1,
  Raboot: 16,
  Cinderace: 36,
  Sobble: 1,
  Drizzile: 16,
  Inteleon: 36,
  Skwovet: 5,
  Greedent: 24,
  Rookidee: 7,
  Corvisquire: 18,
  Corviknight: 38,
  Chewtle: 5,
  Drednaw: 22,
  Rolycoly: 22,
  Carkol: 18,
  Coalossal: 34,
  Applin: 10,
  Flapple: 1,
  Appletun: 1,
  Silicobra: 12,
  Sandaconda: 36,
  Cramorant: 19,
  Arrokuda: 2,
  Barraskewda: 26,
  Toxel: 12,
  Toxtricity: 30,
  Sinistea: 38,
  Polteageist: 38,
  Hatenna: 12,
  Hattrem: 32,
  Hatterene: 42,
  Impidimp: 20,
  Morgrem: 32,
  Grimmsnarl: 42,
  Perrserker: 28,
  Falinks: 14,
  Pincurchin: 20,
  Snom: 12,
  Frosmoth: 2,
  Stonjourner: 20,
  Eiscue: 38,
  Indeedee: 19,
  Morpeko: 14,
  Cufant: 20,
  Copperajah: 34,
  Dreepy: 20,
  Drakloak: 45,
  Dragapult: 60,
  Zacian: 70,
  Zamazenta: 70,
  Eternatus: 60,
  Kubfu: 10,
  Urshifu: 10,
  Regieleki: 70,
  Regidrago: 70,
  Glastrier: 75,
  Spectrier: 75,
  Calyrex: 80,
  Wyrdeer: 31,
  Kleavor: 1,
  Ursaluna: 70,
  Basculegion: 1,
  Sneasler: 2,
  Overqwil: 25,
  Enamorus: 70,
  Sprigatito: 5,
  Floragato: 16,
  Meowscarada: 36,
  Fuecoco: 5,
  Crocalor: 16,
  Skeledirge: 36,
  Quaxly: 5,
  Quaxwell: 16,
  Quaquaval: 36,
  Lechonk: 2,
  Oinkologne: 18,
  Tarountula: 2,
  Spidops: 15,
  Nymble: 12,
  Lokix: 24,
  Pawmi: 2,
  Pawmo: 18,
  Pawmot: 19,
  Tandemaus: 7,
  Maushold: 25,
  Fidough: 5,
  Dachsbun: 26,
  Smoliv: 7,
  Dolliv: 25,
  Arboliva: 35,
  Squawkabilly: 12,
  Nacli: 10,
  Naclstack: 24,
  Garganacl: 38,
  Charcadet: 12,
  Armarouge: 1,
  Ceruledge: 1,
  Tadbulb: 12,
  Bellibolt: 1,
  Wattrel: 12,
  Kilowattrel: 25,
  Maschiff: 10,
  Mabosstiff: 30,
  Shroodle: 5,
  Grafaiai: 24,
  Bramblin: 20,
  Brambleghast: 2,
  Toedscool: 12,
  Toedscruel: 30,
  Klawf: 15,
  Capsakid: 16,
  Scovillain: 1,
  Rellor: 12,
  Rabsca: 2,
  Flittle: 12,
  Espathra: 35,
  Tinkatink: 10,
  Tinkatuff: 24,
  Tinkaton: 38,
  Wiglett: 3,
  Wugtrio: 26,
  Bombirdier: 18,
  Finizen: 15,
  Palafin: 38,
  Varoom: 20,
  Revavroom: 40,
  Cyclizar: 20,
  Orthworm: 14,
  Glimmet: 25,
  Glimmora: 35,
  Greavard: 12,
  Houndstone: 30,
  Flamigo: 5,
  Cetoddle: 32,
  Cetitan: 1,
  Veluza: 25,
  Dondozo: 49,
  Tatsugiri: 49,
  Annihilape: 35,
  Clodsire: 20,
  Farigiraf: 2,
  Dudunsparce: 49,
  Kingambit: 46,
  'Great Tusk': 45,
  'Scream Tail': 52,
  'Brute Bonnet': 55,
  'Flutter Mane': 52,
  'Slither Wing': 52,
  'Sandy Shocks': 52,
  'Iron Treads': 46,
  'Iron Bundle': 52,
  'Iron Hands': 52,
  'Iron Jugulis': 52,
  'Iron Moth': 52,
  'Iron Thorns': 52,
  Frigibax: 34,
  Arctibax: 35,
  Baxcalibur: 54,
  Gimmighoul: 5,
  Gholdengo: 6,
  'Wo-Chien': 60,
  'Chien-Pao': 60,
  'Ting-Lu': 60,
  'Chi-Yu': 60,
  'Roaring Moon': 55,
  'Iron Valiant': 55,
  Koraidon: 72,
  Miraidon: 72,
  'Walking Wake': 75,
  'Iron Leaves': 75,
  Dipplin: 1,
  Poltchageist: 13,
  Sinistcha: 13,
  Okidogi: 70,
  Munkidori: 70,
  Fezandipiti: 70,
  Ogerpon: 20
  }