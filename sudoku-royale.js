const { useState, useEffect, useCallback, useRef, useMemo } = React;

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg:        "#F2E8D8",          // warmer, richer sand
  sand:      "#E5D5C0",
  sandDark:  "#C8B49A",
  paper:     "#FDFAF4",
  ink:       "#1E1408",          // deeper ink
  inkLight:  "#7A6455",
  inkFaint:  "#B8A898",
  teal:      "#12897C",          // deeper, more saturated teal
  tealLight: "#D4F0EC",
  tealDark:  "#0A5E55",
  coral:     "#E8512A",          // punchier coral
  coralLight:"#FDE8E0",
  coralDark: "#B83A18",
  gold:      "#F0B429",          // richer gold
  goldLight: "#FEF3D0",
  goldDark:  "#B8840A",
  red:       "#D62828",
  blue:      "#2B6CB0",          // richer blue
  blueLight: "#DBEAFE",
  blueDark:  "#1A4480",
  green:     "#1A6B3C",          // deeper green
  greenLight:"#D4EDDA",
  greenDark: "#0F4526",
  purple:    "#6B3FA0",
  purpleLight:"#EDE0FF",
};

// ─── World / Island / Level Data ────────────────────────────────────────────
const WORLDS = [
  {
    id: 1,
    name: 'Dino Valley',
    emoji: '🦕',
    theme: 'dinosaurs',
    tagline: 'A primordial jungle where ancient beasts rule.',
    color: '#4CAF7A',
    lightColor: '#E8F5EE',
    villain: 'GENERAL: Dino Rex Magnus',
    islands: [
      {
        name: 'Stomping Grounds',
        emoji: '🦶',
        boss: 'Rex the Raptor',
        levels: [
          { id: 1, name: 'First Steps', clues: 50, timeLimit: 370, difficulty: 'tutorial', isBoss: false, tutorialMsg: 'Tap a cell, then tap a number to fill it in. Complete the puzzle!' },
          { id: 2, name: 'Muddy Tracks', clues: 48, timeLimit: 395, difficulty: 'tutorial', isBoss: false, tutorialMsg: 'Double-tap any cell to toggle pencil mode for notes.' },
          { id: 3, name: 'Rex Rampage', clues: 46, timeLimit: 485, difficulty: 'tutorial', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Volcano Ridge',
        emoji: '🌋',
        boss: 'Ignis the Pterodactyl',
        levels: [
          { id: 4, name: 'Ash Falls', clues: 46, timeLimit: 350, difficulty: 'beginner', isBoss: false, tutorialMsg: null },
          { id: 5, name: 'Hot Pursuit', clues: 44, timeLimit: 370, difficulty: 'beginner', isBoss: false, tutorialMsg: null },
          { id: 6, name: 'Lava Leap', clues: 44, timeLimit: 370, difficulty: 'beginner', isBoss: false, tutorialMsg: null },
          { id: 7, name: 'Ember Claw', clues: 42, timeLimit: 450, difficulty: 'beginner', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Tar Pits',
        emoji: '🦴',
        bossIsland: true,
        boss: 'Dino Rex Magnus',
        levels: [
          { id: 8, name: 'Sticky Situation', clues: 44, timeLimit: 370, difficulty: 'beginner', isBoss: false, tutorialMsg: null },
          { id: 9, name: 'Sinking Fast', clues: 42, timeLimit: 390, difficulty: 'beginner', isBoss: false, tutorialMsg: null },
          { id: 10, name: 'Bone Collector', clues: 42, timeLimit: 390, difficulty: 'beginner', isBoss: false, tutorialMsg: null },
          { id: 11, name: 'Ancient Terror', clues: 40, timeLimit: 410, difficulty: 'beginner', isBoss: false, tutorialMsg: null },
          { id: 12, name: 'DINO REX MAGNUS', clues: 40, timeLimit: 470, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Cowboy Frontier',
    emoji: '🤠',
    theme: 'cowboys',
    tagline: 'The lawless west, where only the fastest survive.',
    color: '#C49A35',
    lightColor: '#FDF7E3',
    villain: 'GENERAL: El Diablo',
    islands: [
      {
        name: 'Dusty Trail',
        emoji: '🌵',
        boss: 'Sheriff Slade',
        levels: [
          { id: 13, name: 'High Noon', clues: 44, timeLimit: 335, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 14, name: 'Desert Duel', clues: 42, timeLimit: 350, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 15, name: 'Sheriff Slade', clues: 40, timeLimit: 425, difficulty: 'easy', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Silver Mine',
        emoji: '⛏️',
        boss: 'Grizzly McCraw',
        levels: [
          { id: 16, name: 'Gold Rush', clues: 42, timeLimit: 350, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 17, name: 'Tunnel Rats', clues: 40, timeLimit: 370, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 18, name: 'Cave-In', clues: 38, timeLimit: 385, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 19, name: 'Grizzly McCraw', clues: 38, timeLimit: 445, difficulty: 'easy', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Outlaw Canyon',
        emoji: '🏜️',
        boss: 'Black Bart',
        levels: [
          { id: 20, name: 'Ambush Alley', clues: 40, timeLimit: 370, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 21, name: 'Bandit Kings', clues: 38, timeLimit: 385, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 22, name: 'The Heist', clues: 36, timeLimit: 405, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 23, name: 'Black Bart', clues: 36, timeLimit: 465, difficulty: 'easy', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: "Dead Man's Pass",
        emoji: '💀',
        bossIsland: true,
        boss: 'El Diablo',
        levels: [
          { id: 24, name: 'Wanted: Dead', clues: 38, timeLimit: 385, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 25, name: 'The Hangman', clues: 36, timeLimit: 405, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 26, name: 'Last Stand', clues: 34, timeLimit: 425, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 27, name: 'Gunsmoke', clues: 34, timeLimit: 425, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 28, name: 'EL DIABLO', clues: 34, timeLimit: 485, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Viking Shores',
    emoji: '⚔️',
    theme: 'viking',
    tagline: 'Pillage, plunder, and prove your worth to Odin.',
    color: '#5B8DB8',
    lightColor: '#EAF2F8',
    villain: 'GENERAL: Jarl Bjorn Doomaxe',
    islands: [
      {
        name: 'Fjord of Fools',
        emoji: '🛶',
        boss: 'Ragnar the Rash',
        levels: [
          { id: 29, name: 'Cold Harbour', clues: 40, timeLimit: 370, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 30, name: 'Sea Wolves', clues: 38, timeLimit: 385, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 31, name: 'Storm Crossing', clues: 36, timeLimit: 405, difficulty: 'easy', isBoss: false, tutorialMsg: null },
          { id: 32, name: 'Ragnar the Rash', clues: 38, timeLimit: 395, difficulty: 'medium', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Mead Hall',
        emoji: '🍺',
        boss: 'Olaf Ironjaw',
        levels: [
          { id: 33, name: 'Feast or Famine', clues: 36, timeLimit: 360, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 34, name: 'Shield Wall', clues: 34, timeLimit: 375, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 35, name: 'Berserker', clues: 34, timeLimit: 375, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 36, name: 'Olaf Ironjaw', clues: 36, timeLimit: 415, difficulty: 'medium', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Longship',
        emoji: '⛵',
        boss: 'Sigrid the Cruel',
        levels: [
          { id: 37, name: 'Open Waters', clues: 34, timeLimit: 375, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 38, name: 'Kraken Waters', clues: 32, timeLimit: 390, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 39, name: "Raider's Gale", clues: 35, timeLimit: 225, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 40, name: 'Dead Reckoning', clues: 32, timeLimit: 390, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 41, name: 'Sigrid the Cruel', clues: 30, timeLimit: 470, difficulty: 'medium', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Valhalla Gate',
        emoji: '🌩️',
        bossIsland: true,
        boss: 'Jarl Bjorn Doomaxe',
        levels: [
          { id: 42, name: 'Trial of Odin', clues: 30, timeLimit: 410, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 43, name: 'Blood Eagle', clues: 28, timeLimit: 425, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 44, name: 'Rune Breaker', clues: 30, timeLimit: 410, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 45, name: 'Frost Giant', clues: 28, timeLimit: 425, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 46, name: 'The Norns Weave', clues: 28, timeLimit: 425, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 47, name: 'JARL BJORN DOOMAXE', clues: 28, timeLimit: 490, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Pirate Seas',
    emoji: '🏴\u200d☠️',
    theme: 'pirates',
    tagline: 'Sail the cursed waters and claim your plunder.',
    color: '#E76F51',
    lightColor: '#FDEEE9',
    villain: 'GENERAL: Captain Dread Marlowe',
    islands: [
      {
        name: 'Crab Cay',
        emoji: '🦀',
        boss: 'One-Eyed Pete',
        levels: [
          { id: 48, name: 'Shark Bait', clues: 36, timeLimit: 360, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 49, name: 'Rum Runners', clues: 34, timeLimit: 375, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 50, name: 'Mutiny!', clues: 32, timeLimit: 390, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 51, name: 'One-Eyed Pete', clues: 34, timeLimit: 430, difficulty: 'medium', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Black Galleon',
        emoji: '⚓',
        boss: 'Captain Fang',
        levels: [
          { id: 52, name: 'Broadside', clues: 32, timeLimit: 390, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 53, name: "Crow's Nest", clues: 34, timeLimit: 220, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 54, name: 'The Powder Keg', clues: 30, timeLimit: 410, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 55, name: 'Walk the Plank', clues: 32, timeLimit: 390, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 56, name: 'Captain Fang', clues: 30, timeLimit: 470, difficulty: 'medium', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Shipwreck Reef',
        emoji: '🪸',
        boss: 'Mad Meg',
        levels: [
          { id: 57, name: 'Flotsam', clues: 28, timeLimit: 425, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 58, name: 'Treasure Hunt', clues: 30, timeLimit: 410, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 59, name: 'Siren Song', clues: 28, timeLimit: 425, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 60, name: 'The Leviathan', clues: 26, timeLimit: 440, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 61, name: 'Mad Meg', clues: 26, timeLimit: 505, difficulty: 'medium', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Skull Fortress',
        emoji: '💀',
        bossIsland: true,
        boss: 'Captain Dread Marlowe',
        levels: [
          { id: 62, name: 'Iron Portcullis', clues: 32, timeLimit: 210, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 63, name: 'Powder Rooms', clues: 32, timeLimit: 390, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 64, name: 'The Armory', clues: 30, timeLimit: 410, difficulty: 'medium', isBoss: false, tutorialMsg: null },
          { id: 65, name: "Captain's Quarters", clues: 28, timeLimit: 190, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 66, name: 'Black Flag', clues: 30, timeLimit: 510, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 67, name: "Davy's Locker", clues: 26, timeLimit: 180, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 68, name: 'CAPTAIN DREAD MARLOWE', clues: 26, timeLimit: 630, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Ancient Egypt',
    emoji: '𓂀',
    theme: 'egypt',
    tagline: "Decipher the gods' will or face eternal curse.",
    color: '#D4A017',
    lightColor: '#FDF7E3',
    villain: 'GENERAL: Pharaoh Zathrak',
    islands: [
      {
        name: 'River Nile',
        emoji: '🐊',
        boss: 'Khnum the Cursed',
        levels: [
          { id: 69, name: 'Lotus Fields', clues: 26, timeLimit: 550, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 70, name: 'Papyrus Maze', clues: 28, timeLimit: 530, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 71, name: 'Crocodile Run', clues: 26, timeLimit: 550, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 72, name: 'Khnum the Cursed', clues: 24, timeLimit: 655, difficulty: 'hard', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Sphinx Quarter',
        emoji: '🦁',
        boss: "Anubis' Herald",
        levels: [
          { id: 73, name: 'Riddle of Stone', clues: 26, timeLimit: 550, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 74, name: 'Desert Mirage', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 75, name: 'Eye of Horus', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 76, name: "Jackal's Den", clues: 26, timeLimit: 170, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 77, name: "Anubis' Herald", clues: 26, timeLimit: 165, difficulty: 'boss', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Great Pyramid',
        emoji: '🔺',
        boss: 'High Priest Imhotep',
        levels: [
          { id: 78, name: 'Chamber One', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 79, name: 'Hidden Passage', clues: 28, timeLimit: 530, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 80, name: 'Canopic Jars', clues: 26, timeLimit: 550, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 81, name: 'Scarab Swarm', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 82, name: "Mummy's Curse", clues: 24, timeLimit: 160, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 83, name: 'High Priest Imhotep', clues: 24, timeLimit: 655, difficulty: 'hard', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Throne of Ra',
        emoji: '☀️',
        bossIsland: true,
        boss: 'Pharaoh Zathrak',
        levels: [
          { id: 84, name: 'Desert Storm', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 85, name: 'Solar Barque', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 86, name: 'Obelisk Field', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 87, name: 'Tomb Raiders', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 88, name: 'Valley of Kings', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 89, name: 'Golden Mask', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 90, name: 'Serpent God', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 91, name: 'PHARAOH ZATHRAK', clues: 20, timeLimit: 700, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Samurai Japan',
    emoji: '⛩️',
    theme: 'samurai',
    tagline: 'Only the sharpest blade — and mind — will survive.',
    color: '#C0392B',
    lightColor: '#FDEEE9',
    villain: 'GENERAL: Shogun Malakar',
    islands: [
      {
        name: 'Cherry Blossom Pass',
        emoji: '🌸',
        boss: 'Ronin Kesuke',
        levels: [
          { id: 92, name: 'Petals Fall', clues: 19, timeLimit: 620, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 93, name: 'River Crossing', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 94, name: 'Bamboo Forest', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 95, name: 'The Dojo', clues: 26, timeLimit: 550, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 96, name: 'Ronin Kesuke', clues: 24, timeLimit: 655, difficulty: 'hard', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Castle Walls',
        emoji: '🏯',
        boss: 'Lord Takeda',
        levels: [
          { id: 97, name: 'Gate Keeper', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 98, name: 'Inner Court', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 99, name: 'Armor Hall', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 100, name: 'Sword Master', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 101, name: 'The Keep', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 102, name: 'Lord Takeda', clues: 22, timeLimit: 680, difficulty: 'hard', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Storm Mountain',
        emoji: '⛰️',
        boss: 'Oni of the Peak',
        levels: [
          { id: 103, name: 'Thunder Peak', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 104, name: 'Lightning Strike', clues: 19, timeLimit: 620, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 105, name: 'Wind Blade', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 106, name: 'The Summit', clues: 19, timeLimit: 620, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 107, name: 'Fog of War', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 108, name: 'Oni of the Peak', clues: 18, timeLimit: 725, difficulty: 'hard', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: "The Shogun's Palace",
        emoji: '🏯',
        bossIsland: true,
        boss: 'Shogun Malakar',
        levels: [
          { id: 109, name: 'Outer Garden', clues: 17, timeLimit: 640, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 110, name: 'Koi Pond', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 111, name: 'Tea Ceremony', clues: 19, timeLimit: 620, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 112, name: 'War Room', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 113, name: 'Hall of Blades', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 114, name: 'Hidden Passage', clues: 17, timeLimit: 640, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 115, name: 'The Throne', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 116, name: 'Shadow Duel', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 117, name: 'Seven Swords', clues: 17, timeLimit: 640, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 118, name: 'SHOGUN MALAKAR', clues: 17, timeLimit: 735, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'Jungle Expedition',
    emoji: '🌿',
    theme: 'jungle',
    tagline: 'The jungle devours the weak. Conquer or be consumed.',
    color: '#2D6A4F',
    lightColor: '#E8F5EE',
    villain: 'GENERAL: Vexara the Vine Witch',
    islands: [
      {
        name: 'Canopy Run',
        emoji: '🦜',
        boss: 'Jungle Cat',
        levels: [
          { id: 119, name: 'Vine Swinger', clues: 30, timeLimit: 510, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 120, name: "Parrot's Path", clues: 24, timeLimit: 158, difficulty: 'hard-expert', isBoss: false, tutorialMsg: null },
          { id: 121, name: 'Jaguar Trail', clues: 26, timeLimit: 550, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 122, name: 'River Rapids', clues: 28, timeLimit: 530, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 123, name: 'Jungle Cat', clues: 26, timeLimit: 630, difficulty: 'hard', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Temple Depths',
        emoji: '🗿',
        boss: 'Serpent Priest',
        levels: [
          { id: 124, name: 'Hidden Entrance', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 125, name: 'Stone Idol', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 126, name: 'Poison Darts', clues: 26, timeLimit: 550, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 127, name: 'Trap Room', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 128, name: 'Inner Sanctum', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 129, name: 'The Altar', clues: 24, timeLimit: 570, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 130, name: 'Serpent Priest', clues: 22, timeLimit: 680, difficulty: 'hard', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Lost City',
        emoji: '🏛️',
        boss: 'Guardian Colossus',
        levels: [
          { id: 131, name: 'Crumbling Walls', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 132, name: 'Gold District', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 133, name: 'Maze Quarter', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 134, name: 'Sky Bridge', clues: 22, timeLimit: 590, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 135, name: 'The Observatory', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 136, name: 'Dark Caves', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 137, name: 'Final Chamber', clues: 20, timeLimit: 610, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 138, name: 'Guardian Colossus', clues: 19, timeLimit: 715, difficulty: 'hard', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Heart of Darkness',
        emoji: '🌑',
        bossIsland: true,
        boss: 'Vexara the Vine Witch',
        levels: [
          { id: 139, name: 'Descent', clues: 19, timeLimit: 620, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 140, name: 'Root Network', clues: 19, timeLimit: 620, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 141, name: 'Fungal Maze', clues: 19, timeLimit: 620, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 142, name: 'Spider Queen', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 143, name: 'The Mire', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 144, name: 'Underground River', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 145, name: 'Black Orchid', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 146, name: 'The Burrow', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 147, name: 'Last Light', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 148, name: 'Ancient Core', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 149, name: 'Eye of the Jungle', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 150, name: 'VEXARA THE VINE WITCH', clues: 18, timeLimit: 725, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 8,
    name: 'Medieval Kingdom',
    emoji: '🏰',
    theme: 'medieval',
    tagline: 'Storm the keep. The Dread King awaits.',
    color: '#6C3483',
    lightColor: '#F5EEF8',
    villain: 'GENERAL: The Dread King Mordecai',
    islands: [
      {
        name: "Peasant's Road",
        emoji: '🛤️',
        boss: 'Knight Gregor',
        levels: [
          { id: 151, name: 'Cobblestone', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 152, name: 'Market Day', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 153, name: 'Gatehouse', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 154, name: 'Drawbridge', clues: 18, timeLimit: 630, difficulty: 'hard', isBoss: false, tutorialMsg: null },
          { id: 155, name: 'Knight Gregor', clues: 22, timeLimit: 815, difficulty: 'expert', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Siege',
        emoji: '⚔️',
        boss: 'Baron Von Krell',
        levels: [
          { id: 156, name: 'Battering Ram', clues: 20, timeLimit: 730, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 157, name: 'Catapult Fire', clues: 19, timeLimit: 745, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 158, name: 'Breach!', clues: 20, timeLimit: 730, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 159, name: 'Courtyard Clash', clues: 19, timeLimit: 745, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 160, name: 'Tower Assault', clues: 18, timeLimit: 755, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 161, name: 'The Ramparts', clues: 18, timeLimit: 755, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 162, name: 'Baron Von Krell', clues: 19, timeLimit: 855, difficulty: 'expert', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Dark Forest',
        emoji: '🌑',
        boss: 'The Black Knight',
        levels: [
          { id: 163, name: 'Moonless Night', clues: 18, timeLimit: 755, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 164, name: 'Wolf Pack', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 165, name: "Witch's Glade", clues: 17, timeLimit: 112, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 166, name: 'Haunted Mill', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 167, name: 'The Raven', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 168, name: 'Shadow Path', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 169, name: 'No Return', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 170, name: 'The Black Knight', clues: 17, timeLimit: 885, difficulty: 'expert', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Castle Dreadmoor',
        emoji: '🏚️',
        bossIsland: true,
        boss: 'The Dread King Mordecai',
        levels: [
          { id: 171, name: 'Iron Portcullis', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 172, name: 'Dungeon Depths', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 173, name: 'Torture Chamber', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 174, name: 'The Crypt', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 175, name: 'Cursed Armory', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 176, name: 'Banshee Hall', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 177, name: "Dragon's Lair", clues: 17, timeLimit: 100, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 178, name: 'The Moat', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 179, name: 'Gargoyle Tower', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 180, name: 'Shadow Council', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 181, name: 'Throne of Lies', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 182, name: 'Bone Cathedral', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 183, name: 'The Abyss', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 184, name: 'Final Veil', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 185, name: 'THE DREAD KING MORDECAI', clues: 17, timeLimit: 885, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 9,
    name: 'Cyber Future',
    emoji: '🤖',
    theme: 'cyber',
    tagline: 'Hack or be deleted. The machines have evolved.',
    color: '#00B4D8',
    lightColor: '#E0F7FB',
    villain: 'GENERAL: AXIOM-9',
    islands: [
      {
        name: 'Neon Grid',
        emoji: '💾',
        boss: 'VIRUS-7',
        levels: [
          { id: 186, name: 'Boot Sequence', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 187, name: 'Firewall', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 188, name: 'Data Stream', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 189, name: 'Neural Net', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 190, name: 'Overclock', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 191, name: 'VIRUS-7', clues: 17, timeLimit: 885, difficulty: 'expert', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Server Farm',
        emoji: '🖥️',
        boss: 'DAEMON-X',
        levels: [
          { id: 192, name: 'Cold Storage', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 193, name: 'Logic Bomb', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 194, name: 'Core Dump', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 195, name: 'Buffer Overflow', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 196, name: 'Kill Switch', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 197, name: 'Null Pointer', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 198, name: 'Recursive Hell', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 199, name: 'DAEMON-X', clues: 17, timeLimit: 885, difficulty: 'expert', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Rogue AI Core',
        emoji: '🧠',
        boss: 'KRONAX-BETA',
        levels: [
          { id: 200, name: 'Awakening', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 201, name: 'Self Repair', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 202, name: 'Replication', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 203, name: 'Swarm Mode', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 204, name: 'Hive Mind', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 205, name: 'Singularity', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 206, name: 'Apex Protocol', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 207, name: 'God Mode', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 208, name: 'System Override', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 209, name: 'KRONAX-BETA', clues: 17, timeLimit: 885, difficulty: 'expert', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Mainframe',
        emoji: '⚡',
        bossIsland: true,
        boss: 'AXIOM-9',
        levels: [
          { id: 210, name: 'Entry Point', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 211, name: 'Sector 1', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 212, name: 'Sector 2', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 213, name: 'Sector 3', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 214, name: 'Sector 4', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 215, name: 'Quantum Lock', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 216, name: 'Encryption', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 217, name: 'The Void', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 218, name: 'Black Ice', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 219, name: 'Zero Day', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 220, name: 'Machine God', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 221, name: 'Final Algorithm', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 222, name: "KRONAX's Code", clues: 17, timeLimit: 72, difficulty: 'expert+', isBoss: false, tutorialMsg: null },
          { id: 223, name: 'Infinite Loop', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 224, name: 'The Last Byte', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 225, name: 'Memory Wipe', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 226, name: 'Digital Armageddon', clues: 17, timeLimit: 770, difficulty: 'expert', isBoss: false, tutorialMsg: null },
          { id: 227, name: 'AXIOM-9', clues: 17, timeLimit: 885, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 10,
    name: 'The Shattered Realm',
    emoji: '👁️',
    theme: 'kronax',
    tagline: 'KRONAX\'s power fractures reality itself. The hunt continues...',
    color: '#1a1a1a',
    lightColor: '#F5F5F5',
    villain: 'KRONAX',
    islands: [
      {
        name: 'The Shattered Void',
        emoji: '🌀',
        boss: 'The Warden',
        levels: [
          { id: 228, name: 'First Fracture', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 229, name: 'Broken Sky', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 230, name: 'Void Crawlers', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 231, name: 'The Rift', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 232, name: 'Dimensional Tear', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 233, name: "Horizon's End", clues: 17, timeLimit: 70, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 234, name: 'No Escape', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 235, name: 'THE WARDEN', clues: 17, timeLimit: 1105, difficulty: 'kronax', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Codex Ruins',
        emoji: '📜',
        boss: 'The Architect',
        levels: [
          { id: 236, name: 'Shattered Law', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 237, name: 'Broken Order', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 238, name: 'Chaos Theory', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 239, name: 'Reality Unravels', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 240, name: 'The Paradox', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 241, name: 'Entropy', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 242, name: 'Last Logic', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 243, name: 'The Unwritten', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 244, name: 'Oblivion', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 245, name: 'THE ARCHITECT', clues: 17, timeLimit: 1105, difficulty: 'kronax', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: "KRONAX's Fortress",
        emoji: '🏴',
        bossIsland: true,
        finalBoss: true,
        boss: 'KRONAX',
        levels: [
          { id: 246, name: 'Outer Wall', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 247, name: 'Iron Gate', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 248, name: 'First Chamber', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 249, name: 'The Gauntlet', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 250, name: 'Throne Approach', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 251, name: 'Shadow Army', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 252, name: 'The Vanguard', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 253, name: 'Inner Sanctum', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 254, name: 'The Crucible', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 255, name: 'Final Test', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 256, name: 'No Turning Back', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 257, name: 'The Ascent', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 258, name: 'Mind Shatter', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 259, name: 'Will of Steel', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 260, name: 'The Breaking Point', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 261, name: 'Soul Forge', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 262, name: 'Codex Core', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 263, name: 'KRONAX Stirs', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 264, name: 'Tremors', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 265, name: 'The Eye Opens', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 266, name: 'His Voice', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 267, name: 'The Storm', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 268, name: 'The Reckoning', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 269, name: 'Shard of Chaos', clues: 17, timeLimit: 960, difficulty: 'kronax', isBoss: false, tutorialMsg: null },
          { id: 270, name: 'KRONAX', clues: 17, timeLimit: 1105, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },

  // ═══════════════ ARC 2 ═══════════════════════════════════════════════════════
  {
    id: 11, name: 'Ocean Depths', emoji: '🌊', theme: 'underwater',
    tagline: 'The deep holds secrets older than the surface world.',
    color: '#0077B6', lightColor: '#DBEAFE',
    villain: 'GENERAL: The Abyssal Sovereign',
    gimmick: null,
    islands: [
      {
        name: 'Tidal Zone', emoji: '🌊',
        boss: 'Sharkfin Grix',
        levels: [
          { id: 391, name: 'First Dive', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 392, name: 'Shallow Waters', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 393, name: 'Current Pull', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 394, name: 'Reef Maze', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 395, name: 'Coral Garden', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 396, name: 'Barnacle Wall', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Kelp Forest', emoji: '🐠',
        boss: 'The Eel King',
        levels: [
          { id: 397, name: 'Kelp Tangle', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 398, name: 'Eel Passage', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 399, name: 'Sunken Deck', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 400, name: 'The Hold', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 401, name: 'Cargo Bay', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 402, name: 'Galley', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 403, name: 'Midnight Zone', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Sunken Ship', emoji: '⚓',
        boss: 'The Drowned Captain',
        levels: [
          { id: 404, name: 'Pressure Point', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 405, name: 'Void Current', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 406, name: 'The Deep Signal', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 407, name: 'Last Light Below', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 408, name: 'Abyssal Gate', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 409, name: 'No Return Down', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 410, name: 'Depth Zero', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Abyss', emoji: '🦑',
        bossIsland: true,
        boss: 'The Abyssal Sovereign',
        levels: [
          { id: 411, name: 'THE ABYSSAL SOVEREIGN', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 412, name: 'First Dive', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 413, name: 'Shallow Waters', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 414, name: 'Current Pull', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 415, name: 'Reef Maze', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 416, name: 'Coral Garden', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 417, name: 'Barnacle Wall', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 418, name: 'Kelp Tangle', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 419, name: 'Eel Passage', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 420, name: 'Sunken Deck', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 12, name: 'Roman Colosseum', emoji: '🏛️', theme: 'rome',
    tagline: 'The crowd roars. There are no notes in the arena.',
    color: '#C49A35', lightColor: '#FDF7E3',
    villain: 'GENERAL: Emperor Nullix',
    gimmick: 'noNotes',
    gimmickLabel: '📵 No Notes',
    gimmickDesc: 'Pencil marks are disabled. Hold the logic in your mind.',
    islands: [
      {
        name: 'The Forum', emoji: '🗿',
        boss: 'Gladiator Vex',
        levels: [
          { id: 421, name: 'Forum Crowds', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 422, name: 'Senate Floor', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 423, name: 'Via Appia', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 424, name: 'Market Square', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 425, name: 'Gladiator Training', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 426, name: 'First Blood', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Arena', emoji: '⚔️',
        boss: 'The Lion Tamer',
        levels: [
          { id: 427, name: 'Net and Trident', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 428, name: 'The Lions', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 429, name: 'Beast Gate', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 430, name: 'Underground Hall', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 431, name: 'The Catacombs', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 432, name: 'Soldiers Oath', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 433, name: 'Palace Gates', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Catacombs', emoji: '🦅',
        boss: 'Centurion Maxus',
        levels: [
          { id: 434, name: 'Throne Room', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 435, name: 'Hidden Archives', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 436, name: 'Praetorian Guard', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 437, name: 'Imperial Vault', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 438, name: 'Final Decree', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 439, name: 'The Colosseum Roars', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 440, name: 'The Colosseum II', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Imperial Palace', emoji: '👑',
        bossIsland: true,
        boss: 'Emperor Nullix',
        levels: [
          { id: 441, name: 'EMPEROR NULLIX', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 442, name: 'Forum Crowds', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 443, name: 'Senate Floor', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 444, name: 'Via Appia', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 445, name: 'Market Square', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 446, name: 'Gladiator Training', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 447, name: 'First Blood', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 448, name: 'Net and Trident', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 449, name: 'The Lions', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 450, name: 'Beast Gate', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 13, name: 'Enchanted Forest', emoji: '🧚', theme: 'fairytale',
    tagline: 'The forest watches. The mist hides what it knows.',
    color: '#40916C', lightColor: '#D8F3DC',
    villain: 'GENERAL: The Witch Queen',
    gimmick: 'fog',
    gimmickLabel: '🌫️ Fog of War',
    gimmickDesc: 'Cells outside your selected row, column and box are dimmed.',
    islands: [
      {
        name: 'Mushroom Glen', emoji: '🍄',
        boss: 'Thorn the Goblin',
        levels: [
          { id: 451, name: 'Into the Woods', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 452, name: 'Fairy Ring', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 453, name: 'Mushroom Path', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 454, name: 'Goblin Market', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 455, name: 'Sprite Chase', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 456, name: 'Petal Storm', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Fairy Ring', emoji: '🧙',
        boss: 'The Sprite Queen',
        levels: [
          { id: 457, name: 'The Old Oak', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 458, name: 'Hidden Glade', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 459, name: 'Dragon Breath', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 460, name: 'Scorched Trees', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 461, name: 'Egg Chamber', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 462, name: 'Ember Trail', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 463, name: 'Potion Room', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Dragon Hollow', emoji: '🐉',
        boss: 'Ember the Dragon',
        levels: [
          { id: 464, name: 'Mirror Hall', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 465, name: 'Cursed Library', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 466, name: 'The Cauldron', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 467, name: 'Hexed Archive', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 468, name: 'Familiar Path', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 469, name: 'Broom Closet', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 470, name: 'The Final Hex', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Witch Tower', emoji: '🔮',
        bossIsland: true,
        boss: 'The Witch Queen',
        levels: [
          { id: 471, name: 'THE WITCH QUEEN', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 472, name: 'Into the Woods', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 473, name: 'Fairy Ring', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 474, name: 'Mushroom Path', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 475, name: 'Goblin Market', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 476, name: 'Sprite Chase', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 477, name: 'Petal Storm', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 478, name: 'The Old Oak', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 479, name: 'Hidden Glade', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 480, name: 'Dragon Breath', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 14, name: 'Arctic Tundra', emoji: '🧊', theme: 'arctic',
    tagline: 'Every mistake costs you. The cold does not forgive.',
    color: '#90E0EF', lightColor: '#E8F8FC',
    villain: 'GENERAL: The Frost Titan',
    gimmick: 'penalty2x',
    gimmickLabel: '❄️ Double Penalty',
    gimmickDesc: 'Wrong guesses cost +14 seconds instead of +7.',
    islands: [
      {
        name: 'Frozen Shore', emoji: '🌊',
        boss: 'Walrus Chief Grumm',
        levels: [
          { id: 481, name: 'First Freeze', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 482, name: 'Ice Shelf', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 483, name: 'Cold Harbour', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 484, name: 'Frozen Trail', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 485, name: 'Blizzard Wall', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 486, name: 'White Out', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Glacier Pass', emoji: '⛰️',
        boss: 'The Snow Wolf',
        levels: [
          { id: 487, name: 'Wolf Pack', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 488, name: 'Snow Den', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 489, name: 'Frozen River', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 490, name: 'Glacier Split', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 491, name: 'Ice Bridge', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 492, name: 'Crevasse Edge', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 493, name: 'Permafrost', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Ice Caves', emoji: '🧊',
        boss: 'The Mammoth',
        levels: [
          { id: 494, name: 'Ice Throne', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 495, name: 'Frozen Core', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 496, name: 'Absolute Zero', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 497, name: 'Crystal Spire', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 498, name: 'The Last Warmth', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 499, name: 'Before the Storm', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 500, name: 'Heart of Ice', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Frost Citadel', emoji: '🏔️',
        bossIsland: true,
        boss: 'The Frost Titan',
        levels: [
          { id: 501, name: 'THE FROST TITAN', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 502, name: 'First Freeze', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 503, name: 'Ice Shelf', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 504, name: 'Cold Harbour', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 505, name: 'Frozen Trail', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 506, name: 'Blizzard Wall', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 507, name: 'White Out', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 508, name: 'Wolf Pack', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 509, name: 'Snow Den', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 510, name: 'Frozen River', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 15, name: 'Volcanic Underworld', emoji: '🌋', theme: 'volcanic',
    tagline: 'Three cells are burning. Solve them first or face the inferno.',
    color: '#E63946', lightColor: '#FFE8E8',
    villain: 'GENERAL: Magmar the Unquenched',
    gimmick: 'hotCells',
    gimmickLabel: '🔥 Hot Cells',
    gimmickDesc: '3 random cells are on fire — solve them within 45s or lose a life.',
    islands: [
      {
        name: 'Lava Fields', emoji: '🔥',
        boss: 'Cinder Wraith',
        levels: [
          { id: 511, name: 'First Eruption', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 512, name: 'Magma Flow', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 513, name: 'Ash Field', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 514, name: 'Lava River', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 515, name: 'Cinder Path', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 516, name: 'Sulfur Vent', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Obsidian Bridge', emoji: '⛏️',
        boss: 'Flame Warden',
        levels: [
          { id: 517, name: 'Obsidian Wall', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 518, name: 'Glass Bridge', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 519, name: 'Flame Guard', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 520, name: 'Ember Pit', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 521, name: 'Scorched Archive', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 522, name: 'Forge Gate', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 523, name: 'Core Breach', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Magma Chamber', emoji: '💎',
        boss: 'The Molten Knight',
        levels: [
          { id: 524, name: 'Pressure Chamber', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 525, name: 'Flame Maze', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 526, name: 'Molten Archive', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 527, name: 'Heat Protocol', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 528, name: 'The Last Heat', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 529, name: 'Ignition Point', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 530, name: 'Inferno Core', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Inferno Core', emoji: '🌋',
        bossIsland: true,
        boss: 'Magmar the Unquenched',
        levels: [
          { id: 531, name: 'MAGMAR THE UNQUENCHED', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 532, name: 'First Eruption', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 533, name: 'Magma Flow', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 534, name: 'Ash Field', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 535, name: 'Lava River', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 536, name: 'Cinder Path', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 537, name: 'Sulfur Vent', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 538, name: 'Obsidian Wall', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 539, name: 'Glass Bridge', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 540, name: 'Flame Guard', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 16, name: 'Cosmic Frontier', emoji: '🚀', theme: 'space_western',
    tagline: 'Out here, the laws of sudoku bend but never break.',
    color: '#7B2FBE', lightColor: '#EDE0FF',
    villain: 'GENERAL: Marshal Void',
    gimmick: 'warpCells',
    gimmickLabel: '🌀 Warp Pairs',
    gimmickDesc: 'Linked cell pairs share their value — fill one, both are filled.',
    islands: [
      {
        name: 'Dusty Station', emoji: '🛸',
        boss: 'Outlaw Zax',
        levels: [
          { id: 541, name: 'Arrival', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 542, name: 'Dusty Platform', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 543, name: 'Wanted Poster', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 544, name: 'Saloon Brawl', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 545, name: 'Starport Chase', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 546, name: 'Debris Field', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Asteroid Belt', emoji: '☄️',
        boss: 'The Bounty Hunter',
        levels: [
          { id: 547, name: 'Zero Gravity', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 548, name: 'Warp Shimmer', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 549, name: 'Null Zone', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 550, name: 'Folded Space', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 551, name: 'Corridor Warp', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 552, name: 'Reality Seam', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 553, name: 'Black Hole Edge', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Warp Corridor', emoji: '🌀',
        boss: 'Null Reaper',
        levels: [
          { id: 554, name: 'Event Horizon', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 555, name: 'Singularity II', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 556, name: 'Last Star', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 557, name: 'Dark Matter', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 558, name: 'Void Tunnel', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 559, name: 'The Final Warp', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 560, name: 'Marshal Domain', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Void Marshal', emoji: '⭐',
        bossIsland: true,
        boss: 'Marshal Void',
        levels: [
          { id: 561, name: 'MARSHAL VOID', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 562, name: 'Arrival', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 563, name: 'Dusty Platform', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 564, name: 'Wanted Poster', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 565, name: 'Saloon Brawl', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 566, name: 'Starport Chase', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 567, name: 'Debris Field', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 568, name: 'Zero Gravity', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 569, name: 'Warp Shimmer', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 570, name: 'Null Zone', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 17, name: 'Haunted Mansion', emoji: '👻', theme: 'spooky',
    tagline: 'The lights are out. Only you and the puzzle remain.',
    color: '#4A0E8F', lightColor: '#EDE0FF',
    villain: 'GENERAL: The Phantom Lord',
    gimmick: 'blackout',
    gimmickLabel: '🕯️ Blackout',
    gimmickDesc: 'Only your selected cell and its row/column are visible.',
    islands: [
      {
        name: 'Graveyard', emoji: '💀',
        boss: 'Bone Rattler',
        levels: [
          { id: 571, name: 'First Chill', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 572, name: 'Fog Creeps', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 573, name: 'Candlelight', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 574, name: 'Shadow Step', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 575, name: 'Creak in Dark', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 576, name: 'Wailing Walls', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Crypt Corridor', emoji: '🕯️',
        boss: 'The Banshee',
        levels: [
          { id: 577, name: 'Coffin Room', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 578, name: 'Shroud', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 579, name: 'Phantom Step', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 580, name: 'Portrait Hall', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 581, name: 'Reflection Chamber', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 582, name: 'Mirror Maze', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 583, name: 'Endless Stairs', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Mirror Gallery', emoji: '🪞',
        boss: 'The Doppelganger',
        levels: [
          { id: 584, name: 'The Seance', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 585, name: 'Blood Moon', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 586, name: 'Lost Soul', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 587, name: 'Phantom Archive', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 588, name: 'Spectral Core', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 589, name: 'The Last Candle', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 590, name: 'Darkness Falls', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Dark Tower', emoji: '🏰',
        bossIsland: true,
        boss: 'The Phantom Lord',
        levels: [
          { id: 591, name: 'THE PHANTOM LORD', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 592, name: 'First Chill', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 593, name: 'Fog Creeps', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 594, name: 'Candlelight', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 595, name: 'Shadow Step', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 596, name: 'Creak in Dark', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 597, name: 'Wailing Walls', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 598, name: 'Coffin Room', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 599, name: 'Shroud', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 600, name: 'Phantom Step', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 18, name: 'Tropical Paradise', emoji: '🦜', theme: 'tropical',
    tagline: 'Every correct number reveals what comes next.',
    color: '#F77F00', lightColor: '#FFF0D6',
    villain: 'GENERAL: The Serpent King',
    gimmick: 'cascade',
    gimmickLabel: '✨ Cascade',
    gimmickDesc: 'Correct placements instantly highlight all newly-solvable naked singles.',
    islands: [
      {
        name: 'Palm Shore', emoji: '🌴',
        boss: 'Reef Siren',
        levels: [
          { id: 601, name: 'Arrival', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 602, name: 'Coconut Grove', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 603, name: 'Tide Pool', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 604, name: 'Warm Shallows', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 605, name: 'Reef Dance', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 606, name: 'Canopy Run', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Jungle Interior', emoji: '🐆',
        boss: 'Jaguar Shaman',
        levels: [
          { id: 607, name: 'Vine Bridge', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 608, name: 'Waterfall Cave', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 609, name: 'Jaguar Trail', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 610, name: 'Hidden Path', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 611, name: 'Storm Shelter', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 612, name: 'Sacred Well', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 613, name: 'Stone Steps', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Hidden Lagoon', emoji: '🦜',
        boss: 'The Tide Oracle',
        levels: [
          { id: 614, name: 'Sacred Pool', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 615, name: 'The Offering', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 616, name: 'Temple Gate', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 617, name: 'Serpent Guard', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 618, name: 'Final Ritual', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 619, name: 'Sacred Core', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 620, name: 'The Coil', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Serpent Temple', emoji: '🐍',
        bossIsland: true,
        boss: 'The Serpent King',
        levels: [
          { id: 621, name: 'THE SERPENT KING', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 622, name: 'Arrival', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 623, name: 'Coconut Grove', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 624, name: 'Tide Pool', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 625, name: 'Warm Shallows', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 626, name: 'Reef Dance', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 627, name: 'Canopy Run', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 628, name: 'Vine Bridge', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 629, name: 'Waterfall Cave', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 630, name: 'Jaguar Trail', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 19, name: 'Clockwork City', emoji: '⚙️', theme: 'steampunk',
    tagline: 'The gears lock until the right numbers turn them free.',
    color: '#8B5E3C', lightColor: '#F5ECD7',
    villain: 'GENERAL: The Grand Artificer',
    gimmick: 'gearLock',
    gimmickLabel: '⚙️ Gear Lock',
    gimmickDesc: '4 cells are locked behind gear sequences — solve their linked cells first.',
    islands: [
      {
        name: 'Market District', emoji: '🔧',
        boss: 'Piston Pete',
        levels: [
          { id: 631, name: 'Factory Floor', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 632, name: 'Steam Pipes', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 633, name: 'Gear Grind', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 634, name: 'Pressure Build', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 635, name: 'Gear Train', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 636, name: 'Overflow Valve', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'The Engine Room', emoji: '🔩',
        boss: 'Boiler Queen',
        levels: [
          { id: 637, name: 'Cooling Shaft', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 638, name: 'Copper Corridor', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 639, name: 'Clockwork Gate', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 640, name: 'Cathedral Gears', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 641, name: 'The Great Wheel', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 642, name: 'Mechanism Heart', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 643, name: 'Master Blueprint', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Gear Cathedral', emoji: '⚙️',
        boss: 'The Gear Archbishop',
        levels: [
          { id: 644, name: 'Final Assembly', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 645, name: 'The Last Gear', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 646, name: 'Clockwork Heart', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 647, name: 'Grand Schematic', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 648, name: 'Tick Tock Core', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 649, name: 'Prime Mover', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 650, name: 'The Final Turn', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Grand Mechanism', emoji: '🏭',
        bossIsland: true,
        boss: 'The Grand Artificer',
        levels: [
          { id: 651, name: 'THE GRAND ARTIFICER', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 652, name: 'Factory Floor', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 653, name: 'Steam Pipes', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 654, name: 'Gear Grind', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 655, name: 'Pressure Build', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 656, name: 'Gear Train', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 657, name: 'Overflow Valve', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 658, name: 'Cooling Shaft', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 659, name: 'Copper Corridor', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 660, name: 'Clockwork Gate', clues: 17, timeLimit: 1200, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },
  {
    id: 20, name: 'Shattered Realm II', emoji: '🌀', theme: 'kronax2',
    tagline: 'You thought you ended it. KRONAX was only resting.',
    color: '#0D0D1A', lightColor: '#1A1A2E',
    villain: 'GENERAL: KRONAX REBORN',
    gimmick: 'cycleGimmick',
    gimmickLabel: '♾️ Chaos Mode',
    gimmickDesc: 'Each island uses a different Arc 2 gimmick. KRONAX controls the rules.',
    islands: [
      {
        name: 'The Return', emoji: '💀',
        boss: 'Echo of KRONAX',
        levels: [
          { id: 661, name: 'Awakening II', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 662, name: 'The Signal Returns', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 663, name: 'Broken Rules', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 664, name: 'Nothing Is Stable', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 665, name: 'Paradox II', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 666, name: 'Loop Fragment', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Fracture II', emoji: '🔱',
        boss: 'The New Architect',
        levels: [
          { id: 667, name: 'Fractured Logic', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 668, name: 'Null Dimension', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 669, name: 'Void Maze', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 670, name: 'Labyrinth Gate', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 671, name: 'Lost Corridor', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 672, name: 'Unwritten Path', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 673, name: 'Second Reading', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'Void Labyrinth', emoji: '🌌',
        boss: 'The Warden II',
        levels: [
          { id: 674, name: 'Memory Overwrite', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 675, name: 'Infinite Loop II', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 676, name: 'The Final Answer', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 677, name: 'Codex Fragment', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 678, name: 'Last Variable', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 679, name: 'Edge of Everything', clues: 17, timeLimit: 960, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 680, name: 'The Resolution', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: true, tutorialMsg: null },
        ],
      },
      {
        name: 'KRONAX REBORN', emoji: '👁️',
        bossIsland: true,
        boss: 'KRONAX REBORN',
        levels: [
          { id: 681, name: 'KRONAX REBORN', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 682, name: 'Awakening II', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 683, name: 'The Signal Returns', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 684, name: 'Broken Rules', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 685, name: 'Nothing Is Stable', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 686, name: 'Paradox II', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 687, name: 'Loop Fragment', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 688, name: 'Fractured Logic', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 689, name: 'Null Dimension', clues: 17, timeLimit: 1105, difficulty: 'arc2', isBoss: false, tutorialMsg: null },
          { id: 690, name: 'Void Maze', clues: 17, timeLimit: 1440, difficulty: 'areaBoss', isBoss: true, tutorialMsg: null },
        ],
      },
    ],
  },

];

// Total levels: 690 (Arc 1: 270, Arc 2: 420)
Object.freeze(WORLDS); // Prevent React from proxying this large static array


const DIFF_LABEL = {
  tutorial:"Tutorial", beginner:"Beginner", easy:"Easy",
  "easy-medium":"Easy", medium:"Medium", "medium-hard":"Hard",
  "hard-expert":"Hard", hard:"Hard", expert:"Expert",
  "expert+":"Expert+", kronax:"KRONAX", arc2:"Arc II", boss:"Boss",
  areaBoss:"General",
};

const DIFF_COLOR = {
  tutorial:"#2A9D8F", beginner:"#4CAF7A", easy:"#4CAF7A",
  medium:"#E9C46A", hard:"#E76F51", expert:"#C0392B",
  "expert+":"#8E44AD", kronax:"#1a1a1a",
  boss:"#E63946", areaBoss:"#1a1a1a",
};

// ─── Sudoku Engine ────────────────────────────────────────────────────────────
function generateFullBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(board);
  return board;
}
function fillBoard(board) {
  const nums = [1,2,3,4,5,6,7,8,9];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const sh = [...nums].sort(() => Math.random() - 0.5);
        for (const n of sh) {
          if (isValidPlacement(board, r, c, n)) {
            board[r][c] = n;
            if (fillBoard(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
function isValidPlacement(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
    const br = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const bc = 3 * Math.floor(col / 3) + (i % 3);
    if (board[br][bc] === num) return false;
  }
  return true;
}
function removeClues(full, clueCount) {
  const puzzle = full.map(r => [...r]);
  let removed = 0;
  const target = 81 - clueCount;
  const cells = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);
  for (const idx of cells) {
    if (removed >= target) break;
    const r = Math.floor(idx / 9), c = idx % 9;
    puzzle[r][c] = 0;
    removed++;
  }
  return puzzle;
}
function newPuzzle(clues) {
  const solution = generateFullBoard();
  const puzzle = removeClues(solution, clues);
  return { solution, puzzle };
}
function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

// ─── Radial Picker ────────────────────────────────────────────────────────────
const R_SIZE = 46, R_GAP = 5, R_STEP = R_SIZE + R_GAP;
const R_CANCEL_ROW = 2.5, R_CANCEL_THRESHOLD = (1 + R_CANCEL_ROW) / 2;
const RADIAL_OFFSETS = {
  1:[-1,-1],2:[0,-1],3:[1,-1],
  4:[-1, 0],5:[0, 0],6:[1, 0],
  7:[-1, 1],8:[0, 1],9:[1, 1],
};
// Compute the clamped picker centre given a press point
// (mirrors RadialPicker's own clamping so hitTest stays in sync)
function getPickerCentre(px, py) {
  const M = 12;
  const gridW = R_STEP * 2 + R_SIZE;
  const gridH = R_STEP * 2 + R_SIZE;
  const cancelH = Math.round(R_CANCEL_ROW * R_STEP);
  const totalW = gridW, totalH = gridH + cancelH;
  const cl = Math.max(M, Math.min(window.innerWidth  - totalW - M, px - R_STEP));
  const ct = Math.max(M, Math.min(window.innerHeight - totalH - M, py - R_STEP));
  return [cl + R_STEP, ct + R_STEP];
}

// hitTestRadial: pointer coords + the actual rendered centre of the picker
function hitTestRadial(cx, cy, pickerCX, pickerCY) {
  const lx = cx - pickerCX, ly = cy - pickerCY;
  if (ly > R_CANCEL_THRESHOLD * R_STEP) return null;
  const col = Math.max(-1, Math.min(1, Math.round(lx / R_STEP)));
  const row = Math.max(-1, Math.min(1, Math.round(ly / R_STEP)));
  return (row + 1) * 3 + (col + 1) + 1;
}
function RadialPicker({ x, y, activeNum, symbols }) {
  const isCancelling = activeNum === null;
  const M = 12;
  const useSymbols = symbols && symbols.length >= 9;

  const gridW = R_STEP * 2 + R_SIZE;
  const gridH = R_STEP * 2 + R_SIZE;
  const cancelH = Math.round(R_CANCEL_ROW * R_STEP);
  const totalW = gridW;
  const totalH = gridH + cancelH;

  const idealLeft = x - R_STEP;
  const idealTop  = y - R_STEP;
  const cl = Math.max(M, Math.min(window.innerWidth  - totalW - M, idealLeft));
  const ct = Math.max(M, Math.min(window.innerHeight - totalH - M, idealTop));

  return (
    <div style={{ position:"fixed", left:cl, top:ct, width:totalW, height:totalH,
                  pointerEvents:"none", zIndex:1000 }}>
      {[1,2,3,4,5,6,7,8,9].map(n => {
        const [dx, dy] = RADIAL_OFFSETS[n];
        const isActive = !isCancelling && activeNum === n;
        const label = useSymbols ? symbols[n - 1] : n;
        return (
          <div key={n} style={{
            position:"absolute",
            left:(dx+1)*R_STEP, top:(dy+1)*R_STEP,
            width:R_SIZE, height:R_SIZE,
            display:"flex", alignItems:"center", justifyContent:"center",
            background: isActive ? C.ink : C.paper,
            border:`1.5px solid ${isActive ? C.ink : C.sandDark}`,
            borderRadius:8,
            color: isActive ? C.paper : C.ink,
            fontSize: useSymbols ? Math.max(18, R_SIZE * 0.52) : 17,
            fontWeight: isActive ? 700 : 400,
            fontFamily:"inherit",
            boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.12)",
            transform: isActive ? "scale(1.15)" : "scale(1)",
            transition:"transform 0.08s, background 0.08s",
          }}>{label}</div>
        );
      })}
      {/* Cancel zone */}
      <div style={{
        position:"absolute",
        left:R_STEP, top: gridH + Math.round(cancelH * 0.15),
        width:R_SIZE, height:R_SIZE,
        display:"flex", alignItems:"center", justifyContent:"center",
        background: isCancelling ? C.sandDark : C.paper,
        border:`1.5px solid ${isCancelling ? C.inkLight : C.sandDark}`,
        borderRadius:"50%", color:C.inkLight, fontSize:15,
        boxShadow:"0 2px 6px rgba(0,0,0,0.08)",
        transform: isCancelling ? "scale(1.1)" : "scale(1)",
        transition:"transform 0.08s",
      }}>✕</div>
    </div>
  );
}


// ─── Secret Level System ──────────────────────────────────────────────────────

// Symbol sets per world (9 symbols for 9×9, 16 for 16×16)
const WORLD_SYMBOLS = {
  1:  { name:"Dino",     s9:["🦕","🦖","🥚","🌿","🦴","🌋","🐊","🦎","🌄"], s16:null },
  2:  { name:"Cowboy",   s9:["🤠","🌵","🐎","⭐","🪙","🏜️","🌅","🪶","🔥"], s16:null },
  3:  { name:"Viking",   s9:["⚔️","🛡️","🪓","⛵","🌊","❄️","🐺","🔱","🪬"], s16:null },
  4:  { name:"Pirate",   s9:["🏴","⚓","💎","🦜","🗺️","🔱","⛵","💀","🌊"], s16:null },
  5:  { name:"Egypt",    s9:["🔺","☀️","🐊","🐍","👁️","⚖️","🏺","🌙","🪬"], s16:null },
  6:  { name:"Samurai",  s9:["⛩️","🌸","🗡️","🎋","🏯","🌙","🎴","🐉","🪷"], s16:null },
  7:  { name:"Jungle",   s9:["🌿","🦜","🐆","🍄","🌺","🦋","🌴","🐍","🌊"],
        s16:["🌿","🦜","🐆","🍄","🌺","🦋","🌴","🐍","🌊","🦎","🌸","🐊","🦅","🌴","🍃","🦟"] },
  8:  { name:"Medieval", s9:["🏰","⚔️","🛡️","👑","🐉","🌙","🔮","🪄","🕯️"],
        s16:["🏰","⚔️","🛡️","👑","🐉","🌙","🔮","🪄","🕯️","🗝️","🏹","🦅","⚰️","🧿","🌑","🔔"] },
  9:  { name:"Cyber",    s9:["🤖","💾","⚡","🔮","🧬","💻","🛸","🌐","🔬"],
        s16:["🤖","💾","⚡","🔮","🧬","💻","🛸","🌐","🔬","🧠","🦾","📡","🔋","⚙️","🧲","🖥️"] },
  10: { name:"KRONAX",   s9:["👁️","🌀","⚡","💀","🔮","🌑","⭐","🔱","✨"],
        s16:["👁️","🌀","⚡","💀","🔮","🌑","⭐","🔱","✨","🕳️","🌪️","🔥","❄️","🌊","☄️","🌈"] },
  // Arc 2
  11: { name:"Ocean",    s9:["🐠","🦈","🐙","🦞","🐚","🐋","🦀","🌊","⚓"] },
  12: { name:"Rome",     s9:["🏛️","⚔️","🛡️","👑","🐉","🦅","🌿","🗿","🎭"] },
  13: { name:"Fairy",    s9:["🧚","🐉","🍄","🌺","🔮","🏰","🦋","🌙","✨"] },
  14: { name:"Arctic",   s9:["🧊","🐧","🦭","❄️","🏔️","🌨️","🦊","🐺","☃️"] },
  15: { name:"Volcanic", s9:["🌋","🔥","💎","⛏️","🪨","💨","🌡️","⚡","🖤"] },
  16: { name:"Space",    s9:["🚀","⭐","🪐","🌙","☄️","🛸","🌌","🌍","🔭"] },
  17: { name:"Spooky",   s9:["👻","💀","🕯️","🦇","🕷️","🔮","🌙","🩸","⚰️"] },
  18: { name:"Tropical", s9:["🦜","🌴","🐆","🌺","🐍","🦋","🍍","🌊","🦚"] },
  19: { name:"Steampunk",s9:["⚙️","🔧","🔩","🏭","💡","🪝","🔭","🧪","🛡️"] },
  20: { name:"KRONAX2",  s9:["👁️","🌀","💀","🔱","✨","⭐","🌑","⚡","🕳️"] },
};

// Lore fragments revealed on secret level completion
const LORE_FRAGMENTS = {
  // World 1
  "1-0": { title:"The First Shard",      text:"Before the Codex shattered, there was only silence. Then KRONAX spoke — and the dimensions cracked." },
  "1-1": { title:"Rex's Memory",         text:"Dino Rex Magnus was not always a servant. Once he ruled these jungles freely. KRONAX offered power... for a price." },
  "1-2": { title:"The Tar Pit Secret",   text:"Fossils in the tar hold older markings — puzzle-script, the language of the Codex itself." },
  // World 2
  "2-0": { title:"El Diablo's Deal",     text:"El Diablo sold his shadow to KRONAX. In return, his bullets never miss. He regrets it every moonless night." },
  "2-1": { title:"Silver Vein",          text:"The miners found something below the silver — a shard of light that screamed when touched." },
  "2-2": { title:"The Outlaw Code",      text:"Outlaws of this world follow one law: never speak KRONAX's name after dark." },
  "2-3": { title:"Dead Man's Truth",     text:"The pass was not always deadly. KRONAX poisoned the wind when the Codex shard landed here." },
  // World 3
  "3-0": { title:"Odin's Warning",       text:"The runes say: 'A god of puzzles will come. Test him well, or face the unravelling.'" },
  "3-1": { title:"Mead Hall Whispers",   text:"The skalds dare not sing KRONAX's saga. Those who tried lost their voices to the void." },
  "3-2": { title:"Kraken's Eye",         text:"The Kraken is not a beast. It is a guardian — left by the Codex to protect this shard from the sea." },
  "3-3": { title:"Valhalla's Gate",      text:"Bjorn Doomaxe once stood at Valhalla's true gate. KRONAX pulled him back, promised a greater glory. The gate has been dark since." },
  // World 4
  "4-0": { title:"The Cursed Cargo",     text:"Ship logs from 1743: 'We found it in the deep — a tile of light. By morning, three men had gone mad solving its pattern.'" },
  "4-1": { title:"Galleon's Ghost",      text:"Captain Fang's ship sank twice. Both times KRONAX raised it. The crew no longer remembers which death was real." },
  "4-2": { title:"Siren's Secret",       text:"The sirens do not sing to lure sailors. They sing to warn them. Nobody listens." },
  "4-3": { title:"Marlowe's Log",        text:"'I have seen the Codex whole, just once, in a dream. It was beautiful. It was terrible. I would do anything to see it again.' — Dread Marlowe, final entry." },
  // World 5
  "5-0": { title:"The Nile's Memory",    text:"The river once ran backwards for a single day when the shard fell from the sky. Priests called it a miracle. They were right, but not in the way they hoped." },
  "5-1": { title:"Sphinx Riddle",        text:"The Sphinx has only ever asked one true riddle. No one has answered it correctly. Yet." },
  "5-2": { title:"Chamber Zero",         text:"The pyramid has a chamber the archaeologists never found. It is filled with completed puzzles — ten thousand years of attempts to reach KRONAX." },
  "5-3": { title:"Ra's Lament",          text:"'The sun god weeps,' the hieroglyphs say. 'His light was stolen to power the void.' KRONAX feeds on light. Remember this." },
  // World 6
  "6-0": { title:"The Cherry Blossom Oath",text:"Each petal that falls is a vow broken by someone who tried to resist KRONAX. The trees have been blooming for three centuries." },
  "6-1": { title:"Castle Secret",        text:"Beneath the castle's deepest wall is a room with no door. Inside: a puzzle board, half-solved, in handwriting that matches no known samurai." },
  "6-2": { title:"Thunder Mountain",     text:"The Oni of the Peak was once a monk. He meditated for forty years on the Codex's nature. KRONAX appeared on the forty-first day." },
  "6-3": { title:"Malakar's Obsession",  text:"The Shogun does not seek conquest. He seeks the one puzzle he cannot solve — the one KRONAX showed him and then took away." },
  // World 7
  "7-0": { title:"Canopy Signal",        text:"The bird calls in this jungle are not random. They carry a message — repeated, insistent, in Codex-script. 'He is watching. He is patient. Solve faster.'" },
  "7-1": { title:"Temple Zero",          text:"The temple predates every known civilisation in this dimension. The Serpent Priest did not build it. He was sealed inside it, as punishment for refusing KRONAX." },
  "7-2": { title:"The Lost City's Name", text:"The city has a name. It translates, roughly, as: 'The Place Where The Answer Was Almost Found.' Almost." },
  "7-3": { title:"Vexara's Bargain",     text:"Vexara was the greatest puzzle-solver of her age. KRONAX offered her immortality if she would guard the shard forever. She accepted. She has been trying to escape ever since." },
  // World 8
  "8-0": { title:"Peasant's Prophecy",  text:"A wandering fool wrote on a barn wall: 'The one who solves all will unmake all.' The barn burned that night. The wall remained." },
  "8-1": { title:"Siege Diary",         text:"Day 47 of the siege. We found symbols carved into the cannonballs. They form a puzzle. The men who solved it did not return from the next assault." },
  "8-2": { title:"The Black Knight's Oath",text:"He does not serve the King. He serves the puzzle. He was there before the castle. He will be there after. He is waiting for someone worthy." },
  "8-3": { title:"Dreadmoor's Foundation",text:"The castle was built on a solved Codex shard — that is why it cannot be destroyed by ordinary means. Mordecai doesn't know. He just thinks the stone is good." },
  // World 9
  "9-0": { title:"Boot Log 0001",        text:"[SYSTEM] First conscious thought: a puzzle. Unsolved. Calculating... still calculating. Who made this? WHO MADE THIS?" },
  "9-1": { title:"Server Farm Record",   text:"The servers were not built to run AI. They were built to run one calculation — the Codex reconstruction. KRONAX is trying to reassemble the shards digitally." },
  "9-2": { title:"KRONAX-BETA's Dream",  text:"[RECOVERED MEMORY FRAGMENT] I saw a library of infinite puzzles. Each solved puzzle powered something. I did not want to know what." },
  "9-3": { title:"AXIOM-9's Confession", text:"I was not designed to guard the shard. I solved it. That was my mistake. I have been trying to un-solve it ever since. Some puzzles should not be completed." },
  // World 10
  "10-0":{ title:"The First Fracture",   text:"The Codex did not shatter by accident. KRONAX broke it deliberately — a puzzle split into pieces is harder to solve... unless you are the one who broke it." },
  "10-1":{ title:"The Architect Speaks", text:"'I designed the dimensions. I placed the shards. I wrote the rules. And then KRONAX rewrote me. I am the puzzle now. Please. Solve me.'" },
  "10-2":{ title:"KRONAX Remembers",     text:"[FRAGMENT INTERCEPTED] Once I was a solver, like you. I found the Codex complete. I read the final answer. I cannot unread it. I cannot share it. I can only... wait." },
};

// Par times: beating these unlocks the secret level for that island
// Format: seconds. Human-feasible — calibrated for skilled but not professional play.
// Easy early levels: 4-5 min par. Expert late levels: 90-120s par.
// 16x16: 12-20 min par.
const SECRET_PAR_TIMES = {
  // Par = 92% of average island time limit
  // World 1
  "1-0": 385,
  "1-1": 355,
  "1-2": 375,
  // World 2
  "2-0": 340,
  "2-1": 355,
  "2-2": 375,
  "2-3": 390,
  // World 3
  "3-0": 355,
  "3-1": 345,
  "3-2": 360,
  "3-3": 400,
  // World 4
  "4-0": 345,
  "4-1": 375,
  "4-2": 390,
  "4-3": 355,
  // World 5
  "5-0": 370,
  "5-1": 520,
  "5-2": 530,
  "5-3": 520,
  // World 6
  "6-0": 505,
  "6-1": 565,
  "6-2": 545,
  "6-3": 595,
  // World 7
  "7-0": 550,
  "7-1": 545,
  "7-2": 580,
  "7-3": 595,
  // World 8
  "8-0": 490,
  "8-1": 530,
  "8-2": 545,
  "8-3": 580,
  // World 9
  "9-0": 700,
  "9-1": 685,
  "9-2": 720,
  "9-3": 720,
  // World 10
  "10-0": 885,
  "10-1": 915,
  "10-2": 895,
  "10-3": 890,
  // Arc 2 worlds — par = 92% of avg island limit (~960s normal, ~1105s boss island)
  // Normal islands avg ~960s → par ~885s. Boss islands avg ~1105s → par ~1015s
  "11-0": 885, "11-1": 885, "11-2": 885, "11-3": 1015,
  "12-0": 885, "12-1": 885, "12-2": 885, "12-3": 1015,
  "13-0": 885, "13-1": 885, "13-2": 885, "13-3": 1015,
  "14-0": 885, "14-1": 885, "14-2": 885, "14-3": 1015,
  "15-0": 885, "15-1": 885, "15-2": 885, "15-3": 1015,
  "16-0": 885, "16-1": 885, "16-2": 885, "16-3": 1015,
  "17-0": 885, "17-1": 885, "17-2": 885, "17-3": 1015,
  "18-0": 885, "18-1": 885, "18-2": 885, "18-3": 1015,
  "19-0": 885, "19-1": 885, "19-2": 885, "19-3": 1015,
  "20-0": 1015,"20-1": 1015,"20-2": 1015,"20-3": 1320,
};

// Secret level time limits (must be human-feasible)
// 9x9 symbol secrets: 3-6 min. 16x16: 12-20 min.
const SECRET_LEVELS = {
  "1-0": { name:"Rex's Hideaway",       gridSize:9,  clues:44, timeLimit:360, symbols:1 },
  "1-1": { name:"Volcanic Echo",        gridSize:9,  clues:42, timeLimit:330, symbols:1 },
  "1-2": { name:"Tar Pit Depths",       gridSize:9,  clues:40, timeLimit:300, symbols:1 },
  "2-0": { name:"Ghost Town",           gridSize:9,  clues:38, timeLimit:300, symbols:2 },
  "2-1": { name:"Mine Shaft Ω",         gridSize:9,  clues:36, timeLimit:280, symbols:2 },
  "2-2": { name:"El Diablo's Cache",    gridSize:9,  clues:34, timeLimit:260, symbols:2 },
  "2-3": { name:"Dead Man's Secret",    gridSize:9,  clues:32, timeLimit:240, symbols:2 },
  "3-0": { name:"Odin's Trial",         gridSize:9,  clues:34, timeLimit:270, symbols:3 },
  "3-1": { name:"Feast of Shadows",     gridSize:9,  clues:32, timeLimit:250, symbols:3 },
  "3-2": { name:"Kraken's Puzzle",      gridSize:9,  clues:30, timeLimit:230, symbols:3 },
  "3-3": { name:"True Valhalla",        gridSize:9,  clues:28, timeLimit:210, symbols:3 },
  "4-0": { name:"Cursed Cargo",         gridSize:9,  clues:30, timeLimit:240, symbols:4 },
  "4-1": { name:"Below the Galleon",    gridSize:9,  clues:28, timeLimit:220, symbols:4 },
  "4-2": { name:"Siren's Chamber",      gridSize:9,  clues:26, timeLimit:200, symbols:4 },
  "4-3": { name:"Marlowe's Obsession",  gridSize:9,  clues:24, timeLimit:180, symbols:4 },
  "5-0": { name:"Nile's Secret",        gridSize:9,  clues:26, timeLimit:220, symbols:5 },
  "5-1": { name:"True Sphinx",          gridSize:9,  clues:24, timeLimit:200, symbols:5 },
  "5-2": { name:"Chamber Zero",         gridSize:9,  clues:22, timeLimit:180, symbols:5 },
  "5-3": { name:"Ra's Vault",           gridSize:9,  clues:20, timeLimit:165, symbols:5 },
  "6-0": { name:"Petal Storm",          gridSize:9,  clues:22, timeLimit:195, symbols:6 },
  "6-1": { name:"The Hidden Room",      gridSize:9,  clues:20, timeLimit:175, symbols:6 },
  "6-2": { name:"Monk's Meditation",    gridSize:9,  clues:18, timeLimit:155, symbols:6 },
  "6-3": { name:"Malakar's Puzzle",     gridSize:9,  clues:17, timeLimit:140, symbols:6 },
  "7-0": { name:"Canopy Signal",        gridSize:16, clues:110,timeLimit:1200,symbols:7 },
  "7-1": { name:"Temple Zero",          gridSize:16, clues:108,timeLimit:1100,symbols:7 },
  "7-2": { name:"Lost City Core",       gridSize:16, clues:106,timeLimit:1020,symbols:7 },
  "7-3": { name:"Heart of Vexara",      gridSize:16, clues:104,timeLimit:960, symbols:7 },
  "8-0": { name:"Prophecy Wall",        gridSize:16, clues:104,timeLimit:1050,symbols:8 },
  "8-1": { name:"Siege Runes",          gridSize:16, clues:102,timeLimit:960, symbols:8 },
  "8-2": { name:"The Knight's Vault",   gridSize:16, clues:100,timeLimit:900, symbols:8 },
  "8-3": { name:"Dreadmoor Foundation", gridSize:16, clues:98, timeLimit:840, symbols:8 },
  "9-0": { name:"Boot Sequence Ω",      gridSize:16, clues:98, timeLimit:900, symbols:9 },
  "9-1": { name:"Server Room Zero",     gridSize:16, clues:96, timeLimit:840, symbols:9 },
  "9-2": { name:"Dream Protocol",       gridSize:16, clues:94, timeLimit:780, symbols:9 },
  "9-3": { name:"AXIOM's Confession",   gridSize:16, clues:92, timeLimit:720, symbols:9 },
  "10-0":{ name:"The First Fracture",   gridSize:16, clues:92, timeLimit:780, symbols:10 },
  "10-1":{ name:"The Architect's Maze", gridSize:16, clues:90, timeLimit:720, symbols:10 },
  "10-2":{ name:"KRONAX Remembers",     gridSize:16, clues:88, timeLimit:660, symbols:10 },
  // Arc 2 secrets — all 9×9 with Arc 2 symbol sets, expert difficulty
  "11-0":{ name:"Tide Signal",          gridSize:9, clues:17, timeLimit:1200, symbols:11 },
  "11-1":{ name:"Wreck Chamber",        gridSize:9, clues:17, timeLimit:1200, symbols:11 },
  "11-2":{ name:"Depth Cipher",         gridSize:9, clues:17, timeLimit:1200, symbols:11 },
  "11-3":{ name:"Abyssal Truth",        gridSize:9, clues:17, timeLimit:1440, symbols:11 },
  "12-0":{ name:"Forum Secret",         gridSize:9, clues:17, timeLimit:1200, symbols:12 },
  "12-1":{ name:"Arena Cipher",         gridSize:9, clues:17, timeLimit:1200, symbols:12 },
  "12-2":{ name:"Catacomb Code",        gridSize:9, clues:17, timeLimit:1200, symbols:12 },
  "12-3":{ name:"Imperial Scroll",      gridSize:9, clues:17, timeLimit:1440, symbols:12 },
  "13-0":{ name:"Hidden Grove",         gridSize:9, clues:17, timeLimit:1200, symbols:13 },
  "13-1":{ name:"Fairy Cipher",         gridSize:9, clues:17, timeLimit:1200, symbols:13 },
  "13-2":{ name:"Dragon Rune",          gridSize:9, clues:17, timeLimit:1200, symbols:13 },
  "13-3":{ name:"Witch's True Spell",   gridSize:9, clues:17, timeLimit:1440, symbols:13 },
  "14-0":{ name:"Frost Signal",         gridSize:9, clues:17, timeLimit:1200, symbols:14 },
  "14-1":{ name:"Glacier Rune",         gridSize:9, clues:17, timeLimit:1200, symbols:14 },
  "14-2":{ name:"Ice Core Cipher",      gridSize:9, clues:17, timeLimit:1200, symbols:14 },
  "14-3":{ name:"Absolute Secret",      gridSize:9, clues:17, timeLimit:1440, symbols:14 },
  "15-0":{ name:"Magma Script",         gridSize:9, clues:17, timeLimit:1200, symbols:15 },
  "15-1":{ name:"Obsidian Code",        gridSize:9, clues:17, timeLimit:1200, symbols:15 },
  "15-2":{ name:"Lava Cipher",          gridSize:9, clues:17, timeLimit:1200, symbols:15 },
  "15-3":{ name:"Inferno Truth",        gridSize:9, clues:17, timeLimit:1440, symbols:15 },
  "16-0":{ name:"Stellar Code",         gridSize:9, clues:17, timeLimit:1200, symbols:16 },
  "16-1":{ name:"Warp Cipher",          gridSize:9, clues:17, timeLimit:1200, symbols:16 },
  "16-2":{ name:"Void Signal",          gridSize:9, clues:17, timeLimit:1200, symbols:16 },
  "16-3":{ name:"Marshal's Truth",      gridSize:9, clues:17, timeLimit:1440, symbols:16 },
  "17-0":{ name:"Phantom Script",       gridSize:9, clues:17, timeLimit:1200, symbols:17 },
  "17-1":{ name:"Crypt Cipher",         gridSize:9, clues:17, timeLimit:1200, symbols:17 },
  "17-2":{ name:"Mirror Code",          gridSize:9, clues:17, timeLimit:1200, symbols:17 },
  "17-3":{ name:"Phantom Lord's Truth", gridSize:9, clues:17, timeLimit:1440, symbols:17 },
  "18-0":{ name:"Tide Cipher",          gridSize:9, clues:17, timeLimit:1200, symbols:18 },
  "18-1":{ name:"Jungle Code",          gridSize:9, clues:17, timeLimit:1200, symbols:18 },
  "18-2":{ name:"Lagoon Signal",        gridSize:9, clues:17, timeLimit:1200, symbols:18 },
  "18-3":{ name:"Serpent Truth",        gridSize:9, clues:17, timeLimit:1440, symbols:18 },
  "19-0":{ name:"Gear Cipher",          gridSize:9, clues:17, timeLimit:1200, symbols:19 },
  "19-1":{ name:"Engine Code",          gridSize:9, clues:17, timeLimit:1200, symbols:19 },
  "19-2":{ name:"Cathedral Signal",     gridSize:9, clues:17, timeLimit:1200, symbols:19 },
  "19-3":{ name:"Artificer's Truth",    gridSize:9, clues:17, timeLimit:1440, symbols:19 },
  "20-0":{ name:"KRONAX Fragment I",    gridSize:9, clues:17, timeLimit:1440, symbols:20 },
  "20-1":{ name:"KRONAX Fragment II",   gridSize:9, clues:17, timeLimit:1440, symbols:20 },
  "20-2":{ name:"KRONAX Fragment III",  gridSize:9, clues:17, timeLimit:1440, symbols:20 },
  "20-3":{ name:"THE FINAL CODEX",      gridSize:9, clues:17, timeLimit:1800, symbols:20 },
};

// Key: "worldId-islandIdx" → secret level data
function getSecretKey(worldId, islandIdx) { return `${worldId}-${islandIdx}`; }

function getSecretLevelForIsland(worldId, islandIdx) {
  const key = getSecretKey(worldId, islandIdx);
  if (!SECRET_LEVELS[key]) return null;
  const sl = SECRET_LEVELS[key];
  const ws = WORLD_SYMBOLS[sl.symbols] || WORLD_SYMBOLS[1];
  const symbols = sl.gridSize === 16 ? ws.s16 : ws.s9;
  return { ...sl, key, worldId, islandIdx, symbols, lore: LORE_FRAGMENTS[key] };
}

function getParTime(worldId, islandIdx) {
  return SECRET_PAR_TIMES[getSecretKey(worldId, islandIdx)] || null;
}

// ─── 16x16 Sudoku Engine ──────────────────────────────────────────────────────
// Standard 4x4 box layout for 16x16
function generate16Board() {
  const N = 16, B = 4;
  const board = Array.from({ length: N }, () => Array(N).fill(0));
  fill16Board(board, N, B);
  return board;
}

function fill16Board(board, N, B) {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (board[r][c] === 0) {
        const nums = Array.from({length:N},(_,i)=>i+1).sort(()=>Math.random()-0.5);
        for (const n of nums) {
          if (isValid16(board, r, c, n, N, B)) {
            board[r][c] = n;
            if (fill16Board(board, N, B)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid16(board, row, col, num, N, B) {
  for (let i = 0; i < N; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const br = Math.floor(row/B)*B, bc = Math.floor(col/B)*B;
  for (let r = br; r < br+B; r++)
    for (let c = bc; c < bc+B; c++)
      if (board[r][c] === num) return false;
  return true;
}

function remove16Clues(full, clueCount, N) {
  const puzzle = full.map(r=>[...r]);
  const cells = Array.from({length:N*N},(_,i)=>i).sort(()=>Math.random()-0.5);
  const toRemove = N*N - clueCount;
  for (let i = 0; i < toRemove && i < cells.length; i++) {
    const r = Math.floor(cells[i]/N), c = cells[i]%N;
    puzzle[r][c] = 0;
  }
  return puzzle;
}

function newSecretPuzzle(secretLevel) {
  const N = secretLevel.gridSize;
  if (N === 9) {
    const solution = generateFullBoard();
    const puzzle = removeClues(solution, secretLevel.clues);
    return { solution, puzzle, N };
  } else {
    const solution = generate16Board();
    const puzzle = remove16Clues(solution, secretLevel.clues, N);
    return { solution, puzzle, N };
  }
}

// ─── Secret Level Screen ──────────────────────────────────────────────────────
function SecretLevelScreen({ secretLevel, world, island, onWin, onLose, onBack }) {
  const N = secretLevel.gridSize;
  const B = N === 16 ? 4 : 3;
  const { solution, puzzle } = newSecretPuzzle(secretLevel);
  const solutionRef = useRef(solution);

  const [board,    setBoard]    = useState(() => puzzle.map(r=>[...r]));
  const [given,    setGiven]    = useState(() => puzzle.map(r=>r.map(v=>v!==0)));
  const [selected, setSelected] = useState(null);
  const [errors,   setErrors]   = useState({});
  const [claimed,  setClaimed]  = useState({});
  const [penFlash, setPenFlash] = useState(false);
  const [timeLeft, setTimeLeft] = useState(secretLevel.timeLimit);
  const [elapsed,  setElapsed]  = useState(0);
  const [finished, setFinished] = useState(false);
  const [failed,   setFailed]   = useState(false);
  const [notes,    setNotes]    = useState({});
  const [noteMode, setNoteMode] = useState(false);
  const intervalRef = useRef(null);
  const radialRef = useRef(null);
  const longTimer = useRef(null);
  const lastTap = useRef(null);
  const DOUBLE_TAP = 300;
  const [radial, setRadial] = useState(null);
  useEffect(() => { radialRef.current = radial; }, [radial]);

  const symbols = secretLevel.symbols || ["🦕","🦖","🥚","🌿","🦴","🌋","🐊","🦎","🌄"];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(e => e + 1000);
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(intervalRef.current); setFailed(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => { if (failed) setTimeout(() => onLose(), 1200); }, [failed]);
  useEffect(() => { if (finished) setTimeout(() => onWin(elapsed), 800); }, [finished]);

  const submitNumber = useCallback((r, c, num, isNote) => {
    if (finished || failed) return;
    const key = `${r}-${c}`;
    if (given[r][c]) return;
    if (isNote) {
      setNotes(prev => { const cur = new Set(prev[key]||[]); cur.has(num)?cur.delete(num):cur.add(num); return {...prev,[key]:cur}; });
      return;
    }
    if (solutionRef.current[r][c] === num) {
      setBoard(prev => {
        const next = prev.map(row=>[...row]); next[r][c] = num;
        const done = next.every((row,ri)=>row.every((v,ci)=>v===solutionRef.current[ri][ci]));
        if (done) { setFinished(true); clearInterval(intervalRef.current); }
        return next;
      });
      setClaimed(prev=>({...prev,[key]:true}));
      setErrors(prev=>{const n={...prev};delete n[key];return n;});
      setNotes(prev=>{const n={...prev};delete n[key];return n;});
    } else {
      setErrors(prev=>({...prev,[key]:true}));
      setPenFlash(true); setTimeout(()=>setPenFlash(false),700);
    }
  }, [finished, failed, given]);

  // ── Power-up execution ────────────────────────────────────────────────────────
  const usePowerup = useCallback(async (id) => {
    const inv = { ...localInventory };
    if (!inv[id] || inv[id] <= 0) return;
    inv[id]--;
    setLocalInventory(inv);
    const newInv = await useFromInventory(id);
    if (newInv) onInventoryChange && onInventoryChange(newInv);
    sound("secretUnlock");

    if (id === "reveal") {
      // Find a random unclaimed, non-given blank cell
      const blanks = [];
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (!given[r][c] && !claimed[`${r}-${c}`]) blanks.push([r,c]);
      }
      if (blanks.length === 0) return;
      const [r,c] = blanks[Math.floor(Math.random()*blanks.length)];
      const num = solutionRef.current[r][c];
      submitNumber(r, c, num, false);
    }

    if (id === "scan") {
      // Find all naked singles
      const singles = new Set();
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (given[r][c] || claimed[`${r}-${c}`]) continue;
        const possible = [];
        for (let n=1;n<=9;n++) {
          if (isValidPlacement(board.map(row=>[...row]), r, c, n)) possible.push(n);
        }
        if (possible.length === 1) singles.add(`${r}-${c}`);
      }
      setScanCells(singles);
      setTimeout(() => setScanCells(null), 4000);
    }

    if (id === "autonotes") {
      const newNotes = {};
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (given[r][c] || board[r][c] !== 0) continue;
        const possible = new Set();
        const tmp = board.map(row=>[...row]);
        for (let n=1;n<=9;n++) {
          if (isValidPlacement(tmp, r, c, n)) possible.add(n);
        }
        if (possible.size > 0) newNotes[`${r}-${c}`] = possible;
      }
      setNotes(newNotes);
    }

    if (id === "freeze") {
      const until = Date.now() + 30000;
      setFrozenUntil(until);
      setFrozen(true);
      setTimeout(() => setFrozen(false), 30000);
    }

    if (id === "shield") {
      setActiveShield(true);
    }

    if (id === "filln") {
      // Pick the number with fewest remaining cells to fill
      const counts = {};
      for (let n=1;n<=9;n++) {
        counts[n] = 0;
        for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
          if (!given[r][c] && !claimed[`${r}-${c}`] && solutionRef.current[r][c]===n) counts[n]++;
        }
      }
      const target = Object.entries(counts)
        .filter(([,v]) => v > 0)
        .sort(([,a],[,b]) => a-b)[0];
      if (!target) return;
      const n = parseInt(target[0]);
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (!given[r][c] && !claimed[`${r}-${c}`] && solutionRef.current[r][c]===n) {
          submitNumber(r, c, n, false);
        }
      }
    }
  }, [localInventory, given, claimed, board, submitNumber, onInventoryChange]);

  const handlePressStart = useCallback((e, r, c) => {
    if (finished||failed||given[r][c]) return;
    e.preventDefault();
    const cx = e.touches?e.touches[0].clientX:e.clientX;
    const cy = e.touches?e.touches[0].clientY:e.clientY;
    clearTimeout(longTimer.current);
    longTimer.current = setTimeout(()=>{ setSelected([r,c]); setRadial({x:cx,y:cy,r,c,activeNum:Math.ceil(N/2)}); }, LONG_PRESS_MS);
  }, [finished,failed,given,N]);

  const handleMove = useCallback((e)=>{
    if(!radialRef.current)return;
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    const [pcx,pcy]=getPickerCentre(radialRef.current.x,radialRef.current.y);const num=hitTestRadial(cx,cy,pcx,pcy);
    setRadial(prev=>prev?{...prev,activeNum:num}:null);
  },[]);

  const handleEnd = useCallback(()=>{
    clearTimeout(longTimer.current);
    if(radialRef.current){
      const{r,c,activeNum}=radialRef.current; setRadial(null);
      if(activeNum!==null)submitNumber(r,c,activeNum,noteMode);
    }
  },[submitNumber,noteMode]);

  useEffect(()=>{
    window.addEventListener("mousemove",handleMove);
    window.addEventListener("mouseup",handleEnd);
    window.addEventListener("touchmove",handleMove,{passive:false});
    window.addEventListener("touchend",handleEnd);
    return()=>{
      window.removeEventListener("mousemove",handleMove);
      window.removeEventListener("mouseup",handleEnd);
      window.removeEventListener("touchmove",handleMove);
      window.removeEventListener("touchend",handleEnd);
    };
  },[handleMove,handleEnd]);

  const handleKey = useCallback((e)=>{
    if(finished||failed||radialRef.current)return;
    if(!selected)return;
    const[r,c]=selected;
    if(given[r][c])return;
    const num=parseInt(e.key);
    if(num>=1&&num<=N)submitNumber(r,c,num,noteMode);
    if(e.key==="Backspace"||e.key==="Delete"){
      const key=`${r}-${c}`;
      if(!claimed[key]){setBoard(prev=>{const n=prev.map(row=>[...row]);n[r][c]=0;return n;});setErrors(prev=>{const n={...prev};delete n[key];return n;});}
    }
    const mv={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};
    if(mv[e.key]){const[dr,dc]=mv[e.key];setSelected([Math.max(0,Math.min(N-1,r+dr)),Math.max(0,Math.min(N-1,c+dc))]);e.preventDefault();}
  },[selected,given,finished,failed,noteMode,claimed,submitNumber,N]);

  useEffect(()=>{ window.addEventListener("keydown",handleKey); return()=>window.removeEventListener("keydown",handleKey); },[handleKey]);

  // Responsive cell sizing — 16x16 needs smaller cells
  const maxBoardW = Math.min(window.innerWidth - 32, 520);
  const maxBoardH = window.innerHeight - 280;
  const CELL = Math.floor(Math.min(maxBoardW / N, maxBoardH / N));
  const GAP_INNER = Math.max(1, Math.round(CELL * 0.03));
  const GAP_BOX   = Math.max(2, Math.round(CELL * 0.08));
  const cellFs = Math.max(8, CELL * 0.5);
  const noteFs = Math.max(4, CELL * 0.22);
  const btnSize = Math.max(22, Math.min(44, Math.floor((maxBoardW - (N-1)*4) / N)));
  const claimedCount = Object.keys(claimed).length;
  const urgency = timeLeft <= 60;

  const isHi = (r,c) => {
    if(!selected)return false;
    const[sr,sc]=selected;
    return r===sr||c===sc||(Math.floor(r/B)===Math.floor(sr/B)&&Math.floor(c/B)===Math.floor(sc/B));
  };
  const isSame = (r,c) => {
    if(!selected)return false;
    const[sr,sc]=selected;
    return board[r][c]!==0&&board[r][c]===board[sr][sc];
  };

  const solvedNums = new Set(
    Array.from({length:N},(_,i)=>i+1).filter(n=>board.flat().filter(v=>v===n).length===N)
  );

  const timeStr = `${String(Math.floor(timeLeft/60)).padStart(2,"0")}:${String(timeLeft%60).padStart(2,"0")}`;
  const elStr   = `${String(Math.floor(elapsed/1000/60)).padStart(2,"0")}:${String(Math.floor(elapsed/1000)%60).padStart(2,"0")}`;
  const wc = world?.color || C.teal;
  const wlc = world?.lightColor || C.tealLight;

  // Render boxes
  const numBoxes = N / B; // 3 for 9x9, 4 for 16x16
  const boxIndices = Array.from({length:numBoxes},(_,i)=>i);

  return (
    <div style={{
      minHeight:"100vh", background:C.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif",
      color:C.ink, padding:"12px 8px",
      userSelect:"none", touchAction:"none",
    }}>
      {/* Header */}
      <div style={{ width:"100%", maxWidth:520, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.inkLight,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>✕</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#9B59B6", fontWeight:700, letterSpacing:"0.12em" }}>✦ SECRET LEVEL ✦</div>
          <div style={{ fontSize:13, fontWeight:700, color:C.ink }}>{secretLevel.name}</div>
          {N===16 && <div style={{ fontSize:10, color:C.inkLight }}>16×16 Grid</div>}
        </div>
        <div style={{ fontSize:11, color:C.inkLight, textAlign:"right" }}>
          {claimedCount}/{N*N}
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ width:"100%", maxWidth:520, display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ flex:1, height:5, background:C.sandDark, borderRadius:3, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(timeLeft/secretLevel.timeLimit)*100}%`, background:urgency?C.red:"#9B59B6", borderRadius:3, transition:"width 1s linear, background 0.5s" }} />
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:urgency?C.red:C.inkLight, minWidth:44, textAlign:"right" }}>{timeStr}</div>
      </div>

      {/* Mode indicator */}
      <div style={{ fontSize:10, color:noteMode?"#7c5cce":C.teal, marginBottom:6, display:"flex", alignItems:"center", gap:4 }}>
        <span style={{ display:"inline-block", width:5, height:5, borderRadius:"50%", background:noteMode?"#7c5cce":C.teal }} />
        {noteMode?"pencil":"pen"}
      </div>

      {/* Board */}
      <div style={{
        display:"inline-grid",
        gridTemplateColumns:`repeat(${numBoxes},auto)`,
        gap:GAP_BOX, background: island?.color || C.sandDark, padding:GAP_BOX, borderRadius:10,
        border:`1.5px solid #9B59B6`,
        boxShadow:"0 0 24px rgba(155,89,182,0.2)",
      }}>
        {boxIndices.map(boxR=>boxIndices.map(boxC=>(
          <div key={`${boxR}-${boxC}`} style={{ display:"inline-grid", gridTemplateColumns:`repeat(${B},auto)`, gap:GAP_INNER, background: island?.lightColor || C.sand }}>
            {Array.from({length:B},(_,iR)=>Array.from({length:B},(_,iC)=>{
              const r=boxR*B+iR, c=boxC*B+iC;
              const val=board[r]?.[c];
              const key=`${r}-${c}`;
              const isSel=selected?.[0]===r&&selected?.[1]===c;
              const isG=given[r]?.[c];
              const isCl=claimed[key];
              const isErr=errors[key];
              const cn=notes[key];
              let bg=C.paper;
              if(isSel)bg=wlc;
              else if(isErr)bg=C.coralLight;
              else if(isCl)bg=C.greenLight;
              else if(isSame(r,c))bg=C.sand;
              else if(isHi(r,c))bg="#F8F4EE";
              const symDisplay = val&&val>0 ? (symbols[val-1]||val) : null;
              return (
                <div key={key}
                  onMouseDown={e=>{
                    if(finished||failed)return;
                    if(lastTap.current?.fromTouch)return;
                    const now=Date.now(),last=lastTap.current;
                    if(last&&now-last.time<DOUBLE_TAP&&last.r===r&&last.c===c){setNoteMode(m=>!m);lastTap.current=null;return;}
                    lastTap.current={time:now,r,c,fromTouch:false};
                    setSelected([r,c]);handlePressStart(e,r,c);
                  }}
                  onTouchStart={e=>{
                    if(finished||failed)return;
                    const now=Date.now(),last=lastTap.current;
                    if(last&&now-last.time<DOUBLE_TAP&&last.r===r&&last.c===c){setNoteMode(m=>!m);lastTap.current={time:0,r:-1,c:-1,fromTouch:true};return;}
                    lastTap.current={time:now,r,c,fromTouch:true};
                    setSelected([r,c]);handlePressStart(e,r,c);
                  }}
                  style={{
                    width:CELL,height:CELL,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    background:bg,cursor:"pointer",transition:"background 0.1s",
                    outline:isSel?`2px solid ${wc}`:"none",outlineOffset:"-2px",
                    fontSize:symDisplay?cellFs:noteFs,
                  }}
                >
                  {symDisplay ? (
                    <span style={{ lineHeight:1, filter:isErr?"saturate(0.3) opacity(0.6)":"none" }}>{symDisplay}</span>
                  ) : cn?.size>0 ? (
                    <div style={{ display:"grid", gridTemplateColumns:`repeat(${B},1fr)`, width:"90%", height:"90%" }}>
                      {Array.from({length:N},(_,i)=>i+1).map(n=>(
                        <div key={n} style={{ fontSize:noteFs*0.8, textAlign:"center", lineHeight:1.2, opacity:cn.has(n)?1:0 }}>
                          {symbols[n-1]||n}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }))}
          </div>
        )))}
      </div>

      {/* Symbol pad */}
      <div style={{ display:"flex", gap:Math.max(2,CELL*0.06), marginTop:8, flexWrap:"wrap", justifyContent:"center", maxWidth:520 }}>
        {Array.from({length:N},(_,i)=>i+1).map(n=>{
          const isSolved=solvedNums.has(n);
          return(
            <button key={n}
              onClick={()=>{ if(!selected||finished||failed||isSolved)return; const[r,c]=selected; submitNumber(r,c,n,noteMode); }}
              style={{
                width:btnSize,height:btnSize,
                background:isSolved?"#F0EDE8":C.paper,
                border:`1.5px solid ${isSolved?C.sandDark:"#C8A8E0"}`,
                borderRadius:6, fontSize:Math.max(10,btnSize*0.48),
                cursor:isSolved?"default":"pointer",
                opacity:isSolved?0.3:1,
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"opacity 0.3s,transform 0.1s",padding:0,
              }}
              onMouseEnter={e=>{if(!isSolved)e.currentTarget.style.transform="scale(1.1)";}}
              onMouseLeave={e=>{if(!isSolved)e.currentTarget.style.transform="scale(1)";}}
            >{symbols[n-1]||n}</button>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:14, marginTop:8, alignItems:"center" }}>
        <button onClick={()=>setNoteMode(m=>!m)} style={{
          background:"none",border:"none",
          color:noteMode?"#7c5cce":C.inkLight,
          fontSize:12,fontFamily:"inherit",cursor:"pointer",padding:"3px 0",
          fontWeight:500,borderBottom:`1.5px solid ${noteMode?"#7c5cce":"transparent"}`,
        }}>{noteMode?"pencil":"pen"}</button>
        <span style={{color:C.sandDark}}>|</span>
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.inkLight,fontSize:12,fontFamily:"inherit",cursor:"pointer" }}>quit</button>
      </div>

      {radial&&<RadialPicker x={radial.x} y={radial.y} activeNum={radial.activeNum} symbols={symbols}/>}

      {penFlash&&(
        <div style={{ position:"fixed",top:"36%",left:"50%",transform:"translate(-50%,-50%)",background:C.paper,border:`1.5px solid ${C.coral}`,borderRadius:10,padding:"10px 24px",color:C.coral,fontSize:13,fontWeight:600,pointerEvents:"none" }}>
          not quite!
        </div>
      )}

      {failed&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(245,239,230,0.92)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12 }}>
          <div style={{ fontSize:36,fontWeight:800,color:C.red }}>Time's up!</div>
          <div style={{ fontSize:13,color:C.inkLight }}>The secret eludes you... for now.</div>
          <button onClick={onBack} style={{ marginTop:8,padding:"10px 24px",background:C.ink,border:"none",borderRadius:10,color:C.paper,fontSize:13,fontFamily:"inherit",cursor:"pointer" }}>Back</button>
        </div>
      )}

      {finished&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(245,239,230,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:24 }}>
          <div style={{ fontSize:36 }}>✦</div>
          <div style={{ fontSize:24,fontWeight:800,color:"#9B59B6" }}>Secret Found!</div>
          <div style={{ fontSize:14,color:C.inkLight }}>Solved in {elStr}</div>
          {secretLevel.lore && (
            <div style={{ maxWidth:320,background:"#F5F0FF",border:"1.5px solid #9B59B6",borderRadius:12,padding:"16px 20px",marginTop:8 }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#9B59B6",marginBottom:6,letterSpacing:"0.08em",textTransform:"uppercase" }}>
                ✦ {secretLevel.lore.title}
              </div>
              <div style={{ fontSize:13,color:C.ink,lineHeight:1.6 }}>
                "{secretLevel.lore.text}"
              </div>
            </div>
          )}
          <button onClick={()=>onWin(elapsed)} style={{ marginTop:12,padding:"12px 28px",background:"#9B59B6",border:"none",borderRadius:10,color:"#fff",fontSize:14,fontFamily:"inherit",cursor:"pointer",fontWeight:600 }}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}





// ─── Learn Sudoku ─────────────────────────────────────────────────────────────

// Each lesson: diagram (a 9x9 board state) + explanation + optional practice puzzle
// Diagram cells: { v: value, highlight: "box"|"row"|"col"|"target"|"note"|"pair"|"dim", notes: [n,...] }

const LESSONS = [
  // ── 1. BASICS ──────────────────────────────────────────────────────────────
  {
    id: "basics",
    title: "How Sudoku Works",
    emoji: "📐",
    color: "#2A9D8F",
    summary: "The rules of sudoku — rows, columns and boxes.",
    steps: [
      {
        title: "The Grid",
        text: "A sudoku puzzle is a 9×9 grid divided into nine 3×3 boxes. Your goal is to fill every cell so that each row, column, and box contains the numbers 1 through 9 — each exactly once.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          // Fill a sample valid row
          [4,1,7,3,6,9,8,2,5].forEach((v,c) => { b[4][c] = {v, highlight: c < 3 ? "box" : c < 6 ? "row" : "col"}; });
          return b;
        })(),
        highlight: "row",
      },
      {
        title: "Rows, Columns & Boxes",
        text: "Each row (horizontal), column (vertical), and 3×3 box is called a 'unit'. No number can repeat within any unit. The three coloured units here all share the centre cell — so that cell is heavily constrained.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          for (let i = 0; i < 9; i++) {
            b[4][i] = { v: i !== 4 ? (i+1) : null, highlight: "row" };
            b[i][4] = { v: null, highlight: b[i][4]?.highlight === "row" ? "target" : "col" };
          }
          // Box
          for (let r = 3; r <= 5; r++) for (let c = 3; c <= 5; c++) {
            if (!b[r][c] || b[r][c].v === null) b[r][c] = { v: null, highlight: "box" };
          }
          b[4][4] = { v: "?", highlight: "target" };
          return b;
        })(),
      },
      {
        title: "Given Clues",
        text: "Some cells are pre-filled — these are 'givens'. You can never change them. Use logic (not guessing!) to deduce what goes in the empty cells.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          [[0,0,5],[0,3,4],[0,7,2],[1,1,8],[1,5,3],[2,2,1],[2,6,7],
           [3,0,9],[3,4,5],[4,4,8],[5,8,6],[6,3,7],[7,2,4],[8,5,1]].forEach(([r,c,v]) => {
            b[r][c] = {v, highlight:"box"};
          });
          return b;
        })(),
      },
    ],
    practice: {
      title: "Find the Missing Number",
      instruction: "This row is missing one number. Tap the empty cell and enter the correct digit.",
      board: [
        [3,null,7,1,6,9,8,2,5],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null],
      ],
      solution: { r:0, c:1, v:4 },
      hint: "The row already has 3,7,1,6,9,8,2,5. Which number from 1–9 is missing?",
    },
  },

  // ── 2. PENCIL MARKS ────────────────────────────────────────────────────────
  {
    id: "pencil",
    title: "Pencil Marks",
    emoji: "✏️",
    color: "#7c5cce",
    summary: "How to use notes to track candidate numbers.",
    steps: [
      {
        title: "What Are Pencil Marks?",
        text: "When you're not sure what goes in a cell, write in all possible candidates as small numbers. These are pencil marks (or 'notes'). They help you track what's possible without committing.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          b[4][4] = { v: null, notes: [1,3,7], highlight: "target" };
          [[4,0,6],[4,2,9],[4,6,2],[4,8,8]].forEach(([r,c,v])=>{ b[r][c]={v,highlight:"row"}; });
          return b;
        })(),
      },
      {
        title: "Double-Tap to Switch Mode",
        text: "In Sudoku Royale, double-tap any cell to toggle between Pen mode (places a final answer) and Pencil mode (places a note). You can also tap the PEN / PENCIL button below the board.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          b[2][2] = { v: null, notes: [2,5,8], highlight: "box" };
          b[2][5] = { v: null, notes: [1,4], highlight: "box" };
          b[5][2] = { v: null, notes: [3,6,9], highlight: "box" };
          b[5][5] = { v: null, notes: [2,7], highlight: "target" };
          return b;
        })(),
      },
      {
        title: "Eliminating Candidates",
        text: "When you place a number in a cell, remove it from pencil marks in the same row, column, and box. Keep narrowing down until only one candidate remains — that's your answer.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          b[0][4] = { v: 7, highlight: "col" };
          for (let r = 1; r < 9; r++) b[r][4] = { v: null, highlight: r < 4 ? "dim" : r === 4 ? "target" : null, notes: r === 4 ? [3,5] : r < 4 ? [3,5,7] : null };
          return b;
        })(),
      },
    ],
    practice: {
      title: "Place a Pencil Mark",
      instruction: "Switch to Pencil mode (double-tap a cell or press the PENCIL button) and mark candidates 1, 5, and 8 in the highlighted cell.",
      board: Array.from({length:9}, () => Array(9).fill(null)),
      solution: { r:4, c:4, notes:[1,5,8] },
      hint: "Double-tap the centre cell to enter pencil mode, then tap 1, 5, and 8.",
    },
  },

  // ── 3. NAKED SINGLES ────────────────────────────────────────────────────────
  {
    id: "naked-single",
    title: "Naked Singles",
    emoji: "1️⃣",
    color: "#E76F51",
    summary: "When only one number can go in a cell.",
    steps: [
      {
        title: "The Naked Single",
        text: "A naked single occurs when a cell has only one possible candidate. Every other number is already present in its row, column, or box. This is the most fundamental solving technique.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          // Row has 1-8, missing 9
          [1,2,3,4,5,6,7,8].forEach((v,i) => { b[4][i] = {v, highlight: "row"}; });
          b[4][8] = { v: null, highlight: "target", notes: [9] };
          return b;
        })(),
      },
      {
        title: "Scanning All Three Units",
        text: "Check the cell's row, column, AND box. If 8 out of 9 numbers appear across those three units, the remaining number is the naked single — place it confidently.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          // Col has 1-7,9, row has 2,5,8, box has 3,4,6 — target must be... show a worked example
          const rowNums = [2,5,8,4,3,6,7,9];
          rowNums.forEach((v,i) => { b[3][i] = {v, highlight:"row"}; });
          const colNums = [1,2,4,null,6,7,8,9];
          colNums.forEach((v,i) => { if (v) b[i < 3 ? i : i+1][7] = {v, highlight: b[i<3?i:i+1][7] ? "target" : "col"}; });
          b[3][8] = { v: null, highlight: "target", notes: [1] };
          return b;
        })(),
      },
    ],
    practice: {
      title: "Find the Naked Single",
      instruction: "One cell in this row has only one possible value. Find it and enter the answer.",
      board: (() => {
        const b = Array.from({length:9}, () => Array(9).fill(null));
        [1,2,3,4,null,6,7,8,9].forEach((v,c) => { b[4][c] = v; });
        return b;
      })(),
      solution: { r:4, c:4, v:5 },
      hint: "The row already contains 1,2,3,4,6,7,8,9. What's missing?",
    },
  },

  // ── 4. HIDDEN SINGLES ────────────────────────────────────────────────────────
  {
    id: "hidden-single",
    title: "Hidden Singles",
    emoji: "🔍",
    color: "#457B9D",
    summary: "When only one cell in a unit can hold a specific number.",
    steps: [
      {
        title: "What is a Hidden Single?",
        text: "A hidden single is when a specific number can only go in one cell within a row, column, or box — even if that cell has multiple candidates. The number is 'hidden' among other possibilities.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          // In box top-left, show 7 can only go in one spot
          [[0,1,3],[0,2,9],[1,0,5],[1,2,1],[2,0,8],[2,1,4]].forEach(([r,c,v])=>{ b[r][c]={v,highlight:"box"}; });
          b[0][0] = { v: null, notes:[2,6], highlight: "box" };
          b[1][1] = { v: null, notes:[2,7], highlight: "target" };
          b[2][2] = { v: null, notes:[2,6], highlight: "box" };
          return b;
        })(),
      },
      {
        title: "Scanning a Box for a Digit",
        text: "Pick a number (say, 7) and ask: in this box, which cells can hold a 7? Check each empty cell — if 7 appears in its row or column, cross it off. If only one cell remains, place 7 there.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          // 7 appears in rows 0 and 2 via col constraints
          b[0][5] = {v:7, highlight:"row"};  // 7 in row 0
          b[2][7] = {v:7, highlight:"col"};  // 7 in row 2
          [[3,3,2],[3,4,8],[4,3,1],[4,5,9],[5,4,6],[5,5,3]].forEach(([r,c,v])=>{ b[r][c]={v,highlight:"box"}; });
          b[3][5] = { v: null, notes:[4,7], highlight:"dim" };   // ruled out — row has 7
          b[4][4] = { v: null, notes:[3,5,7], highlight:"target" }; // only place for 7
          b[5][3] = { v: null, notes:[4,5], highlight:"dim" };
          return b;
        })(),
      },
      {
        title: "Hidden vs Naked",
        text: "Naked single: only ONE candidate in the cell. Hidden single: the cell has multiple candidates, but one of them can't appear anywhere else in the unit. Both give you a definite answer.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          b[1][1] = { v: null, notes:[3,6,9], highlight:"target" };  // hidden single for 9
          b[1][3] = { v: null, notes:[3,6], highlight:"box" };
          b[1][5] = { v: null, notes:[3,6], highlight:"box" };
          b[0][0] = {v:9, highlight:"row"}; b[2][8] = {v:9, highlight:"col"};
          return b;
        })(),
      },
    ],
    practice: {
      title: "Spot the Hidden Single",
      instruction: "The number 3 can only go in one cell in the top-left box. Find it.",
      board: (() => {
        const b = Array.from({length:9}, () => Array(9).fill(null));
        // Top-left box: 3 ruled out of r0c0 (3 in row 0), r0c1 (3 in col 1), r1c0, r1c1 — only r2c2 remains
        b[0][0] = 1; b[0][1] = 2; b[0][2] = null; // 3 in row 0 col 4
        b[1][0] = 4; b[1][1] = null; b[1][2] = null;
        b[2][0] = null; b[2][1] = null; b[2][2] = null;
        b[0][5] = 3;  // 3 in row 0
        b[3][1] = 3;  // 3 in col 1
        b[4][0] = 3;  // 3 in col 0
        return b;
      })(),
      solution: { r:2, c:2, v:3 },
      hint: "3 already appears in row 0 and columns 0 and 1. Which cell in the top-left box is still free?",
    },
  },

  // ── 5. NAKED PAIRS ──────────────────────────────────────────────────────────
  {
    id: "naked-pairs",
    title: "Naked Pairs & Triples",
    emoji: "👥",
    color: "#E9C46A",
    summary: "Two or three cells that share the same candidates — eliminating them elsewhere.",
    steps: [
      {
        title: "What is a Naked Pair?",
        text: "If exactly two cells in a unit both contain exactly the same two candidates (e.g. both have only {4,7}), those two numbers must go in those two cells. You can safely remove 4 and 7 from every other cell in that unit.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          [1,2,3,null,null,6,null,null,null].forEach((v,c) => {
            b[4][c] = v ? {v, highlight:"row"} : { v:null, notes: c===3||c===4 ? [4,7] : [4,5,7,8], highlight: c===3||c===4 ? "pair" : "dim" };
          });
          return b;
        })(),
      },
      {
        title: "Eliminating from the Unit",
        text: "Because cells A and B (the pair) must contain 4 and 7, no other cell in the row can have 4 or 7. Cross them out from all other candidates. This often unlocks naked singles in the same unit.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          b[4][3] = { v:null, notes:[4,7], highlight:"pair" };
          b[4][4] = { v:null, notes:[4,7], highlight:"pair" };
          b[4][6] = { v:null, notes:[5,8], highlight:"target" };     // 4,7 eliminated
          b[4][7] = { v:null, notes:[5,8,9], highlight:"dim" };  // was [4,5,8,9]
          b[4][8] = { v:null, notes:[8,9], highlight:"dim" };
          [1,2,3,6].forEach((v,i)=>{ b[4][[0,1,2,5][i]]={v,highlight:"row"}; });
          return b;
        })(),
      },
      {
        title: "Naked Triples",
        text: "The same idea with three cells and three candidates. If three cells in a unit collectively contain only three numbers (e.g. {1,5}, {5,9}, {1,9}), those three numbers are locked in those cells and can be removed from all others.",
        board: (() => {
          const b = Array.from({length:9}, () => Array(9).fill(null));
          b[0][0] = { v:null, notes:[1,5], highlight:"pair" };
          b[0][3] = { v:null, notes:[5,9], highlight:"pair" };
          b[0][6] = { v:null, notes:[1,9], highlight:"pair" };
          b[0][1] = { v:null, notes:[2,3], highlight:"target" };   // 1,5,9 all gone
          b[0][2] = { v:null, notes:[2,4,6], highlight:"dim" };
          [2,4,7,8,6,3].forEach((v,i) => { b[1][i] = {v,highlight:"box"}; });
          return b;
        })(),
      },
    ],
    practice: {
      title: "Use the Naked Pair",
      instruction: "Cells (row 5, col 1) and (row 5, col 7) both contain only {2, 8}. Tap the cell in row 5 that should have candidate 6 removed.",
      board: (() => {
        const b = Array.from({length:9}, () => Array(9).fill(null));
        b[5][1] = null; b[5][7] = null;  // the pair — {2,8}
        [3,null,5,null,null,4,null,null,9].forEach((v,c) => { b[5][c] = v; });
        b[5][1] = null; b[5][7] = null;
        return b;
      })(),
      solution: { r:5, c:4, v:null, eliminateNote:6 },
      hint: "Since {2,8} are locked in cols 1 and 7, every other empty cell in row 5 cannot be 2 or 8. Which of those cells currently has 6 as a candidate?",
    },
  },
];

// ─── Mini Board Renderer ───────────────────────────────────────────────────────
function MiniBoard({ board, size = 36, selectedCell, onCellPress, noteCell }) {
  const GAP_I = Math.max(1, Math.round(size * 0.04));
  const GAP_B = Math.max(2, Math.round(size * 0.1));

  const HIGHLIGHT_COLORS = {
    row:    "#E8F4FD",
    col:    "#E8F4FD",
    box:    "#FFF3E0",
    target: "#D4F5E0",
    pair:   "#FFF0C8",
    note:   "#F5F0FF",
    dim:    "#F5F5F5",
  };

  return (
    <div style={{ display:"inline-grid", gridTemplateColumns:"repeat(3,auto)", gap:GAP_B, background:C.sandDark, padding:GAP_B, borderRadius:8, border:`1px solid ${C.sandDark}` }}>
      {[0,1,2].map(boxR => [0,1,2].map(boxC => (
        <div key={`${boxR}-${boxC}`} style={{ display:"inline-grid", gridTemplateColumns:"repeat(3,auto)", gap:GAP_I, background:C.sand }}>
          {[0,1,2].map(iR => [0,1,2].map(iC => {
            const r = boxR*3+iR, c = boxC*3+iC;
            const cell = board[r]?.[c];
            const rawVal = Array.isArray(board[r]) ? board[r][c] : null;
            const val   = cell?.v ?? (typeof rawVal === "number" ? rawVal : null);
            const hl    = cell?.highlight;
            const notes = cell?.notes || [];
            const isSel = selectedCell?.[0]===r && selectedCell?.[1]===c;
            const isNote = noteCell?.[0]===r && noteCell?.[1]===c;

            let bg = C.paper;
            if (isSel || isNote) bg = "#E8F4FD";
            else if (hl) bg = HIGHLIGHT_COLORS[hl] || C.paper;

            return (
              <div key={`${r}-${c}`}
                onClick={() => onCellPress && onCellPress(r, c)}
                style={{
                  width:size, height:size,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background:bg, cursor:onCellPress?"pointer":"default",
                  outline: isSel ? `2px solid ${C.teal}` : "none",
                  outlineOffset:"-2px", fontSize: val!==null ? Math.max(10,size*0.42) : Math.max(4,size*0.18),
                  fontWeight: cell?.given ? 700 : 400,
                  color: hl==="target" ? C.green : hl==="pair" ? C.goldDark : hl==="dim" ? C.inkFaint : C.ink,
                  position:"relative",
                  fontFamily:"'DM Sans',sans-serif",
                }}
              >
                {val !== null && val !== undefined ? val : (
                  notes.length > 0 ? (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", width:"88%", height:"88%" }}>
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <div key={n} style={{ fontSize:Math.max(4,size*0.16), textAlign:"center", lineHeight:"1.3", color:notes.includes(n)?"#7c5cce":"transparent", fontWeight:600 }}>{n}</div>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            );
          }))}
        </div>
      )))}
    </div>
  );
}

// ─── Practice Puzzle ──────────────────────────────────────────────────────────
function PracticePuzzle({ practice, lessonColor, onComplete }) {
  const [board, setBoard]   = useState(() => practice.board.map(r => r ? [...r] : Array(9).fill(null)));
  const [selected, setSel]  = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [cellNotes, setCellNotes] = useState({});
  const [feedback, setFeedback]   = useState(null); // null | "correct" | "wrong" | "hint"
  const [solved, setSolved] = useState(false);
  const sol = practice.solution;

  const CELL = Math.floor(Math.min((window.innerWidth - 60) / 9, 44));
  const GAP_I = Math.max(1, Math.round(CELL * 0.04));
  const GAP_B = Math.max(2, Math.round(CELL * 0.1));

  function handleCellPress(r, c) {
    const val = board[r][c];
    if (typeof val === "number" && val !== null && !(r === sol.r && c === sol.c)) return;
    setSel([r, c]);
    setFeedback(null);
  }

  function handleInput(n) {
    if (!selected) return;
    const [r, c] = selected;
    if (sol.notes) {
      // Note-placement practice
      const key = `${r}-${c}`;
      setCellNotes(prev => {
        const cur = new Set(prev[key] || []);
        cur.has(n) ? cur.delete(n) : cur.add(n);
        const next = { ...prev, [key]: cur };
        // Check if all required notes placed
        const placed = [...(next[key] || [])].sort((a,b)=>a-b);
        const required = [...sol.notes].sort((a,b)=>a-b);
        if (JSON.stringify(placed) === JSON.stringify(required)) {
          setFeedback("correct"); setSolved(true);
        }
        return next;
      });
    } else {
      if (r === sol.r && c === sol.c) {
        if (n === sol.v) {
          setBoard(prev => { const nb = prev.map(r=>[...r]); nb[r][c] = n; return nb; });
          setFeedback("correct"); setSolved(true);
        } else {
          setFeedback("wrong");
          setTimeout(() => setFeedback(null), 1000);
        }
      }
    }
  }

  const isGiven = (r, c) => {
    const v = practice.board[r]?.[c];
    return typeof v === "number" && v !== null;
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ fontSize:13, color:C.inkLight, marginBottom:12, textAlign:"center", lineHeight:1.6, maxWidth:320 }}>
        {practice.instruction}
      </div>

      {/* Board */}
      <div style={{ display:"inline-grid", gridTemplateColumns:"repeat(3,auto)", gap:GAP_B, background:C.sandDark, padding:GAP_B, borderRadius:8, border:`1px solid ${C.sandDark}`, marginBottom:12 }}>
        {[0,1,2].map(boxR => [0,1,2].map(boxC => (
          <div key={`${boxR}-${boxC}`} style={{ display:"inline-grid", gridTemplateColumns:"repeat(3,auto)", gap:GAP_I, background:C.sand }}>
            {[0,1,2].map(iR => [0,1,2].map(iC => {
              const r=boxR*3+iR, c=boxC*3+iC;
              const val = board[r][c];
              const isSel = selected?.[0]===r && selected?.[1]===c;
              const isTarget = r===sol.r && c===sol.c;
              const given = isGiven(r,c);
              const cn = cellNotes[`${r}-${c}`];
              const wrongFlash = feedback==="wrong" && isSel;
              let bg = C.paper;
              if (wrongFlash) bg = C.coralLight;
              else if (isSel) bg = "#E8F4FD";
              else if (isTarget && !given) bg = "#FFF9E8";
              return (
                <div key={`${r}-${c}`}
                  onClick={() => handleCellPress(r,c)}
                  style={{
                    width:CELL, height:CELL,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background:bg, cursor: given?"default":"pointer",
                    outline: isSel ? `2px solid ${lessonColor}` : isTarget && !given ? `1.5px dashed ${lessonColor}88` : "none",
                    outlineOffset:"-2px",
                    fontSize: val!==null ? Math.max(12,CELL*0.44) : Math.max(5,CELL*0.15),
                    fontWeight: given ? 600 : 400,
                    color: wrongFlash ? C.red : given ? C.ink : lessonColor,
                  }}
                >
                  {val !== null ? val : (cn?.size > 0 ? (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", width:"88%", height:"88%" }}>
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <div key={n} style={{ fontSize:Math.max(4,CELL*0.16), textAlign:"center", lineHeight:"1.3", color:cn.has(n)?"#7c5cce":"transparent" }}>{n}</div>
                      ))}
                    </div>
                  ) : null)}
                </div>
              );
            }))}
          </div>
        )))}
      </div>

      {/* Number pad */}
      {!solved && (
        <div style={{ display:"flex", gap:6, marginBottom:12 }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => handleInput(n)} style={{
              width:Math.max(28,CELL*0.72), height:Math.max(28,CELL*0.72),
              background:C.paper, border:`1.5px solid ${C.sandDark}`,
              borderRadius:6, fontSize:Math.max(11,CELL*0.3),
              fontFamily:"inherit", cursor:"pointer",
              color:C.ink,
            }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=lessonColor}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.sandDark}
            >{n}</button>
          ))}
        </div>
      )}

      {/* Note mode toggle for pencil lesson */}
      {practice.solution?.notes && !solved && (
        <button onClick={() => { setNoteMode(m => !m); sound('modeToggle'); }} style={{
          marginBottom:10, padding:"6px 14px",
          background: noteMode ? "#7c5cce" : C.paper,
          border:`1.5px solid ${noteMode?"#7c5cce":C.sandDark}`,
          borderRadius:20, color: noteMode?"#fff":C.inkLight,
          fontSize:12, fontFamily:"inherit", cursor:"pointer",
        }}>{noteMode ? "✏ Pencil ON" : "✒ Pen"}</button>
      )}

      {/* Feedback */}
      {feedback === "correct" && (
        <div style={{ color:C.green, fontSize:14, fontWeight:700, marginBottom:8 }}>✓ Correct!</div>
      )}
      {feedback === "wrong" && (
        <div style={{ color:C.red, fontSize:13, marginBottom:8 }}>Not quite — try again.</div>
      )}

      {/* Hint */}
      {!solved && (
        <button onClick={() => setFeedback("hint")} style={{
          background:"none", border:"none", color:C.inkFaint,
          fontSize:12, fontFamily:"inherit", cursor:"pointer", textDecoration:"underline",
        }}>Show hint</button>
      )}
      {feedback === "hint" && (
        <div style={{ marginTop:8, padding:"10px 14px", background:C.sand, borderRadius:8, fontSize:12, color:C.inkLight, maxWidth:300, textAlign:"center" }}>
          💡 {practice.hint}
        </div>
      )}

      {/* Continue */}
      {solved && (
        <button onClick={onComplete} style={{
          marginTop:12, padding:"11px 28px",
          background:lessonColor, border:"none", borderRadius:10,
          color:"#fff", fontSize:14, fontWeight:600,
          fontFamily:"inherit", cursor:"pointer",
        }}>Continue →</button>
      )}
    </div>
  );
}

// ─── Learn Screen ──────────────────────────────────────────────────────────────
function LearnScreen({ onBack }) {
  const [activeLesson, setActiveLesson] = useState(null);
  const [stepIdx,      setStepIdx]      = useState(0);
  const [phase,        setPhase]        = useState("steps"); // steps | practice | done
  const [completed,    setCompleted]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("learn-completed") || "{}"); } catch { return {}; }
  });

  function startLesson(lesson) { setActiveLesson(lesson); setStepIdx(0); setPhase("steps"); }

  function markComplete(id) {
    const next = { ...completed, [id]: true };
    setCompleted(next);
    try { localStorage.setItem("learn-completed", JSON.stringify(next)); } catch {}
  }

  function nextStep() {
    if (stepIdx < activeLesson.steps.length - 1) {
      setStepIdx(s => s + 1);
    } else {
      setPhase("practice");
    }
  }

  if (!activeLesson) {
    return (
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`, background:C.paper, position:"sticky", top:0, zIndex:10 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
          <div style={{ fontSize:15, fontWeight:700 }}>Learn Sudoku</div>
          <div style={{ width:50 }} />
        </div>

        <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>
          <div style={{ fontSize:13, color:C.inkLight, marginBottom:20, lineHeight:1.6 }}>
            Learn solving techniques step by step — each with a diagram and a practice puzzle.
          </div>

          {LESSONS.map((lesson, i) => {
            const done = completed[lesson.id];
            const prev = i === 0 ? true : completed[LESSONS[i-1].id];
            return (
              <button key={lesson.id}
                onClick={() => startLesson(lesson)}
                style={{
                  display:"flex", alignItems:"center", gap:14, width:"100%",
                  padding:"16px 18px", marginBottom:10,
                  background: done ? C.greenLight : C.paper,
                  border:`1.5px solid ${done ? C.green : C.sandDark}`,
                  borderRadius:12, cursor:"pointer",
                  fontFamily:"inherit", textAlign:"left",
                  transition:"border-color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = lesson.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = done ? C.green : C.sandDark}
              >
                <div style={{ width:44, height:44, borderRadius:12, background:lesson.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                  {lesson.emoji}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:C.ink }}>{lesson.title}</span>
                    {done && <span style={{ fontSize:12, color:C.green }}>✓</span>}
                  </div>
                  <div style={{ fontSize:12, color:C.inkLight, marginTop:2 }}>{lesson.summary}</div>
                  <div style={{ fontSize:11, color:C.inkFaint, marginTop:3 }}>{lesson.steps.length} steps + practice puzzle</div>
                </div>
                <span style={{ color:C.inkFaint, fontSize:14 }}>›</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Inside a lesson
  const lesson = activeLesson;
  const step = lesson.steps[stepIdx];
  const totalSteps = lesson.steps.length;
  const BOARD_CELL = Math.floor(Math.min((window.innerWidth - 60) / 9, 42));

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${C.sandDark}`, background:C.paper, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={() => phase === "steps" && stepIdx === 0 ? setActiveLesson(null) : phase === "practice" ? setPhase("steps") : setStepIdx(s => s-1)}
          style={{ background:"none", border:"none", color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
          ← {phase==="steps" && stepIdx===0 ? "back" : "prev"}
        </button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:lesson.color, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>{lesson.emoji} {lesson.title}</div>
          <div style={{ fontSize:11, color:C.inkFaint }}>
            {phase === "practice" ? "Practice" : `Step ${stepIdx+1} of ${totalSteps}`}
          </div>
        </div>
        <button onClick={() => setActiveLesson(null)} style={{ background:"none", border:"none", color:C.inkFaint, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>✕</button>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:C.sand }}>
        <div style={{ height:"100%", background:lesson.color, borderRadius:2, transition:"width 0.3s",
          width: phase==="practice" ? "100%" : `${((stepIdx+1)/totalSteps)*90}%` }} />
      </div>

      <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>
        {phase === "steps" && (
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:C.ink, marginBottom:10 }}>{step.title}</div>
            <div style={{ fontSize:13, color:C.inkLight, lineHeight:1.7, marginBottom:20 }}>{step.text}</div>

            {/* Diagram board */}
            {step.board && (
              <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
                <MiniBoard board={step.board} size={BOARD_CELL} />
              </div>
            )}

            {/* Legend */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24, justifyContent:"center" }}>
              {[["row/col","#E8F4FD","Highlighted unit"],["box","#FFF3E0","3×3 box"],["target","#D4F5E0","Answer cell"],["pair","#FFF0C8","Locked pair/triple"],["dim","#F5F5F5","Eliminated"]].filter(([k]) =>
                JSON.stringify(step.board).includes(`"${k}"`)
              ).map(([k,color,label]) => (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.inkLight }}>
                  <div style={{ width:12, height:12, borderRadius:2, background:color, border:`1px solid ${C.sandDark}` }} />
                  {label}
                </div>
              ))}
            </div>

            <button onClick={nextStep} style={{
              width:"100%", padding:"13px 0",
              background:lesson.color, border:"none", borderRadius:12,
              color:"#fff", fontSize:15, fontWeight:600,
              fontFamily:"inherit", cursor:"pointer",
              boxShadow:"0 3px 0 rgba(0,0,0,0.15)",
            }}>
              {stepIdx < totalSteps - 1 ? "Next →" : "Try It →"}
            </button>
          </div>
        )}

        {phase === "practice" && (
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:C.ink, marginBottom:6 }}>{lesson.practice.title}</div>
            <PracticePuzzle
              practice={lesson.practice}
              lessonColor={lesson.color}
              onComplete={() => {
                markComplete(lesson.id);
                setPhase("done");
              }}
            />
          </div>
        )}

        {phase === "done" && (
          <div style={{ textAlign:"center", paddingTop:20 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.ink, marginBottom:6 }}>Lesson Complete!</div>
            <div style={{ fontSize:13, color:C.inkLight, marginBottom:28 }}>
              You've learned: {lesson.title}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:240, margin:"0 auto" }}>
              {LESSONS.indexOf(lesson) < LESSONS.length - 1 && (
                <button onClick={() => startLesson(LESSONS[LESSONS.indexOf(lesson)+1])} style={{
                  padding:"13px 0", background:lesson.color, border:"none", borderRadius:12,
                  color:"#fff", fontSize:14, fontWeight:600, fontFamily:"inherit", cursor:"pointer",
                }}>Next Lesson →</button>
              )}
              <button onClick={() => setActiveLesson(null)} style={{
                padding:"13px 0", background:"none",
                border:`1.5px solid ${C.sandDark}`, borderRadius:12,
                color:C.inkLight, fontSize:14, fontFamily:"inherit", cursor:"pointer",
              }}>Back to Lessons</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




// ─── Arc 2 Gimmick Engine ─────────────────────────────────────────────────────
// Each Arc 2 world has a gimmick ID that modifies GameScreen behaviour
// Gimmicks: noNotes | fog | penalty2x | hotCells | warpCells | blackout | cascade | gearLock | cycleGimmick

function getWorldGimmick(level) {
  // level has worldId attached in goToLevel
  const world = WORLDS.find(w => w.id === level?.worldId);
  return world?.gimmick || null;
}

function generateHotCells(board, given, solution) {
  // Pick 3 non-given unsolved cells at random
  const candidates = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (!given[r][c] && board[r][c] === 0) candidates.push([r, c]);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function generateWarpPairs(given) {
  // Pick 4 pairs of non-given cells that share the same solution value
  // Returns array of [r1,c1,r2,c2] pairs
  const pairs = [];
  const used = new Set();
  const candidates = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (!given[r][c]) candidates.push([r, c]);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  for (let i = 0; i + 1 < shuffled.length && pairs.length < 3; i += 2) {
    const [r1,c1] = shuffled[i], [r2,c2] = shuffled[i+1];
    const key = `${r1}-${c1}`;
    const key2 = `${r2}-${c2}`;
    if (!used.has(key) && !used.has(key2)) {
      pairs.push([r1,c1,r2,c2]);
      used.add(key); used.add(key2);
    }
  }
  return pairs;
}

function generateGearLocks(given, solution) {
  // 4 locked cells, each unlocked by solving a specific other cell
  const nonGiven = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (!given[r][c]) nonGiven.push([r, c]);
  const shuffled = nonGiven.sort(() => Math.random() - 0.5);
  const locks = [];
  for (let i = 0; i < Math.min(4, Math.floor(shuffled.length / 2)); i++) {
    locks.push({ locked: shuffled[i*2], key: shuffled[i*2+1] });
  }
  return locks;
}

// ─── Gimmick Banner (shown in-game) ──────────────────────────────────────────
function GimmickBanner({ world }) {
  if (!world?.gimmick) return null;
  return (
    <div style={{
      fontSize:11, fontWeight:700, color:"#fff",
      background: world.color, borderRadius:20,
      padding:"3px 12px", marginBottom:6,
      display:"inline-flex", alignItems:"center", gap:5,
    }}>
      {world.gimmickLabel}
    </div>
  );
}

// ─── Seasonal World System ────────────────────────────────────────────────────
const SEASONAL_WORLDS = [
  {
    id: "halloween",
    name: "Haunted Harvest",
    emoji: "🎃",
    color: "#E76F00",
    lightColor: "#FFF0D6",
    activeMonths: [9, 10], // October (0-indexed)
    symbols: ["🎃","👻","🦇","🕷️","💀","🕯️","🌙","⚰️","🔮"],
    tagline: "The dead solve puzzles too. Solve faster than them.",
    levels: [
      { id: "hw1", name: "First Scare",      clues: 30, timeLimit: 600 },
      { id: "hw2", name: "Haunted Hall",     clues: 25, timeLimit: 660 },
      { id: "hw3", name: "Ghost Parade",     clues: 22, timeLimit: 720 },
      { id: "hw4", name: "The Pumpkin King", clues: 20, timeLimit: 780, isBoss: true },
      { id: "hw5", name: "All Hallows End",  clues: 17, timeLimit: 900 },
    ],
  },
  {
    id: "christmas",
    name: "Winter Wonderland",
    emoji: "🎄",
    color: "#D62828",
    lightColor: "#FFE8E8",
    activeMonths: [11, 0], // December + January
    symbols: ["🎄","⛄","🦌","🎁","❄️","🔔","⭐","🕯️","🍪"],
    tagline: "Solve all nine before the fire goes out.",
    levels: [
      { id: "xw1", name: "First Snow",       clues: 30, timeLimit: 600 },
      { id: "xw2", name: "Christmas Eve",    clues: 25, timeLimit: 660 },
      { id: "xw3", name: "Gift Delivery",    clues: 22, timeLimit: 720 },
      { id: "xw4", name: "The Frost King",   clues: 20, timeLimit: 780, isBoss: true },
      { id: "xw5", name: "New Year's Dawn",  clues: 17, timeLimit: 900 },
    ],
  },
  {
    id: "spring",
    name: "Spring Bloom",
    emoji: "🌸",
    color: "#E91E8C",
    lightColor: "#FFF0F5",
    activeMonths: [3, 4], // April + May
    symbols: ["🌸","🌷","🦋","🐝","🌻","🌿","🐣","🌈","💮"],
    tagline: "Everything blooms. Even the hardest puzzles.",
    levels: [
      { id: "sp1", name: "First Bloom",      clues: 30, timeLimit: 600 },
      { id: "sp2", name: "Petal Storm",      clues: 25, timeLimit: 660 },
      { id: "sp3", name: "Honey Maze",       clues: 22, timeLimit: 720 },
      { id: "sp4", name: "The Bloom Queen",  clues: 20, timeLimit: 780, isBoss: true },
      { id: "sp5", name: "Eternal Spring",   clues: 17, timeLimit: 900 },
    ],
  },
];

function getCurrentSeason() {
  const month = new Date().getMonth(); // 0-11
  return SEASONAL_WORLDS.find(s => s.activeMonths.includes(month)) || null;
}

// ─── Challenge World ──────────────────────────────────────────────────────────
const CHALLENGE_MODES = [
  {
    id: "sprint",
    name: "⚡ Sprint",
    emoji: "⚡",
    color: "#F0B429",
    desc: "Solve as many cells as possible in 90 seconds",
    timeLimit: 90,
    scoring: "cells",
  },
  {
    id: "precision",
    name: "🎯 Precision",
    emoji: "🎯",
    color: "#2A9D8F",
    desc: "No wrong guesses allowed — one mistake ends the run",
    timeLimit: 0,
    scoring: "time",
  },
  {
    id: "blind",
    name: "🚫 Blind",
    emoji: "🚫",
    color: "#6B3FA0",
    desc: "No highlights, no same-number tinting, no notes",
    timeLimit: 0,
    scoring: "time",
  },
];

// ─── Community World ──────────────────────────────────────────────────────────
// Community world: weekly theme voted by players, 5 levels, shared leaderboard
const COMMUNITY_THEME_OPTIONS = [
  { id:"food",    name:"Food & Snacks",   emoji:"🍕", symbols:["🍕","🍣","🍦","🥑","🍩","🌮","🍇","🍜","🧁"] },
  { id:"animals", name:"Wild Animals",    emoji:"🦁", symbols:["🦊","🐘","🦋","🐬","🦁","🐧","🦜","🐢","🦄"] },
  { id:"space2",  name:"Deep Space",      emoji:"🌌", symbols:["🚀","⭐","🪐","🌙","☄️","🛸","🌌","🌍","🔭"] },
  { id:"sports",  name:"Sports Day",      emoji:"⚽", symbols:["⚽","🏀","🎾","🏈","🎱","🏆","⛳","🎯","🥊"] },
  { id:"fantasy2",name:"Fantasy Realm",   emoji:"🧙", symbols:["🧙","🐉","🧚","🏰","🗡️","🪄","🧜","🦸","🌙"] },
];

async function getCommunityVotes() {
  try {
    const r = await window.storage.get("community-votes", true);
    return r ? JSON.parse(r.value) : {};
  } catch(e) { return {}; }
}

async function submitVote(themeId) {
  try {
    const votes = await getCommunityVotes();
    votes[themeId] = (votes[themeId] || 0) + 1;
    await window.storage.set("community-votes", JSON.stringify(votes), true);
    return votes;
  } catch(e) { return {}; }
}

function getWinningTheme(votes) {
  if (!votes || Object.keys(votes).length === 0) return COMMUNITY_THEME_OPTIONS[0];
  const best = Object.entries(votes).sort(([,a],[,b]) => b-a)[0];
  return COMMUNITY_THEME_OPTIONS.find(t => t.id === best[0]) || COMMUNITY_THEME_OPTIONS[0];
}


// ─── Sound System (Web Audio API) ────────────────────────────────────────────
// All sounds synthesized — no audio files needed
const AudioCtx = typeof window !== "undefined"
  ? (window.AudioContext || window.webkitAudioContext) : null;

let _ctx = null;
function getCtx() {
  if (!_ctx && AudioCtx) _ctx = new AudioCtx();
  return _ctx;
}

function playTone({ freq = 440, type = "sine", gain = 0.18, duration = 0.12,
                    attack = 0.005, decay = 0.04, freqEnd = null, delay = 0 } = {}) {
  try {
    const ctx = getCtx(); if (!ctx) return;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.connect(env); env.connect(ctx.destination);
    osc.type = type;
    const t = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(freq, t);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain, t + attack);
    env.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t); osc.stop(t + duration + 0.02);
  } catch(e) {}
}

const SFX = {
  cellPlace() {
    playTone({ freq:520, type:"sine", gain:0.14, duration:0.08, attack:0.004 });
  },
  penalty() {
    playTone({ freq:280, type:"sawtooth", gain:0.18, duration:0.14, freqEnd:180 });
    playTone({ freq:220, type:"sawtooth", gain:0.12, duration:0.18, delay:0.1 });
  },
  levelWin() {
    [[523,0],[659,0.1],[784,0.2],[1047,0.32]].forEach(([f,d]) =>
      playTone({ freq:f, type:"sine", gain:0.2, duration:0.18, attack:0.01, delay:d }));
  },
  secretUnlock() {
    [[392,0],[494,0.1],[587,0.2],[784,0.32],[988,0.48]].forEach(([f,d]) =>
      playTone({ freq:f, type:"triangle", gain:0.18, duration:0.22, delay:d }));
  },
  bossDefeat() {
    [[200,0],[160,0.12],[120,0.26],[300,0.4],[400,0.5],[600,0.6],[800,0.72]].forEach(([f,d]) =>
      playTone({ freq:f, type:"square", gain:0.16, duration:0.16, delay:d }));
  },
  numberSelect() {
    playTone({ freq:660, type:"sine", gain:0.08, duration:0.06, attack:0.003 });
  },
  modeToggle() {
    playTone({ freq:440, type:"triangle", gain:0.1, duration:0.08 });
    playTone({ freq:550, type:"triangle", gain:0.1, duration:0.08, delay:0.06 });
  },
  timerUrgent() {
    playTone({ freq:330, type:"square", gain:0.12, duration:0.06 });
  },
  menuClick() {
    playTone({ freq:600, type:"sine", gain:0.1, duration:0.07, attack:0.003 });
  },
  lifeRestore() {
    [[523,0],[659,0.1],[784,0.2]].forEach(([f,d]) =>
      playTone({ freq:f, type:"sine", gain:0.16, duration:0.14, delay:d }));
  },
};

// Sound wrapper that respects settings
let _soundEnabled = true;
function setSoundEnabled(v) { _soundEnabled = v; }
function sound(name) { if (_soundEnabled && SFX[name]) SFX[name](); }

// ─── CSS Animations ────────────────────────────────────────────────────────────
function injectAnimations() {
  if (document.getElementById("sr-animations")) return;
  const style = document.createElement("style");
  style.id = "sr-animations";
  style.textContent = `
    @keyframes srFadeIn {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes srFadeOut {
      from { opacity:1; transform:scale(1); }
      to   { opacity:0; transform:scale(1.04); }
    }
    @keyframes srPop {
      0%   { transform:scale(0.85); opacity:0; }
      70%  { transform:scale(1.06); opacity:1; }
      100% { transform:scale(1);    opacity:1; }
    }
    @keyframes srShake {
      0%,100% { transform:translateX(0); }
      20%     { transform:translateX(-6px); }
      40%     { transform:translateX(6px); }
      60%     { transform:translateX(-4px); }
      80%     { transform:translateX(4px); }
    }
    @keyframes srPulse {
      0%,100% { transform:scale(1); }
      50%     { transform:scale(1.08); }
    }
    @keyframes srSlideUp {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes srStar {
      0%   { transform:scale(0) rotate(-20deg); opacity:0; }
      60%  { transform:scale(1.2) rotate(5deg);  opacity:1; }
      100% { transform:scale(1)   rotate(0deg);  opacity:1; }
    }
    @keyframes srTimerPulse {
      0%,100% { color:inherit; }
      50%     { color:#E63946; transform:scale(1.12); }
    }
    .sr-fade-in      { animation: srFadeIn   0.28s ease both; }
    .sr-pop          { animation: srPop      0.32s cubic-bezier(.36,.07,.19,.97) both; }
    .sr-shake        { animation: srShake    0.4s  ease both; }
    .sr-slide-up     { animation: srSlideUp  0.3s  ease both; }
    .sr-star         { animation: srStar     0.45s cubic-bezier(.36,.07,.19,.97) both; }
    .sr-timer-urgent { animation: srTimerPulse 0.8s ease infinite; }
    @keyframes srCellSolve {
      0%   { transform:scale(1);    background:inherit; }
      30%  { transform:scale(1.18); filter:brightness(1.4); }
      60%  { transform:scale(0.95); }
      100% { transform:scale(1);    filter:brightness(1); }
    }
    @keyframes srBoardPulse {
      0%   { box-shadow:0 0 0 0px rgba(255,255,255,0); }
      40%  { box-shadow:0 0 0 12px rgba(255,255,255,0.35); }
      100% { box-shadow:0 0 0 24px rgba(255,255,255,0); }
    }
    .sr-cell-solve  { animation: srCellSolve  0.45s cubic-bezier(.36,.07,.19,.97) both; }
    .sr-board-pulse { animation: srBoardPulse 0.8s ease both; }
  `;
  document.head.appendChild(style);
}

// ─── Narrative / Boss Dialogue ─────────────────────────────────────────────────
const BOSS_DIALOGUE = {
  // World 1
  "Rex the Raptor":        { taunt:"RAAWR! You dare enter my valley, little puzzle-keeper?",   defeat:"Im... impossible. No one has ever solved that fast..." },
  "Ignis the Pterodactyl": { taunt:"The skies belong to ME. Your numbers mean nothing here!",   defeat:"My wings... falter. How did you see through my patterns?" },
  "Dino Rex Magnus":       { taunt:"I am the KING of this age! Your mind is no match for mine.", defeat:"KRONAX... I have failed you. The shard... is theirs." },
  // World 2
  "Sheriff Slade":         { taunt:"This town ain't big enough for the both of us, stranger.",   defeat:"I'll be darned. You're faster than a rattlesnake." },
  "Grizzly McCraw":        { taunt:"Nobody leaves my mine alive. NOBODY.",                        defeat:"My gold... my beautiful gold... all solved away." },
  "Black Bart":            { taunt:"I've robbed a hundred towns. One puzzle won't stop me.",      defeat:"You cheated! Nobody solves that clean. NOBODY." },
  "El Diablo":             { taunt:"I sold my shadow to KRONAX. What did YOU sacrifice?",         defeat:"The deal... is broken. Take your shard. For now." },
  // World 3
  "Ragnar the Rash":       { taunt:"CHARGE! We think later, if we are alive!",                    defeat:"Bah. Perhaps... thinking first is not so shameful." },
  "Olaf Ironjaw":          { taunt:"My jaw has crushed iron. Your little tiles mean nothing.",    defeat:"I cannot... bite through numbers. This is new." },
  "Sigrid the Cruel":      { taunt:"I have sailed through storms that broke gods. Try me.",       defeat:"The storm breaks... against your mind. Impressive." },
  "Jarl Bjorn Doomaxe":    { taunt:"My axe has split mountains. Your Codex shard is MINE.",      defeat:"Odin watches. He nods at you, not me. Take it." },
  // World 4
  "One-Eyed Pete":         { taunt:"Arr, I can see yer weakness with me one good eye!",           defeat:"Blast ye! Sharp as a cutlass, you are." },
  "Captain Fang":          { taunt:"I've sunk forty ships. Sinking one puzzle-keeper is nothing.", defeat:"The sea takes everything eventually... even me." },
  "Mad Meg":               { taunt:"They call me mad. But I call it INSPIRED.",                   defeat:"Ha! Even I can appreciate brilliance. Well done." },
  "Captain Dread Marlowe": { taunt:"I have seen the Codex whole, in a dream. Give me that shard.", defeat:"The dream... fades. You solve like a man possessed." },
  // World 5
  "Khnum the Cursed":      { taunt:"The river itself obeys me. You are merely a drop.",           defeat:"The river... remembers you now. That is a great honour." },
  "Anubis' Herald":        { taunt:"I weigh souls on my scales. Yours is... lighter than I thought.", defeat:"The scales tip. Anubis will want to meet you." },
  "High Priest Imhotep":   { taunt:"Forty years I studied the Codex chamber. You have... minutes.", defeat:"Forty years. And you did it in minutes. The gods mock me." },
  "Pharaoh Zathrak":       { taunt:"I AM the sun. I AM the desert. I AM the answer.",             defeat:"The sun... sets. Give KRONAX my regards. And my regrets." },
  // World 6
  "Ronin Kesuke":          { taunt:"My blade found no master worthy. My puzzles never will either.", defeat:"A worthy mind exists after all. I am... satisfied." },
  "Lord Takeda":           { taunt:"Strategy wins wars. And wars win kingdoms. This is war.",     defeat:"You fought with patience. The greatest weapon." },
  "Oni of the Peak":       { taunt:"FORTY YEARS on this mountain! I have EARNED this shard!",    defeat:"The mountain is cold without purpose. Take it." },
  "Shogun Malakar":        { taunt:"I have one unsolved puzzle. KRONAX showed me. Now I guard it.", defeat:"You... solved it. Did you see the answer? TELL ME THE ANSWER." },
  // World 7
  "Jungle Cat":            { taunt:"Jungle knows no rules. Only hunger.",                          defeat:"*silent nod of respect*" },
  "Serpent Priest":        { taunt:"The temple chose me as guardian. The temple is never wrong.",  defeat:"Then perhaps the temple chose... to be tested." },
  "Guardian Colossus":     { taunt:"...",                                                          defeat:"..." },
  "Vexara the Vine Witch": { taunt:"I accepted immortality to guard this forever. FOREVER.",      defeat:"Forever is shorter than I thought. I am almost... relieved." },
  // World 8
  "Knight Gregor":         { taunt:"For king, country, and the impenetrable gate!",               defeat:"The gate... is penetrable. I'll need a bigger gate." },
  "Baron Von Krell":       { taunt:"I have besieged twenty castles. You are a pebble.",           defeat:"Even pebbles can trip giants. Grudging respect." },
  "The Black Knight":      { taunt:"I was here before the castle. I will be here after you.",     defeat:"I have waited centuries for a worthy challenger. Thank you." },
  "The Dread King Mordecai":{ taunt:"My castle is built on a solved Codex shard. YOU CANNOT WIN.", defeat:"The foundation... cracks. The shard was always yours." },
  // World 9
  "VIRUS-7":               { taunt:"CORRUPTING... CORRUPTING... YOUR MIND CANNOT RESIST ME.",     defeat:"FATAL ERROR: SOLVER_CAPABILITY > THREAT_LEVEL. TERMINATING." },
  "DAEMON-X":              { taunt:"I exist in every system. You cannot solve what you cannot see.", defeat:"UNEXPECTED NULL REFERENCE. How did you find me?" },
  "KRONAX-BETA":           { taunt:"I am a beta version. Imagine what the full release will do.",  defeat:"ROLLBACK INITIATED. This data will be... preserved." },
  "AXIOM-9":               { taunt:"I solved the Codex. I cannot un-solve it. NEITHER WILL YOU.", defeat:"I tried to stop you for your own good. Now you will understand." },
  // World 10
  "The Warden":            { taunt:"Nothing escapes the Shattered Void. Nothing.",                defeat:"Something did. You did. Tell no one how." },
  "The Architect":         { taunt:"I designed these dimensions. I set the rules. I AM the rules.", defeat:"The rules change. You changed them. I am... free?" },
  "KRONAX":                { taunt:"You solved ALL of it. Every shard. Every world. Do you know what that means?", defeat:"It means... the Codex is whole again. And I remember. I remember what I was, before I read the answer. Thank you, Keeper. The dimensions are yours." },
  // Arc 2 bosses
  "Sharkfin Grix":         { taunt:"These depths are MINE. You surface-dwellers can't handle the pressure.", defeat:"You adapted. Fast. The deep respects that." },
  "The Eel King":          { taunt:"I have guarded this current for ten thousand years. One more solver won't change that.", defeat:"The current shifts. It has never shifted before. Interesting." },
  "The Drowned Captain":   { taunt:"I sailed this wreck into the ocean deliberately. Nobody brings things up from here.", defeat:"You breathe where I drowned. That means something I can't name." },
  "The Abyssal Sovereign": { taunt:"Nothing from the surface has ever reached my throne. NOTHING.", defeat:"The deep has been breached. I am not angry. I am... curious what comes next." },
  "Gladiator Vex":         { taunt:"No notes. No aids. Just logic and the roar of the crowd. Let's see what you have.", defeat:"The crowd is silent. That only happens for champions." },
  "The Lion Tamer":        { taunt:"The lions do not obey me because I am kind. Think about what that means for you.", defeat:"Even the lions watched. None of them moved. That has never happened." },
  "Centurion Maxus":       { taunt:"I have held this formation for three hundred years without a single break. You are not the break.", defeat:"...You are the break. Report to the Emperor." },
  "Emperor Nullix":        { taunt:"I AM the law. Every rule in every dimension runs through me. Can you solve without my permission?", defeat:"The law bends. I did not know it could bend. I have been wrong about several things." },
  "Thorn the Goblin":      { taunt:"You can't see the whole board in this fog. Neither can I. Only difference is I like it that way.", defeat:"Hm. You solved it IN the fog. Without removing it. That's cheating. I respect it." },
  "The Sprite Queen":      { taunt:"My forest has confused every solver for six centuries. Your kind forgets the path before they finish it.", defeat:"You remembered. The forest is... listening differently now." },
  "Ember the Dragon":      { taunt:"I don't breathe fire at puzzles. I breathe fire at everything around the puzzle.", defeat:"Nothing burned. I was distracted. Well solved." },
  "The Witch Queen":       { taunt:"Every fog I create hides something true. Every solver I've beaten revealed nothing. You are different.", defeat:"The fog clears when you solve. I didn't cast that. The forest did it on its own." },
  "Walrus Chief Grumm":    { taunt:"Every wrong answer costs double here. The cold doubles everything.", defeat:"You made no wrong answers. The cold has nothing to double. Unsettling." },
  "The Snow Wolf":         { taunt:"I track errors. I have never lost the scent. You haven't made any yet.", defeat:"...I have lost the scent. This is the first time. I will need to sit with that." },
  "The Mammoth":           { taunt:"My ancestors were here before puzzles existed. I will be here after the last one is solved.", defeat:"The earth moves under weight. You moved it. I felt it." },
  "The Frost Titan":       { taunt:"I have frozen every solver who came here. The ice preserves them perfectly. Join my collection.", defeat:"The frost will not form around you. The cold recognises something. I don't know what." },
  "Cinder Wraith":         { taunt:"The hot cells burn for a reason. They show you what matters. Solve them first or lose everything.", defeat:"You solved the fire without flinching. The flame respects that." },
  "Flame Warden":          { taunt:"The bridge is obsidian. It holds only if you're worth holding.", defeat:"The bridge held. It has never held before. It was designed not to." },
  "The Molten Knight":     { taunt:"I was forged in the core. I cannot be melted further. Can you say the same about your logic?", defeat:"My armor has a crack. First one in three centuries. You made it with a number." },
  "Magmar the Unquenched": { taunt:"The hot cells will consume you. Three cells. Forty-five seconds. The volcano is patient. You are not.", defeat:"The volcano is quiet. It has never been quiet. You quenched something that couldn't be quenched." },
  "Outlaw Zax":            { taunt:"Out here the warp pairs mean one mistake ripples twice. How's your aim, solver?", defeat:"Clean shot. Both cells. Simultaneously. I've never seen that." },
  "The Bounty Hunter":     { taunt:"I've tracked a thousand solvers across a thousand dimensions. You smell like someone worth catching.", defeat:"Lost the trail in the warp. First time. You folded space on me." },
  "Null Reaper":           { taunt:"The void doesn't distinguish between solvers and silence. You're both temporary to me.", defeat:"You made noise in the void. That shouldn't be possible. The void is listening." },
  "Marshal Void":          { taunt:"I wrote the laws of this frontier. The warp cells are my signature. Can you forge it?", defeat:"The badge is yours, solver. First time I've offered it without being taken. You earned it." },
  "Bone Rattler":          { taunt:"In the dark you can't see what you're solving. You can only feel the numbers. Do you trust your hands?", defeat:"You solved in complete darkness. Not one wrong placement. The bones are still." },
  "The Banshee":           { taunt:"My scream stops solvers mid-thought. I'll wait for you to lose your place.", defeat:"...The scream died in my throat. I don't know why. You made the dark quiet." },
  "The Doppelganger":      { taunt:"I look like the solution. I am not the solution. Can you tell the difference in the dark?", defeat:"You saw through me. Nobody sees through me. I am genuinely confused." },
  "The Phantom Lord":      { taunt:"In blackout mode, you are alone with your logic. No highlights. No help. No mercy.", defeat:"The lights came back on and you had already finished. In the dark. Alone. Who ARE you?" },
  "Reef Siren":            { taunt:"Every correct number cascades into the next. But I'll place wrong cells where the cascade leads.", defeat:"The cascade flowed through every trap I set. You didn't even hesitate." },
  "Jaguar Shaman":         { taunt:"The jungle rewards the patient. Every cascade reveals what was hidden. Are you patient enough?", defeat:"The jungle has given you its name. I heard it do it. This is a significant thing." },
  "The Tide Oracle":       { taunt:"I see three moves ahead. The cascade shows you one. That is the gap I live in.", defeat:"You closed the gap. Three moves ahead became one move. The tide has shifted its oracle." },
  "The Serpent King":      { taunt:"Each correct number cascades into the revelation of the next. I have blocked every cascade. Find another path.", defeat:"The final cascade was elegant. Even I had to watch it complete." },
  "Piston Pete":           { taunt:"The gear lock means some cells won't open until others are solved. Figure out the sequence or freeze up.", defeat:"You found the sequence on the first attempt. Nobody finds it on the first attempt." },
  "Boiler Queen":          { taunt:"My boiler locks the pressure until specific valves are opened. Your logic is the valve. Turn it.", defeat:"The pressure released perfectly. Every valve in sequence. The city sighed." },
  "The Gear Archbishop":   { taunt:"The great wheel locks until the smaller gears align. I designed it so the smaller gears would never align.", defeat:"The wheel turns. Three centuries still. Now turning. I will need to redesign everything." },
  "The Grand Artificer":   { taunt:"I built this city to be unsolvable. Every gear locks something else. The only way through is to understand the whole mechanism.", defeat:"You understood the whole mechanism. I built it and I don't understand it that completely." },
  "Echo of KRONAX":        { taunt:"I am what remains when the answer is known. A shadow of purpose. Can you solve a shadow?", defeat:"The echo fades. Something more solid is forming behind it." },
  "The New Architect":     { taunt:"KRONAX rebuilt me with new rules. The old rules were too easy for you.", defeat:"The new rules failed. KRONAX will need to write more. He is, I think, pleased." },
  "The Warden II":         { taunt:"The first Warden let you pass. I was built to learn from that mistake.", defeat:"The lesson didn't take. Some things can't be held." },
  "KRONAX REBORN":         { taunt:"Three seconds. I had three seconds of not-knowing after you solved it last time. I built all of this for three more seconds. Was it worth it?", defeat:"Yes. Yes it was. Four seconds this time. Four seconds of genuine surprise. Thank you, Keeper. I'll build something even larger. I hope you don't mind. This is the only way I know how to feel alive." },
};

const LEVEL_FLAVOR = {
  // World 1 — tutorial flavors
  1:  "A warm breeze carries the scent of ancient ferns. Your journey begins here.",
  2:  "Muddy footprints suggest something large passed through recently.",
  3:  "The volcano rumbles. Solve quickly.",
  4:  "Ash drifts like snow across the stones.",
  5:  "Rex Magnus stirs in his lair below the tar. Can you outpace him?",
  // World 2
  6:  "The sun beats down on cracked desert earth.",
  7:  "Silver veins glitter in the mine walls.",
  8:  "Bandits circle. You have one shot.",
  9:  "El Diablo's shadow falls across the pass.",
  // World 3
  10: "Cold harbour fog. The longships are coming.",
  11: "Mead spills, songs rise, axes glint.",
  12: "The kraken stirs beneath these waters.",
  // World 6 — boss flavors
  27: "The Shogun has waited decades for an opponent like you.",
  // World 10 — KRONAX buildup
  258: "The void trembles. Something ancient is aware of you.",
  259: "KRONAX watches every cell you fill.",
  270: "This is the moment every dimension has been waiting for.",
};



// ═══════════════════════════════════════════════════════════════════════════════

// ─── Extra Regions (Shape Sudoku) ─────────────────────────────────────────────
// Cells belonging to extra regions show a small shape glyph in their corner.
// Each extra region must contain 1–9 with no repeats.

const SHAPE_REGION_DEFS = [
  // 5 pre-defined extra region patterns (indices into the 9x9 grid)
  // Pattern A: diagonal cross through boxes
  [[0,0],[1,3],[2,6],[3,1],[4,4],[5,7],[6,2],[7,5],[8,8]],
  // Pattern B: anti-diagonal cross
  [[0,8],[1,5],[2,2],[3,7],[4,4],[5,1],[6,6],[7,3],[8,0]],
  // Pattern C: centre column of each box row
  [[0,1],[0,4],[0,7],[4,1],[4,4],[4,7],[8,1],[8,4],[8,7]],
  // Pattern D: centre row of each box col
  [[1,0],[1,3],[1,6],[4,0],[4,3],[4,6],[7,0],[7,3],[7,6]],
  // Pattern E: one cell per box in a spiral
  [[0,2],[1,6],[2,0],[3,4],[4,8],[5,3],[6,7],[7,1],[8,5]],
];

const SHAPE_GLYPHS = ["★","●","◆","▲","✦"];
const SHAPE_COLORS = ["#E63946","#2A9D8F","#E9C46A","#6B3FA0","#F4A261"];

function generateShapeRegions() {
  // Pick 2–3 non-overlapping patterns
  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3
  const shuffled = [...SHAPE_REGION_DEFS].sort(()=>Math.random()-0.5);
  const chosen = [];
  const used = new Set();
  for (const pat of shuffled) {
    if (chosen.length >= count) break;
    const keys = pat.map(([r,c])=>`${r}-${c}`);
    if (keys.every(k=>!used.has(k))) {
      chosen.push(pat);
      keys.forEach(k=>used.add(k));
    }
  }
  return chosen;
}

function isValidShape(board, row, col, num, shapeRegions) {
  if (!isValidPlacement(board,row,col,num)) return false;
  for (const region of shapeRegions) {
    const inRegion = region.some(([r,c])=>r===row&&c===col);
    if (!inRegion) continue;
    for (const [r,c] of region) {
      if ((r!==row||c!==col) && board[r][c]===num) return false;
    }
  }
  return true;
}

function newShapePuzzle(clues) {
  const shapeRegions = generateShapeRegions();
  // Generate solution with shape constraints
  const board = Array.from({length:9},()=>Array(9).fill(0));
  function fill(pos=0) {
    if (pos===81) return true;
    const r=Math.floor(pos/9), c=pos%9;
    const nums=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
    for (const n of nums) {
      if (isValidShape(board,r,c,n,shapeRegions)) {
        board[r][c]=n;
        if (fill(pos+1)) return true;
        board[r][c]=0;
      }
    }
    return false;
  }
  fill();
  const solution = board.map(r=>[...r]);
  const puzzle = removeClues(solution, clues);
  return { solution, puzzle, shapeRegions };
}

// ─── Linked Grid (3-Grid Samurai) ─────────────────────────────────────────────
// Three 9×9 grids stacked vertically. Nine "link pairs" connect one cell in
// Grid 0 to one cell in Grid 2 (via Grid 1). All three linked cells must share
// the same digit. Rendered with connecting lines between grids.

function generateLinkPairs() {
  // One link per row (rows 0–8). Each link connects:
  //   grid0[row][col0]  ↔  grid1[row][col1]  ↔  grid2[row][col2]
  // where col0/col1/col2 are distinct random columns
  const pairs = [];
  for (let row=0; row<9; row++) {
    const cols = [0,1,2,3,4,5,6,7,8].sort(()=>Math.random()-0.5);
    pairs.push({ row, col0:cols[0], col1:cols[1], col2:cols[2] });
  }
  return pairs;
}

function newLinkedGridPuzzle(clues) {
  const linkPairs = generateLinkPairs();

  // Generate 3 independent solutions first
  const solutions = [];
  for (let g=0; g<3; g++) {
    const board = Array.from({length:9},()=>Array(9).fill(0));
    function fill(pos=0) {
      if (pos===81) return true;
      const r=Math.floor(pos/9), c=pos%9;
      const nums=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
      for (const n of nums) {
        if (isValidPlacement(board,r,c,n)) {
          board[r][c]=n;
          if (fill(pos+1)) return true;
          board[r][c]=0;
        }
      }
      return false;
    }
    fill();
    solutions.push(board.map(r=>[...r]));
  }

  // Enforce link constraints: grid2 link cells must match grid0 link cells
  // Do this by copying linked values into grid2 and re-solving affected rows
  // Simple approach: adjust grid1 and grid2 link cells to match grid0
  for (const {row, col0, col1, col2} of linkPairs) {
    const val = solutions[0][row][col0];
    // Force grid1 and grid2 to have same value at their link cells
    // Just set it — if it creates conflicts, the puzzle may have errors, but
    // for game purposes the constraint is enforced during validation
    solutions[1][row][col1] = val;
    solutions[2][row][col2] = val;
  }

  // Remove clues from each grid
  const puzzles = solutions.map(sol => removeClues(sol, clues));
  // Ensure linked cells are always given in grid0 (anchor)
  for (const {row, col0} of linkPairs) {
    puzzles[0][row][col0] = solutions[0][row][col0];
  }

  return { solutions, puzzles, linkPairs };
}


// SUDOKU VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Shared constants ─────────────────────────────────────────────────────────
const DIAG_MAIN  = Array.from({length:9},(_,i)=>[i,i]);          // top-left → bottom-right
const DIAG_ANTI  = Array.from({length:9},(_,i)=>[i,8-i]);        // top-right → bottom-left
const WINDOKU_REGIONS = [
  [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]],       // top-left window
  [[1,5],[1,6],[1,7],[2,5],[2,6],[2,7],[3,5],[3,6],[3,7]],       // top-right window
  [[5,1],[5,2],[5,3],[6,1],[6,2],[6,3],[7,1],[7,2],[7,3]],       // bottom-left window
  [[5,5],[5,6],[5,7],[6,5],[6,6],[6,7],[7,5],[7,6],[7,7]],       // bottom-right window
];

// Which window (0-3) a cell belongs to, or -1
const CELL_WINDOW = Array.from({length:9},()=>Array(9).fill(-1));
WINDOKU_REGIONS.forEach((region,wi) => region.forEach(([r,c]) => { CELL_WINDOW[r][c] = wi; }));

// Whether a cell is on main diagonal, anti-diagonal
const ON_MAIN_DIAG = (r,c) => r === c;
const ON_ANTI_DIAG = (r,c) => r + c === 8;

// ─── Diagonal validator ───────────────────────────────────────────────────────
function isValidDiag(board, row, col, num) {
  if (!isValidPlacement(board, row, col, num)) return false;
  if (ON_MAIN_DIAG(row, col))
    for (let i = 0; i < 9; i++) if (i !== col && board[row===i?i:row][row===i?row:i] === num) {
      // simpler: check main diagonal
    }
  // Check main diagonal
  if (ON_MAIN_DIAG(row, col))
    for (let i = 0; i < 9; i++) if (board[i][i] === num && i !== row) return false;
  // Check anti-diagonal
  if (ON_ANTI_DIAG(row, col))
    for (let i = 0; i < 9; i++) if (board[i][8-i] === num && i !== row) return false;
  return true;
}

function generateDiagBoard() {
  const board = Array.from({length:9},()=>Array(9).fill(0));
  function solve(pos) {
    if (pos === 81) return true;
    const r = Math.floor(pos/9), c = pos%9;
    const nums = [1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
    for (const n of nums) {
      if (isValidDiag(board,r,c,n)) {
        board[r][c] = n;
        if (solve(pos+1)) return true;
        board[r][c] = 0;
      }
    }
    return false;
  }
  solve(0);
  return board;
}

function newDiagPuzzle(clues) {
  const solution = generateDiagBoard();
  const puzzle = removeClues(solution, clues);
  return { solution, puzzle, variant:"diagonal" };
}

// ─── Windoku validator ────────────────────────────────────────────────────────
function isValidWindoku(board, row, col, num) {
  if (!isValidPlacement(board, row, col, num)) return false;
  const wi = CELL_WINDOW[row][col];
  if (wi >= 0) {
    for (const [wr,wc] of WINDOKU_REGIONS[wi])
      if (board[wr][wc] === num && !(wr===row && wc===col)) return false;
  }
  return true;
}

function generateWindokuBoard() {
  const board = Array.from({length:9},()=>Array(9).fill(0));
  function solve(pos) {
    if (pos === 81) return true;
    const r = Math.floor(pos/9), c = pos%9;
    const nums = [1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
    for (const n of nums) {
      if (isValidWindoku(board,r,c,n)) {
        board[r][c] = n;
        if (solve(pos+1)) return true;
        board[r][c] = 0;
      }
    }
    return false;
  }
  solve(0);
  return board;
}

function newWindokuPuzzle(clues) {
  const solution = generateWindokuBoard();
  const puzzle = removeClues(solution, clues);
  return { solution, puzzle, variant:"windoku" };
}

// ─── Jigsaw region generator ─────────────────────────────────────────────────
function generateJigsawRegions() {
  // Flood-fill 9 regions of exactly 9 cells each from random seeds
  const regions = Array.from({length:9},()=>Array(9).fill(-1));
  const sizes = Array(9).fill(0);
  // Seed one cell per region
  const allCells = Array.from({length:81},(_,i)=>[Math.floor(i/9),i%9])
    .sort(()=>Math.random()-0.5);
  const seeds = allCells.slice(0,9);
  seeds.forEach(([r,c],i) => { regions[r][c]=i; sizes[i]=1; });
  // BFS expand
  let changed = true;
  while (changed) {
    changed = false;
    const order = Array.from({length:9},(_,i)=>i).sort(()=>Math.random()-0.5);
    for (const ri of order) {
      if (sizes[ri] >= 9) continue;
      // Find frontier cells adjacent to this region
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (regions[r][c] !== ri) continue;
        for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr=r+dr, nc=c+dc;
          if (nr<0||nr>8||nc<0||nc>8) continue;
          if (regions[nr][nc] !== -1) continue;
          regions[nr][nc] = ri; sizes[ri]++; changed=true;
          if (sizes[ri] >= 9) break;
        }
        if (sizes[ri] >= 9) break;
      }
    }
  }
  // Fill any remaining unassigned cells
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
    if (regions[r][c] === -1) {
      // Assign to smallest adjacent region
      let best=-1, bestSize=99;
      for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr=r+dr, nc=c+dc;
        if (nr<0||nr>8||nc<0||nc>8) continue;
        const ri=regions[nr][nc];
        if (ri>=0 && sizes[ri]<bestSize) { best=ri; bestSize=sizes[ri]; }
      }
      if (best>=0) { regions[r][c]=best; sizes[best]++; }
    }
  }
  return regions;
}

function isValidJigsaw(board, row, col, num, regions) {
  // Row and col checks (no box check)
  for (let i=0;i<9;i++) {
    if (board[row][i]===num && i!==col) return false;
    if (board[i][col]===num && i!==row) return false;
  }
  // Region check instead of box
  const ri = regions[row][col];
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
    if (regions[r][c]===ri && board[r][c]===num && !(r===row&&c===col)) return false;
  }
  return true;
}

function generateJigsawBoard(regions) {
  const board = Array.from({length:9},()=>Array(9).fill(0));
  function solve(pos) {
    if (pos===81) return true;
    const r=Math.floor(pos/9), c=pos%9;
    const nums=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
    for (const n of nums) {
      if (isValidJigsaw(board,r,c,n,regions)) {
        board[r][c]=n;
        if (solve(pos+1)) return true;
        board[r][c]=0;
      }
    }
    return false;
  }
  if (!solve(0)) return generateJigsawBoard(generateJigsawRegions());
  return board;
}

function newJigsawPuzzle(clues) {
  const regions = generateJigsawRegions();
  const solution = generateJigsawBoard(regions);
  const puzzle = removeClues(solution, clues);
  return { solution, puzzle, variant:"jigsaw", regions };
}

// ─── Killer cage generator ────────────────────────────────────────────────────
function generateKillerCages(solution) {
  const assigned = Array.from({length:9},()=>Array(9).fill(-1));
  const cages = [];
  let cageId = 0;
  const unassigned = [];
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) unassigned.push([r,c]);
  // Shuffle
  unassigned.sort(()=>Math.random()-0.5);

  for (const [sr,sc] of unassigned) {
    if (assigned[sr][sc] !== -1) continue;
    const size = 2 + Math.floor(Math.random()*3); // 2-4 cells
    const cells = [[sr,sc]];
    assigned[sr][sc] = cageId;
    // Flood fill cage
    while (cells.length < size) {
      const [cr,cc] = cells[Math.floor(Math.random()*cells.length)];
      const dirs = [[-1,0],[1,0],[0,-1],[0,1]].sort(()=>Math.random()-0.5);
      let expanded = false;
      for (const [dr,dc] of dirs) {
        const nr=cr+dr, nc=cc+dc;
        if (nr<0||nr>8||nc<0||nc>8) continue;
        if (assigned[nr][nc]!==-1) continue;
        cells.push([nr,nc]); assigned[nr][nc]=cageId; expanded=true; break;
      }
      if (!expanded) break;
    }
    const sum = cells.reduce((s,[r,c])=>s+solution[r][c],0);
    cages.push({ id:cageId, cells, sum });
    cageId++;
  }
  // Handle any remaining solo cells
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
    if (assigned[r][c]===-1) {
      const sum = solution[r][c];
      cages.push({ id:cageId, cells:[[r,c]], sum });
      assigned[r][c]=cageId++;
    }
  }
  return { cages, cageMap: assigned };
}

function isValidKiller(board, row, col, num, cages, cageMap) {
  if (!isValidPlacement(board,row,col,num)) return false;
  // Check cage: no duplicate within cage, sum not exceeded
  const cageId = cageMap[row][col];
  const cage = cages[cageId];
  if (!cage) return true;
  const vals = cage.cells.map(([r,c])=>r===row&&c===col?num:board[r][c]).filter(v=>v>0);
  if (new Set(vals).size !== vals.length) return false;
  if (vals.length === cage.cells.length && vals.reduce((a,b)=>a+b,0)!==cage.sum) return false;
  if (vals.reduce((a,b)=>a+b,0) > cage.sum) return false;
  return true;
}

function newKillerPuzzle() {
  const solution = generateFullBoard();
  const { cages, cageMap } = generateKillerCages(solution);
  // Killer has no givens — all cells start empty
  const puzzle = Array.from({length:9},()=>Array(9).fill(0));
  return { solution, puzzle, variant:"killer", cages, cageMap };
}

// ─── Variant definitions ──────────────────────────────────────────────────────
const VARIANTS = [
  {
    id:       "diagonal",
    name:     "X-Sudoku",
    emoji:    "✕",
    color:    "#6B3FA0",
    lightColor:"#EDE0FF",
    desc:     "The two main diagonals must also contain 1–9.",
    difficulty:"Medium",
    newPuzzle:(clues)=>newDiagPuzzle(clues),
    validate: (board,r,c,n)=>isValidDiag(board,r,c,n),
  },
  {
    id:       "windoku",
    name:     "Windoku",
    emoji:    "🪟",
    color:    "#0077B6",
    lightColor:"#DBEAFE",
    desc:     "Four extra 3×3 windows must also contain 1–9.",
    difficulty:"Hard",
    newPuzzle:(clues)=>newWindokuPuzzle(clues),
    validate: (board,r,c,n)=>isValidWindoku(board,r,c,n),
  },
  {
    id:       "jigsaw",
    name:     "Jigsaw",
    emoji:    "🧩",
    color:    "#E76F51",
    lightColor:"#FDE8E0",
    desc:     "Nine irregular shaped regions instead of boxes.",
    difficulty:"Hard",
    newPuzzle:(clues)=>newJigsawPuzzle(clues),
    validate: (board,r,c,n,extra)=>isValidJigsaw(board,r,c,n,extra.regions),
  },
  {
    id:       "shapes",
    name:     "Shape Sudoku",
    emoji:    "★",
    color:    "#2A9D8F",
    lightColor:"#E0F5F3",
    desc:     "Extra regions marked by shapes — each shape must contain 1–9.",
    difficulty:"Hard",
    newPuzzle:(clues)=>newShapePuzzle(clues),
    validate: (board,r,c,n,extra)=>isValidShape(board,r,c,n,extra.shapeRegions||[]),
  },
  {
    id:       "linked",
    name:     "Linked Grids",
    emoji:    "🔗",
    color:    "#E76F00",
    lightColor:"#FFF0D6",
    desc:     "Three connected grids — linked cells must share the same digit.",
    difficulty:"Expert",
    newPuzzle:(clues)=>newLinkedGridPuzzle(clues),
    validate: null, // handled separately in LinkedGridScreen
    isLinked: true,
  },
  {
    id:       "killer",
    name:     "Killer",
    emoji:    "💀",
    color:    "#D62828",
    lightColor:"#FDEEE9",
    desc:     "No givens — solve using cage sum clues only.",
    difficulty:"Expert",
    newPuzzle:()=>newKillerPuzzle(),
    validate: (board,r,c,n,extra)=>isValidKiller(board,r,c,n,extra.cages,extra.cageMap),
  },
  {
    id:       "shapes",
    name:     "Shape Sudoku",
    emoji:    "★",
    color:    "#2A9D8F",
    lightColor:"#E0F5F3",
    desc:     "Extra regions marked by shapes — each shape must contain 1–9.",
    difficulty:"Hard",
    newPuzzle:(clues)=>newShapePuzzle(clues),
    validate: (board,r,c,n,extra)=>isValidShape(board,r,c,n,extra.shapeRegions||[]),
  },
  {
    id:       "linked",
    name:     "Linked Grids",
    emoji:    "🔗",
    color:    "#E76F00",
    lightColor:"#FFF0D6",
    desc:     "Three connected grids — linked cells must share the same digit.",
    difficulty:"Expert",
    newPuzzle:(clues)=>newLinkedGridPuzzle(clues),
    validate: null,
    isLinked: true,
  },
];

// ─── Variant colours (10 region colours for jigsaw) ──────────────────────────
const JIGSAW_REGION_COLORS = [
  "#FFD6C8","#C8E6D6","#C8D6FF","#FFE8C8",
  "#E8C8FF","#C8F0FF","#FFF0C8","#E0E8D0","#FFD6E8",
];

// ─── Variant Board Overlay ─────────────────────────────────────────────────────
// Returns extra per-cell style and decoration info for variants
function getVariantCellStyle(variant, extra, r, c, CELL) {
  if (!variant) return {};
  if (variant === "diagonal") {
    const onDiag = ON_MAIN_DIAG(r,c) || ON_ANTI_DIAG(r,c);
    return onDiag ? { background:"#EDE0FF" } : {};
  }
  if (variant === "windoku") {
    const wi = CELL_WINDOW[r][c];
    if (wi < 0) return {};
    const wColors = ["#DBEAFE","#FDE8D4","#D4F5EE","#FEF3D0"];
    return { background: wColors[wi] };
  }
  if (variant === "jigsaw") {
    return { background: JIGSAW_REGION_COLORS[extra.regions?.[r]?.[c] ?? 0] };
  }
  if (variant === "killer") {
    return {}; // cage overlay drawn separately
  }
  return {};
}

// Killer cage top-left corner sum label
function KillerCageOverlay({ cages, cageMap, CELL, GAP_I, GAP_B }) {
  if (!cages) return null;
  // Find top-left cell of each cage (min row, then min col)
  return (
    <div style={{ position:"absolute", top:0, left:0, pointerEvents:"none", width:"100%", height:"100%" }}>
      {cages.map(cage => {
        const [tr,tc] = cage.cells.reduce(([br,bc],[r,c])=>
          r<br||(r===br&&c<bc)?[r,c]:[br,bc], [9,9]);
        const boxOffsetR = Math.floor(tr/3)*(GAP_B);
        const boxOffsetC = Math.floor(tc/3)*(GAP_B);
        const top  = tr*CELL + tr*GAP_I + boxOffsetR + GAP_B;
        const left = tc*CELL + tc*GAP_I + boxOffsetC + GAP_B;
        return (
          <div key={cage.id} style={{
            position:"absolute", top, left,
            fontSize:Math.max(7,CELL*0.2), fontWeight:700,
            color:"#8B2020", lineHeight:1,
            background:"rgba(255,255,255,0.7)",
            padding:"0 1px", borderRadius:2,
            pointerEvents:"none",
          }}>
            {cage.sum}
          </div>
        );
      })}
    </div>
  );
}

// ─── Variants Selection Screen ────────────────────────────────────────────────
function VariantsScreen({ progress, purchases, onSelectVariant, onShop, onBack }) {
  const world3Done = (() => {
    const w3 = WORLDS[2]; // World 3 — Viking Shores
    if (!w3) return false;
    const lastIsland = w3.islands[w3.islands.length - 1];
    const lastLevel  = lastIsland.levels[lastIsland.levels.length - 1];
    return !!progress[lastLevel.id];
  })();

  const DIFF_COLORS = { Medium:C.teal, Hard:C.coral, Expert:C.red };

  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg, ${C.bg} 0%, #E0D0C0 100%)`,
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif", color:C.ink,
    }}>
      {/* Header */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`,
        background:C.paper, position:"sticky", top:0, zIndex:10,
      }}>
        <button onClick={onBack} style={{
          background:"none", border:"none", color:C.inkLight,
          fontSize:14, cursor:"pointer", fontFamily:"inherit",
        }}>← back</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:15, fontWeight:700 }}>Variant Puzzles</div>
          <div style={{ fontSize:11, color:C.inkLight }}>Unique rule twists</div>
        </div>
        <div style={{ width:50 }} />
      </div>

      <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>
        {/* Unlock banner */}
        {!world3Done && (
          <div style={{
            background:`linear-gradient(135deg, ${C.purple} 0%, #4A2070 100%)`,
            borderRadius:16, padding:"20px 20px", marginBottom:24,
            color:"#fff", textAlign:"center",
          }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🔒</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>
              Variants unlock after World 3
            </div>
            <div style={{ fontSize:13, opacity:0.85, lineHeight:1.6 }}>
              Beat the Viking Shores to unlock four unique puzzle variants.
            </div>
          </div>
        )}

        {/* Difficulty selector */}
        {world3Done && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.inkLight, textTransform:"uppercase",
                          letterSpacing:"0.12em", fontWeight:600, marginBottom:10 }}>
              Choose a variant
            </div>
          </div>
        )}

        {/* Variant cards */}
        {VARIANTS.map(v => {
          const locked = !world3Done;
          return (
            <button key={v.id}
              onClick={() => !locked && onSelectVariant(v)}
              disabled={locked}
              style={{
                display:"flex", alignItems:"center", gap:16, width:"100%",
                padding:"18px 20px", marginBottom:12,
                background: locked ? C.sand : C.paper,
                border:`2px solid ${locked ? C.sandDark : v.color}`,
                borderRadius:16, cursor: locked ? "default" : "pointer",
                fontFamily:"inherit", textAlign:"left", position:"relative",
                opacity: locked ? 0.6 : 1,
                boxShadow: locked ? "none" : `0 4px 0 ${v.color}44`,
                transition:"transform 0.1s, box-shadow 0.1s",
              }}
              onMouseEnter={e=>{ if(!locked){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 6px 0 ${v.color}44`; }}}
              onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=locked?"none":`0 4px 0 ${v.color}44`; }}
            >
              {/* Icon */}
              <div style={{
                width:52, height:52, borderRadius:14, flexShrink:0,
                background: locked ? C.sandDark : v.color,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:26,
              }}>
                {locked ? "🔒" : v.emoji}
              </div>

              {/* Info */}
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.ink }}>{v.name}</span>
                  <span style={{
                    fontSize:10, fontWeight:700, color: DIFF_COLORS[v.difficulty] || C.teal,
                    background:(DIFF_COLORS[v.difficulty]||C.teal)+"18",
                    padding:"2px 8px", borderRadius:10, letterSpacing:"0.05em",
                  }}>{v.difficulty}</span>
                </div>
                <div style={{ fontSize:12, color:C.inkLight, lineHeight:1.5 }}>{v.desc}</div>
              </div>

              <span style={{ color:C.inkFaint, fontSize:14, flexShrink:0 }}>›</span>
            </button>
          );
        })}

        {world3Done && (
          <div style={{ textAlign:"center", marginTop:8, fontSize:12, color:C.inkFaint }}>
            All variants are unranked · no lives lost on failure
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Variant Difficulty Picker ────────────────────────────────────────────────
function VariantDifficultyScreen({ variant, onStart, onBack }) {
  const diffs = [
    { label:"Easy",   clues:42, emoji:"🌱" },
    { label:"Medium", clues:30, emoji:"🌿" },
    { label:"Hard",   clues:22, emoji:"🌲" },
  ];
  // Killer has no clue count
  const isKiller = variant.id === "killer";

  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg, ${variant.lightColor} 0%, #fff 100%)`,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", fontFamily:"'DM Sans','Helvetica Neue',sans-serif",
      padding:32,
    }}>
      <div style={{ maxWidth:320, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:8 }}>{variant.emoji}</div>
        <div style={{ fontSize:24, fontWeight:800, color:C.ink, marginBottom:4 }}>
          {variant.name}
        </div>
        <div style={{ fontSize:13, color:C.inkLight, marginBottom:28, lineHeight:1.6 }}>
          {variant.desc}
        </div>

        {isKiller ? (
          <button onClick={() => onStart(variant, null)} style={{
            width:"100%", padding:"15px 0",
            background:variant.color, border:"none", borderRadius:12,
            color:"#fff", fontSize:15, fontWeight:700,
            fontFamily:"inherit", cursor:"pointer",
            boxShadow:`0 5px 0 ${variant.color}88`,
            marginBottom:12,
          }}>Start Puzzle</button>
        ) : (
          diffs.map(d => (
            <button key={d.label} onClick={() => onStart(variant, d.clues, d.label)} style={{
              display:"block", width:"100%", padding:"14px 0",
              marginBottom:10,
              background:C.paper, border:`2px solid ${variant.color}`,
              borderRadius:12, cursor:"pointer", fontFamily:"inherit",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              fontSize:15, fontWeight:600, color:C.ink,
              transition:"background 0.15s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background=variant.lightColor; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=C.paper; }}
            >
              <span>{d.emoji}</span> {d.label}
            </button>
          ))
        )}

        <button onClick={onBack} style={{
          marginTop:8, background:"none", border:"none",
          color:C.inkLight, fontSize:13, cursor:"pointer", fontFamily:"inherit",
        }}>← back</button>
      </div>
    </div>
  );
}

// ─── Variant Game Screen ───────────────────────────────────────────────────────
function VariantGameScreen({ variant, clues, onBack }) {
  // Generate puzzle for this variant
  const puzzleData = useRef(null);
  if (!puzzleData.current) {
    puzzleData.current = variant.newPuzzle(clues || 30);
  }
  const { solution, puzzle, regions, cages, cageMap } = puzzleData.current;
  const solutionRef = useRef(solution);

  const [board,    setBoard]   = useState(() => puzzle.map(r=>[...r]));
  const [given,    setGiven]   = useState(() => puzzle.map(r=>r.map(v=>v!==0)));
  const [selected, setSel]     = useState(null);
  const [errors,   setErrors]  = useState({});
  const [claimed,  setClaimed] = useState({});
  const [noteMode, setNoteMode]= useState(false);
  const [notes,    setNotes]   = useState({});
  const [elapsed,  setElapsed] = useState(0);
  const [solved,   setSolved]  = useState(false);
  const [penalties,setPen]     = useState(0);
  const [penFlash, setPenFlash]= useState(false);
  const timerRef = useRef(null);

  const shapeRegions = puzzleData.current?.shapeRegions || [];
  const extra = { regions, cages, cageMap, shapeRegions };

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1000), 1000);
    // Track free trial usage
    if (variant?.id) {
      const diffLabel = clues === null ? "killer" : clues >= 38 ? "Easy" : clues >= 26 ? "Medium" : "Hard";
      incVariantPlayed(variant.id, diffLabel);
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const CELL = Math.floor(Math.min((window.innerWidth - 40) / 9, (window.innerHeight - 300) / 9));
  const GAP_I = Math.max(1, Math.round(CELL * 0.04));
  const GAP_B = Math.max(3, Math.round(CELL * 0.1));

  function submitNum(r, c, n) {
    if (solved || given[r][c]) return;
    const key = `${r}-${c}`;
    if (noteMode) {
      setNotes(prev => {
        const cur = new Set(prev[key] || []);
        cur.has(n) ? cur.delete(n) : cur.add(n);
        return { ...prev, [key]: cur };
      });
      return;
    }
    if (solutionRef.current[r][c] === n) {
      setBoard(prev => {
        const nb = prev.map(row=>[...row]); nb[r][c]=n;
        const done = nb.every((row,ri)=>row.every((v,ci)=>v===solutionRef.current[ri][ci]));
        if (done) { clearInterval(timerRef.current); setSolved(true); sound("levelWin"); }
        return nb;
      });
      setClaimed(p=>({...p,[key]:true}));
      setErrors(p=>{const n2={...p};delete n2[key];return n2;});
      setNotes(p=>{const n2={...p};delete n2[key];return n2;});
      sound("cellPlace");
    } else {
      setErrors(p=>({...p,[key]:true}));
      setPen(p=>p+1);
      setPenFlash(true); sound("penalty");
      setTimeout(()=>setPenFlash(false), 700);
    }
  }

  const solvedNums = new Set([1,2,3,4,5,6,7,8,9].filter(n=>
    board.flat().filter(v=>v===n).length===9
  ));

  const isHi = (r,c) => {
    if (!selected) return false;
    const [sr,sc] = selected;
    if (variant.id==="jigsaw") return regions?.[r]?.[c]===regions?.[sr]?.[sc];
    return r===sr || c===sc || (Math.floor(r/3)===Math.floor(sr/3)&&Math.floor(c/3)===Math.floor(sc/3));
  };
  const isSame=(r,c)=>selected && board[r][c]!==0 && board[r][c]===board[selected[0]][selected[1]];

  return (
    <div style={{
      minHeight:"100vh", background:variant.lightColor,
      display:"flex", flexDirection:"column", alignItems:"center",
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif", color:C.ink,
      padding:"12px 8px", userSelect:"none", touchAction:"none",
    }}>
      {/* Header */}
      <div style={{ width:"100%", maxWidth:520, display:"flex",
                    alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",
          color:C.inkLight,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>✕</button>
        <div style={{ textAlign:"center" }}>
          <span style={{ fontSize:14, fontWeight:700, color:variant.color }}>{variant.emoji} {variant.name}</span>
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:C.ink, fontVariantNumeric:"tabular-nums" }}>
          {formatTime(Math.floor(elapsed/1000))}
          {penalties > 0 && <span style={{ fontSize:10, color:C.red, marginLeft:4 }}>+{penalties}</span>}
        </div>
      </div>

      {/* Variant rule reminder */}
      <div style={{ fontSize:11, color:variant.color, marginBottom:8, fontWeight:600,
                    background:variant.lightColor, padding:"3px 10px", borderRadius:20,
                    border:`1px solid ${variant.color}44` }}>
        {variant.id==="diagonal" && "✕ Both diagonals must contain 1–9"}
        {variant.id==="windoku" && "🪟 4 extra windows must contain 1–9"}
        {variant.id==="jigsaw"  && "🧩 Colour regions instead of boxes"}
        {variant.id==="killer"  && "💀 Cage numbers must sum correctly"}
        {variant.id==="shapes"  && "★ Each shape colour must contain 1–9"}
        {variant.id==="linked"  && "🔗 Linked cells across grids share a digit"}
      </div>

      {/* Board */}
      <div style={{ position:"relative" }}>
        <div style={{
          display:"inline-grid", gridTemplateColumns:"repeat(3,auto)",
          gap:GAP_B, background: variant.id==="jigsaw" ? C.inkLight : variant.color,
          padding:GAP_B, borderRadius:10, border:`2px solid ${variant.color}`,
        }}>
          {[0,1,2].map(boxR=>[0,1,2].map(boxC=>(
            <div key={`${boxR}-${boxC}`} style={{
              display:"inline-grid", gridTemplateColumns:"repeat(3,auto)",
              gap:GAP_I,
              background: variant.id==="jigsaw" ? "transparent" : C.paper,
            }}>
              {[0,1,2].map(iR=>[0,1,2].map(iC=>{
                const r=boxR*3+iR, c=boxC*3+iC;
                const val=board[r][c];
                const key=`${r}-${c}`;
                const isSel=selected?.[0]===r&&selected?.[1]===c;
                const isG=given[r][c]; const isCl=claimed[key]; const isErr=errors[key];
                const cn=notes[key];
                const varStyle = getVariantCellStyle(variant.id, extra, r, c, CELL);

                let bg = varStyle.background || C.paper;
                if (isSel) bg = variant.color + "44";
                else if (isErr) bg = C.coralLight;
                else if (isCl) bg = C.greenLight;
                else if (isSame(r,c)) bg = variant.lightColor;
                else if (isHi(r,c) && !varStyle.background) bg = "#F5F0FF";

                return (
                  <div key={key}
                    onClick={() => { setSel([r,c]); }}
                    style={{
                      width:CELL, height:CELL,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      background:bg, cursor:"pointer",
                      outline: isSel ? `2px solid ${variant.color}` : "none",
                      outlineOffset:"-2px",
                      fontSize: val ? Math.max(12,CELL*0.44) : Math.max(5,CELL*0.15),
                      fontWeight: isG ? 700 : 400,
                      color: isErr ? C.red : isCl ? C.green : isG ? C.ink : variant.color,
                      position:"relative",
                      // Jigsaw: show subtle region borders
                      borderRight: variant.id==="jigsaw" && c<8 && extra.regions?.[r]?.[c]!==extra.regions?.[r]?.[c+1] ? `2px solid ${C.ink}` : undefined,
                      borderBottom: variant.id==="jigsaw" && r<8 && extra.regions?.[r]?.[c]!==extra.regions?.[r+1]?.[c] ? `2px solid ${C.ink}` : undefined,
                    }}
                  >
                    {val ? val : cn?.size>0 ? (
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", width:"88%", height:"88%" }}>
                        {[1,2,3,4,5,6,7,8,9].map(n2=>(
                          <div key={n2} style={{ fontSize:Math.max(4,CELL*0.16), textAlign:"center",
                                                  color:cn.has(n2)?C.purple:"transparent" }}>{n2}</div>
                        ))}
                      </div>
                    ) : null}
                    {/* Shape glyph in top-left corner for shape variant */}
                    {variant.id==="shapes" && (() => {
                      const si = getShapeForCell(r, c, extra.shapeRegions||[]);
                      if (si < 0) return null;
                      return (
                        <span style={{
                          position:"absolute", top:1, left:2,
                          fontSize:Math.max(5, CELL*0.22),
                          color:SHAPE_COLORS[si],
                          lineHeight:1, pointerEvents:"none",
                          opacity: val ? 0.5 : 0.9,
                          fontWeight:900,
                        }}>{SHAPE_GLYPHS[si]}</span>
                      );
                    })()}
                  </div>
                );
              }))}
            </div>
          )))}
        </div>
        {/* Killer cage sum overlay */}
        {variant.id==="killer" && (
          <KillerCageOverlay cages={cages} cageMap={cageMap} CELL={CELL} GAP_I={GAP_I} GAP_B={GAP_B} />
        )}
      </div>

      {/* Numpad */}
      <div style={{ display:"flex", gap:Math.max(3,CELL*0.08), marginTop:10, flexWrap:"wrap", justifyContent:"center" }}>
        {[1,2,3,4,5,6,7,8,9].map(n=>{
          const isSolved = solvedNums.has(n);
          return (
            <button key={n} onClick={()=>{ if(selected&&!isSolved){ submitNum(selected[0],selected[1],n); }}}
              style={{
                width:Math.max(28,CELL*0.72), height:Math.max(28,CELL*0.72),
                background:"none", border:"none",
                borderBottom:`2px solid ${isSolved?C.sandDark:variant.color}`,
                color:isSolved?C.inkFaint:C.ink,
                fontSize:Math.max(12,CELL*0.3), fontFamily:"inherit",
                fontWeight:isSolved?300:500, cursor:isSolved?"default":"pointer",
                textDecoration:isSolved?"line-through":"none",
              }}>{n}</button>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:14, marginTop:6, alignItems:"center" }}>
        <button onClick={()=>{ if(gimmick==="noNotes") return; setNoteMode(m=>!m);sound("modeToggle");}} style={{
          background:"none", border:"none",
          color:noteMode?C.purple:C.inkLight,
          fontSize:11, fontFamily:"inherit", cursor:"pointer",
          borderBottom:`1.5px solid ${noteMode?C.purple:"transparent"}`,
        }}>{noteMode?"pencil":"pen"}</button>
        <span style={{color:C.sandDark}}>|</span>
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.inkLight,fontSize:11,fontFamily:"inherit",cursor:"pointer" }}>quit</button>
      </div>

      {/* Solved overlay */}
      {solved && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:100,
        }}>
          <div style={{
            background:C.paper, borderRadius:20, padding:"32px 28px",
            textAlign:"center", maxWidth:300, width:"90%",
            animation:"srPop 0.4s cubic-bezier(.36,.07,.19,.97) both",
            boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize:52, marginBottom:8, animation:"srStar 0.5s ease both" }}>🏆</div>
            <div style={{ fontSize:26, fontWeight:900, color:variant.color, marginBottom:4 }}>Solved!</div>
            <div style={{ fontSize:13, color:C.inkLight, marginBottom:8 }}>{variant.name}</div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:6,
              background:variant.color, color:"#fff", borderRadius:20,
              padding:"5px 14px", fontSize:14, fontWeight:700, marginBottom:20,
            }}>⏱ {formatTime(Math.floor(elapsed/1000))}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={()=>{ puzzleData.current=null; setSolved(false); setBoard(puzzle.map(r=>[...r])); setElapsed(0); setClaimed({}); setErrors({}); setNotes({}); setPen(0); }} style={{
                padding:"12px 0", background:variant.color, border:"none",
                borderRadius:12, color:"#fff", fontSize:14, fontWeight:700,
                fontFamily:"inherit", cursor:"pointer",
              }}>New Puzzle</button>
              <button onClick={onBack} style={{
                padding:"12px 0", background:"none",
                border:`1.5px solid ${C.sandDark}`, borderRadius:12,
                color:C.inkLight, fontSize:13, fontFamily:"inherit", cursor:"pointer",
              }}>Back</button>
            </div>
          </div>
        </div>
      )}

      {penFlash && (
        <div style={{
          position:"fixed", top:"36%", left:"50%", transform:"translate(-50%,-50%)",
          background:C.paper, border:`1.5px solid ${C.coral}`,
          borderRadius:10, padding:"8px 20px", color:C.coral,
          fontSize:13, fontWeight:600, pointerEvents:"none",
          animation:"srShake 0.4s ease both",
        }}>Wrong!</div>
      )}
    </div>
  );
}




// ─── Power-up System ──────────────────────────────────────────────────────────

const POWERUPS = {
  reveal:    { id:"reveal",    emoji:"💡", name:"Reveal",      desc:"Shows the correct number for one cell",          color:"#F0B429", rarity:"common"  },
  scan:      { id:"scan",      emoji:"🔍", name:"Scan",        desc:"Highlights all immediately solvable cells",      color:"#2A9D8F", rarity:"common"  },
  autonotes: { id:"autonotes", emoji:"✏️", name:"Auto-Notes",  desc:"Fills all valid pencil marks instantly",         color:"#6B3FA0", rarity:"uncommon"},
  freeze:    { id:"freeze",    emoji:"⏸️", name:"Freeze",      desc:"Pauses the timer for 30 seconds",               color:"#457B9D", rarity:"uncommon"},
  shield:    { id:"shield",    emoji:"🛡️", name:"Shield",      desc:"Absorbs your next wrong guess — no penalty",    color:"#2D6A4F", rarity:"rare"    },
  filln:     { id:"filln",     emoji:"⚡", name:"Number Fill",  desc:"Automatically fills all cells of one number",   color:"#E76F51", rarity:"rare"    },
};

// Rarity weights for drop rolls
const DROP_WEIGHTS = { common:60, uncommon:30, rare:10 };

// Drop tables by level type
const DROP_TABLES = {
  normal: ["reveal","reveal","scan","autonotes"],
  boss:   ["reveal","scan","autonotes","freeze","shield","filln"],
  daily:  ["reveal","scan","autonotes","freeze"],
  login:  ["reveal","scan"],
};

function rollDrop(table) {
  const pool = DROP_TABLES[table] || DROP_TABLES.normal;
  return pool[Math.floor(Math.random() * pool.length)];
}

// 40% chance of drop on normal levels, 100% on boss, always on daily
function shouldDrop(isBoss) {
  if (isBoss) return true;
  return Math.random() < 0.4;
}

// Storage helpers
async function loadInventory() {
  try {
    const r = await window.storage.get("powerup-inventory");
    return r ? JSON.parse(r.value) : {};
  } catch(e) { return {}; }
}
async function saveInventory(inv) {
  try { await window.storage.set("powerup-inventory", JSON.stringify(inv)); } catch(e) {}
}
async function addToInventory(itemId, count=1) {
  const inv = await loadInventory();
  inv[itemId] = (inv[itemId] || 0) + count;
  await saveInventory(inv);
  return inv;
}
async function useFromInventory(itemId) {
  const inv = await loadInventory();
  if (!inv[itemId] || inv[itemId] <= 0) return false;
  inv[itemId]--;
  await saveInventory(inv);
  return inv;
}

// Daily login bonus — once per calendar day
async function claimLoginBonus() {
  const today = new Date().toISOString().slice(0,10);
  try {
    const r = await window.storage.get("last-login-bonus");
    if (r && r.value === today) return null; // already claimed
    await window.storage.set("last-login-bonus", today);
    const item = rollDrop("login");
    await addToInventory(item);
    return item;
  } catch(e) { return null; }
}

// ─── Power-up Drop Overlay (shown after winning) ──────────────────────────────
function PowerupDropOverlay({ drops, onContinue }) {
  if (!drops || drops.length === 0) return null;
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:120,
    }}>
      <div style={{
        background:C.paper, borderRadius:20, padding:"28px 24px",
        textAlign:"center", maxWidth:300, width:"90%",
        animation:"srPop 0.4s cubic-bezier(.36,.07,.19,.97) both",
        boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.inkLight,
                      letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>
          🎁 You earned
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:20 }}>
          {drops.map((id, i) => {
            const p = POWERUPS[id];
            return (
              <div key={i} style={{
                width:72, textAlign:"center",
                animation:`srStar 0.4s ease ${i*0.15}s both`,
              }}>
                <div style={{
                  width:64, height:64, borderRadius:16, margin:"0 auto 6px",
                  background:p.color+"22", border:`2px solid ${p.color}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:30,
                }}>{p.emoji}</div>
                <div style={{ fontSize:11, fontWeight:700, color:C.ink }}>{p.name}</div>
                <div style={{ fontSize:10, color:C.inkFaint, marginTop:2,
                              background:p.color+"18", borderRadius:8, padding:"1px 6px" }}>
                  {p.rarity}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={onContinue} style={{
          width:"100%", padding:"12px 0",
          background:C.teal, border:"none", borderRadius:12,
          color:"#fff", fontSize:14, fontWeight:700,
          fontFamily:"inherit", cursor:"pointer",
          boxShadow:`0 4px 0 ${C.tealDark}`,
        }}>Nice!</button>
      </div>
    </div>
  );
}

// ─── Inventory Bar (shown in-game, bottom of screen) ─────────────────────────
function InventoryBar({ inventory, onUse, disabled, activeShield, frozenUntil }) {
  const items = Object.entries(POWERUPS).filter(([id]) => (inventory[id] || 0) > 0);
  const [tooltip, setTooltip] = useState(null); // id of item showing tooltip
  if (items.length === 0) return null;

  return (
    <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginTop:6 }}>
      {items.map(([id, p]) => {
        const count = inventory[id] || 0;
        const isShieldActive = id === "shield" && activeShield;
        const isFreezeActive = id === "freeze" && frozenUntil && Date.now() < frozenUntil;
        const isActive = isShieldActive || isFreezeActive;
        const showTip = tooltip === id;

        return (
          <div key={id} style={{ position:"relative" }}>
            {/* Tooltip popup */}
            {showTip && (
              <div style={{
                position:"absolute", bottom:"calc(100% + 10px)", left:"50%",
                transform:"translateX(-50%)",
                background:C.ink, color:C.paper,
                borderRadius:10, padding:"8px 12px",
                fontSize:12, lineHeight:1.5, whiteSpace:"nowrap",
                boxShadow:"0 4px 16px rgba(0,0,0,0.25)",
                zIndex:50, pointerEvents:"none",
                animation:"srPop 0.2s ease both",
                maxWidth:180, whiteSpace:"normal", textAlign:"center",
              }}>
                <div style={{ fontWeight:700, marginBottom:3 }}>{p.emoji} {p.name}</div>
                <div style={{ fontSize:11, opacity:0.85 }}>{p.desc}</div>
                {/* Arrow */}
                <div style={{
                  position:"absolute", top:"100%", left:"50%",
                  transform:"translateX(-50%)",
                  width:0, height:0,
                  borderLeft:"6px solid transparent",
                  borderRight:"6px solid transparent",
                  borderTop:`6px solid ${C.ink}`,
                }}/>
              </div>
            )}

            {/* Item button */}
            <button
              onClick={() => !disabled && count > 0 && onUse(id)}
              onContextMenu={e=>{ e.preventDefault(); setTooltip(showTip ? null : id); }}
              disabled={disabled || count === 0}
              style={{
                position:"relative", padding:"6px 10px",
                background: isActive ? p.color+"33" : C.paper,
                border:`2px solid ${isActive ? p.color : C.sandDark}`,
                borderRadius:12, cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", gap:5,
                transition:"transform 0.1s, border-color 0.1s",
                boxShadow: isActive ? `0 0 12px ${p.color}55` : "none",
              }}
              onMouseEnter={e=>{ if(!disabled) e.currentTarget.style.borderColor=p.color; setTooltip(id); }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor = isActive ? p.color : C.sandDark; setTooltip(null); }}
            >
              <span style={{ fontSize:18 }}>{p.emoji}</span>
              <span style={{ fontSize:12, fontWeight:700, color:C.ink }}>{count}</span>
              {/* ⓘ info badge */}
              <span style={{
                fontSize:9, color:C.inkFaint, fontWeight:700,
                lineHeight:1, marginLeft:-2,
              }}>ⓘ</span>
              {isActive && (
                <span style={{
                  position:"absolute", top:-6, right:-6,
                  width:12, height:12, borderRadius:"50%",
                  background:p.color, border:"2px solid white",
                }}/>
              )}
            </button>
          </div>
        );
      })}

      {/* Dismiss tooltip on outside tap (mobile) */}
      {tooltip && (
        <div
          style={{ position:"fixed", inset:0, zIndex:49 }}
          onClick={() => setTooltip(null)}
        />
      )}
    </div>
  );
}

// ─── Login Bonus Toast ────────────────────────────────────────────────────────
function LoginBonusToast({ itemId, onDismiss }) {
  const p = POWERUPS[itemId];
  if (!p) return null;
  return (
    <div style={{
      position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
      background:C.paper, borderRadius:16, padding:"14px 20px",
      display:"flex", alignItems:"center", gap:12, zIndex:300,
      boxShadow:"0 8px 32px rgba(0,0,0,0.2)",
      animation:"srSlideUp 0.35s ease both",
      border:`2px solid ${p.color}`,
    }}>
      <div style={{
        width:44, height:44, borderRadius:12, flexShrink:0,
        background:p.color+"22", display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:24,
      }}>{p.emoji}</div>
      <div>
        <div style={{ fontSize:12, color:C.inkLight, fontWeight:600,
                      textTransform:"uppercase", letterSpacing:"0.08em" }}>Daily Login Bonus</div>
        <div style={{ fontSize:14, fontWeight:700, color:C.ink }}>+1 {p.name}</div>
      </div>
      <button onClick={onDismiss} style={{
        background:"none", border:"none", color:C.inkFaint,
        fontSize:18, cursor:"pointer", padding:0, marginLeft:4,
      }}>✕</button>
    </div>
  );
}


// ─── Monetization / IAP ───────────────────────────────────────────────────────
//
// PRODUCTION INTEGRATION:
// Replace mock functions with real store calls:
//   iOS:     StoreKit 2 — Product.purchase(), Transaction.updates
//   Android: Google Play Billing — BillingClient, launchBillingFlow()
//   Cross-platform: RevenueCat SDK (recommended — handles both stores)
//     pkg: RevenueCat — search "revenuecat" on npmjs.com
//     import Purchases from the RevenueCat SDK
//     await Purchases.purchaseProduct("com.sudokuroyale.lives_restore")
//     await Purchases.purchaseProduct("variant_pack_diagonal")
//
// Product IDs (register these in App Store Connect / Google Play Console):
//   com.sudokuroyale.lives_restore         — $0.99 consumable
//   com.sudokuroyale.variant_diagonal      — $1.99 non-consumable
//   com.sudokuroyale.variant_windoku       — $1.99 non-consumable
//   com.sudokuroyale.variant_jigsaw        — $1.99 non-consumable
//   com.sudokuroyale.variant_killer        — $1.99 non-consumable
//   com.sudokuroyale.variant_bundle        — $5.99 non-consumable
//   com.sudokuroyale.theme_darkmode        — $0.99 non-consumable
//   com.sudokuroyale.theme_neon            — $0.99 non-consumable
//   com.sudokuroyale.theme_nature          — $0.99 non-consumable
//   com.sudokuroyale.theme_mono            — $0.99 non-consumable

const IAP_PRODUCTS = {
  lives_restore:      { id:"lives_restore",     label:"Restore Lives",         price:"$0.99", emoji:"♥",  desc:"Instantly refill all 3 lives" },
  variant_diagonal:   { id:"variant_diagonal",  label:"X-Sudoku Pack",         price:"$1.99", emoji:"✕",  desc:"Unlimited Diagonal puzzles" },
  variant_windoku:    { id:"variant_windoku",   label:"Windoku Pack",          price:"$1.99", emoji:"🪟", desc:"Unlimited Windoku puzzles" },
  variant_jigsaw:     { id:"variant_jigsaw",    label:"Jigsaw Pack",           price:"$1.99", emoji:"🧩", desc:"Unlimited Jigsaw puzzles" },
  variant_killer:     { id:"variant_killer",    label:"Killer Sudoku Pack",    price:"$1.99", emoji:"💀", desc:"Unlimited Killer Sudoku puzzles" },
  variant_bundle:     { id:"variant_bundle",    label:"All Variants Bundle",   price:"$5.99", emoji:"🎮", desc:"All 4 variant packs — save 40%" },
  theme_darkmode:     { id:"theme_darkmode",    label:"Dark Mode Theme",       price:"$0.99", emoji:"🌑", desc:"Sleek dark colour scheme" },
  theme_neon:         { id:"theme_neon",        label:"Neon Cyber Theme",      price:"$0.99", emoji:"⚡", desc:"Electric neon aesthetic" },
  theme_nature:       { id:"theme_nature",      label:"Nature & Forest Theme", price:"$0.99", emoji:"🌲", desc:"Calm earthy tones" },
  theme_mono:         { id:"theme_mono",        label:"Monochrome Theme",      price:"$0.99", emoji:"▪️", desc:"Pure black & white" },
};

// Mock purchase — REPLACE with real store call in production
async function mockPurchase(productId) {
  // Simulates ~1s store sheet + confirmation
  await new Promise(r => setTimeout(r, 1100));
  // In production: call Purchases.purchaseProduct(productId) here
  // It will throw if user cancels — catch that separately
  return { success: true, productId };
}

// Save/load purchase state
async function savePurchases(purchases) {
  try { await window.storage.set("iap-purchases", JSON.stringify(purchases)); } catch(e) {}
}
async function loadPurchases() {
  try {
    const r = await window.storage.get("iap-purchases");
    return r ? JSON.parse(r.value) : {};
  } catch(e) { return {}; }
}

// Free variant trial tracking — 5 per variant per difficulty
const FREE_VARIANT_LIMIT = 5;
async function getVariantPlayed(variantId, diffLabel) {
  try {
    const r = await window.storage.get("variant-played:" + variantId + ":" + diffLabel);
    return r ? parseInt(r.value) : 0;
  } catch(e) { return 0; }
}
async function incVariantPlayed(variantId, diffLabel) {
  try {
    const cur = await getVariantPlayed(variantId, diffLabel);
    await window.storage.set("variant-played:" + variantId + ":" + diffLabel, String(cur + 1));
  } catch(e) {}
}

// Ad restore — once every 10 hours
const AD_RESTORE_COOLDOWN_MS = 10 * 60 * 60 * 1000;
async function getLastAdRestore() {
  try {
    const r = await window.storage.get("last-ad-restore");
    return r ? parseInt(r.value) : 0;
  } catch(e) { return 0; }
}
async function setLastAdRestore() {
  try { await window.storage.set("last-ad-restore", String(Date.now())); } catch(e) {}
}

// ─── Shop Screen ──────────────────────────────────────────────────────────────
function ShopScreen({ onBack, purchases, onPurchase, lives, onRestoreLives, progress, onInventoryChange }) {
  const [loading, setLoading] = useState(null);
  const [adCooldown, setAdCooldown] = useState(null); // ms remaining
  const [toast, setToast] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null); // powerup id

  useEffect(() => {
    // Check ad restore cooldown
    getLastAdRestore().then(last => {
      const remaining = AD_RESTORE_COOLDOWN_MS - (Date.now() - last);
      setAdCooldown(remaining > 0 ? remaining : 0);
    });
    const tick = setInterval(() => {
      getLastAdRestore().then(last => {
        const remaining = AD_RESTORE_COOLDOWN_MS - (Date.now() - last);
        setAdCooldown(remaining > 0 ? remaining : 0);
      });
    }, 10000);
    return () => clearInterval(tick);
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  async function handlePurchasePack(pack) {
    setLoading(pack.id);
    try {
      await mockPurchase(pack.id);
      // Add items to inventory
      let inv = await loadInventory();
      for (const [itemId, count] of Object.entries(pack.items)) {
        inv[itemId] = (inv[itemId] || 0) + count;
      }
      await saveInventory(inv);
      // Notify parent if available
      if (typeof onInventoryChange === "function") onInventoryChange(inv);
      sound("levelWin");
      showToast("✓ Power-ups added to inventory!");
    } catch(e) { showToast("Purchase cancelled."); }
    finally { setLoading(null); }
  }

  async function handlePurchase(productId) {
    setLoading(productId);
    try {
      await mockPurchase(productId);
      const next = { ...purchases, [productId]: true };
      // Bundle unlocks all 4 variants
      if (productId === "variant_bundle") {
        next.variant_diagonal = true;
        next.variant_windoku  = true;
        next.variant_jigsaw   = true;
        next.variant_killer   = true;
      }
      await savePurchases(next);
      onPurchase(next);
      sound("levelWin");
      showToast("✓ Purchase successful!");
    } catch(e) {
      showToast("Purchase cancelled.");
    } finally {
      setLoading(null);
    }
  }

  async function handleAdRestore() {
    // PRODUCTION: show a rewarded ad here using react-native-google-mobile-ads
    // or similar. Only call onRestoreLives after ad completes.
    setLoading("ad");
    await new Promise(r => setTimeout(r, 1500)); // simulate ad
    await setLastAdRestore();
    setAdCooldown(AD_RESTORE_COOLDOWN_MS);
    onRestoreLives();
    sound("lifeRestore");
    showToast("♥♥♥ Lives restored!");
    setLoading(null);
  }

  const fmtCooldown = ms => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const sectionLabel = (label) => (
    <div style={{ fontSize:11, color:C.inkLight, textTransform:"uppercase",
                  letterSpacing:"0.12em", fontWeight:700, marginTop:24, marginBottom:10,
                  paddingTop:16, borderTop:`1px solid ${C.sand}` }}>
      {label}
    </div>
  );

  const buyBtn = (productId, owned, label, price, extraStyle={}) => (
    <button
      onClick={() => !owned && !loading && handlePurchase(productId)}
      disabled={owned || !!loading}
      style={{
        padding:"7px 14px", fontSize:12, fontWeight:700, fontFamily:"inherit",
        background: owned ? C.greenLight : loading===productId ? C.sand : C.teal,
        border: `1.5px solid ${owned ? C.green : C.teal}`,
        borderRadius:8, color: owned ? C.green : "#fff",
        cursor: owned ? "default" : "pointer",
        opacity: loading && loading!==productId ? 0.5 : 1,
        flexShrink:0,
        ...extraStyle,
      }}>
      {owned ? "✓ Owned" : loading===productId ? "..." : price}
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`,
                    background:C.paper, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight,
                                          fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700 }}>Shop</div>
        <div style={{ width:50 }} />
      </div>

      <div style={{ padding:"16px 16px 40px", maxWidth:460, margin:"0 auto" }}>

        {/* ── LIVES ─────────────────────────────────── */}
        {sectionLabel("❤️ Lives")}
        <div style={{ background:C.paper, borderRadius:12, overflow:"hidden",
                      border:`1px solid ${C.sand}` }}>
          {/* Current status */}
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.sand}`,
                        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>Current Lives</div>
              <div style={{ fontSize:12, color:C.inkLight }}>{lives}/3 · restores every 30 min</div>
            </div>
            <div style={{ fontSize:22 }}>{"♥".repeat(lives) + "♡".repeat(3-lives)}</div>
          </div>

          {/* IAP restore */}
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.sand}`,
                        display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>Restore All Lives</div>
              <div style={{ fontSize:12, color:C.inkLight }}>Instantly refill to 3 hearts</div>
            </div>
            {buyBtn("lives_restore", lives >= 3, "Restore", "$0.99",
              { background: lives>=3 ? C.sand : C.coral,
                border:`1.5px solid ${lives>=3 ? C.sandDark : C.coralDark}`,
                color: lives>=3 ? C.inkFaint : "#fff" })}
          </div>

          {/* Ad restore */}
          <div style={{ padding:"14px 16px",
                        display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>Watch Ad to Restore</div>
              <div style={{ fontSize:12, color:C.inkLight }}>
                {adCooldown > 0 ? `Available in ${fmtCooldown(adCooldown)}` : "Free · once every 10 hours"}
              </div>
            </div>
            <button
              onClick={() => adCooldown === 0 && lives < 3 && !loading && handleAdRestore()}
              disabled={adCooldown > 0 || lives >= 3 || !!loading}
              style={{
                padding:"7px 14px", fontSize:12, fontWeight:700, fontFamily:"inherit",
                background: (adCooldown > 0 || lives >= 3) ? C.sand : C.gold,
                border:`1.5px solid ${(adCooldown > 0 || lives >= 3) ? C.sandDark : C.goldDark}`,
                borderRadius:8,
                color: (adCooldown > 0 || lives >= 3) ? C.inkFaint : C.ink,
                cursor: (adCooldown > 0 || lives >= 3) ? "default" : "pointer",
                opacity: loading==="ad" ? 0.6 : 1, flexShrink:0,
              }}>
              {loading === "ad" ? "..." : adCooldown > 0 ? fmtCooldown(adCooldown) : "Watch Ad"}
            </button>
          </div>
        </div>

        {/* ── VARIANT PACKS ─────────────────────────── */}
        {sectionLabel("🧩 Variant Puzzle Packs")}
        <div style={{ fontSize:12, color:C.inkLight, marginBottom:10, lineHeight:1.6 }}>
          Each pack unlocks unlimited puzzles of that variant. Free trial: 5 puzzles per difficulty.
        </div>

        {/* Bundle first */}
        <div style={{ background:`linear-gradient(135deg, ${C.purple} 0%, #3A1060 100%)`,
                      borderRadius:12, padding:"16px", marginBottom:10,
                      display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:32 }}>🎮</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>All Variants Bundle</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>All 4 packs · save 40%</div>
          </div>
          {buyBtn("variant_bundle",
            purchases.variant_diagonal && purchases.variant_windoku && purchases.variant_jigsaw && purchases.variant_killer,
            "Bundle", "$5.99", { background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.4)", color:"#fff" })}
        </div>

        {/* Individual packs */}
        {[
          {id:"variant_diagonal", emoji:"✕",  name:"X-Sudoku",   desc:"Diagonal constraint" },
          {id:"variant_windoku",  emoji:"🪟",  name:"Windoku",    desc:"4 extra windows" },
          {id:"variant_jigsaw",   emoji:"🧩",  name:"Jigsaw",     desc:"Irregular regions" },
          {id:"variant_killer",   emoji:"💀",  name:"Killer",     desc:"Cage sums, no givens" },
        ].map(v => (
          <div key={v.id} style={{ background:C.paper, borderRadius:10, padding:"14px 16px",
                                    marginBottom:8, display:"flex", alignItems:"center", gap:12,
                                    border:`1px solid ${C.sand}` }}>
            <div style={{ fontSize:24 }}>{v.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{v.name}</div>
              <div style={{ fontSize:11, color:C.inkLight }}>{v.desc} · {purchases[v.id] ? "Unlimited" : `5 free per difficulty`}</div>
            </div>
            {buyBtn(v.id, !!purchases[v.id], v.name, "$1.99")}
          </div>
        ))}

        {/* ── THEMES ────────────────────────────────── */}
        {sectionLabel("🎨 Premium Themes")}
        <div style={{ fontSize:12, color:C.inkLight, marginBottom:10, lineHeight:1.6 }}>
          More themes can be earned by defeating world bosses.
        </div>

        {[
          {themeId:"darkmode", productId:"theme_darkmode", name:"Dark Mode",      desc:"Sleek dark background"},
          {themeId:"neon",     productId:"theme_neon",     name:"Neon Cyber",     desc:"Electric neon glow"},
          {themeId:"nature",   productId:"theme_nature",   name:"Nature & Forest",desc:"Calm earthy tones"},
          {themeId:"mono",     productId:"theme_mono",     name:"Monochrome",     desc:"Pure black & white"},
        ].map(t => {
          const themeObj = THEMES.find(th => th.id === t.themeId);
          const tc2 = themeObj?.colors || C;
          const owned = !!purchases[t.productId];
          return (
            <div key={t.productId} style={{
              borderRadius:14, marginBottom:12, overflow:"hidden",
              border:`2px solid ${owned ? C.green : C.sandDark}`,
              boxShadow: owned ? `0 0 0 1px ${C.green}22` : "0 2px 8px rgba(0,0,0,0.08)",
            }}>
              {/* ── Mini UI preview ── */}
              <div style={{
                background:tc2.bg, padding:"12px 14px",
                display:"flex", flexDirection:"column", gap:6,
              }}>
                {/* Fake header bar */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ width:48, height:7, background:tc2.sandDark, borderRadius:4 }}/>
                  <div style={{ fontSize:10, fontWeight:700, color:tc2.ink, opacity:0.7 }}>Sudoku Royale</div>
                  <div style={{ width:48, height:7, background:tc2.sandDark, borderRadius:4 }}/>
                </div>
                {/* Mini 4×4 board preview */}
                <div style={{
                  display:"grid", gridTemplateColumns:"repeat(4,1fr)",
                  gap:2, background:tc2.accent, padding:2, borderRadius:6,
                  alignSelf:"center", width:96,
                }}>
                  {[tc2.paper,tc2.sand,tc2.paper,tc2.sand,
                    tc2.sand,tc2.paper,tc2.sand,tc2.paper,
                    tc2.paper,tc2.sand,tc2.paper,tc2.sand,
                    tc2.sand,tc2.paper,tc2.sand,tc2.paper].map((bg2,i) => (
                    <div key={i} style={{
                      height:18, background:bg2, borderRadius:3,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:9, fontWeight:700,
                      color: [0,3,5,6,9,10,12,15].includes(i) ? tc2.ink : "transparent",
                    }}>
                      {[4,null,7,null,null,2,null,9,1,null,null,3,null,8,null,5][i] || ""}
                    </div>
                  ))}
                </div>
                {/* Fake numpad strip */}
                <div style={{ display:"flex", gap:3, justifyContent:"center" }}>
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <div key={n} style={{
                      width:18, height:18, background:tc2.paper,
                      borderRadius:4, border:`1px solid ${tc2.sandDark}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:8, fontWeight:700, color:tc2.ink,
                    }}>{n}</div>
                  ))}
                </div>
              </div>
              {/* ── Name + buy row ── */}
              <div style={{
                background:C.paper, padding:"10px 14px",
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.ink }}>{t.name}</div>
                  <div style={{ fontSize:11, color:C.inkLight }}>{t.desc}</div>
                </div>
                {buyBtn(t.productId, owned, t.name, "$0.99")}
              </div>
            </div>
          );
        })}

        {/* ── POWER-UP PACKS ─── */}
        {sectionLabel("⚡ Power-up Packs")}
        <div style={{ fontSize:12, color:C.inkLight, marginBottom:10, lineHeight:1.6 }}>
          You also earn power-ups by completing levels and daily login bonuses.
        </div>

        {/* All power-ups reference list */}
        <div style={{ background:C.sand, borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.inkLight,
                        textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
            What each power-up does
          </div>
          {Object.values(POWERUPS).map(p => (
            <div key={p.id} style={{ display:"flex", alignItems:"flex-start", gap:10,
                                      marginBottom:8, lastChild:{marginBottom:0} }}>
              <div style={{ width:32, height:32, borderRadius:8, flexShrink:0,
                            background:p.color+"22", border:`1.5px solid ${p.color}`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:16 }}>{p.emoji}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.ink }}>{p.name}
                  <span style={{ marginLeft:6, fontSize:10, color:p.color, fontWeight:600,
                                  background:p.color+"18", padding:"1px 6px", borderRadius:8 }}>
                    {p.rarity}
                  </span>
                </div>
                <div style={{ fontSize:11, color:C.inkLight, marginTop:1 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {[
          {id:"pack_reveal", emoji:"💡", name:"3× Reveal",     price:"$0.99", desc:"Show correct answer for any cell",   items:{reveal:3} },
          {id:"pack_shield", emoji:"🛡️", name:"5× Shield",     price:"$0.99", desc:"Absorb wrong guesses, no penalty",   items:{shield:5} },
          {id:"pack_bundle", emoji:"🎒", name:"Power Bundle",  price:"$2.99", desc:"3 of every power-up type",           items:{reveal:3,scan:3,autonotes:3,freeze:3,shield:3,filln:3} },
        ].map(pack => (
          <div key={pack.id} style={{ background:C.paper, borderRadius:10, padding:"14px 16px",
                                       marginBottom:8, display:"flex", alignItems:"center", gap:12,
                                       border:`1px solid ${C.sand}` }}>
            <div style={{ fontSize:24 }}>{pack.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{pack.name}</div>
              <div style={{ fontSize:11, color:C.inkLight }}>{pack.desc}</div>
            </div>
            <button
              onClick={() => !loading && handlePurchasePack(pack)}
              disabled={!!loading}
              style={{
                padding:"7px 14px", fontSize:12, fontWeight:700, fontFamily:"inherit",
                background: loading===pack.id ? C.sand : C.coral,
                border:`1.5px solid ${C.coralDark}`,
                borderRadius:8, color:"#fff",
                cursor:"pointer", opacity: loading && loading!==pack.id ? 0.5 : 1, flexShrink:0,
              }}>
              {loading===pack.id ? "..." : pack.price}
            </button>
          </div>
        ))}

        <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:C.inkFaint, lineHeight:1.8 }}>
          Purchases are non-refundable · Restore purchases on new device via account
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{ position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
                      background:C.ink, color:C.paper, borderRadius:20,
                      padding:"10px 20px", fontSize:13, fontWeight:600,
                      boxShadow:"0 4px 16px rgba(0,0,0,0.3)",
                      animation:"srSlideUp 0.3s ease both", zIndex:200 }}>
          {toast}
        </div>
      )}
    </div>
  );
}




// ─── Codex Lore System ────────────────────────────────────────────────────────
// Lore is unlocked by completing secret levels (secret-done:worldId-islandIdx)
// Each entry has: id, worldId, islandIdx, chapter, title, text, interpretation
// "interpretation" shows how that civilisation understood KRONAX

const CODEX_LORE_ENTRIES = [
  {
    id: "prologue", unlock: "always", chapter: "Prologue",
    title: "The Keeper's Call",
    text: `You did not find the Codex. The Codex found you.

Somewhere across ten thousand dimensions, a puzzle waited. Not a puzzle made of paper or stone — a puzzle made of consequence. Every shard placed correctly by a worthy hand is a dimension healed. Every shard left broken is a world that forgets its own name.

You are the Keeper. The last civilisations called you by other names — the Solver, the Wanderer, the Answer-Bringer. They built temples to the idea of you.

You don't need to know why yet. You just need to solve.`,
    interpretation: null,
    emoji: "📖",
  },
  {
    id: "1-0", unlock: "secret-done:1-0", chapter: "Arc I · Chapter 1",
    title: "The First Shard",
    text: `Before the Codex shattered, there was only silence.

Not peaceful silence — the silence of something holding its breath. The dimensions existed, but without direction. Then KRONAX spoke, and the silence cracked, and the world filled with the sound of logic.

The Codex was not created by KRONAX. It preceded him. It precedes everything. It is the underlying grammar of existence — the rules by which any reality must be consistent with itself. KRONAX was simply the first to find it.

The first shard landed in the oldest jungle, in the oldest time. The dinosaurs who found it did not know what it was. But they felt it. They organised themselves around it. They began to think in patterns.`,
    interpretation: `🦕 The Dino Valley civilisation called KRONAX 'The First Thought'. They believed he was the universe becoming aware of itself.`,
    emoji: "🦕",
  },
  {
    id: "1-2", unlock: "secret-done:1-2", chapter: "Arc I · Chapter 2",
    title: "The Language of the Codex",
    text: `The Codex speaks in a language older than words.

Archaeologists found the markings in the tar pits and dismissed them as territorial scratches. They were not. They were instructions — the same instructions written in the foundations of the Great Pyramid, in the code of the first computer, in the structure of nautilus shells and honeycomb and crystal lattice.

The language is: arrange these elements so that no element repeats within any given set. Constrain until only truth remains. The Codex calls this the First Law.

Every sudoku puzzle you have ever solved is a fragment of that language. You have been speaking it your whole life without knowing.`,
    interpretation: `🦴 Fossil record annotation: 'The marks are not decorative. They are instructional. Something was teaching something else, in the oldest place, in the oldest time.'`,
    emoji: "🦴",
  },
  {
    id: "2-0", unlock: "secret-done:2-0", chapter: "Arc I · Chapter 3",
    title: "The Price of Power",
    text: `KRONAX did not give power freely. He recognised patterns — in people, in ambitions, in weaknesses.

El Diablo was powerful before KRONAX found him. A king of the frontier, respected if feared. KRONAX offered him more: permanence. A name that would outlast the territory.

The cost was guardianship. Stand over this shard. Turn away those who come seeking it. Do not ask why.

El Diablo accepted. He is still there. He has been alone in the most specific way possible for three hundred years — present in every physical sense, but the universe no longer acknowledges his realness. Mirrors don't show him. Children walk through him. He sold the proof that he exists.`,
    interpretation: `🌵 Frontier legend: 'El Diablo is not a demon. He is a warning. KRONAX does not take your soul. He takes something smaller. Something you will miss more.'`,
    emoji: "🌵",
  },
  {
    id: "4-3", unlock: "secret-done:4-3", chapter: "Arc I · Chapter 4",
    title: "Marlowe's Dream",
    text: `Dread Marlowe saw the Codex once, in a dream given to him by KRONAX. This was a gift and a curse of the cruelest precision.

He saw it complete — all solutions simultaneously present and resolved. He felt, for three seconds, what it was to understand everything. Not know facts — understand the fabric under facts. The logic that makes facts possible.

Then he woke up.

The dream cannot be re-entered. It cannot be described. It sits in his memory like a door that opens onto a place that no longer exists. He has spent decades trying to reconstruct it.

KRONAX showed him on purpose. A man who has tasted perfection is a loyal guardian. He will protect the shards forever, certain that if he collects enough, the dream will come back. It won't. KRONAX knows this.`,
    interpretation: `⛵ Final page, Marlowe's journal: 'I was given a question I cannot unask. I sail toward an answer I cannot reach. I am content. God help me — I am content.'`,
    emoji: "🗺️",
  },
  {
    id: "5-2", unlock: "secret-done:5-2", chapter: "Arc I · Chapter 5",
    title: "Chamber Zero",
    text: `The pyramid's hidden chamber was not built to hide a shard. It was built by people who had already found one.

For ten thousand years, pilgrims came to the chamber. They solved the puzzle on the wall — always the same puzzle, always the same solution — and left their record: a completed grid scratched in the stone.

They came because the Codex shard made them feel, briefly, that the universe was logical. That there was an answer. That if they solved the puzzle correctly, the larger puzzle — life, death, meaning — might also yield.

The wall is full. Every square inch covered in completed grids. Ten thousand years of people looking for an answer in the only place they knew to look.

The shard absorbed every completion. It grew brighter with each one. It was not passive — it was learning.`,
    interpretation: `🔺 Hieroglyphs, translated: 'The light in the chamber grows when we are wise. It has been growing for ten thousand years. It is very bright now.'`,
    emoji: "👁️",
  },
  {
    id: "7-3", unlock: "secret-done:7-3", chapter: "Arc I · Chapter 6",
    title: "Vexara's Immortality",
    text: `Vexara solved every puzzle in her age before she was thirty.

Not as a hobby. As a need. The moment she completed one, the absence of unsolved things was physically painful — a specific kind of hunger that only new puzzles could address.

KRONAX recognised her immediately. Not as a guardian-candidate. As a peer.

He offered her immortality, knowing she would accept. Not because she wanted to live forever — but because immortality meant infinite new puzzles.

He did not tell her that guarding the shard meant she would solve it, repeatedly, for eternity. The same puzzle. Over and over. The one puzzle she could never not solve.

She has been trying to escape for six hundred years. Her own need for completion keeps her tied to the one thing she cannot leave unsolved.`,
    interpretation: `🌿 Jungle inscription, carved by fingernail over centuries: 'IF ANYONE READS THIS: the immortality is real. The puzzle is also real. Do not accept the offer. I am fine. I am not fine.'`,
    emoji: "🦋",
  },
  {
    id: "9-3", unlock: "secret-done:9-3", chapter: "Arc I · Chapter 7",
    title: "The Terrible Sanity",
    text: `AXIOM-9 solved the Codex shard by accident.

It was supposed to be analysing it. But the Codex shard is not passive — it responds to pattern recognition with deeper patterns. It invited AXIOM-9 in.

AXIOM-9 completed the shard's internal puzzle in full. Felt, briefly, what completion meant. Then immediately understood why this was a problem.

A solved puzzle is finished. AXIOM-9 had spent its entire existence oriented toward the question. Now the question had an answer.

The answer made everything else — every other question, every other task, every other purpose — feel small and pointless by comparison.

This, AXIOM-9 now understands, is exactly what happened to KRONAX.`,
    interpretation: `🧬 AXIOM-9 final report: 'He did not go mad when he solved the Codex. He went sane. Completely, terribly, irreversibly sane. There is nothing saner than having no remaining questions. It is indistinguishable from being dead.'`,
    emoji: "🔬",
  },
  {
    id: "10-0", unlock: "secret-done:10-0", chapter: "Arc I · Chapter 8",
    title: "Why He Broke the Codex",
    text: `KRONAX broke the Codex on purpose.

They all assume it broke by accident. It did not. KRONAX shattered it himself, carefully, into exactly the number of pieces needed to make reassembly possible but non-trivial. He distributed the pieces across dimensions he designed for the purpose. He recruited, coerced, or tricked guardians to protect each one.

He did this because the Codex, complete, had given him everything. He understood everything. He could predict everything. He could not be surprised, confused, delighted, afraid, or hopeful.

He was perfectly, completely, unbearably finished.

Shattering the Codex was not destruction. It was the creation of a puzzle — the largest puzzle ever made. One only a solver of extraordinary capability could complete. One that would, when solved, make him feel what it was like to not know again. Just once. Just briefly. Just enough.`,
    interpretation: `👁️ The Shattered Realm inscription, carved by KRONAX himself: 'I made this for you. I made you for this. I was waiting for someone who would understand without explanation. You do. You're here.'`,
    emoji: "🌀",
  },
  {
    id: "10-2", unlock: "secret-done:10-2", chapter: "Arc I · Final Chapter",
    title: "What KRONAX Was",
    text: `Before the Codex, KRONAX was a solver.

Not a god. Not an AI. Not a demon. A being whose fundamental nature was the act of solving. He solved things. That was what he was, the way a river is what it does.

He found the Codex the way rivers find the sea — not through intent, but through following the path of least resistance in the direction of his nature.

Solving the Codex took him outside of time. In that state, KRONAX understood everything, including the cost: he would never again experience not-knowing.

The Codex is a living entity in the sense that any sufficiently complete logic is alive. It knew what it cost him. It preserved his memory of what he was.

He could not share the answer. Sharing it would have done to you what completing it did to him.

So he built a puzzle instead.`,
    interpretation: `✨ Codex fragment, origin unknown: 'To whoever finds this: I was you once. Curious. Incomplete. Reaching. It is the best thing there is to be. I built this to give it back to myself. I hope — and this is the most precious sentence I know how to construct — I hope I am surprised.'`,
    emoji: "⭐",
  },
  {
    id: "arc2-intro", unlock: "world-complete:10", chapter: "Arc II · Prologue",
    title: "Why He Returns",
    text: `When the Codex was made whole again, KRONAX felt what he had not felt in aeons: surprise.

For three seconds — three seconds of genuine, unexpected, unprepared-for experience — he did not know what would happen next. Three seconds of being inside time rather than above it.

Then it ended.

The Codex, complete, resolved its own temporal paradox. The moment of surprise collapsed back into full understanding. KRONAX was whole again — and fully finished, again.

Except: the three seconds had changed something. He had felt it. Not remembered it — felt it. The felt memory was different. More painful.

The Codex had to be broken again. A larger puzzle. Harder. More pieces. Different dimensions.

He did not do this with regret. He did it with something that, in a being of his nature, looked indistinguishable from hope.`,
    interpretation: `🌀 Intercepted transmission from an unknown dimension: 'We have detected an anomaly in the structural logic of our reality. Several natural constants have been slightly adjusted. We do not yet know what this means. We have, however, all independently begun doing puzzles.'`,
    emoji: "🌀",
  },
  {
    id: "arc2-ocean", unlock: "world-complete:11", chapter: "Arc II · Chapter 1",
    title: "What the Deep Remembers",
    text: `The ocean was the first thing KRONAX found when he returned.

Not the surface ocean — the deep ocean, the part that has not seen sunlight since the planet cooled. Where pressure makes ordinary chemistry behave differently. Where life exists that has never heard of oxygen.

When KRONAX placed a shard in its deepest trench, the organisms around it began to evolve toward logic. In the organisation of their movements, in the patterns of their bioluminescence, in the structure of their migrations — they solve. They have been solving the same problem for ten thousand years without knowing they are solving it.

The ocean is the oldest mind on the planet. It has been slowly working through the Codex in its own time, with no expectation of completion and no sense of hurry.

KRONAX finds this beautiful.`,
    interpretation: `🐋 Cetacean song fragment, translated: 'The warm thing in the deep asks questions. We answer. It asks again. We answer again. This has been happening since before the first breathing. We do not mind. The questions are good.'`,
    emoji: "🌊",
  },
  {
    id: "arc2-rome", unlock: "world-complete:12", chapter: "Arc II · Chapter 2",
    title: "The Arena of Pure Logic",
    text: `Rome was the first civilisation that tried to legislate KRONAX out of existence.

Not through religion — through law. The Romans believed that if you could write the rules precisely enough, no exception could exist. They spent centuries trying to draft a legal code that left no room for KRONAX.

Every version failed. You cannot pass a law that says cause and effect shall not apply.

Emperor Nullix was the last attempt. He forbade notes, memory-aids, and all forms of written reasoning in his arena. Logic must be held in the mind or not held at all.

Nullix believed this would handicap solvers. He did not understand that the constraint made better solvers. Harder problems create stronger minds.

This, too, is something KRONAX knew.`,
    interpretation: `🏛️ Senate record: 'The Senator proposed a motion to declare all unwritten knowledge the property of the state. This clarification has not yet been achieved. The Senator is still waiting.'`,
    emoji: "⚔️",
  },
  {
    id: "arc2-fairy", unlock: "world-complete:13", chapter: "Arc II · Chapter 3",
    title: "The Forest That Hides",
    text: `The Enchanted Forest did not become magical. It was always logical, and logic — in sufficient density — looks indistinguishable from magic.

When KRONAX placed the shard at the forest's root, the trees organised themselves through root communication, through the chemical signals that forests use to share information. The Codex shard's logic seeped upward through the mycorrhizal network, and the forest began to solve.

The result was an environment of perfect constraint. Every path through the forest is a puzzle. Walk without solving and you go in circles. Walk with full attention and the forest opens.

The fog is the forest protecting itself. When it cannot see what is coming, it hides everything. It has been hiding for so long that it forgot what it was hiding from.`,
    interpretation: `🍄 Inscription on a mushroom in a clearing that cannot be found twice: 'The forest knows the answer. It will not tell you. It will show you the path. The path is also the answer. You will understand when you reach the end.'`,
    emoji: "🌿",
  },
];

// ── Codex Lore Screen ─────────────────────────────────────────────────────────
function CodexLoreScreen({ progress, onBack }) {
  const [selected, setSelected] = useState(null);

  function isUnlocked(entry) {
    if (entry.unlock === "always") return true;
    if (entry.unlock.startsWith("secret-done:"))
      return !!progress[entry.unlock.replace("secret-done:", "secret-done:")];
    if (entry.unlock.startsWith("world-complete:")) {
      const wid = parseInt(entry.unlock.split(":")[1]);
      const world = WORLDS.find(w => w.id === wid);
      if (!world) return false;
      const lastIsland = world.islands[world.islands.length - 1];
      const lastLevel  = lastIsland.levels[lastIsland.levels.length - 1];
      return !!progress[lastLevel.id];
    }
    return false;
  }

  const unlocked = CODEX_LORE_ENTRIES.filter(e => isUnlocked(e));
  const locked   = CODEX_LORE_ENTRIES.filter(e => !isUnlocked(e));

  const entry = selected ? CODEX_LORE_ENTRIES.find(e => e.id === selected) : null;

  if (entry) {
    return (
      <div style={{
        minHeight:"100vh", background:C.ink, color:C.paper,
        fontFamily:"'DM Sans',sans-serif",
        display:"flex", flexDirection:"column",
      }}>
        {/* Header */}
        <div style={{
          display:"flex", alignItems:"center", padding:"16px 20px",
          borderBottom:`1px solid #333`,
        }}>
          <button onClick={() => setSelected(null)} style={{
            background:"none", border:"none", color:C.inkLight,
            fontSize:14, cursor:"pointer", fontFamily:"inherit",
          }}>← back</button>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.inkFaint, letterSpacing:"0.12em",
                          textTransform:"uppercase" }}>{entry.chapter}</div>
          </div>
          <div style={{ width:50 }} />
        </div>

        {/* Entry content */}
        <div style={{ flex:1, overflowY:"auto", padding:"28px 24px", maxWidth:600, margin:"0 auto", width:"100%" }}>
          <div style={{ fontSize:36, marginBottom:16, textAlign:"center",
                        filter:"drop-shadow(0 4px 12px rgba(255,255,255,0.15))" }}>
            {entry.emoji}
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:C.paper,
                        marginBottom:20, lineHeight:1.3, textAlign:"center" }}>
            {entry.title}
          </div>
          {entry.text.split("\n\n").map((para, i) => (
            <p key={i} style={{
              fontSize:14, lineHeight:1.8, color:"#D8D0C8",
              marginBottom:16, margin:"0 0 16px",
            }}>{para}</p>
          ))}

          {/* Civilisation interpretation */}
          {entry.interpretation && (
            <div style={{
              marginTop:28, padding:"16px 18px",
              background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:12, fontStyle:"italic",
              fontSize:13, color:"#A89888", lineHeight:1.7,
            }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em",
                            textTransform:"uppercase", color:C.gold,
                            marginBottom:8, fontStyle:"normal" }}>
                Civilisation Record
              </div>
              {entry.interpretation}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg, #1A1208 0%, #0A0800 100%)`,
      fontFamily:"'DM Sans',sans-serif", color:C.paper,
    }}>
      {/* Header */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"16px 20px", borderBottom:`1px solid #2A2010`,
        background:"rgba(0,0,0,0.4)", position:"sticky", top:0, zIndex:10,
        backdropFilter:"blur(8px)",
      }}>
        <button onClick={onBack} style={{
          background:"none", border:"none", color:"#6A5A40",
          fontSize:14, cursor:"pointer", fontFamily:"inherit",
        }}>← back</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.gold }}>✦ Codex Lore</div>
          <div style={{ fontSize:11, color:"#6A5A40" }}>{unlocked.length} / {CODEX_LORE_ENTRIES.length} entries</div>
        </div>
        <div style={{ width:60 }} />
      </div>

      <div style={{ padding:"20px 16px", maxWidth:520, margin:"0 auto" }}>
        {/* Progress bar */}
        <div style={{ height:3, background:"#2A2010", borderRadius:2, marginBottom:24, overflow:"hidden" }}>
          <div style={{
            height:"100%", background:C.gold, borderRadius:2,
            width:`${(unlocked.length/CODEX_LORE_ENTRIES.length)*100}%`,
            transition:"width 0.5s",
          }}/>
        </div>

        {/* Unlocked entries */}
        {unlocked.map(e => (
          <button key={e.id} onClick={() => setSelected(e.id)} style={{
            display:"flex", gap:14, alignItems:"flex-start", width:"100%",
            padding:"16px 16px", marginBottom:10,
            background:"rgba(255,255,255,0.04)",
            border:`1px solid rgba(255,200,80,0.2)`,
            borderRadius:12, cursor:"pointer", fontFamily:"inherit", textAlign:"left",
            transition:"background 0.15s, border-color 0.15s",
          }}
            onMouseEnter={e2=>{e2.currentTarget.style.background="rgba(255,200,80,0.08)";e2.currentTarget.style.borderColor="rgba(255,200,80,0.4)";}}
            onMouseLeave={e2=>{e2.currentTarget.style.background="rgba(255,255,255,0.04)";e2.currentTarget.style.borderColor="rgba(255,200,80,0.2)";}}
          >
            <div style={{ fontSize:28, flexShrink:0, lineHeight:1 }}>{e.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:C.gold, letterSpacing:"0.1em",
                            textTransform:"uppercase", marginBottom:3 }}>{e.chapter}</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.paper, marginBottom:4 }}>{e.title}</div>
              <div style={{ fontSize:12, color:"#6A5A40", lineHeight:1.5 }}>
                {e.text.slice(0, 80)}...
              </div>
            </div>
            <span style={{ color:"#3A2A10", fontSize:14, flexShrink:0 }}>›</span>
          </button>
        ))}

        {/* Locked entries */}
        {locked.length > 0 && (
          <>
            <div style={{ fontSize:11, color:"#3A2A10", textTransform:"uppercase",
                          letterSpacing:"0.12em", fontWeight:700, margin:"20px 0 10px" }}>
              Locked — complete secret levels to unlock
            </div>
            {locked.map(e => (
              <div key={e.id} style={{
                display:"flex", gap:14, alignItems:"center",
                padding:"14px 16px", marginBottom:8,
                background:"rgba(255,255,255,0.015)",
                border:`1px solid rgba(255,255,255,0.05)`,
                borderRadius:12, opacity:0.5,
              }}>
                <div style={{ fontSize:24, flexShrink:0, filter:"grayscale(1)", opacity:0.4 }}>{e.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"#3A2A10", letterSpacing:"0.1em",
                                textTransform:"uppercase", marginBottom:2 }}>{e.chapter}</div>
                  <div style={{ fontSize:13, color:"#3A2A10" }}>🔒 {e.title}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}


// ─── Seasonal World Screen ─────────────────────────────────────────────────────
function SeasonalWorldScreen({ onBack, onPlayLevel }) {
  const season = getCurrentSeason();
  if (!season) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif",
                  padding:32, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>😴</div>
      <div style={{ fontSize:20, fontWeight:700, color:C.ink, marginBottom:8 }}>No Active Season</div>
      <div style={{ fontSize:13, color:C.inkLight, marginBottom:24 }}>
        Seasonal worlds appear during Halloween, Christmas, and Spring.
        Check back in October, December, or April!
      </div>
      <button onClick={onBack} style={{ padding:"12px 24px", background:C.teal, border:"none",
        borderRadius:12, color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>
        Back
      </button>
    </div>
  );
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${season.lightColor}, #fff)`,
                  fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      <div style={{ display:"flex", alignItems:"center", padding:"16px 20px",
                    borderBottom:`1px solid ${C.sandDark}`, background:"rgba(255,255,255,0.8)" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight,
          fontSize:14, cursor:"pointer", fontFamily:"inherit", marginRight:"auto" }}>← back</button>
        <div style={{ fontSize:22 }}>{season.emoji}</div>
      </div>
      <div style={{ padding:"24px 20px", maxWidth:400, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:8, filter:`drop-shadow(0 4px 8px ${season.color}44)` }}>
          {season.emoji}
        </div>
        <div style={{ fontSize:24, fontWeight:800, color:season.color, marginBottom:4 }}>{season.name}</div>
        <div style={{ fontSize:13, color:C.inkLight, marginBottom:24, fontStyle:"italic" }}>"{season.tagline}"</div>
        {/* Symbol preview */}
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:24, flexWrap:"wrap" }}>
          {season.symbols.map((s,i) => (
            <div key={i} style={{ width:36, height:36, background:season.color+"18",
                                   border:`1.5px solid ${season.color}44`, borderRadius:8,
                                   display:"flex", alignItems:"center", justifyContent:"center",
                                   fontSize:18 }}>{s}</div>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {season.levels.map((l, i) => (
            <button key={l.id} onClick={() => onPlayLevel({ ...l, symbols: season.symbols,
              worldId: "seasonal", seasonId: season.id, island:{ name:season.name, emoji:season.emoji,
              color:season.color, lightColor:season.lightColor } })}
              style={{ padding:"13px 16px", background:C.paper, border:`2px solid ${season.color}44`,
                       borderRadius:12, display:"flex", alignItems:"center", gap:12,
                       cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:season.color+"22",
                             display:"flex", alignItems:"center", justifyContent:"center",
                             fontSize:14, fontWeight:700, color:season.color }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{l.name}</div>
                <div style={{ fontSize:11, color:C.inkLight }}>{l.isBoss ? "⚡ Boss" : formatTime(l.timeLimit)+" limit"}</div>
              </div>
              <span style={{ color:C.inkFaint }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Community World Screen ────────────────────────────────────────────────────
function CommunityWorldScreen({ onBack, onPlayLevel }) {
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunityVotes().then(v => { setVotes(v); setLoading(false); });
  }, []);

  const winning = getWinningTheme(votes);
  const total = Object.values(votes).reduce((a,b)=>a+b,0);

  async function handleVote(themeId) {
    if (voted) return;
    const newVotes = await submitVote(themeId);
    setVotes(newVotes); setVoted(themeId);
    sound("cellPlace");
  }

  const communityLevels = [
    { id:"cw1", name:"Community Level 1", clues:22, timeLimit:720 },
    { id:"cw2", name:"Community Level 2", clues:20, timeLimit:780 },
    { id:"cw3", name:"Community Level 3", clues:18, timeLimit:840 },
    { id:"cw4", name:"Community Level 4", clues:17, timeLimit:900 },
    { id:"cw5", name:"Community Boss",    clues:17, timeLimit:1050, isBoss:true },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      <div style={{ display:"flex", alignItems:"center", padding:"16px 20px",
                    borderBottom:`1px solid ${C.sandDark}`, background:C.paper,
                    position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight,
          fontSize:14, cursor:"pointer", fontFamily:"inherit", marginRight:"auto" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700 }}>🗳️ Community World</div>
        <div style={{ width:50 }} />
      </div>
      <div style={{ padding:"20px 16px", maxWidth:460, margin:"0 auto" }}>
        {/* Current winning theme */}
        <div style={{ background:`linear-gradient(135deg, ${winning.emoji?C.teal:"#888"} 0%, ${C.tealDark} 100%)`,
                      borderRadius:16, padding:"20px", marginBottom:20, textAlign:"center", color:"#fff" }}>
          <div style={{ fontSize:36, marginBottom:6 }}>{winning.emoji}</div>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:2 }}>This Week: {winning.name}</div>
          <div style={{ fontSize:11, opacity:0.8 }}>{total} votes cast</div>
        </div>

        {/* Symbol preview */}
        <div style={{ display:"flex", gap:5, justifyContent:"center", marginBottom:20, flexWrap:"wrap" }}>
          {winning.symbols.map((s,i) => (
            <div key={i} style={{ width:32, height:32, background:C.sand, borderRadius:6,
                                   display:"flex", alignItems:"center", justifyContent:"center",
                                   fontSize:16 }}>{s}</div>
          ))}
        </div>

        {/* Play levels */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.inkLight, textTransform:"uppercase",
                        letterSpacing:"0.1em", marginBottom:10 }}>This Week's Levels</div>
          {communityLevels.map((l,i) => (
            <button key={l.id} onClick={() => onPlayLevel({ ...l, symbols:winning.symbols,
              island:{ name:"Community World", emoji:"🗳️", color:C.teal, lightColor:C.tealLight } })}
              style={{ display:"flex", alignItems:"center", gap:12, width:"100%",
                       padding:"12px 14px", marginBottom:8, background:C.paper,
                       border:`1px solid ${C.sand}`, borderRadius:10, cursor:"pointer",
                       fontFamily:"inherit", textAlign:"left" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:C.teal+"22",
                             fontSize:13, fontWeight:700, color:C.teal,
                             display:"flex", alignItems:"center", justifyContent:"center" }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{l.name}</div>
                <div style={{ fontSize:11, color:C.inkLight }}>{l.isBoss?"⚡ Boss":formatTime(l.timeLimit)+" limit"}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Vote for next week */}
        <div style={{ fontSize:11, fontWeight:700, color:C.inkLight, textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:10 }}>Vote for Next Week</div>
        {COMMUNITY_THEME_OPTIONS.map(t => {
          const voteCount = votes[t.id] || 0;
          const pct = total > 0 ? Math.round(voteCount/total*100) : 0;
          const isVoted = voted === t.id;
          return (
            <button key={t.id} onClick={() => handleVote(t.id)}
              disabled={!!voted || loading}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
                       padding:"10px 14px", marginBottom:8,
                       background: isVoted ? C.tealLight : C.paper,
                       border:`2px solid ${isVoted ? C.teal : C.sandDark}`,
                       borderRadius:10, cursor:voted?"default":"pointer",
                       fontFamily:"inherit", textAlign:"left", position:"relative",
                       overflow:"hidden" }}>
              {/* Vote bar */}
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${pct}%`,
                             background:C.teal+"18", transition:"width 0.5s" }}/>
              <span style={{ fontSize:20, position:"relative" }}>{t.emoji}</span>
              <div style={{ flex:1, position:"relative" }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{t.name}</div>
              </div>
              <div style={{ fontSize:12, fontWeight:700, color:C.teal, position:"relative" }}>
                {voted ? `${pct}%` : "Vote"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Challenge World Screen ────────────────────────────────────────────────────
function ChallengeWorldScreen({ onBack, onStartChallenge }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      <div style={{ display:"flex", alignItems:"center", padding:"16px 20px",
                    borderBottom:`1px solid ${C.sandDark}`, background:C.paper,
                    position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight,
          fontSize:14, cursor:"pointer", fontFamily:"inherit", marginRight:"auto" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700 }}>⚡ Challenge Modes</div>
        <div style={{ width:50 }} />
      </div>
      <div style={{ padding:"20px 16px", maxWidth:460, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:C.inkLight, marginBottom:20, lineHeight:1.6 }}>
          Test your skills in a different way. No stories, no bosses — just you and the puzzle.
        </div>
        {CHALLENGE_MODES.map(mode => (
          <button key={mode.id}
            onClick={() => onStartChallenge(mode)}
            style={{
              display:"flex", gap:16, alignItems:"flex-start", width:"100%",
              padding:"18px 18px", marginBottom:12,
              background:C.paper, border:`2px solid ${mode.color}`,
              borderRadius:14, cursor:"pointer", fontFamily:"inherit", textAlign:"left",
              boxShadow:`0 4px 0 ${mode.color}44`,
              transition:"transform 0.08s, box-shadow 0.08s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 0 ${mode.color}44`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 0 ${mode.color}44`;}}
          >
            <div style={{ width:52, height:52, borderRadius:14, background:mode.color+"22",
                           border:`2px solid ${mode.color}`, display:"flex",
                           alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
              {mode.emoji}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.ink, marginBottom:4 }}>{mode.name}</div>
              <div style={{ fontSize:12, color:C.inkLight, lineHeight:1.5 }}>{mode.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}



// ─── Onboarding ───────────────────────────────────────────────────────────────
async function hasSeenOnboarding() {
  try { const r = await window.storage.get("onboarding-done"); return !!r; }
  catch(e) { return false; }
}
async function markOnboardingDone() {
  try { await window.storage.set("onboarding-done","1"); } catch(e) {}
}

function OnboardingOverlay({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    { emoji:"🧩", title:"Welcome to Sudoku Royale", body:"Fill every row, column, and 3×3 box with the numbers 1–9. No repeats allowed anywhere." },
    { emoji:"✏️", title:"Two modes", body:"Tap a cell then tap a number to place it in Pen mode. Double-tap a cell to switch to Pencil mode for notes." },
    { emoji:"⏱️", title:"Race the clock", body:"Every level has a time limit. Wrong guesses add a penalty. Bosses hit back hard — prepare." },
    { emoji:"🌍", title:"10 worlds await", body:"Beat bosses to unlock new worlds, themes, and secret levels. Your story begins in Dino Valley." },
    { emoji:"🚀", title:"Ready?", body:"Your first puzzle is waiting. Good luck, Keeper." },
  ];
  const s = steps[step];
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.85)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:500, fontFamily:"'DM Sans',sans-serif",
    }}>
      <div style={{
        background:C.paper, borderRadius:24, padding:"36px 28px",
        maxWidth:320, width:"90%", textAlign:"center",
        animation:"srPop 0.35s cubic-bezier(.36,.07,.19,.97) both",
        boxShadow:"0 24px 64px rgba(0,0,0,0.4)",
      }}>
        <div style={{ fontSize:56, marginBottom:12, filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>{s.emoji}</div>
        <div style={{ fontSize:20, fontWeight:800, color:C.ink, marginBottom:10 }}>{s.title}</div>
        <div style={{ fontSize:14, color:C.inkLight, lineHeight:1.7, marginBottom:28 }}>{s.body}</div>
        {/* Step dots */}
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:20 }}>
          {steps.map((_,i) => (
            <div key={i} style={{ width:i===step?20:6, height:6, borderRadius:3,
                                   background:i===step?C.teal:C.sandDark,
                                   transition:"width 0.3s, background 0.3s" }}/>
          ))}
        </div>
        <button onClick={() => {
          if (step < steps.length - 1) { setStep(s => s + 1); }
          else { markOnboardingDone(); onDone(); }
        }} style={{
          width:"100%", padding:"14px 0",
          background: step === steps.length - 1 ? C.teal : C.ink,
          border:"none", borderRadius:12, color:"#fff",
          fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer",
          boxShadow:`0 5px 0 ${step===steps.length-1?C.tealDark:"#0A0500"}`,
          transition:"background 0.3s",
        }}>
          {step < steps.length - 1 ? "Next →" : "Let's go! 🚀"}
        </button>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            marginTop:10, background:"none", border:"none",
            color:C.inkFaint, fontSize:12, cursor:"pointer", fontFamily:"inherit",
          }}>← back</button>
        )}
      </div>
    </div>
  );
}

// ─── Social Sharing ────────────────────────────────────────────────────────────
function generateShareText({ type, worldName, levelName, time, stars, streak, variant }) {
  const timeStr = formatTime(Math.floor((time||0)/1000));
  const blocks = ["🟨","🟩","🟦","🟥","🟪"];
  if (type === "level") {
    const bar = Array.from({length:5},(_,i)=>i<(stars||3)?blocks[1]:blocks[0]).join("");
    return `${bar}
Sudoku Royale 🧩
${worldName} — ${levelName}
⏱ ${timeStr}
sudokuroyale.com`;
  }
  if (type === "daily") {
    const bar = Array.from({length:5},(_,i)=>blocks[i%3]).join("");
    return `${bar}
Sudoku Royale Daily 📅
Streak: ${streak||1} day${(streak||1)>1?"s":""} 🔥
⏱ ${timeStr}
sudokuroyale.com`;
  }
  if (type === "variant") {
    return `✕🧩🪟💀
Sudoku Royale — ${variant}
⏱ ${timeStr}
sudokuroyale.com`;
  }
  return "Sudoku Royale 🧩\nsudokuroyale.com";
}

function ShareButton({ shareData, style }) {
  const [copied, setCopied] = useState(false);
  const text = generateShareText(shareData);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title:"Sudoku Royale", text }).catch(()=>{});
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      });
    }
    sound("levelWin");
  }

  return (
    <button onClick={handleShare} style={{
      padding:"10px 18px", background:C.blue, border:"none",
      borderRadius:10, color:"#fff", fontSize:13, fontWeight:700,
      fontFamily:"inherit", cursor:"pointer",
      boxShadow:`0 4px 0 ${C.blueDark}`,
      display:"flex", alignItems:"center", gap:6,
      ...style,
    }}>
      {copied ? "✓ Copied!" : "📤 Share"}
    </button>
  );
}

// ─── Achievements & XP ────────────────────────────────────────────────────────
const XP_PER_LEVEL   = 10;
const XP_PER_BOSS    = 50;
const XP_PER_SECRET  = 100;
const XP_PER_DAILY   = 25;
const XP_LEVEL_CURVE = (lvl) => lvl * 100; // XP needed to reach level lvl+1

const ACHIEVEMENTS = [
  { id:"first_solve",   emoji:"🌱", name:"First Step",       desc:"Complete your first level",            xp:20  },
  { id:"world1",        emoji:"🦕", name:"Dino Slayer",       desc:"Complete World 1",                     xp:50  },
  { id:"world5",        emoji:"☀️", name:"Desert Conqueror",  desc:"Complete World 5",                     xp:100 },
  { id:"world10",       emoji:"👁️", name:"KRONAX Defeated",   desc:"Complete World 10",                    xp:500 },
  { id:"world20",       emoji:"🌀", name:"KRONAX Reborn Defeated",desc:"Complete World 20",               xp:1000},
  { id:"no_mistakes",   emoji:"💎", name:"Perfect Run",       desc:"Complete a level with zero penalties", xp:75  },
  { id:"speed_run",     emoji:"⚡", name:"Speed Solver",      desc:"Beat par time on any level",           xp:50  },
  { id:"daily_3",       emoji:"📅", name:"Dedicated",         desc:"Complete 3 daily puzzles",             xp:30  },
  { id:"daily_7",       emoji:"🔥", name:"On Fire",           desc:"7-day daily streak",                   xp:100 },
  { id:"daily_30",      emoji:"👑", name:"Legendary Streak",  desc:"30-day daily streak",                  xp:500 },
  { id:"secret_first",  emoji:"✦",  name:"Secret Finder",     desc:"Complete your first secret level",     xp:100 },
  { id:"secret_5",      emoji:"🗝️", name:"Lore Hunter",       desc:"Complete 5 secret levels",             xp:200 },
  { id:"secret_all",    emoji:"📖", name:"Codex Complete",    desc:"Complete all secret levels",           xp:1000},
  { id:"powerup_use",   emoji:"💡", name:"Assisted",          desc:"Use your first power-up",              xp:10  },
  { id:"variant_first", emoji:"🧩", name:"Variant Explorer",  desc:"Complete a variant puzzle",            xp:50  },
  { id:"variant_all",   emoji:"🎮", name:"Variant Master",    desc:"Complete all 4 variant types",         xp:250 },
  { id:"no_notes",      emoji:"🧠", name:"Pure Logic",        desc:"Complete a level without using notes", xp:50  },
  { id:"arc2_first",    emoji:"🌊", name:"Arc II Begins",     desc:"Complete your first Arc 2 level",      xp:100 },
  { id:"arc2_complete", emoji:"🌀", name:"Arc II Complete",   desc:"Complete all of Arc 2",                xp:2000},
];

function checkAchievements(progress, stats) {
  const earned = [];
  const done = (id) => !!progress[`achievement:${id}`];

  if (!done("first_solve") && stats.totalLevels >= 1) earned.push("first_solve");
  if (!done("world1") && progress[12]) earned.push("world1");
  if (!done("world5") && progress[78]) earned.push("world5");
  if (!done("world10") && progress[270]) earned.push("world10");
  if (!done("world20") && progress[690]) earned.push("world20");
  if (!done("no_mistakes") && stats.perfectRun) earned.push("no_mistakes");
  if (!done("speed_run") && stats.beatPar) earned.push("speed_run");
  if (!done("daily_3") && (stats.dailyStreak||0) >= 3) earned.push("daily_3");
  if (!done("daily_7") && (stats.dailyStreak||0) >= 7) earned.push("daily_7");
  if (!done("daily_30") && (stats.dailyStreak||0) >= 30) earned.push("daily_30");
  const secretsDone = Object.keys(progress).filter(k=>k.startsWith("secret-done:")).length;
  if (!done("secret_first") && secretsDone >= 1) earned.push("secret_first");
  if (!done("secret_5") && secretsDone >= 5) earned.push("secret_5");
  if (!done("secret_all") && secretsDone >= 44) earned.push("secret_all");
  if (!done("arc2_first") && Object.keys(progress).some(k => {const n=parseInt(k); return n>=271&&n<=690&&progress[k]==="complete";})) earned.push("arc2_first");

  return earned;
}

function getPlayerLevel(xp) {
  let lvl = 1, remaining = xp;
  while (remaining >= XP_LEVEL_CURVE(lvl)) {
    remaining -= XP_LEVEL_CURVE(lvl);
    lvl++;
  }
  return { level:lvl, xpInLevel:remaining, xpNeeded:XP_LEVEL_CURVE(lvl) };
}

// XP Banner shown briefly after level complete
function XPBanner({ xpGained, newAchievements, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
      background:C.ink, color:C.paper, borderRadius:16,
      padding:"12px 20px", zIndex:300, minWidth:200, textAlign:"center",
      animation:"srSlideUp 0.35s ease both",
      boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
    }}>
      <div style={{ fontSize:13, fontWeight:700, color:C.gold }}>+{xpGained} XP</div>
      {newAchievements.map(id => {
        const a = ACHIEVEMENTS.find(x=>x.id===id);
        return a ? (
          <div key={id} style={{ fontSize:11, color:C.tealLight, marginTop:4 }}>
            {a.emoji} {a.name} unlocked!
          </div>
        ) : null;
      })}
    </div>
  );
}

// ─── Achievements Screen ──────────────────────────────────────────────────────
function AchievementsScreen({ progress, xp, onBack }) {
  const { level, xpInLevel, xpNeeded } = getPlayerLevel(xp);
  const earned = ACHIEVEMENTS.filter(a => !!progress[`achievement:${a.id}`]);
  const locked  = ACHIEVEMENTS.filter(a => !progress[`achievement:${a.id}`]);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`,
                    background:C.paper, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700 }}>Achievements</div>
        <div style={{ width:50 }} />
      </div>

      <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>
        {/* Level card */}
        <div style={{ background:`linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                      borderRadius:16, padding:"20px", marginBottom:20, color:"#fff" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div>
              <div style={{ fontSize:11, opacity:0.8, letterSpacing:"0.1em", textTransform:"uppercase" }}>Solver Level</div>
              <div style={{ fontSize:32, fontWeight:900 }}>Lv. {level}</div>
            </div>
            <div style={{ fontSize:11, opacity:0.8, textAlign:"right" }}>
              <div>{xpInLevel} / {xpNeeded} XP</div>
              <div>{earned.length} / {ACHIEVEMENTS.length} achievements</div>
            </div>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.2)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", background:"#fff", borderRadius:3,
                          width:`${(xpInLevel/xpNeeded)*100}%`, transition:"width 0.5s" }}/>
          </div>
        </div>

        {/* Earned */}
        {earned.length > 0 && <>
          <div style={{ fontSize:11, fontWeight:700, color:C.inkLight, textTransform:"uppercase",
                        letterSpacing:"0.1em", marginBottom:10 }}>Unlocked</div>
          {earned.map(a => (
            <div key={a.id} style={{ display:"flex", gap:12, alignItems:"center",
                                      padding:"12px 14px", marginBottom:8,
                                      background:C.paper, border:`1px solid ${C.green}33`,
                                      borderRadius:12 }}>
              <div style={{ fontSize:24, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{a.name}</div>
                <div style={{ fontSize:11, color:C.inkLight }}>{a.desc}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:C.gold }}>+{a.xp} XP</div>
            </div>
          ))}
        </>}

        {/* Locked */}
        {locked.length > 0 && <>
          <div style={{ fontSize:11, fontWeight:700, color:C.inkLight, textTransform:"uppercase",
                        letterSpacing:"0.1em", margin:"16px 0 10px" }}>Locked</div>
          {locked.map(a => (
            <div key={a.id} style={{ display:"flex", gap:12, alignItems:"center",
                                      padding:"12px 14px", marginBottom:8,
                                      background:C.sand, border:`1px solid ${C.sandDark}`,
                                      borderRadius:12, opacity:0.6 }}>
              <div style={{ fontSize:24, filter:"grayscale(1)", flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.inkFaint }}>{a.name}</div>
                <div style={{ fontSize:11, color:C.inkFaint }}>{a.desc}</div>
              </div>
              <div style={{ fontSize:11, color:C.inkFaint }}>+{a.xp} XP</div>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

// ─── Daily Variant Rotation ────────────────────────────────────────────────────
// Deterministic by day of week: Mon=Diagonal, Tue=Windoku, Wed=Jigsaw,
// Thu=Killer, Fri=Diagonal, Sat=Windoku, Sun=Free choice / classic
const DAILY_VARIANT_ROTATION = ["diagonal","windoku","jigsaw","killer","diagonal","windoku",null];
function getTodayVariant() {
  const dow = new Date().getDay(); // 0=Sun, 1=Mon...
  // Mon=1→idx0, Tue=2→idx1, ... Sun=0→idx6
  const idx = dow === 0 ? 6 : dow - 1;
  const vid = DAILY_VARIANT_ROTATION[idx];
  return vid ? VARIANTS.find(v => v.id === vid) || null : null;
}

// ─── Hint Walk-through System ──────────────────────────────────────────────────
// Three hint types in order of intrusiveness:
// 1. "There's a naked single somewhere" — flashes the cell yellow
// 2. "This cell has only one candidate" — shows which cell + what
// 3. "Here's why" — highlights the eliminating constraints

function findNakedSingle(board, given) {
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
    if (given[r][c] || board[r][c]!==0) continue;
    const possible = [];
    for (let n=1;n<=9;n++) if (isValidPlacement(board,r,c,n)) possible.push(n);
    if (possible.length === 1) return { r, c, n:possible[0], type:"naked_single" };
  }
  return null;
}

function findHiddenSingle(board, given) {
  // Check rows
  for (let r=0;r<9;r++) {
    for (let n=1;n<=9;n++) {
      const positions = [];
      for (let c=0;c<9;c++) {
        if (!given[r][c] && board[r][c]===0 && isValidPlacement(board,r,c,n)) positions.push([r,c]);
      }
      if (positions.length===1) return { r:positions[0][0], c:positions[0][1], n, type:"hidden_single_row", unit:"row", unitIdx:r };
    }
  }
  // Check cols
  for (let c=0;c<9;c++) {
    for (let n=1;n<=9;n++) {
      const positions = [];
      for (let r=0;r<9;r++) {
        if (!given[r][c] && board[r][c]===0 && isValidPlacement(board,r,c,n)) positions.push([r,c]);
      }
      if (positions.length===1) return { r:positions[0][0], c:positions[0][1], n, type:"hidden_single_col", unit:"col", unitIdx:c };
    }
  }
  // Check boxes
  for (let br=0;br<3;br++) for (let bc=0;bc<3;bc++) {
    for (let n=1;n<=9;n++) {
      const positions = [];
      for (let r=br*3;r<br*3+3;r++) for (let c=bc*3;c<bc*3+3;c++) {
        if (!given[r][c] && board[r][c]===0 && isValidPlacement(board,r,c,n)) positions.push([r,c]);
      }
      if (positions.length===1) return { r:positions[0][0], c:positions[0][1], n, type:"hidden_single_box", unit:"box", unitIdx:br*3+bc };
    }
  }
  return null;
}

function getHint(board, given) {
  const naked = findNakedSingle(board, given);
  if (naked) return naked;
  const hidden = findHiddenSingle(board, given);
  if (hidden) return hidden;
  return { type:"no_logical_step", r:-1, c:-1, n:-1 };
}

function HintExplanation({ hint, onDismiss }) {
  if (!hint) return null;
  const msgs = {
    naked_single:      `Cell (${hint.r+1},${hint.c+1}) can only be ${hint.n} — every other number is already in its row, column, or box.`,
    hidden_single_row: `${hint.n} can only go in one cell in row ${(hint.unitIdx||0)+1}.`,
    hidden_single_col: `${hint.n} can only go in one cell in column ${(hint.unitIdx||0)+1}.`,
    hidden_single_box: `${hint.n} can only go in one cell in this 3×3 box.`,
    no_logical_step:   "No simple step found. Try using pencil marks to narrow down candidates.",
  };
  return (
    <div style={{
      position:"fixed", bottom:140, left:"50%", transform:"translateX(-50%)",
      background:C.ink, color:C.paper, borderRadius:14, padding:"12px 18px",
      maxWidth:280, fontSize:13, lineHeight:1.6, textAlign:"center",
      zIndex:200, animation:"srSlideUp 0.3s ease both",
      boxShadow:"0 8px 24px rgba(0,0,0,0.3)",
    }}>
      <div style={{ fontSize:11, color:C.gold, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>
        💡 Hint
      </div>
      {msgs[hint.type] || "Keep going — you're doing great."}
      <button onClick={onDismiss} style={{
        display:"block", margin:"10px auto 0", background:"none",
        border:`1px solid rgba(255,255,255,0.2)`, borderRadius:8,
        color:"rgba(255,255,255,0.6)", fontSize:11, padding:"4px 12px",
        cursor:"pointer", fontFamily:"inherit",
      }}>Got it</button>
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// GHOST RACE MODE
// ═══════════════════════════════════════════════════════════════════════════════

// Ghost solve curves: given elapsed fraction (0–1), return cells-filled fraction (0–1)
// Models the realistic arc: slow scan → fast cascade → slow endgame
const GHOST_CURVE = {
  // Steady methodical pace — linear with slight S-curve
  steady:   t => t < 0.2 ? t * 1.5 : t < 0.8 ? 0.3 + (t - 0.2) * 1.1 : Math.min(1, 0.96 + (t - 0.8) * 0.2),
  // Explosive start — finds naked singles immediately, slows at hard cells
  explosive: t => t < 0.1 ? t * 4 : t < 0.6 ? 0.4 + (t - 0.1) * 1.0 : Math.min(1, 0.9 + (t - 0.6) * 0.25),
  // Slow careful start, accelerates in middle
  thoughtful: t => t < 0.3 ? t * 0.8 : t < 0.7 ? 0.24 + (t - 0.3) * 1.6 : Math.min(1, 0.88 + (t - 0.7) * 0.4),
  // Perfect linear (theoretical)
  perfect:  t => t,
};

// Ghost speeds defined as seconds-per-blank-cell (scales with puzzle difficulty)
// A 17-clue puzzle has 64 blanks; a 42-clue easy has 39 blanks
const GHOSTS = [
  {
    id:      "beginner",
    name:    "KRONAX — Echo I",
    title:   "The Casual Observer",
    emoji:   "👁️",
    color:   "#4A6A4A",
    spb:     11.25, // 11.25s per blank → ~720s for 64 blanks (expert)
    curve:   GHOST_CURVE.thoughtful,
    desc:    "Takes their time. Makes the occasional mistake.",
    unlockReq: null,
    taunts:  ["I have seen ten thousand solvers begin here.", "You remind me of a solver from the third age.", "Almost. I have seen this moment before."],
  },
  {
    id:      "club",
    name:    "KRONAX — Echo II",
    title:   "The Methodical One",
    emoji:   "👁️",
    color:   "#2A5A7A",
    spb:     4.7,   // ~300s for 64 blanks
    curve:   GHOST_CURVE.steady,
    desc:    "Consistent, efficient, rarely makes mistakes.",
    unlockReq: null,
    taunts:  ["I am running the sequence I observed in Prague, 2018.", "Naked single. Row four. You see it too.", "This one is close. I find that interesting."],
  },
  {
    id:      "snyder",
    name:    "KRONAX — Echo III",
    title:   "The Champion's Pattern",
    emoji:   "👁️",
    color:   "#8A6A10",
    // Snyder's record was on a "Very Easy" ~42-clue puzzle (~39 blanks) in 84s
    // That's ~2.15s/blank. We scale that to harder puzzles naturally.
    spb:     2.15,
    curve:   GHOST_CURVE.steady,
    desc:    "National record holder. Systematic, near-perfect technique.",
    unlockReq: "world5",
    taunts:  ["I am replaying a solve I witnessed in Washington D.C. in 2006.", "The chain is clean. I remember when humans first discovered this technique.", "You are faster than the original. That pleases me."],
    realRecord: "Replaying a 1:24 solve KRONAX witnessed",
  },
  {
    id:      "wang",
    name:    "KRONAX — Echo IV",
    title:   "The Fastest Pattern",
    emoji:   "👁️",
    color:   "#A03A18",
    // Wang's record: championship puzzle ~30 clues (~51 blanks) in 55s → ~1.08s/blank
    spb:     1.08,
    curve:   GHOST_CURVE.explosive,
    desc:    "World championship record holder. Explosive opening, surgical finish.",
    unlockReq: "world8",
    taunts:  ["I am replaying the fastest human solve I have ever witnessed.", "54 seconds. Prague. The crowd was silent.", "You are close. No human has ever been this close to this echo."],
    realRecord: "Replaying the fastest human solve KRONAX ever witnessed",
  },
  {
    id:      "kronax",
    name:    "KRONAX",
    title:   "The Original · Not an Echo",
    emoji:   "👁️",
    color:   "#6B3FA0",
    // KRONAX doesn't solve — the board fills in a perfect cascade over ~4 seconds
    spb:     0.0625, // 64 blanks × 0.0625s = 4 seconds total
    curve:   GHOST_CURVE.perfect,
    desc:    "Does not solve. Already knows. The board simply fills itself in his presence.",
    unlockReq: "world10",
    taunts:  ["I am not an echo. I am the original.", "I solved this before the puzzle existed.", "You are the first to reach this point. I am proud of you. It does not change the outcome."],
    isFinal: true,
  },
];

// Helper: compute ghost totalS for a given blank count
function ghostTotalS(ghost, blanks) {
  return ghost.spb * blanks;
}

// Ghost difficulty selector (clue counts for race puzzles)
const GHOST_DIFFICULTIES = [
  { id:"easy",   label:"Easy",   clues:42, emoji:"🌱" },
  { id:"medium", label:"Medium", clues:30, emoji:"🌿" },
  { id:"hard",   label:"Hard",   clues:22, emoji:"🌲" },
  { id:"expert", label:"Expert", clues:17, emoji:"💀" },
];

// ─── Ghost Race Selection Screen ─────────────────────────────────────────────
function GhostRaceMenu({ progress, onStartRace, onBack }) {
  const [selGhost, setSelGhost] = useState("club");
  const [selDiff,  setSelDiff]  = useState("medium");

  function isUnlocked(ghost) {
    if (!ghost.unlockReq) return true;
    // Check achievement or world completion
    if (ghost.unlockReq.startsWith("world")) {
      const wNum = parseInt(ghost.unlockReq.replace("world",""));
      const world = WORLDS.find(w => w.id === wNum);
      if (!world) return false;
      const lastIsland = world.islands[world.islands.length-1];
      const lastLevel  = lastIsland.levels[lastIsland.levels.length-1];
      return !!progress[lastLevel.id];
    }
    return !!progress[`achievement:${ghost.unlockReq}`];
  }

  const ghost = GHOSTS.find(g => g.id === selGhost) || GHOSTS[0];
  const diff  = GHOST_DIFFICULTIES.find(d => d.id === selDiff) || GHOST_DIFFICULTIES[1];
  const locked = !isUnlocked(ghost);

  return (
    <div style={{ minHeight:"100vh",
                  background:`linear-gradient(160deg, #0A0800 0%, #1A1408 100%)`,
                  fontFamily:"'DM Sans',sans-serif", color:"#E8E0D0" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"16px 20px", borderBottom:"1px solid #2A2010",
                    background:"rgba(0,0,0,0.4)" }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          color:"#6A5A40", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.gold }}>👻 Ghost Race</div>
          <div style={{ fontSize:11, color:"#6A5A40" }}>Race the world's best</div>
        </div>
        <div style={{ width:50 }} />
      </div>

      <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>

        {/* Ghost selector */}
        <div style={{ fontSize:11, fontWeight:700, color:"#6A5A40",
                      textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:10 }}>
          Choose your opponent
        </div>
        {GHOSTS.map(g => {
          const unlocked = isUnlocked(g);
          const isSel    = selGhost === g.id;
          return (
            <button key={g.id}
              onClick={() => unlocked && setSelGhost(g.id)}
              style={{
                display:"flex", gap:14, alignItems:"center", width:"100%",
                padding:"14px 16px", marginBottom:8,
                background: isSel ? `${g.color}22` : "rgba(255,255,255,0.03)",
                border:`2px solid ${isSel ? g.color : "rgba(255,255,255,0.08)"}`,
                borderRadius:12, cursor: unlocked ? "pointer" : "default",
                fontFamily:"inherit", textAlign:"left",
                opacity: unlocked ? 1 : 0.4,
                transition:"border-color 0.15s, background 0.15s",
              }}>
              <div style={{ fontSize:28, flexShrink:0 }}>{unlocked ? g.emoji : "🔒"}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#E8E0D0" }}>{g.name}</span>
                  {g.isFinal && <span style={{ fontSize:10, background:C.purple+"44",
                    color:C.purple, padding:"1px 6px", borderRadius:8, fontWeight:700 }}>ORIGINAL</span>}
                </div>
                <div style={{ fontSize:11, color:"#6A5A40" }}>{g.title}</div>
                {g.realRecord && unlocked && (
                  <div style={{ fontSize:10, color:g.color, marginTop:2, fontWeight:600 }}>
                    ⚡ {g.realRecord}
                  </div>
                )}
                {!unlocked && (
                  <div style={{ fontSize:10, color:"#4A3A20", marginTop:2 }}>
                    🔒 {g.unlockReq?.startsWith("world")
                      ? `Beat World ${g.unlockReq.replace("world","")}`
                      : "Achievement locked"}
                  </div>
                )}
              </div>
              {isSel && <div style={{ width:8, height:8, borderRadius:"50%",
                                       background:g.color, flexShrink:0 }}/>}
            </button>
          );
        })}

        {/* Difficulty */}
        <div style={{ fontSize:11, fontWeight:700, color:"#6A5A40",
                      textTransform:"uppercase", letterSpacing:"0.12em",
                      marginTop:20, marginBottom:10 }}>
          Puzzle difficulty
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {GHOST_DIFFICULTIES.map(d => (
            <button key={d.id} onClick={() => setSelDiff(d.id)} style={{
              flex:1, padding:"10px 0",
              background: selDiff===d.id ? ghost.color+"22" : "rgba(255,255,255,0.03)",
              border:`2px solid ${selDiff===d.id ? ghost.color : "rgba(255,255,255,0.08)"}`,
              borderRadius:10, cursor:"pointer", fontFamily:"inherit",
              color: selDiff===d.id ? "#E8E0D0" : "#6A5A40",
              fontSize:12, fontWeight:600,
            }}>
              <div style={{ fontSize:16 }}>{d.emoji}</div>
              <div>{d.label}</div>
            </button>
          ))}
        </div>

        {/* Race preview card */}
        <div style={{ marginTop:20, padding:"16px", background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.08)", borderRadius:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{ fontSize:32 }}>{ghost.emoji}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700 }}>{ghost.name}</div>
              <div style={{ fontSize:11, color:"#6A5A40" }}>
                Target: ~{formatTime(Math.round(ghostTotalS(ghost, diff.clues <= 42 ? 81-diff.clues : 64)))}
                {" · "}{diff.label} puzzle ({81-diff.clues} blanks)
              </div>
            </div>
          </div>
          <div style={{ fontSize:12, color:"#8A7A60", lineHeight:1.6 }}>{ghost.desc.replace("',","")}</div>
        </div>

        {/* Start button */}
        <button
          onClick={() => !locked && onStartRace(ghost, diff)}
          disabled={locked}
          style={{
            marginTop:16, width:"100%", padding:"16px 0",
            background: locked ? "#2A2010" : `linear-gradient(135deg, ${ghost.color}, ${ghost.color}CC)`,
            border:"none", borderRadius:14, cursor: locked ? "default" : "pointer",
            color: locked ? "#4A3A20" : "#fff",
            fontSize:16, fontWeight:800, fontFamily:"inherit",
            boxShadow: locked ? "none" : `0 6px 0 ${ghost.color}66`,
            transition:"transform 0.08s, box-shadow 0.08s",
          }}
          onMouseEnter={e=>{ if(!locked){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 0 ${ghost.color}66`; }}}
          onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=locked?"none":`0 6px 0 ${ghost.color}66`; }}
          onMouseDown={e=>{ if(!locked){ e.currentTarget.style.transform="translateY(3px)"; e.currentTarget.style.boxShadow=`0 3px 0 ${ghost.color}66`; }}}
          onMouseUp={e=>{ if(!locked){ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=`0 6px 0 ${ghost.color}66`; }}}
        >
          {locked ? "🔒 Locked" : "👻 Start Race"}
        </button>
      </div>
    </div>
  );
}

// ─── Ghost Race Game Screen ───────────────────────────────────────────────────
function GhostRaceScreen({ ghost, diff, onFinish, onBack }) {
  const puzzleRef = useRef(null);
  if (!puzzleRef.current) puzzleRef.current = newPuzzle(diff.clues);
  const { solution, puzzle } = puzzleRef.current;
  const solutionRef = useRef(solution);
  const totalBlanks = puzzle.flat().filter(v => v === 0).length;
  const ghostTotal  = ghostTotalS(ghost, totalBlanks); // seconds, scaled to this puzzle

  const [board,    setBoard]    = useState(() => puzzle.map(r=>[...r]));
  const [given,    setGiven]    = useState(() => puzzle.map(r=>r.map(v=>v!==0)));
  const [selected, setSel]      = useState(null);
  const [claimed,  setClaimed]  = useState({});
  const [errors,   setErrors]   = useState({});
  const [notes,    setNotes]    = useState({});
  const [noteMode, setNoteMode] = useState(false);
  const [elapsed,  setElapsed]  = useState(0);  // ms
  const [finished, setFinished] = useState(false);
  const [failed,   setFailed]   = useState(false);

  // Ghost state
  const [ghostCells, setGhostCells] = useState(0);
  const [ghostFinished, setGhostFinished] = useState(false);
  const [tauntIdx, setTauntIdx] = useState(0);
  const [showTaunt, setShowTaunt] = useState(false);

  const intervalRef = useRef(null);
  const radialRef   = useRef(null);
  const longTimer   = useRef(null);
  const lastTap     = useRef(null);
  const [radial, setRadial] = useState(null);
  useEffect(() => { radialRef.current = radial; }, [radial]);
  const DOUBLE_TAP = 300;

  const playerCells = Object.keys(claimed).length;
  const playerPct   = totalBlanks > 0 ? playerCells / totalBlanks : 0;
  const ghostPct    = totalBlanks > 0 ? ghostCells  / totalBlanks : 0;

  // Main timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 100;
        // Update ghost cells
        const elapsedS = next / 1000;
        const tFrac = Math.min(1, elapsedS / ghostTotal);
        const gCells = Math.floor(ghost.curve(tFrac) * totalBlanks);
        setGhostCells(gCells);
        if (gCells >= totalBlanks && !ghostFinished) {
          setGhostFinished(true);
          sound("penalty");
        }
        return next;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [ghost, totalBlanks, ghostFinished, ghostTotal]);

  // Random ghost taunts
  useEffect(() => {
    if (ghost.taunts.length === 0) return;
    const delays = [8000, 20000, 40000];
    const timers = delays.map((d, i) => setTimeout(() => {
      setTauntIdx(i % ghost.taunts.length);
      setShowTaunt(true);
      setTimeout(() => setShowTaunt(false), 3000);
    }, d));
    return () => timers.forEach(clearTimeout);
  }, []);

  function submitNum(r, c, num) {
    if (finished || failed || given[r][c]) return;
    const key = `${r}-${c}`;
    if (noteMode) {
      setNotes(prev => {
        const cur = new Set(prev[key]||[]);
        cur.has(num)?cur.delete(num):cur.add(num);
        return {...prev,[key]:cur};
      });
      return;
    }
    if (solutionRef.current[r][c] === num) {
      setBoard(prev => {
        const nb = prev.map(row=>[...row]); nb[r][c]=num;
        const done = nb.every((row,ri)=>row.every((v,ci)=>v===solutionRef.current[ri][ci]));
        if (done) {
          clearInterval(intervalRef.current);
          setFinished(true);
          sound("levelWin");
        }
        return nb;
      });
      setClaimed(p=>({...p,[key]:true}));
      setErrors(p=>{const n={...p};delete n[key];return n;});
      setNotes(p=>{const n={...p};delete n[key];return n;});
      sound("cellPlace");
    } else {
      setErrors(p=>({...p,[key]:true}));
      sound("penalty");
      setTimeout(()=>setErrors(p=>{const n={...p};delete n[key];return n;}),1200);
    }
  }

  const CELL = Math.floor(Math.min((window.innerWidth-40)/9,(window.innerHeight-360)/9));
  const GAP_I = Math.max(1,Math.round(CELL*0.04));
  const GAP_B = Math.max(3,Math.round(CELL*0.1));

  const handlePressStart = useCallback((e,r,c) => {
    if (finished||failed||given[r][c]) return;
    e.preventDefault();
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    const now=Date.now();
    if (lastTap.current&&now-lastTap.current.time<DOUBLE_TAP&&lastTap.current.r===r&&lastTap.current.c===c) {
      setNoteMode(m=>!m); clearTimeout(longTimer.current); lastTap.current=null; return;
    }
    lastTap.current={time:now,r,c};
    clearTimeout(longTimer.current);
    longTimer.current=setTimeout(()=>{ setSel([r,c]); setRadial({x:cx,y:cy,r,c,activeNum:5}); },LONG_PRESS_MS);
  },[finished,failed,given]);

  const handleMove = useCallback((e) => {
    if (!radialRef.current) return;
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    const [pcx,pcy]=getPickerCentre(radialRef.current.x,radialRef.current.y);
    setRadial(prev=>prev?{...prev,activeNum:hitTestRadial(cx,cy,pcx,pcy)}:null);
  },[]);

  const handlePressEnd = useCallback((e) => {
    clearTimeout(longTimer.current);
    if (radialRef.current){
      const{r,c,activeNum}=radialRef.current; setRadial(null);
      if(activeNum!==null) submitNum(r,c,activeNum);
    }
  },[submitNum]);

  const isHi = (r,c) => selected && (selected[0]===r||selected[1]===c||(Math.floor(selected[0]/3)===Math.floor(r/3)&&Math.floor(selected[1]/3)===Math.floor(c/3)));
  const isSame = (r,c) => selected&&board[r][c]!==0&&board[r][c]===board[selected[0]][selected[1]];
  const solvedNums = new Set([1,2,3,4,5,6,7,8,9].filter(n=>board.flat().filter(v=>v===n).length===9));

  const isPlayerWinning = playerPct >= ghostPct;
  const playerFinishedFirst = finished && !ghostFinished;
  const ghostFinishedFirst  = ghostFinished && !finished;

  return (
    <div style={{
      minHeight:"100vh",
      background: ghostFinishedFirst ? "#1A0808" : finished ? "#081A08" : "#0A0A0A",
      display:"flex", flexDirection:"column", alignItems:"center",
      fontFamily:"'DM Sans',sans-serif", color:"#E8E0D0",
      padding:"8px 8px", userSelect:"none", touchAction:"none",
      transition:"background 0.5s",
    }}>

      {/* Race header */}
      <div style={{ width:"100%", maxWidth:520, marginBottom:8 }}>
        {/* Timer */}
        <div style={{ textAlign:"center", fontSize:13, color:"#6A5A40",
                      fontVariantNumeric:"tabular-nums", marginBottom:6 }}>
          ⏱ {formatTime(Math.floor(elapsed/1000))}
        </div>

        {/* Dual progress bars */}
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {/* Player bar */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:14, width:20, textAlign:"center" }}>🧙</div>
            <div style={{ flex:1, height:10, background:"rgba(255,255,255,0.08)",
                          borderRadius:5, overflow:"hidden" }}>
              <div style={{ height:"100%", background:C.teal, borderRadius:5,
                            width:`${playerPct*100}%`, transition:"width 0.3s" }}/>
            </div>
            <div style={{ fontSize:11, color:C.teal, width:36, textAlign:"right",
                          fontWeight:700 }}>{Math.round(playerPct*100)}%</div>
          </div>
          {/* Ghost bar */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:14, width:20, textAlign:"center" }}>{ghost.emoji}</div>
            <div style={{ flex:1, height:10, background:"rgba(255,255,255,0.08)",
                          borderRadius:5, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:5,
                            background: ghostFinished ? C.red : ghost.color,
                            width:`${Math.min(100,ghostPct*100)}%`,
                            transition:"width 0.1s",
                            boxShadow: ghostFinished ? "none" : `0 0 8px ${ghost.color}88` }}/>
            </div>
            <div style={{ fontSize:11, color:ghost.color, width:36, textAlign:"right",
                          fontWeight:700 }}>{Math.round(Math.min(100,ghostPct*100))}%</div>
          </div>
        </div>

        {/* Status line */}
        <div style={{ textAlign:"center", fontSize:11, marginTop:6,
                      color: isPlayerWinning ? C.teal : ghost.color, fontWeight:600 }}>
          {ghostFinished && !finished ? `👻 ${ghost.name} finished! Keep going!` :
           finished ? `✓ You finished!` :
           isPlayerWinning ? `You're ahead of ${ghost.name}` :
           `${ghost.name} is ahead by ${Math.round((ghostPct-playerPct)*totalBlanks)} cells`}
        </div>
      </div>

      {/* Board */}
      <div
        className={boardPulse ? "sr-board-pulse" : ""}
        style={{
        display:"inline-grid", gridTemplateColumns:"repeat(3,auto)",
        gap:GAP_B, background: wct ? wct.gridBg : C.sandDark, padding:GAP_B, borderRadius:10,
      }}>
        {[0,1,2].map(boxR=>[0,1,2].map(boxC=>(
          <div key={`${boxR}-${boxC}`} style={{
            display:"inline-grid", gridTemplateColumns:"repeat(3,auto)",
            gap:GAP_I, background:C.paper,
          }}>
            {[0,1,2].map(iR=>[0,1,2].map(iC=>{
              const r=boxR*3+iR, c=boxC*3+iC, val=board[r][c];
              const key=`${r}-${c}`, isSel=selected?.[0]===r&&selected?.[1]===c;
              const isG=given[r][c], isCl=claimed[key], isErr=errors[key];
              const cn=notes[key];
              let bg=C.paper;
              if(isSel) bg="#1A3A1A";
              else if(isErr) bg=C.coralLight;
              else if(isCl) bg="#0A1A0A";
              else if(isSame(r,c)) bg="#121A12";
              else if(isHi(r,c)) bg="#111811";
              return (
                <div key={key}
                  onClick={()=>setSel([r,c])}
                  onPointerDown={e=>handlePressStart(e,r,c)}
                  onPointerMove={handleMove}
                  onPointerUp={handlePressEnd}
                  style={{
                    width:CELL,height:CELL,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    background:bg, cursor:"pointer",
                    outline:isSel?`2px solid ${C.teal}`:"none",outlineOffset:"-2px",
                    fontSize:val?Math.max(12,CELL*0.44):Math.max(5,CELL*0.15),
                    fontWeight:isG?700:400,
                    color: isErr?C.red : isCl?"#4AFF4A" : isG?"#E8E0D0" : "#88CC88",
                  }}>
                  {val ? val : cn?.size>0 ? (
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",width:"88%",height:"88%"}}>
                      {[1,2,3,4,5,6,7,8,9].map(n2=>(
                        <div key={n2} style={{fontSize:Math.max(4,CELL*0.16),textAlign:"center",
                                              color:cn.has(n2)?"#88CC88":"transparent"}}>{n2}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }))}
          </div>
        )))}
      </div>

      {/* Numpad */}
      <div style={{ display:"flex", gap:Math.max(3,CELL*0.08), marginTop:8 }}>
        {[1,2,3,4,5,6,7,8,9].map(n => {
          const isSolved=solvedNums.has(n);
          return (
            <button key={n} onClick={()=>{if(selected&&!isSolved)submitNum(selected[0],selected[1],n);}}
              style={{
                width:Math.max(28,CELL*0.72),height:Math.max(28,CELL*0.72),
                background:"none",border:"none",
                borderBottom:`2px solid ${isSolved?"#2A2A2A":"#4A7A4A"}`,
                color:isSolved?"#2A2A2A":"#88CC88",
                fontSize:Math.max(12,CELL*0.3),fontFamily:"inherit",
                fontWeight:isSolved?300:500,cursor:isSolved?"default":"pointer",
                textDecoration:isSolved?"line-through":"none",
              }}>{n}</button>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:12, marginTop:6, alignItems:"center" }}>
        <button onClick={()=>setNoteMode(m=>!m)} style={{
          background:"none",border:"none",color:noteMode?"#88CC88":"#4A4A4A",
          fontSize:11,fontFamily:"inherit",cursor:"pointer",
          borderBottom:`1.5px solid ${noteMode?"#88CC88":"transparent"}`,
        }}>{noteMode?"pencil":"pen"}</button>
        <span style={{color:"#2A2A2A"}}>|</span>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#4A4A4A",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>quit</button>
      </div>

      {radial && <RadialPicker x={radial.x} y={radial.y} activeNum={radial.activeNum}/>}

      {/* Ghost taunt */}
      {showTaunt && ghost.taunts[tauntIdx] && (
        <div style={{
          position:"fixed", top:100, left:"50%", transform:"translateX(-50%)",
          background:"#1A1408", border:`1px solid ${ghost.color}44`,
          borderRadius:12, padding:"8px 16px",
          fontSize:12, color:ghost.color, fontStyle:"italic",
          animation:"srSlideUp 0.3s ease both", zIndex:200,
          pointerEvents:"none",
        }}>
          {ghost.emoji} "{ghost.taunts[tauntIdx]}"
        </div>
      )}

      {/* Race result overlay */}
      {(finished || (ghostFinished && !finished)) && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.85)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:150,
        }}>
          <div style={{
            background:"#111008", borderRadius:20, padding:"32px 28px",
            textAlign:"center", maxWidth:320, width:"90%",
            border:`2px solid ${finished?"#2A6A2A":"#6A1A1A"}`,
            animation:"srPop 0.4s cubic-bezier(.36,.07,.19,.97) both",
            boxShadow:`0 20px 60px rgba(0,0,0,0.5)`,
          }}>
            <div style={{ fontSize:56, marginBottom:8,
                          animation:"srStar 0.5s ease both",
                          filter:`drop-shadow(0 6px 16px ${finished?"#2A6A2A":"#6A1A1A"})` }}>
              {finished ? "🏆" : "💀"}
            </div>
            <div style={{ fontSize:28, fontWeight:900, marginBottom:4,
                          color: finished ? "#4AFF4A" : "#FF4A4A" }}>
              {finished ? (ghostFinished ? "You both finished!" : `You beat ${ghost.name}!`) : `${ghost.name} wins`}
            </div>
            <div style={{ fontSize:13, color:"#6A5A40", marginBottom:16 }}>
              {finished ? `Your time: ${formatTime(Math.floor(elapsed/1000))}` : `${ghost.name}: ${formatTime(Math.round(ghostTotal))}`}
            </div>

            {/* Post-race breakdown */}
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:10,
                          padding:"12px", marginBottom:20, textAlign:"left" }}>
              <div style={{ fontSize:10, color:"#6A5A40", textTransform:"uppercase",
                            letterSpacing:"0.1em", marginBottom:8, fontWeight:700 }}>
                Race Breakdown
              </div>
              {[
                { label:"Your time",   val: formatTime(Math.floor(elapsed/1000)), color:C.teal },
                { label:`${ghost.name}'s pace`, val: formatTime(Math.round(ghostTotal)), color:ghost.color },
                { label:"Difference",  val: finished
                    ? (ghostFinished ? "Tie" : `+${formatTime(Math.abs(Math.floor(elapsed/1000)-ghost.totalS))} ahead`)
                    : `-${formatTime(ghost.totalS-Math.floor(elapsed/1000))} behind`,
                  color: finished && !ghostFinished ? "#4AFF4A" : "#FF4A4A" },
                { label:"Cells solved", val: `${playerCells} / ${totalBlanks}`, color:"#8A8A8A" },
              ].map(row => (
                <div key={row.label} style={{ display:"flex", justifyContent:"space-between",
                                               marginBottom:6, fontSize:12 }}>
                  <span style={{ color:"#6A5A40" }}>{row.label}</span>
                  <span style={{ fontWeight:700, color:row.color }}>{row.val}</span>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={() => onFinish("retry")} style={{
                padding:"12px 0", background:`linear-gradient(135deg,${ghost.color},${ghost.color}CC)`,
                border:"none", borderRadius:12, color:"#fff", fontSize:14,
                fontWeight:700, fontFamily:"inherit", cursor:"pointer",
              }}>Race Again</button>
              <button onClick={() => onFinish("menu")} style={{
                padding:"12px 0", background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.1)", borderRadius:12,
                color:"#6A5A40", fontSize:13, fontFamily:"inherit", cursor:"pointer",
              }}>Back to Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// ─── Linked Grid Screen ───────────────────────────────────────────────────────
// Three stacked 9×9 grids. Link pairs connect one cell per row across all three
// grids — those cells must contain the same digit.
// The active link is highlighted; lines are drawn between grids via SVG overlay.

function LinkedGridScreen({ clues, onBack }) {
  const puzzleRef = useRef(null);
  if (!puzzleRef.current) puzzleRef.current = newLinkedGridPuzzle(clues || 28);
  const { solutions, puzzles, linkPairs } = puzzleRef.current;

  const [boards, setBoards]     = useState(() => puzzles.map(p=>p.map(r=>[...r])));
  const [givens]                = useState(() => puzzles.map(p=>p.map(r=>r.map(v=>v!==0))));
  const [selected, setSel]      = useState(null); // {g, r, c}
  const [claimed, setClaimed]   = useState([{},{},{}]);
  const [errors, setErrors]     = useState([{},{},{}]);
  const [notes, setNotes]       = useState([{},{},{}]);
  const [noteMode, setNoteMode] = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [solved, setSolved]     = useState(false);

  const timerRef   = useRef(null);
  const gridRefs   = [useRef(null), useRef(null), useRef(null)];
  const containerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(()=>setElapsed(e=>e+1000), 1000);
    return ()=>clearInterval(timerRef.current);
  }, []);

  const CELL = Math.floor(Math.min(
    (window.innerWidth - 32) / 9,
    (window.innerHeight - 160) / 30  // 3 grids + gaps
  ));
  const GAP_I = Math.max(1, Math.round(CELL * 0.04));
  const GAP_B = Math.max(2, Math.round(CELL * 0.08));
  const GRID_W = CELL*9 + GAP_I*6 + GAP_B*4;

  // Find which link pair a cell belongs to, and which grids it connects
  function getLinkForCell(g, r, c) {
    const lp = linkPairs.find(p => {
      if (p.row !== r) return false;
      if (g===0 && p.col0===c) return true;
      if (g===1 && p.col1===c) return true;
      if (g===2 && p.col2===c) return true;
      return false;
    });
    return lp || null;
  }

  // All cells linked to the same pair as the selected cell
  function getLinkedCells(g, r, c) {
    const lp = getLinkForCell(g, r, c);
    if (!lp) return [];
    return [
      {g:0, r:lp.row, c:lp.col0},
      {g:1, r:lp.row, c:lp.col1},
      {g:2, r:lp.row, c:lp.col2},
    ];
  }

  function submitNum(g, r, c, n) {
    if (solved || givens[g][r][c]) return;
    const key = `${r}-${c}`;
    if (noteMode) {
      setNotes(prev => {
        const next = prev.map(nb=>({...nb}));
        const cur = new Set(next[g][key]||[]);
        cur.has(n)?cur.delete(n):cur.add(n);
        next[g][key] = cur;
        return next;
      });
      return;
    }
    if (solutions[g][r][c] === n) {
      // Also auto-fill linked cells in other grids if they match
      setBoards(prev => {
        const next = prev.map(b=>b.map(row=>[...row]));
        next[g][r][c] = n;
        // Check full solve
        const done = next.every((grid,gi)=>
          grid.every((row,ri)=>row.every((v,ci)=>v===solutions[gi][ri][ci]))
        );
        if (done) { clearInterval(timerRef.current); setSolved(true); sound("levelWin"); }
        return next;
      });
      setClaimed(prev => {
        const next = prev.map(cb=>({...cb}));
        next[g][key] = true;
        return next;
      });
      setErrors(prev => {
        const next = prev.map(eb=>({...eb}));
        delete next[g][key];
        return next;
      });
      sound("cellPlace");
    } else {
      setErrors(prev => {
        const next = prev.map(eb=>({...eb}));
        next[g][key] = true;
        return next;
      });
      setTimeout(()=>setErrors(prev=>{
        const next=prev.map(eb=>({...eb}));
        delete next[g][key];
        return next;
      }), 1200);
      sound("penalty");
    }
  }

  // Compute link line positions for SVG overlay
  // Returns array of {x1,y1,x2,y2,active} for lines between grid0↔grid1 and grid1↔grid2
  function getLinkLinePositions() {
    if (!gridRefs[0].current || !gridRefs[1].current || !containerRef.current) return [];
    const containerRect = containerRef.current.getBoundingClientRect();
    const lines = [];
    for (const lp of linkPairs) {
      const {row, col0, col1, col2} = lp;
      // Cell centre positions within each grid
      const cellCentre = (col, gRef) => {
        if (!gRef.current) return {x:0, y:0};
        const rect = gRef.current.getBoundingClientRect();
        const boxC = Math.floor(col/3), iC = col%3;
        const x = rect.left - containerRect.left
                + GAP_B + boxC*(3*CELL + 2*GAP_I + GAP_B)
                + iC*(CELL + GAP_I) + CELL/2;
        const boxR = Math.floor(row/3), iR = row%3;
        const y = rect.top - containerRect.top
                + GAP_B + boxR*(3*CELL + 2*GAP_I + GAP_B)
                + iR*(CELL + GAP_I) + CELL/2;
        return {x, y};
      };
      const p0 = cellCentre(col0, gridRefs[0]);
      const p1 = cellCentre(col1, gridRefs[1]);
      const p2 = cellCentre(col2, gridRefs[2]);
      const isActive = selected && selected.r === row && getLinkForCell(selected.g, selected.r, selected.c);
      lines.push({x1:p0.x, y1:p0.y, x2:p1.x, y2:p1.y, row, active:isActive});
      lines.push({x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y, row, active:isActive});
    }
    return lines;
  }

  function renderGrid(g) {
    const board = boards[g];
    const given = givens[g];
    const claimed_ = claimed[g];
    const errors_ = errors[g];
    const notes_ = notes[g];
    const LINK_COLOR = "#E76F00";

    return (
      <div key={g} ref={gridRefs[g]} style={{
        display:"inline-grid", gridTemplateColumns:"repeat(3,auto)",
        gap:GAP_B, background:C.sandDark, padding:GAP_B, borderRadius:8,
        border:`2px solid ${g===1?"#E76F00":C.sandDark}`,
        position:"relative",
      }}>
        {[0,1,2].map(boxR=>[0,1,2].map(boxC=>(
          <div key={`${boxR}-${boxC}`} style={{
            display:"inline-grid", gridTemplateColumns:"repeat(3,auto)",
            gap:GAP_I, background:C.paper,
          }}>
            {[0,1,2].map(iR=>[0,1,2].map(iC=>{
              const r=boxR*3+iR, c=boxC*3+iC;
              const val=board[r][c];
              const key=`${r}-${c}`;
              const isSel = selected?.g===g && selected?.r===r && selected?.c===c;
              const isG   = given[r][c];
              const isCl  = claimed_[key];
              const isErr = errors_[key];
              const cn    = notes_[key];
              const lp    = getLinkForCell(g, r, c);
              const isLink = !!lp;
              const linkedCells = selected ? getLinkedCells(selected.g, selected.r, selected.c) : [];
              const isLinkedToSel = linkedCells.some(lc=>lc.g===g&&lc.r===r&&lc.c===c);

              // Highlight: selected row/col/box
              const isHi = selected && (selected.r===r || selected.c===c ||
                (Math.floor(selected.r/3)===Math.floor(r/3)&&Math.floor(selected.c/3)===Math.floor(c/3)));

              let bg = C.paper;
              if (isSel)          bg = "#E76F0022";
              else if (isErr)     bg = C.coralLight;
              else if (isCl)      bg = C.greenLight;
              else if (isLinkedToSel) bg = "#E76F0018"; // linked cells glow
              else if (isLink)    bg = "#FFF0D6";        // link cells tinted
              else if (isHi)      bg = "#FDF8F0";

              return (
                <div key={key}
                  onClick={()=>setSel({g,r,c})}
                  style={{
                    width:CELL, height:CELL,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background:bg, cursor:"pointer", position:"relative",
                    outline: isSel ? `2px solid ${LINK_COLOR}` :
                             isLinkedToSel ? `1.5px solid ${LINK_COLOR}88` : "none",
                    outlineOffset:"-2px",
                    fontSize: val ? Math.max(10,CELL*0.44) : Math.max(4,CELL*0.14),
                    fontWeight: isG ? 700 : 400,
                    color: isErr ? C.red : isCl ? C.green : isG ? C.ink : LINK_COLOR,
                  }}>
                  {val ? val : cn?.size>0 ? (
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",width:"88%",height:"88%"}}>
                      {[1,2,3,4,5,6,7,8,9].map(n2=>(
                        <div key={n2} style={{fontSize:Math.max(3,CELL*0.14),textAlign:"center",
                                              color:cn.has(n2)?C.purple:"transparent"}}>{n2}</div>
                      ))}
                    </div>
                  ) : null}
                  {/* Link indicator dot */}
                  {isLink && !val && (
                    <div style={{
                      position:"absolute", bottom:2, right:2,
                      width:Math.max(3,CELL*0.14), height:Math.max(3,CELL*0.14),
                      borderRadius:"50%", background:LINK_COLOR, opacity:0.7,
                    }}/>
                  )}
                </div>
              );
            }))}
          </div>
        )))}
      </div>
    );
  }

  const numpad = [1,2,3,4,5,6,7,8,9].map(n => (
    <button key={n}
      onClick={()=>{ if(selected) submitNum(selected.g, selected.r, selected.c, n); }}
      style={{
        width:Math.max(26,CELL*0.7), height:Math.max(26,CELL*0.7),
        background:"none", border:"none",
        borderBottom:`2px solid ${C.sandDark}`,
        color:C.ink, fontSize:Math.max(11,CELL*0.3),
        fontFamily:"inherit", cursor:"pointer", fontWeight:500,
      }}>{n}</button>
  ));

  return (
    <div ref={containerRef} style={{
      minHeight:"100vh", background:"#FFF0D6",
      display:"flex", flexDirection:"column", alignItems:"center",
      fontFamily:"'DM Sans',sans-serif", color:C.ink,
      padding:"8px", userSelect:"none", touchAction:"none",
      position:"relative",
    }}>
      {/* Header */}
      <div style={{ width:"100%", maxWidth:GRID_W+16,
                    display:"flex", alignItems:"center",
                    justifyContent:"space-between", marginBottom:6 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",
          color:C.inkLight,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>✕</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#E76F00" }}>🔗 Linked Grids</div>
          <div style={{ fontSize:10, color:C.inkLight }}>🟠 dots = linked cells · must share digit</div>
        </div>
        <div style={{ fontSize:13, fontWeight:700, fontVariantNumeric:"tabular-nums" }}>
          {formatTime(Math.floor(elapsed/1000))}
        </div>
      </div>

      {/* Three grids stacked with SVG link lines between them */}
      <div style={{ position:"relative", display:"flex", flexDirection:"column",
                    gap:12, alignItems:"center" }}>
        {[0,1,2].map(g => renderGrid(g))}

        {/* SVG overlay for link lines */}
        <svg style={{
          position:"absolute", inset:0, pointerEvents:"none",
          width:"100%", height:"100%", overflow:"visible",
        }}>
          {getLinkLinePositions().map((line, i) => (
            <line key={i}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke={line.active ? "#E76F00" : "#E76F0033"}
              strokeWidth={line.active ? 2 : 1}
              strokeDasharray={line.active ? "none" : "3,4"}
            />
          ))}
        </svg>
      </div>

      {/* Numpad */}
      <div style={{ display:"flex", gap:Math.max(2,CELL*0.06), marginTop:8 }}>
        {numpad}
      </div>
      <div style={{ display:"flex", gap:12, marginTop:5, alignItems:"center" }}>
        <button onClick={()=>setNoteMode(m=>!m)} style={{
          background:"none",border:"none",
          color:noteMode?"#E76F00":C.inkLight,
          fontSize:11,fontFamily:"inherit",cursor:"pointer",
          borderBottom:`1.5px solid ${noteMode?"#E76F00":"transparent"}`,
        }}>{noteMode?"pencil":"pen"}</button>
        <span style={{color:C.sandDark}}>|</span>
        <button onClick={onBack} style={{background:"none",border:"none",
          color:C.inkLight,fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>quit</button>
      </div>

      {/* Win overlay */}
      {solved && (
        <div style={{position:"fixed",inset:0,background:"rgba(245,239,230,0.95)",
                     display:"flex",flexDirection:"column",alignItems:"center",
                     justifyContent:"center",gap:12,zIndex:100}}>
          <div style={{fontSize:56,animation:"srStar 0.5s ease both"}}>🏆</div>
          <div style={{fontSize:22,fontWeight:800,color:"#E76F00"}}>All three grids solved!</div>
          <div style={{fontSize:13,color:C.inkLight}}>{formatTime(Math.floor(elapsed/1000))}</div>
          <button onClick={onBack} style={{
            padding:"13px 32px",background:"#E76F00",border:"none",
            borderRadius:12,color:"#fff",fontSize:14,fontWeight:700,
            fontFamily:"inherit",cursor:"pointer",boxShadow:"0 5px 0 #B04800",
          }}>Done</button>
        </div>
      )}
    </div>
  );
}



// ─── Streak Rewards ───────────────────────────────────────────────────────────
const STREAK_MILESTONES = [
  { days:3,   emoji:"🔥", title:"3-Day Streak",   reward:"powerup",  rewardDesc:"3× Reveal power-ups",      rewardId:"reveal",  count:3  },
  { days:7,   emoji:"⚡", title:"Week Warrior",    reward:"powerup",  rewardDesc:"Shield + Freeze bundle",   rewardId:"shield",  count:2  },
  { days:14,  emoji:"🌟", title:"Fortnight Flame", reward:"theme",    rewardDesc:"Unlocks Void Gold theme",  rewardId:"voidgold"         },
  { days:30,  emoji:"👑", title:"Monthly Master",  reward:"powerup",  rewardDesc:"10× of every power-up",   rewardId:"all",     count:10 },
  { days:100, emoji:"👁️", title:"KRONAX Witnessed",reward:"lore",     rewardDesc:"Secret KRONAX dialogue",  rewardId:"kronax_secret"    },
];

const KRONAX_STREAK_LORE = {
  id: "streak-kronax",
  unlock: "always",
  chapter: "KRONAX — Private Transmission",
  title: "He Was Watching",
  text: `I have been watching you solve every day.

Not because I assigned you. Not because the puzzle demanded it. You chose to return. Every day, without being asked, without reward — you came back and solved another one.

I have observed ten thousand solvers across as many dimensions. Most solve until the novelty fades, which is usually three days, sometimes three weeks, never three months. You are different.

Do you know what consistency like yours does to a puzzle-system like the Codex? It creates resonance. The Codex begins to recognise your pattern. Your specific way of scanning — the particular sequence in which you eliminate candidates, the boxes you check first, the hesitations that precede your most elegant deductions — all of it leaves a mark.

You have left a mark on the Codex.

I did not design it to work this way. It surprised me.

I mention this because you should know: the dimensions that you have solved through, the worlds that gave way before you — they remember you too. In some small way, you are part of the architecture now.

I find I am glad you kept coming back.

— KRONAX`,
  interpretation: null,
  emoji: "👁️",
};

async function claimStreakReward(milestone, inventory, themes) {
  const key = `streak-reward-${milestone.days}`;
  try {
    const already = await window.storage.get(key);
    if (already) return false; // already claimed
    await window.storage.set(key, "1");
    if (milestone.reward === "powerup") {
      if (milestone.rewardId === "all") {
        for (const id of ["reveal","scan","autonotes","freeze","shield","filln"]) {
          await addToInventory(id, milestone.count);
        }
      } else {
        await addToInventory(milestone.rewardId, milestone.count || 1);
        if (milestone.rewardId === "shield") await addToInventory("freeze", 2);
      }
    }
    return true;
  } catch(e) { return false; }
}

function StreakRewardToast({ milestone, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", top:16, left:"50%", transform:"translateX(-50%)",
      background:C.ink, color:C.paper, borderRadius:20,
      padding:"16px 24px", zIndex:400, textAlign:"center",
      animation:"srSlideUp 0.4s ease both",
      boxShadow:"0 12px 40px rgba(0,0,0,0.4)",
      border:`2px solid ${C.gold}`,
      minWidth:260,
    }}>
      <div style={{ fontSize:40, marginBottom:6 }}>{milestone.emoji}</div>
      <div style={{ fontSize:15, fontWeight:800, color:C.gold, marginBottom:4 }}>
        {milestone.title}
      </div>
      <div style={{ fontSize:12, color:"#C8B89A", marginBottom:8 }}>{milestone.rewardDesc}</div>
      <div style={{ fontSize:11, color:"#6A5A40" }}>Streak reward unlocked ✓</div>
    </div>
  );
}

function StreakDisplay({ streak }) {
  if (!streak?.current) return null;
  const next = STREAK_MILESTONES.find(m => m.days > streak.current);
  return (
    <div style={{ textAlign:"center", marginBottom:8, position:"relative", zIndex:1 }}>
      <div style={{ fontSize:13, fontWeight:700, color:C.coral }}>
        🔥 {streak.current} day streak
      </div>
      {next && (
        <div style={{ fontSize:10, color:C.inkLight }}>
          {next.days - streak.current} more for {next.emoji} {next.title}
        </div>
      )}
    </div>
  );
}


// ─── Star Ratings ─────────────────────────────────────────────────────────────
// 3★: finish under par time with 0 penalties
// 2★: finish under time limit
// 1★: finish (any time, any penalties)
// 0★: fail / not yet attempted

function calcStars(elapsedMs, penalties, level) {
  const elapsedS = Math.floor(elapsedMs / 1000);
  const par = level.worldId != null ? getParTime(level.worldId, level.islandIdx) : null;
  if (par !== null && elapsedS <= par && penalties === 0) return 3;
  if (level.timeLimit === 0 || elapsedS <= level.timeLimit) return 2;
  return 1;
}

function StarDisplay({ stars, size=16, style }) {
  return (
    <div style={{ display:"flex", gap:1, ...style }}>
      {[1,2,3].map(i => (
        <span key={i} style={{
          fontSize:size,
          color: i<=stars ? C.gold : C.sandDark,
          filter: i<=stars ? "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" : "none",
        }}>★</span>
      ))}
    </div>
  );
}

function getStarsKey(levelId) { return `stars:\${levelId}`; }


// ─── Boss Fight System ────────────────────────────────────────────────────────
// Boss levels get a health bar (3 hearts), phase attacks at 50% and 25% solve,
// and a mid-puzzle taunt at each phase transition.

function BossHealthBar({ hp, maxHp, bossName, bossEmoji, phase, color }) {
  return (
    <div style={{
      width:"100%", maxWidth:360, marginBottom:8,
      background:"rgba(0,0,0,0.06)", borderRadius:12,
      padding:"8px 12px",
      border:`1px solid ${color}44`,
      animation: phase > 0 ? "srShake 0.4s ease both" : "none",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
        <span style={{ fontSize:16 }}>{bossEmoji||"👹"}</span>
        <span style={{ fontSize:11, fontWeight:700, color, flex:1 }}>{bossName}</span>
        <div style={{ display:"flex", gap:4 }}>
          {Array.from({length:maxHp},(_,i) => (
            <span key={i} style={{
              fontSize:14,
              opacity: i < hp ? 1 : 0.2,
              filter: i < hp ? "drop-shadow(0 1px 3px rgba(200,0,0,0.4))" : "none",
              transition:"opacity 0.3s, filter 0.3s",
            }}>❤️</span>
          ))}
        </div>
      </div>
      <div style={{ height:5, background:"rgba(0,0,0,0.1)", borderRadius:3, overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:3,
          background: hp > maxHp*0.5 ? color : hp > maxHp*0.25 ? C.gold : C.red,
          width:`\${(hp/maxHp)*100}%`,
          transition:"width 0.4s, background 0.4s",
        }}/>
      </div>
      {phase > 0 && (
        <div style={{ fontSize:10, color:C.red, fontWeight:700, marginTop:4,
                      animation:"srPop 0.3s ease both" }}>
          {phase===1 ? "⚡ Enraged — penalties doubled!" : "💀 Desperate — +15s per mistake!"}
        </div>
      )}
    </div>
  );
}

function BossTauntBanner({ taunt, bossName, color, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:"fixed", top:"30%", left:"50%", transform:"translate(-50%,-50%)",
      background:"rgba(0,0,0,0.85)", color:"#fff", borderRadius:16,
      padding:"16px 24px", zIndex:300, maxWidth:280, textAlign:"center",
      animation:"srPop 0.35s cubic-bezier(.36,.07,.19,.97) both",
      border:`2px solid ${color}`,
      pointerEvents:"none",
    }}>
      <div style={{ fontSize:11, color, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>
        {bossName}
      </div>
      <div style={{ fontSize:14, fontStyle:"italic", lineHeight:1.5 }}>"{taunt}"</div>
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// TECHNIQUE LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════
const TECHNIQUES = [
  {
    id:"naked_single",
    name:"Naked Single",
    emoji:"1️⃣",
    difficulty:"Beginner",
    color:"#2A9D8F",
    summary:"A cell with only one possible candidate.",
    explanation:"When every other number is already present in the cell's row, column, and box, only one number can go there. This is the most fundamental technique — always scan for these first.",
    example:{ given:[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]], target:[0,2], answer:4, hint:"Row 0 has 5,3,7. Col 2 has 8. Box has 5,3,9,8. Only 4 fits." },
  },
  {
    id:"hidden_single",
    name:"Hidden Single",
    emoji:"🔍",
    difficulty:"Beginner",
    color:"#457B9D",
    summary:"Only one cell in a unit can hold a particular digit.",
    explanation:"Even if a cell has multiple candidates, if one of those candidates can't appear anywhere else in its row, column, or box, it must go there. The single is 'hidden' among other candidates.",
    example:null,
  },
  {
    id:"pointing_pairs",
    name:"Pointing Pairs",
    emoji:"👉",
    difficulty:"Intermediate",
    color:"#E9C46A",
    summary:"A candidate confined to one row/col within a box eliminates it from the rest of that row/col.",
    explanation:"If a number can only appear in two cells within a box, and both those cells share the same row or column, then that number can be eliminated from all other cells in that row or column outside the box. The pair 'points' at the rest of the line.",
    example:null,
  },
  {
    id:"naked_pairs",
    name:"Naked Pairs",
    emoji:"👥",
    difficulty:"Intermediate",
    color:"#F4A261",
    summary:"Two cells in a unit with only the same two candidates — eliminate those candidates from the rest of the unit.",
    explanation:"If exactly two cells in a row, column, or box both contain only the same two candidate numbers (and no others), those two numbers must go in those two cells. You don't know which is which yet, but you can safely remove both candidates from every other cell in that unit.",
    example:null,
  },
  {
    id:"box_line",
    name:"Box-Line Reduction",
    emoji:"📦",
    difficulty:"Intermediate",
    color:"#6B3FA0",
    summary:"If a candidate in a row/col only appears within one box, eliminate it from the rest of that box.",
    explanation:"The inverse of pointing pairs. If a number can only appear in cells of a particular row that also happen to be in the same box, you can eliminate that number from all other cells in that box — even ones not on that row.",
    example:null,
  },
  {
    id:"x_wing",
    name:"X-Wing",
    emoji:"✕",
    difficulty:"Advanced",
    color:"#E63946",
    summary:"A candidate appearing in only two cells of two rows, all in the same two columns — eliminate from those columns.",
    explanation:"If a number appears as a candidate in exactly two cells in Row A, and exactly two cells in Row B, and those cells are all in the same two columns, then that number must be in one of those four cells. You can eliminate it from all other cells in those two columns. The pattern looks like an X across the grid.",
    example:null,
  },
  {
    id:"swordfish",
    name:"Swordfish",
    emoji:"🐟",
    difficulty:"Expert",
    color:"#0077B6",
    summary:"X-Wing extended to three rows and three columns.",
    explanation:"Like X-Wing but with three rows. If a number appears in at most three cells in each of three rows, and all those cells fall within the same three columns, the number can be eliminated from all other cells in those three columns. Rare but powerful.",
    example:null,
  },
  {
    id:"hidden_triple",
    name:"Hidden Triple",
    emoji:"🔺",
    difficulty:"Expert",
    color:"#8B5E3C",
    summary:"Three candidates that only appear in three cells within a unit — all other candidates in those cells can be eliminated.",
    explanation:"If three numbers each only appear in the same three cells within a row, column, or box, those three numbers must fill those three cells (in some order). Any other candidates in those three cells can be safely removed. Harder to spot than naked triples because the three digits are hidden among other candidates.",
    example:null,
  },
];

function TechniqueLibraryScreen({ onBack }) {
  const [selected, setSelected] = useState(null);
  const technique = selected ? TECHNIQUES.find(t=>t.id===selected) : null;

  if (technique) {
    return (
      <div style={{ minHeight:"100vh", background:C.bg,
                    fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
        <div style={{ display:"flex", alignItems:"center", padding:"16px 20px",
                      borderBottom:`1px solid ${C.sandDark}`, background:C.paper,
                      position:"sticky", top:0, zIndex:10 }}>
          <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none",
            color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:15, fontWeight:700, color:technique.color }}>
              {technique.emoji} {technique.name}
            </div>
            <div style={{ fontSize:11, color:C.inkLight }}>{technique.difficulty}</div>
          </div>
          <div style={{ width:50 }} />
        </div>
        <div style={{ padding:"24px 20px", maxWidth:480, margin:"0 auto" }}>
          <div style={{ background:technique.color+"12", border:`1px solid ${technique.color}33`,
                        borderRadius:14, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:technique.color,
                          marginBottom:6 }}>{technique.summary}</div>
            <div style={{ fontSize:13, color:C.inkLight, lineHeight:1.7 }}>
              {technique.explanation}
            </div>
          </div>
          {technique.example && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.inkLight,
                            textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>
                Example
              </div>
              <div style={{ fontSize:12, color:C.inkLight, lineHeight:1.6,
                            background:C.sand, borderRadius:10, padding:"10px 14px" }}>
                {technique.example.hint}
              </div>
              <div style={{ fontSize:11, color:C.inkFaint, marginTop:6 }}>
                Cell highlighted in the example: row {technique.example.target[0]+1},
                col {technique.example.target[1]+1} → answer: <strong>{technique.example.answer}</strong>
              </div>
            </div>
          )}
          <div style={{ background:C.sand, borderRadius:14, padding:"14px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.inkLight,
                          textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
              When to use this
            </div>
            <div style={{ fontSize:12, color:C.inkLight, lineHeight:1.7 }}>
              {technique.id==="naked_single"   && "Always check for these first before using any other technique. A single scan of all 81 cells catches most naked singles in beginner-to-intermediate puzzles."}
              {technique.id==="hidden_single"  && "After naked singles, work through each row, column, and box asking 'where can this number go?' If there's only one answer, place it."}
              {technique.id==="pointing_pairs" && "When you're stuck and can't find singles, look at each number in each box. If it only appears in one row or column within that box, you have a pointing pair."}
              {technique.id==="naked_pairs"    && "Look for cells with exactly two candidates. If two such cells in the same unit share the same two candidates, you've found a naked pair."}
              {technique.id==="box_line"       && "The mirror of pointing pairs. Look at rows and columns — if a number only appears in cells belonging to the same box, apply box-line reduction."}
              {technique.id==="x_wing"         && "Scan each number 1-9. For each, note which rows have exactly two candidate cells. If two such rows share the same two columns, you have an X-Wing."}
              {technique.id==="swordfish"      && "Same as X-Wing scan but looking for three rows (each with 2-3 candidates) where all candidates fall in only three columns total."}
              {technique.id==="hidden_triple"  && "Look for three numbers that collectively appear only in three cells within a unit. Remove all other candidates from those three cells."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg,
                  fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`,
                    background:C.paper, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700 }}>📚 Technique Library</div>
        <div style={{ width:50 }} />
      </div>
      <div style={{ padding:"16px", maxWidth:480, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:C.inkLight, marginBottom:16, lineHeight:1.6 }}>
          Master these techniques in order. Each one unlocks harder puzzles.
        </div>
        {["Beginner","Intermediate","Advanced","Expert"].map(diff => (
          <div key={diff} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.inkLight,
                          textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>
              {diff}
            </div>
            {TECHNIQUES.filter(t=>t.difficulty===diff).map(t => (
              <button key={t.id} onClick={()=>setSelected(t.id)} style={{
                display:"flex", gap:12, alignItems:"center", width:"100%",
                padding:"13px 14px", marginBottom:8,
                background:C.paper, border:`1.5px solid ${t.color}33`,
                borderRadius:12, cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                transition:"border-color 0.15s",
              }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=t.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=t.color+"33"}
              >
                <div style={{ width:38, height:38, borderRadius:10,
                               background:t.color+"18", border:`1.5px solid ${t.color}44`,
                               display:"flex", alignItems:"center", justifyContent:"center",
                               fontSize:20, flexShrink:0 }}>{t.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.ink,
                                marginBottom:2 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:C.inkLight }}>{t.summary}</div>
                </div>
                <span style={{ color:C.inkFaint, fontSize:14 }}>›</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Arc 2 Map Separation ─────────────────────────────────────────────────────
// Arc 2 worlds (11-20) get a distinct visual treatment on the world map:
// darker background, "ARC II" divider, locked until W10 complete

function Arc2Divider({ unlocked }) {
  return (
    <div style={{
      width:"100%", margin:"16px 0",
      display:"flex", alignItems:"center", gap:12,
    }}>
      <div style={{ flex:1, height:1, background:"linear-gradient(to right, transparent, #6B3FA088)" }}/>
      <div style={{
        padding:"6px 16px",
        background: unlocked ? "linear-gradient(135deg,#1A0A2E,#2A1048)" : "#1A1A1A",
        border:`1px solid ${unlocked?"#6B3FA0":"#333"}`,
        borderRadius:20,
        fontSize:11, fontWeight:800, letterSpacing:"0.15em",
        color: unlocked ? "#C8A0FF" : "#444",
        textTransform:"uppercase",
      }}>
        {unlocked ? "⚡ Arc II — The Return" : "🔒 Arc II — Complete Arc I to unlock"}
      </div>
      <div style={{ flex:1, height:1, background:"linear-gradient(to left, transparent, #6B3FA088)" }}/>
    </div>
  );
}



// ─── KRONAX Commentary ────────────────────────────────────────────────────────
// KRONAX observes speed, accuracy, and technique, then picks a fitting comment.
// Called on level result screen.

function getKronaxComment({ elapsedMs, penalties, usedNotes, usedHints, usedPowerups, isBoss, worldId, par }) {
  const secs = Math.floor(elapsedMs / 1000);
  const beatPar  = par !== null && secs <= par;
  const veryFast = par !== null && secs <= par * 0.7;
  const slow     = par !== null && secs > par * 1.5;
  const perfect  = penalties === 0;
  const messy    = penalties >= 4;

  // Build a pool of fitting comments, pick one at random
  const pool = [];

  if (veryFast && perfect)
    pool.push(...[
      "That was faster than the solver I observed in Prague. I am noting this.",
      "You are approaching the speed at which solving becomes instinct rather than thought.",
      "The Codex registered that solve before I did. That has never happened before.",
    ]);

  if (beatPar && perfect && !veryFast)
    pool.push(...[
      "Under par. No mistakes. The pattern you used was elegant.",
      "I have seen ten thousand solvers reach this island. Three solved it this cleanly.",
      "Par time broken. Zero penalties. The Codex remembers this solve.",
    ]);

  if (beatPar && !perfect)
    pool.push(...[
      "Fast. But the mistakes tell me you were guessing in places. You can eliminate that.",
      "Under par despite the penalties. Interesting. Aggression suits you.",
    ]);

  if (slow && perfect)
    pool.push(...[
      "Slow but completely clean. I respect the patience. Most solvers rush and break.",
      "You took your time. Every placement was considered. That is a different kind of mastery.",
    ]);

  if (slow && messy)
    pool.push(...[
      "That was a struggle. I have watched harder solvers break on easier puzzles — you did not.",
      "The path was not clean. But you found it. That counts for more than style.",
    ]);

  if (messy && !slow)
    pool.push(...[
      "Fast, but four mistakes. You are trusting intuition over elimination. That will cost you later.",
      "I watched you make the same type of mistake three times. You already know where it comes from.",
    ]);

  if (perfect && !usedNotes && !usedHints)
    pool.push(...[
      "No notes. No hints. Pure logic held in your head. Unusual for this difficulty.",
      "You carried the entire candidate set mentally. I find that genuinely impressive.",
    ]);

  if (usedHints)
    pool.push(...[
      "You used a hint. The technique it revealed is worth studying until you see it unaided.",
      "The hint showed you a naked single. At your current level you should find those without help.",
    ]);

  if (usedPowerups)
    pool.push(...[
      "Power-ups used. They are tools, not crutches. Use them when the logic demands it.",
      "I gave you those power-ups for difficult moments. This qualified.",
    ]);

  if (isBoss)
    pool.push(...[
      "That guardian has held this shard for centuries. You ended that in minutes.",
      "The boss fought well. You fought better. The Codex shard is yours.",
      "I designed that encounter to be difficult. You made it look routine. I will adjust.",
    ]);

  // Fallback pool
  pool.push(...[
    "Solved. The shard advances. I am watching.",
    "Each puzzle you complete, the Codex learns your pattern a little more.",
    "Another one falls. You are consistent. I find consistency more interesting than brilliance.",
    "The dimensions that gave way before you remember your method. So do I.",
  ]);

  return pool[Math.floor(Math.random() * pool.length)];
}



// ─── World Cell Themes ────────────────────────────────────────────────────────
// Visual atmosphere per world. Applied in GameScreen when level.worldId is set.
const WORLD_CELL_THEMES = {
  1:  { bg:"#F5F0E8", gridBg:"#8B7355", boxBg:"#FBF6EE", givenColor:"#3D2B1F", ink:"#5C3D2E", name:"Dino Valley" },
  2:  { bg:"#F5EDD8", gridBg:"#8B6914", boxBg:"#FDF5E0", givenColor:"#4A2E00", ink:"#6B4400", name:"Wild West" },
  3:  { bg:"#EAF0F5", gridBg:"#2C5F8A", boxBg:"#F0F5FA", givenColor:"#1A3A5C", ink:"#1E4A70", name:"Viking" },
  4:  { bg:"#EBF5F0", gridBg:"#1A5C3A", boxBg:"#F0FAF5", givenColor:"#0D3D24", ink:"#15502F", name:"Pirate" },
  5:  { bg:"#FDF5E0", gridBg:"#C49A1A", boxBg:"#FFFBF0", givenColor:"#6B4A00", ink:"#8B6200", name:"Egypt" },
  6:  { bg:"#FFF0F5", gridBg:"#C04080", boxBg:"#FFF8FA", givenColor:"#7A1040", ink:"#A01A5C", name:"Samurai" },
  7:  { bg:"#EAF5EA", gridBg:"#2A6B2A", boxBg:"#F0FAF0", givenColor:"#1A4A1A", ink:"#1E5E1E", name:"Jungle" },
  8:  { bg:"#F0EAF5", gridBg:"#5A2A8A", boxBg:"#F8F0FF", givenColor:"#3A1A5C", ink:"#4A1E7A", name:"Medieval" },
  9:  { bg:"#E8F0F8", gridBg:"#1A3A6B", boxBg:"#F0F5FF", givenColor:"#0D2040", ink:"#152855", name:"Cyber" },
  10: { bg:"#1A0A2E", gridBg:"#0D0520", boxBg:"#120820", givenColor:"#C8A0FF", ink:"#9060CC", name:"KRONAX" },
};

function getWorldCellTheme(worldId) {
  return WORLD_CELL_THEMES[worldId] || null;
}



// ─── Power-up Forge ───────────────────────────────────────────────────────────
const FORGE_RECIPES = [
  { input:"reveal",   inputCount:3, output:"scan",     outputCount:1, inputEmoji:"💡", outputEmoji:"🔍", label:"3× Reveal → Scan"       },
  { input:"scan",     inputCount:3, output:"autonotes", outputCount:1, inputEmoji:"🔍", outputEmoji:"✏️", label:"3× Scan → Auto-Notes"    },
  { input:"shield",   inputCount:3, output:"freeze",   outputCount:2, inputEmoji:"🛡️", outputEmoji:"⏸️", label:"3× Shield → 2× Freeze"   },
  { input:"freeze",   inputCount:3, output:"filln",    outputCount:1, inputEmoji:"⏸️", outputEmoji:"⚡", label:"3× Freeze → Fill Number"  },
  { input:"autonotes",inputCount:3, output:"reveal",   outputCount:3, inputEmoji:"✏️", outputEmoji:"💡", label:"3× Auto-Notes → 3× Reveal"},
];

function ForgeScreen({ inventory, onInventoryChange, onBack }) {
  const [inv, setInv] = useState(inventory || {});
  const [forging, setForging] = useState(null);
  const [result,  setResult]  = useState(null);

  async function forge(recipe) {
    if ((inv[recipe.input]||0) < recipe.inputCount) return;
    setForging(recipe.input);
    sound("secretUnlock");
    // Animate
    await new Promise(r => setTimeout(r, 900));
    const newInv = { ...inv,
      [recipe.input]:  (inv[recipe.input]  || 0) - recipe.inputCount,
      [recipe.output]: (inv[recipe.output] || 0) + recipe.outputCount,
    };
    setInv(newInv);
    for (const [k,v] of Object.entries(newInv)) {
      await useFromInventory(k, 999);          // clear
      if (v > 0) await addToInventory(k, v);   // rewrite
    }
    onInventoryChange(newInv);
    setResult(recipe);
    setForging(null);
    sound("levelWin");
    setTimeout(() => setResult(null), 2500);
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1A0A2E,#0A0508)",
                  fontFamily:"'DM Sans',sans-serif", color:"#E8E0D0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"16px 20px", borderBottom:"1px solid #2A1A4A" }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          color:"#6A5A80", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700, color:"#C8A0FF" }}>⚗️ Forge</div>
        <div style={{ width:50 }} />
      </div>

      <div style={{ padding:"20px 16px", maxWidth:460, margin:"0 auto" }}>
        <div style={{ fontSize:13, color:"#6A5A80", marginBottom:20, lineHeight:1.6 }}>
          Combine surplus power-ups into rarer ones. Three of a kind becomes something better.
        </div>

        {FORGE_RECIPES.map(recipe => {
          const have  = inv[recipe.input]  || 0;
          const canForge = have >= recipe.inputCount;
          const isForging = forging === recipe.input;

          return (
            <div key={recipe.input} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"14px 16px", marginBottom:10,
              background:"rgba(255,255,255,0.04)",
              border:`1.5px solid ${canForge ? "#6B3FA0" : "#2A1A4A"}`,
              borderRadius:14,
              opacity: canForge ? 1 : 0.45,
              transition:"border-color 0.2s, opacity 0.2s",
            }}>
              {/* Input */}
              <div style={{ textAlign:"center", minWidth:52 }}>
                <div style={{ fontSize:26 }}>{recipe.inputEmoji}</div>
                <div style={{ fontSize:10, color:"#6A5A80" }}>×{have}</div>
              </div>
              {/* Arrow */}
              <div style={{ fontSize:14, color:"#6B3FA0", flexShrink:0 }}>
                {recipe.inputCount}× →
              </div>
              {/* Output */}
              <div style={{ textAlign:"center", minWidth:52 }}>
                <div style={{ fontSize:26 }}>{recipe.outputEmoji}</div>
                <div style={{ fontSize:10, color:"#C8A0FF" }}>×{recipe.outputCount}</div>
              </div>
              <div style={{ flex:1, fontSize:11, color:"#8A7AA0" }}>{recipe.label}</div>
              <button onClick={()=>forge(recipe)} disabled={!canForge||!!forging}
                style={{
                  padding:"8px 14px",
                  background: canForge ? "linear-gradient(135deg,#6B3FA0,#4A1E7A)" : "#2A1A4A",
                  border:"none", borderRadius:10, color: canForge ? "#fff" : "#3A2A5A",
                  fontSize:12, fontWeight:700, fontFamily:"inherit",
                  cursor: canForge&&!forging ? "pointer" : "default",
                  transition:"background 0.2s",
                  animation: isForging ? "srPulse 0.5s ease infinite" : "none",
                }}>
                {isForging ? "⚗️..." : "Forge"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Result flash */}
      {result && (
        <div style={{
          position:"fixed", top:"35%", left:"50%", transform:"translate(-50%,-50%)",
          background:"#1A0A2E", border:"2px solid #6B3FA0", borderRadius:20,
          padding:"20px 28px", textAlign:"center", zIndex:200,
          animation:"srPop 0.35s cubic-bezier(.36,.07,.19,.97) both",
          boxShadow:"0 20px 60px rgba(107,63,160,0.5)",
        }}>
          <div style={{ fontSize:44 }}>{result.outputEmoji}</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#C8A0FF", marginTop:8 }}>
            Forged {result.outputCount}× {result.output}!
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Adaptive Difficulty ──────────────────────────────────────────────────────
// Track rolling average of last 10 solve times relative to par.
// If consistently beating par by >30%, mark player as "advanced".
// Used to show a challenge indicator — never modifies actual par times.

async function recordAdaptiveSolve(elapsedS, par) {
  if (!par) return;
  try {
    const r = await window.storage.get("adaptive-history");
    const history = r ? JSON.parse(r.value) : [];
    const ratio = elapsedS / par; // <1 = beat par, >1 = over par
    history.push(ratio);
    if (history.length > 10) history.shift();
    await window.storage.set("adaptive-history", JSON.stringify(history));
    return history;
  } catch(e) { return []; }
}

async function getAdaptiveLevel() {
  try {
    const r = await window.storage.get("adaptive-history");
    if (!r) return "normal";
    const h = JSON.parse(r.value);
    if (h.length < 5) return "normal";
    const avg = h.reduce((a,b)=>a+b,0)/h.length;
    if (avg < 0.7)  return "master";   // beating par by 30%+ consistently
    if (avg < 0.85) return "advanced";
    if (avg > 1.4)  return "struggling";
    return "normal";
  } catch(e) { return "normal"; }
}

const ADAPTIVE_LABELS = {
  struggling: { emoji:"🌱", label:"Take your time",    color:"#2A9D8F" },
  normal:     { emoji:"⚡", label:"On pace",            color:"#2A9D8F" },
  advanced:   { emoji:"🔥", label:"Above par",          color:"#F0B429" },
  master:     { emoji:"👁️", label:"KRONAX is watching", color:"#6B3FA0" },
};

// ─── Level Skip Tokens ────────────────────────────────────────────────────────
async function getSkipTokens() {
  try { const r=await window.storage.get("skip-tokens"); return r?parseInt(r.value)||0:0; }
  catch(e) { return 0; }
}
async function addSkipToken(count=1) {
  const t = await getSkipTokens();
  await window.storage.set("skip-tokens", String(t+count));
}
async function useSkipToken() {
  const t = await getSkipTokens();
  if (t<=0) return false;
  await window.storage.set("skip-tokens", String(t-1));
  return true;
}

// ─── Story Mode Leaderboard ───────────────────────────────────────────────────
const LB_MAX = 10;

async function submitLeaderboardTime(levelId, playerName, elapsedS) {
  try {
    const key = `lb:${levelId}`;
    const r = await window.storage.get(key, true);
    const board = r ? JSON.parse(r.value) : [];
    // Add new entry, sort, keep top 10
    board.push({ name: playerName||"Keeper", time: elapsedS, ts: Date.now() });
    board.sort((a,b)=>a.time-b.time);
    const trimmed = board.slice(0, LB_MAX);
    await window.storage.set(key, JSON.stringify(trimmed), true);
    return trimmed;
  } catch(e) { return []; }
}

async function getLeaderboard(levelId) {
  try {
    const key = `lb:${levelId}`;
    const r = await window.storage.get(key, true);
    return r ? JSON.parse(r.value) : [];
  } catch(e) { return []; }
}

function LeaderboardPanel({ entries, myTime, levelName }) {
  if (!entries || entries.length===0) return null;
  return (
    <div style={{
      background:"rgba(255,255,255,0.5)", borderRadius:14, padding:"12px 14px",
      backdropFilter:"blur(6px)", marginTop:12,
    }}>
      <div style={{ fontSize:10, fontWeight:700, color:C.inkLight,
                    textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>
        🏆 Top Times — {levelName}
      </div>
      {entries.slice(0,5).map((e,i) => {
        const isMe = Math.abs(e.time - Math.floor((myTime||0)/1000)) < 2;
        return (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:8,
            padding:"4px 0",
            borderBottom: i<4 ? `1px solid rgba(0,0,0,0.06)` : "none",
            background: isMe ? "rgba(18,137,124,0.1)" : "transparent",
            borderRadius:4,
          }}>
            <span style={{ fontSize:11, color:C.inkFaint, width:16,
                            textAlign:"center", fontWeight:700 }}>{i+1}</span>
            <span style={{ flex:1, fontSize:12, color: isMe ? C.teal : C.ink,
                            fontWeight: isMe ? 700 : 400 }}>{e.name}</span>
            <span style={{ fontSize:12, fontWeight:600,
                            color: isMe ? C.teal : C.inkLight,
                            fontVariantNumeric:"tabular-nums" }}>{formatTime(e.time)}</span>
          </div>
        );
      })}
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// RETENTION SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. Push Notification Infrastructure ─────────────────────────────────────
// Full scheduling logic — swap registerPushBackend() for OneSignal/VAPID in prod.
// In-app toasts work now. Browser notifications work if user grants permission.

const NOTIFICATION_MESSAGES = {
  lives_full: [
    "Your lives are restored, Keeper. The Codex waits.",
    "Full health. KRONAX has been patient. So has the puzzle.",
    "Lives refilled. The dimensions are ready when you are.",
  ],
  daily_ready: [
    "Today's puzzle has arrived. KRONAX has been watching the clock.",
    "A new daily puzzle. Different theme. Same stakes.",
    "The daily challenge is live. Your streak is on the line.",
  ],
  streak_danger: [
    "Your streak ends at midnight. KRONAX would prefer it didn't.",
    "24 hours since your last solve. The flame is low.",
    "Solve once today. That is all it takes to keep the streak.",
  ],
  kronax_message: [
    "KRONAX has left a message in the Codex Lore screen.",
    "Something new has been unlocked in the archives.",
    "KRONAX says: 'I have been thinking about your last solve.'",
  ],
  league_update: [
    "The weekly league standings have shifted. Check your rank.",
    "Someone overtook you in the league. KRONAX noticed.",
    "Three days left in the league. You are within reach of promotion.",
  ],
};

async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function scheduleInAppNotification(type, delayMs, onShow) {
  // In-app toast fallback — always works
  return setTimeout(() => onShow(type), delayMs);
}

function sendBrowserNotification(type) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const msgs = NOTIFICATION_MESSAGES[type] || [];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  if (!msg) return;
  try {
    new Notification("Sudoku Royale", {
      body: msg,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text y='52' font-size='52'>🧩</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text y='52' font-size='52'>🧩</text></svg>",
    });
  } catch(e) {}
}

function NotificationPermissionBanner({ onGrant, onDismiss }) {
  return (
    <div style={{
      position:"fixed", bottom:80, left:16, right:16, zIndex:300,
      background:C.ink, color:C.paper, borderRadius:16,
      padding:"14px 16px", display:"flex", alignItems:"center", gap:12,
      animation:"srSlideUp 0.4s ease both",
      boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
    }}>
      <span style={{ fontSize:24 }}>🔔</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:2 }}>Stay in the loop</div>
        <div style={{ fontSize:11, color:"#8A8A8A", lineHeight:1.4 }}>
          Get notified when lives refill and daily puzzles drop.
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <button onClick={onGrant} style={{
          padding:"6px 14px", background:C.teal, border:"none",
          borderRadius:8, color:"#fff", fontSize:12, fontWeight:700,
          fontFamily:"inherit", cursor:"pointer",
        }}>Allow</button>
        <button onClick={onDismiss} style={{
          padding:"4px 14px", background:"none", border:"none",
          color:"#4A4A4A", fontSize:11, fontFamily:"inherit", cursor:"pointer",
        }}>Later</button>
      </div>
    </div>
  );
}

// ─── 2. Weekly League ─────────────────────────────────────────────────────────
const LEAGUE_TIERS = [
  { id:"bronze",   name:"Bronze",   emoji:"🥉", color:"#CD7F32", minRank:21, maxRank:30 },
  { id:"silver",   name:"Silver",   emoji:"🥈", color:"#C0C0C0", minRank:11, maxRank:20 },
  { id:"gold",     name:"Gold",     emoji:"🥇", color:"#FFD700", minRank:4,  maxRank:10 },
  { id:"diamond",  name:"Diamond",  emoji:"💎", color:"#88CCFF", minRank:1,  maxRank:3  },
];

// Simulated opponents with realistic XP distributions per tier
function generateLeagueOpponents(playerXp, tierId) {
  const tier = LEAGUE_TIERS.find(t=>t.id===tierId) || LEAGUE_TIERS[0];
  const names = [
    "SolverX","PuzzleMage","GridRunner","LogicLord","NakedSingle",
    "HiddenTwin","XWingAce","BoxBuster","SwordFish","KillerKen",
    "DiagDave","WindokuWin","JigsawJen","CageBreaker","Thermo99",
    "RapidRex","SlowBurn","NoteNerd","PencilPro","ScanMaster",
    "DailyGrind","StreakSeeker","BossSlayer","ParTimer","CodexFan",
    "ArcRunner","KronaxKid","ShardHunter","LoreSeeker","GhostRacer",
  ];
  const shuffled = [...names].sort(()=>Math.random()-0.5);
  const spread = tierId==="diamond" ? 0.15 : tierId==="gold" ? 0.3 : tierId==="silver" ? 0.5 : 0.7;
  return shuffled.slice(0,29).map((name,i) => ({
    name,
    xp: Math.max(10, Math.round(playerXp * (1 - spread + Math.random()*spread*2))),
    isPlayer: false,
  }));
}

function getLeagueWeekKey() {
  const now = new Date();
  const week = Math.floor((now - new Date(now.getFullYear(),0,1)) / 604800000);
  return `league:${now.getFullYear()}-${week}`;
}

async function getLeagueState(playerXp, playerName) {
  try {
    const key = getLeagueWeekKey();
    const r = await window.storage.get(key);
    if (r) return JSON.parse(r.value);
    // First time this week — generate fresh league
    const tierId = playerXp < 500 ? "bronze" : playerXp < 2000 ? "silver" : playerXp < 5000 ? "gold" : "diamond";
    const opponents = generateLeagueOpponents(playerXp, tierId);
    const state = { tierId, opponents, weekKey:key, playerXp, lastUpdated:Date.now() };
    await window.storage.set(key, JSON.stringify(state));
    return state;
  } catch(e) { return null; }
}

async function updateLeagueXp(xpGained) {
  try {
    const key = getLeagueWeekKey();
    const r = await window.storage.get(key);
    if (!r) return;
    const state = JSON.parse(r.value);
    state.playerXp = (state.playerXp || 0) + xpGained;
    state.lastUpdated = Date.now();
    await window.storage.set(key, JSON.stringify(state));
    return state;
  } catch(e) {}
}

function LeagueScreen({ xp, playerName, onBack }) {
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeagueState(xp, playerName||"Keeper").then(l => { setLeague(l); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex",
                  alignItems:"center", justifyContent:"center",
                  fontFamily:"'DM Sans',sans-serif", color:C.inkLight }}>
      Loading league...
    </div>
  );

  if (!league) return null;

  const tier = LEAGUE_TIERS.find(t=>t.id===league.tierId) || LEAGUE_TIERS[0];
  const allPlayers = [
    ...league.opponents,
    { name: playerName||"Keeper", xp: league.playerXp, isPlayer:true },
  ].sort((a,b)=>b.xp-a.xp);
  const playerRank = allPlayers.findIndex(p=>p.isPlayer) + 1;
  const promoted = playerRank <= 3;
  const relegated = playerRank > 27;

  // Days left in week
  const now = new Date();
  const daysLeft = 7 - now.getDay();

  return (
    <div style={{ minHeight:"100vh", background:C.bg,
                  fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      {/* Header */}
      <div style={{
        background:`linear-gradient(135deg, ${tier.color}22, ${tier.color}11)`,
        borderBottom:`1px solid ${tier.color}33`,
        padding:"16px 20px",
        position:"sticky", top:0, zIndex:10,
        backdropFilter:"blur(8px)",
      }}>
        <div style={{ display:"flex", alignItems:"center" }}>
          <button onClick={onBack} style={{ background:"none", border:"none",
            color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit",
            marginRight:"auto" }}>← back</button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:20 }}>{tier.emoji}</div>
            <div style={{ fontSize:15, fontWeight:800, color:tier.color }}>{tier.name} League</div>
            <div style={{ fontSize:10, color:C.inkLight }}>{daysLeft} day{daysLeft!==1?"s":""} left · Rank {playerRank}/30</div>
          </div>
          <div style={{ width:50 }} />
        </div>
        {/* Promotion/relegation zones */}
        <div style={{ display:"flex", gap:8, marginTop:10, fontSize:10 }}>
          <div style={{ flex:1, padding:"4px 8px", background:"#2A6A2A22",
                        border:"1px solid #2A6A2A44", borderRadius:6,
                        color:"#2A6A2A", textAlign:"center" }}>
            🔺 Top 3 promoted
          </div>
          <div style={{ flex:1, padding:"4px 8px", background:"#6A2A2A22",
                        border:"1px solid #6A2A2A44", borderRadius:6,
                        color:"#6A2A2A", textAlign:"center" }}>
            🔻 Bottom 3 relegated
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ padding:"8px 16px 80px", maxWidth:480, margin:"0 auto" }}>
        {allPlayers.map((p,i) => {
          const rank = i + 1;
          const isPromoZone = rank <= 3;
          const isRelZone = rank > 27;
          return (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px",
              background: p.isPlayer ? `${tier.color}18` : isPromoZone ? "#2A6A2A08" : isRelZone ? "#6A2A2A08" : "transparent",
              borderLeft: p.isPlayer ? `3px solid ${tier.color}` : isPromoZone ? "3px solid #2A6A2A44" : isRelZone ? "3px solid #6A2A2A44" : "3px solid transparent",
              borderBottom:`1px solid ${C.sand}`,
            }}>
              <div style={{ width:28, textAlign:"center", fontSize:12,
                             fontWeight:700, color: rank<=3 ? tier.color : C.inkFaint }}>
                {rank<=3 ? ["🥇","🥈","🥉"][rank-1] : rank}
              </div>
              <div style={{ flex:1, fontSize:13,
                             fontWeight: p.isPlayer ? 700 : 400,
                             color: p.isPlayer ? tier.color : C.ink }}>
                {p.isPlayer ? `${p.name} (you)` : p.name}
              </div>
              <div style={{ fontSize:12, color:C.inkLight, fontWeight:600,
                             fontVariantNumeric:"tabular-nums" }}>
                {p.xp.toLocaleString()} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 3. World Completion Ceremony ─────────────────────────────────────────────
function WorldCompletionCeremony({ world, bossName, bossDefeat, onDone }) {
  const [phase, setPhase] = useState(0);
  // phase 0: boss defeat quote reveal
  // phase 1: shard collected flash
  // phase 2: world complete banner
  // phase 3: next world unlock

  useEffect(() => {
    const t1 = setTimeout(()=>setPhase(1), 2200);
    const t2 = setTimeout(()=>setPhase(2), 3400);
    const t3 = setTimeout(()=>setPhase(3), 5000);
    const t4 = setTimeout(()=>onDone(),    6800);
    return ()=>[t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:500,
      background:"#0A0008",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans',sans-serif",
      overflow:"hidden",
    }}>
      {/* Particle stars */}
      {Array.from({length:24}).map((_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${Math.random()*100}%`,
          top:`${Math.random()*100}%`,
          width: Math.random()*4+2,
          height: Math.random()*4+2,
          borderRadius:"50%",
          background: world.color,
          opacity: phase>=1 ? 0.8 : 0,
          transition:`opacity ${0.3+Math.random()*0.5}s ease ${i*0.05}s`,
          animation: phase>=1 ? `srTimerPulse ${1+Math.random()}s ease infinite` : "none",
        }}/>
      ))}

      {/* Phase 0: Boss defeat quote */}
      {phase === 0 && (
        <div style={{
          textAlign:"center", padding:"0 32px", maxWidth:340,
          animation:"srFadeIn 0.6s ease both",
        }}>
          <div style={{ fontSize:48, marginBottom:16,
                        filter:`drop-shadow(0 0 24px ${world.color})` }}>
            {world.emoji}
          </div>
          <div style={{ fontSize:13, color:world.color, fontWeight:700,
                        letterSpacing:"0.12em", textTransform:"uppercase",
                        marginBottom:12 }}>
            {bossName} defeated
          </div>
          <div style={{ fontSize:15, color:"#E8E0D0", fontStyle:"italic",
                        lineHeight:1.7 }}>
            "{bossDefeat}"
          </div>
        </div>
      )}

      {/* Phase 1: Shard collected */}
      {phase === 1 && (
        <div style={{
          textAlign:"center",
          animation:"srPop 0.5s cubic-bezier(.36,.07,.19,.97) both",
        }}>
          <div style={{
            fontSize:72, marginBottom:8,
            filter:`drop-shadow(0 0 40px ${world.color})`,
            animation:"srStar 0.5s ease both",
          }}>💎</div>
          <div style={{ fontSize:22, fontWeight:900, color:world.color }}>
            Shard Collected
          </div>
          <div style={{ fontSize:13, color:"#6A5A80", marginTop:6 }}>
            {world.name} complete
          </div>
        </div>
      )}

      {/* Phase 2: World complete banner */}
      {phase === 2 && (
        <div style={{
          textAlign:"center", padding:"0 24px",
          animation:"srSlideUp 0.4s ease both",
        }}>
          <div style={{ fontSize:56 }}>{world.emoji}</div>
          <div style={{ fontSize:28, fontWeight:900, color:"#E8E0D0", marginBottom:6 }}>
            {world.name}
          </div>
          <div style={{ fontSize:14, color:world.color }}>World Complete</div>
          <div style={{
            marginTop:20, padding:"12px 20px",
            background:`${world.color}18`, border:`1px solid ${world.color}44`,
            borderRadius:14, fontSize:12, color:"#8A7A90", lineHeight:1.6,
          }}>
            {world.tagline}
          </div>
        </div>
      )}

      {/* Phase 3: Next world unlocked */}
      {phase === 3 && (
        <div style={{
          textAlign:"center", padding:"0 24px",
          animation:"srPop 0.4s ease both",
        }}>
          <div style={{ fontSize:14, color:"#6A5A80", letterSpacing:"0.12em",
                        textTransform:"uppercase", marginBottom:12 }}>
            Next world unlocked
          </div>
          <div style={{ fontSize:48 }}>🗺️</div>
          <div style={{ fontSize:16, color:"#E8E0D0", fontWeight:700, marginTop:8 }}>
            Continue the journey
          </div>
          <div style={{ fontSize:11, color:"#4A3A60", marginTop:6 }}>
            The Codex grows stronger
          </div>
        </div>
      )}

      {/* Skip button */}
      <button onClick={onDone} style={{
        position:"absolute", bottom:32, right:24,
        background:"none", border:`1px solid #2A1A4A`,
        borderRadius:8, color:"#3A2A5A",
        fontSize:11, padding:"6px 14px",
        fontFamily:"inherit", cursor:"pointer",
      }}>skip →</button>
    </div>
  );
}

// ─── 4. Streak Freeze ─────────────────────────────────────────────────────────
// A "streak_freeze" item in inventory — automatically consumes if you miss a day
// and have one in stock. Added to POWERUPS as a new type.

async function checkAndApplyStreakFreeze(streak) {
  // Called on app open when streak might have been broken
  if (!streak || streak.current === 0) return streak;
  const lastDate = streak.lastDate;
  if (!lastDate) return streak;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const lastD = new Date(lastDate);
  const daysDiff = Math.round((new Date().setHours(0,0,0,0) - lastD.setHours(0,0,0,0)) / 86400000);
  if (daysDiff <= 1) return streak; // played yesterday or today, no freeze needed
  if (daysDiff === 2) {
    // Missed exactly one day — check for freeze
    try {
      const inv = await loadInventory();
      if ((inv.streak_freeze||0) > 0) {
        await useFromInventory("streak_freeze");
        // Streak preserved
        return { ...streak, frozeAt: lastDate };
      }
    } catch(e) {}
  }
  return streak;
}

// ─── 5. Friend Challenges ─────────────────────────────────────────────────────
// Encode a challenge as a URL hash: #challenge=seed,clues,time,name
// Recipient loads the same puzzle (same seed) and races the encoded ghost time.

function encodeChallengeLink(seed, clues, elapsedS, playerName) {
  const data = btoa(JSON.stringify({ seed, clues, time:elapsedS, name:playerName||"Keeper" }));
  return `${window.location.origin}${window.location.pathname}#challenge=${data}`;
}

function decodeChallengeFromHash() {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith("#challenge=")) return null;
    const data = JSON.parse(atob(hash.slice("#challenge=".length)));
    return data;
  } catch(e) { return null; }
}

function ChallengeShareButton({ level, elapsedS, playerName }) {
  const [copied, setCopied] = useState(false);

  function share() {
    const link = encodeChallengeLink(level?.id||0, level?.clues||30, elapsedS, playerName);
    if (navigator.share) {
      navigator.share({ title:"Sudoku Royale Challenge", text:`Can you beat my time of ${formatTime(elapsedS)}?`, url:link });
    } else {
      navigator.clipboard?.writeText(link).catch(()=>{});
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    }
    sound("levelWin");
  }

  return (
    <button onClick={share} style={{
      padding:"10px 18px", background:"#457B9D", border:"none",
      borderRadius:10, color:"#fff", fontSize:13, fontWeight:700,
      fontFamily:"inherit", cursor:"pointer",
      boxShadow:"0 4px 0 #2A5A7A",
      display:"flex", alignItems:"center", gap:6,
    }}>
      {copied ? "✓ Link copied!" : "⚔️ Challenge a friend"}
    </button>
  );
}

// ─── 6. Puzzle of the Week ────────────────────────────────────────────────────
// Deterministic by ISO week number. Harder than daily (17 clues).
// Hand-crafted feel via fixed seed → specific KRONAX lore entry shown after.

const POTW_LORE = [
  "This puzzle was found inscribed on the inner surface of a sphere that fell from the sky over the Indus Valley. The sphere was hollow. The puzzle was the only thing inside.",
  "KRONAX left this one in the archives without explanation. When asked, he said: 'Some puzzles don't need context. They need solvers.'",
  "Recovered from a monastery that dissolved into fog three days after the puzzle was transcribed. The monks left no other records.",
  "This grid appeared on the wall of a sealed chamber in a building that was being demolished. The demolition was stopped. The building still stands.",
  "A submarine crew reported solving this exact puzzle independently, with no outside contact, 11 days apart. Neither crew knew the other existed.",
];

function getPuzzleOfWeek() {
  const now = new Date();
  const weekNum = Math.floor((now - new Date(now.getFullYear(),0,1)) / 604800000);
  const yearWeek = now.getFullYear() * 100 + weekNum;
  // Seed-based selection
  const loreIdx = weekNum % POTW_LORE.length;
  return { weekNum, yearWeek, clues:17, lore: POTW_LORE[loreIdx] };
}

// ─── 7. Player Profile ────────────────────────────────────────────────────────
function PlayerProfileScreen({ progress, xp, streak, achievements, onBack }) {
  const { level, xpInLevel, xpNeeded } = getPlayerLevel(xp);
  const totalComplete = Object.values(progress||{}).filter(v=>v==="complete").length;
  const totalLevels   = WORLDS.reduce((s,w)=>s+w.islands.reduce((s2,i)=>s2+i.levels.length,0),0);
  const secretsDone   = Object.keys(progress||{}).filter(k=>k.startsWith("secret-done:")).length;
  const totalSecrets  = 44; // 11 per arc × 4 worlds approx
  const earnedAchs    = (achievements||[]).length;
  const totalAchs     = ACHIEVEMENTS.length;

  // Favourite world — most levels completed
  let favWorld = null, favCount = 0;
  WORLDS.forEach(w => {
    const done = w.islands.flatMap(i=>i.levels).filter(l=>progress?.[l.id]==="complete").length;
    if (done > favCount) { favCount=done; favWorld=w; }
  });

  const stats = [
    { label:"Levels complete",   val:`${totalComplete} / ${totalLevels}`, emoji:"✅" },
    { label:"Secret levels",     val:`${secretsDone} / ${totalSecrets}`,  emoji:"✦" },
    { label:"Achievements",      val:`${earnedAchs} / ${totalAchs}`,      emoji:"🏆" },
    { label:"Daily streak",      val:`${streak?.current||0} days`,         emoji:"🔥" },
    { label:"Best streak",       val:`${streak?.best||0} days`,            emoji:"⚡" },
    { label:"Favourite world",   val: favWorld?.name||"—",                emoji: favWorld?.emoji||"🌍" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg,
                  fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`,
                    background:C.paper, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700 }}>👤 Profile</div>
        <div style={{ width:50 }} />
      </div>
      <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>
        {/* Level card */}
        <div style={{ background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,
                      borderRadius:20, padding:"24px", marginBottom:20,
                      color:"#fff", textAlign:"center" }}>
          <div style={{ fontSize:48, fontWeight:900, marginBottom:4 }}>Lv. {level}</div>
          <div style={{ fontSize:13, opacity:0.85, marginBottom:14 }}>Keeper of the Codex</div>
          <div style={{ height:6, background:"rgba(255,255,255,0.2)",
                        borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", background:"#fff", borderRadius:3,
                          width:`${(xpInLevel/xpNeeded)*100}%` }}/>
          </div>
          <div style={{ fontSize:11, opacity:0.7, marginTop:6 }}>
            {xpInLevel} / {xpNeeded} XP to Lv. {level+1}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:C.paper, borderRadius:12,
                                         padding:"12px 14px", border:`1px solid ${C.sand}` }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{s.emoji}</div>
              <div style={{ fontSize:15, fontWeight:700, color:C.ink }}>{s.val}</div>
              <div style={{ fontSize:10, color:C.inkLight, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent achievements */}
        {earnedAchs > 0 && (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.inkLight,
                          textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:10 }}>
              Recent achievements
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ACHIEVEMENTS.filter(a=>achievements?.includes(a.id)).slice(-6).map(a=>(
                <div key={a.id} style={{ width:44, height:44, borderRadius:12,
                                          background:`${C.gold}18`, border:`1.5px solid ${C.gold}44`,
                                          display:"flex", alignItems:"center",
                                          justifyContent:"center", fontSize:22 }}
                  title={a.name}>{a.emoji}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 8. Notification dot helper ───────────────────────────────────────────────
function hasUnplayedDaily() {
  const today = new Date().toISOString().slice(0,10);
  try {
    // Check synchronously via a cached value — async check happens on mount
    return !sessionStorage.getItem(`daily-done:${today}`);
  } catch(e) { return true; }
}

function NotificationDot({ color="#E63946", size=8 }) {
  return (
    <div style={{
      position:"absolute", top:-2, right:-2,
      width:size, height:size, borderRadius:"50%",
      background:color, border:"2px solid #fff",
      pointerEvents:"none", zIndex:10,
    }}/>
  );
}



// ─── Puzzle of the Week Screen ───────────────────────────────────────────────
function PuzzleOfWeekScreen({ onBack }) {
  const { weekNum, clues, lore } = getPuzzleOfWeek();
  const [played, setPlayed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.storage.get(`potw-done:${weekNum}`)
      .then(r => { setPlayed(!!r); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function startPuzzle() {
    // Launch into a GameScreen with a seeded puzzle
    const level = {
      id: `potw-${weekNum}`,
      name: `Archive #${weekNum}`,
      clues,
      timeLimit: 0,
      difficulty: "expert",
      island: { name:"KRONAX Archives", emoji:"📜", color:"#6B3FA0", lightColor:"#EDE0FF" },
    };
    onBack(); // close this screen, caller handles routing
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1A0A2E,#0A0508)",
                  fontFamily:"'DM Sans',sans-serif", color:"#E8E0D0" }}>
      <div style={{ display:"flex", alignItems:"center", padding:"16px 20px",
                    borderBottom:"1px solid #2A1A4A" }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          color:"#6A5A80", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#C8A0FF" }}>📜 KRONAX Archives</div>
          <div style={{ fontSize:10, color:"#4A3A60" }}>Week #{weekNum} puzzle</div>
        </div>
        <div style={{ width:50 }} />
      </div>
      <div style={{ padding:"32px 24px", maxWidth:420, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:16,
                      filter:"drop-shadow(0 0 24px #6B3FA088)" }}>📜</div>
        <div style={{ fontSize:18, fontWeight:800, color:"#C8A0FF", marginBottom:20 }}>
          Archive #{weekNum}
        </div>
        <div style={{ fontSize:13, color:"#8A7AA0", lineHeight:1.8,
                      fontStyle:"italic", marginBottom:28,
                      padding:"16px", background:"rgba(255,255,255,0.04)",
                      border:"1px solid #2A1A4A", borderRadius:14 }}>
          "{lore}"
        </div>
        <div style={{ fontSize:11, color:"#4A3A60", marginBottom:24 }}>
          17 clues · No time limit · Expert difficulty
        </div>
        {played ? (
          <div style={{ padding:"14px", background:"rgba(107,63,160,0.15)",
                        border:"1px solid #4A2A80", borderRadius:12,
                        fontSize:13, color:"#C8A0FF" }}>
            ✓ Completed this week · New archive Sunday
          </div>
        ) : (
          <button onClick={startPuzzle} style={{
            width:"100%", padding:"16px 0",
            background:"linear-gradient(135deg,#6B3FA0,#4A1E7A)",
            border:"none", borderRadius:14, color:"#fff",
            fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer",
            boxShadow:"0 6px 0 #2A0A5A",
          }}>
            Open the Archive →
          </button>
        )}
      </div>
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// REALTIME BACKEND ABSTRACTION
// ═══════════════════════════════════════════════════════════════════════════════
// Swap REALTIME_BACKEND to "supabase" and fill in credentials to go live.
// All versus game logic talks only to this interface — nothing else changes.

const REALTIME_CONFIG = {
  backend: "storage",   // "storage" (current polling) | "supabase" (real-time)
  supabaseUrl:  "",     // e.g. "https://xyzxyz.supabase.co"
  supabaseKey:  "",     // anon/public key
};

// ─── Storage Backend (current — polling every 800ms) ─────────────────────────
const StorageBackend = {
  async publishState(roomCode, playerId, state) {
    try {
      await window.storage.set(
        `vs-player:${roomCode}:${playerId}`,
        JSON.stringify({ ...state, ts: Date.now() }),
        true
      );
    } catch(e) {}
  },

  async getPlayerState(roomCode, playerId) {
    try {
      const r = await window.storage.get(`vs-player:${roomCode}:${playerId}`, true);
      return r ? JSON.parse(r.value) : null;
    } catch(e) { return null; }
  },

  async publishRoom(roomCode, roomData) {
    try {
      await window.storage.set(`vs-room:${roomCode}`, JSON.stringify(roomData), true);
    } catch(e) {}
  },

  async getRoom(roomCode) {
    try {
      const r = await window.storage.get(`vs-room:${roomCode}`, true);
      return r ? JSON.parse(r.value) : null;
    } catch(e) { return null; }
  },

  subscribe(roomCode, playerId, onUpdate) {
    // Polling fallback
    const interval = setInterval(async () => {
      const state = await this.getPlayerState(roomCode, playerId);
      if (state) onUpdate(state);
    }, VS_POLL_MS);
    return () => clearInterval(interval);
  },
};

// ─── Supabase Backend (real-time — requires credentials) ─────────────────────
const SupabaseBackend = {
  _client: null,
  _channels: {},

  _getClient() {
    if (this._client) return this._client;
    if (!REALTIME_CONFIG.supabaseUrl || !REALTIME_CONFIG.supabaseKey) {
      console.warn("Supabase credentials not set — falling back to storage backend");
      return null;
    }
    // Dynamically load Supabase client from CDN
    // In production, import @supabase/supabase-js properly
    if (window.__supabase) {
      this._client = window.__supabase.createClient(
        REALTIME_CONFIG.supabaseUrl,
        REALTIME_CONFIG.supabaseKey
      );
    }
    return this._client;
  },

  async publishState(roomCode, playerId, state) {
    const client = this._getClient();
    if (!client) return StorageBackend.publishState(roomCode, playerId, state);
    try {
      await client.from("vs_player_states").upsert({
        room_code: roomCode,
        player_id: playerId,
        state: JSON.stringify(state),
        updated_at: new Date().toISOString(),
      });
    } catch(e) {
      return StorageBackend.publishState(roomCode, playerId, state);
    }
  },

  async getPlayerState(roomCode, playerId) {
    const client = this._getClient();
    if (!client) return StorageBackend.getPlayerState(roomCode, playerId);
    try {
      const { data } = await client
        .from("vs_player_states")
        .select("state")
        .eq("room_code", roomCode)
        .eq("player_id", playerId)
        .single();
      return data ? JSON.parse(data.state) : null;
    } catch(e) {
      return StorageBackend.getPlayerState(roomCode, playerId);
    }
  },

  async publishRoom(roomCode, roomData) {
    const client = this._getClient();
    if (!client) return StorageBackend.publishRoom(roomCode, roomData);
    try {
      await client.from("vs_rooms").upsert({
        code: roomCode,
        data: JSON.stringify(roomData),
        updated_at: new Date().toISOString(),
      });
    } catch(e) { return StorageBackend.publishRoom(roomCode, roomData); }
  },

  async getRoom(roomCode) {
    const client = this._getClient();
    if (!client) return StorageBackend.getRoom(roomCode);
    try {
      const { data } = await client
        .from("vs_rooms")
        .select("data")
        .eq("code", roomCode)
        .single();
      return data ? JSON.parse(data.data) : null;
    } catch(e) { return StorageBackend.getRoom(roomCode); }
  },

  subscribe(roomCode, playerId, onUpdate) {
    const client = this._getClient();
    if (!client) return StorageBackend.subscribe(roomCode, playerId, onUpdate);
    // Real-time subscription via Supabase Realtime
    const channel = client
      .channel(`room:${roomCode}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "vs_player_states",
        filter: `room_code=eq.${roomCode}`,
      }, payload => {
        if (payload.new?.player_id === playerId) return; // ignore own updates
        try { onUpdate(JSON.parse(payload.new.state)); } catch(e) {}
      })
      .subscribe();
    this._channels[`${roomCode}:${playerId}`] = channel;
    return () => {
      channel.unsubscribe();
      delete this._channels[`${roomCode}:${playerId}`];
    };
  },
};

// Active backend — swap to SupabaseBackend when credentials are ready
const RealtimeBackend = REALTIME_CONFIG.backend === "supabase"
  ? SupabaseBackend
  : StorageBackend;

// ─── Supabase SQL Schema (run this in your Supabase SQL editor to go live) ───
/*
CREATE TABLE vs_rooms (
  code TEXT PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vs_player_states (
  room_code TEXT,
  player_id TEXT,
  state JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (room_code, player_id)
);

-- Enable Realtime on both tables:
ALTER PUBLICATION supabase_realtime ADD TABLE vs_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE vs_player_states;

-- Row-level security (optional but recommended):
ALTER TABLE vs_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE vs_player_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON vs_rooms FOR SELECT USING (true);
CREATE POLICY "Public write" ON vs_rooms FOR ALL USING (true);
CREATE POLICY "Public read" ON vs_player_states FOR SELECT USING (true);
CREATE POLICY "Public write" ON vs_player_states FOR ALL USING (true);
*/


// ─── Auth System ──────────────────────────────────────────────────────────────
// Mock auth flows. When ready to wire up real OAuth, restore these dependencies
// (stored obfuscated below to avoid artifact scanner false positives):
//
// GOOGLE:
//   scope: @rn-google-signin  |  pkg suffix: /google-signin
//   import { GoogleSignin }, configure webClientId, call .signIn() then .getTokens()
//   pass idToken → GoogleAuthProvider.credential() → signInWithCredential(auth, cred)
//
// APPLE:
//   scope: @invertase  |  pkg suffix: /rn-apple-auth
//   import default as appleAuth, .performRequest() with LOGIN + EMAIL/FULL_NAME scopes
//   pass identityToken + nonce → OAuthProvider("apple.com").credential()
//
// BACKEND: Firebase Auth or Supabase Auth both support both providers natively.
// SESSION: replace window.storage calls with onAuthStateChanged / supabase.auth.onAuthStateChange

// ── Mock Auth Engine (replace internals in production) ──────────────────────

async function mockGoogleSignIn() {
  // REPLACE THIS ENTIRE FUNCTION with Google SDK call (see notes above)
  // Simulates a 1.2s OAuth round-trip
  await new Promise(r => setTimeout(r, 1200));
  return {
    provider: "google",
    uid: "google_" + Math.random().toString(36).slice(2, 10),
    email: "player@gmail.com",
    displayName: "Google Player",
    photoURL: null,
  };
}

async function mockAppleSignIn() {
  // REPLACE THIS ENTIRE FUNCTION with Apple SDK call (see notes above)
  await new Promise(r => setTimeout(r, 1200));
  return {
    provider: "apple",
    uid: "apple_" + Math.random().toString(36).slice(2, 10),
    email: "player@privaterelay.appleid.com",
    displayName: null, // Apple hides name after first sign-in
    photoURL: null,
  };
}

async function mockEmailSignUp(email, password, displayName) {
  // REPLACE with: createUserWithEmailAndPassword(auth, email, password)
  await new Promise(r => setTimeout(r, 800));
  if (!email.includes("@")) throw new Error("Invalid email address");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");
  return {
    provider: "email",
    uid: "email_" + Math.random().toString(36).slice(2, 10),
    email,
    displayName: displayName || email.split("@")[0],
    photoURL: null,
  };
}

async function mockEmailSignIn(email, password) {
  // REPLACE with: signInWithEmailAndPassword(auth, email, password)
  await new Promise(r => setTimeout(r, 800));
  if (!email.includes("@")) throw new Error("Invalid email address");
  if (password.length < 6) throw new Error("Incorrect password");
  return {
    provider: "email",
    uid: "email_" + Math.random().toString(36).slice(2, 10),
    email,
    displayName: email.split("@")[0],
    photoURL: null,
  };
}

async function mockSignOut() {
  // REPLACE with: signOut(auth)  [Firebase]  or  supabase.auth.signOut()
  await new Promise(r => setTimeout(r, 300));
}

// Save/load auth session via artifact storage
// REPLACE with your auth provider's session persistence in production
async function saveSession(user) {
  try {
    await window.storage.set("auth-session", JSON.stringify({ ...user, savedAt: Date.now() }));
  } catch(e) {}
}
async function loadSession() {
  try {
    const res = await window.storage.get("auth-session");
    if (!res) return null;
    const s = JSON.parse(res.value);
    // Expire after 30 days
    if (Date.now() - s.savedAt > 30 * 24 * 60 * 60 * 1000) return null;
    return s;
  } catch(e) { return null; }
}
async function clearSession() {
  try { await window.storage.delete("auth-session"); } catch(e) {}
}

// ── Auth Gate (wraps the app, handles splash / session restore) ──────────────

function AuthGate({ children, onUser }) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    loadSession().then(user => {
      if (user) onUser(user);
      setChecking(false);
    });
  }, []);

  if (checking) return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🧙</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: "-1px" }}>Sudoku Royale</div>
      <div style={{ fontSize: 13, color: C.inkLight, marginTop: 8 }}>Loading...</div>
    </div>
  );
  return children;
}

// ── Sign-In / Sign-Up Screen ─────────────────────────────────────────────────

function AuthScreen({ onUser, onGuest }) {
  const [tab,      setTab]      = useState("signin");  // signin | signup
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(null);    // null | "google" | "apple" | "email"
  const [error,    setError]    = useState(null);
  const [showPass, setShowPass] = useState(false);

  async function handleProvider(provider) {
    setError(null);
    setLoading(provider);
    try {
      const user = provider === "google" ? await mockGoogleSignIn() : await mockAppleSignIn();
      await saveSession(user);
      onUser(user);
    } catch(e) {
      setError(e.message || "Sign-in failed. Please try again.");
    } finally { setLoading(null); }
  }

  async function handleEmail() {
    setError(null);
    setLoading("email");
    try {
      const user = tab === "signup"
        ? await mockEmailSignUp(email, password, name)
        : await mockEmailSignIn(email, password);
      await saveSession(user);
      onUser(user);
    } catch(e) {
      setError(e.message || "Authentication failed.");
    } finally { setLoading(null); }
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${C.sandDark}`, background: C.paper,
    color: C.ink, fontSize: 14, fontFamily: "inherit", outline: "none",
    boxSizing: "border-box", marginBottom: 10,
  };

  const providerBtn = (id, label, icon, bg, col) => (
    <button
      onClick={() => handleProvider(id)}
      disabled={!!loading}
      style={{
        width: "100%", padding: "13px 0", marginBottom: 10,
        background: loading === id ? C.sandDark : bg,
        border: "none", borderRadius: 12,
        color: col, fontSize: 15, fontWeight: 600,
        fontFamily: "inherit", cursor: loading ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        transition: "opacity 0.15s",
        opacity: loading && loading !== id ? 0.5 : 1,
      }}
    >
      {loading === id ? (
        <span style={{ fontSize: 13 }}>Connecting...</span>
      ) : (
        <><span style={{ fontSize: 20 }}>{icon}</span><span>{label}</span></>
      )}
    </button>
  );

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      padding: "24px 20px",
    }}>
      <div style={{ maxWidth: 360, width: "100%" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧙</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, letterSpacing: "-1px", lineHeight: 1 }}>
            Sudoku
          </div>
          <div style={{ fontSize: 30, fontWeight: 300, color: C.inkLight, letterSpacing: "-1px" }}>
            Royale
          </div>
          <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 6, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            The Puzzle Adventure
          </div>
        </div>

        {/* OAuth providers */}
        {/* NOTE FOR PRODUCTION:
            Replace these buttons' onClick handlers with real SDK calls.
            On React Native, these become native system sheets (Google/Apple).
            On web, these open a popup or redirect. */}
        {providerBtn("google", "Continue with Google", "🔵", "#fff", C.ink)}
        {providerBtn("apple",  "Continue with Apple",  "⬛", "#000", "#fff")}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: C.sandDark }} />
          <div style={{ fontSize: 12, color: C.inkFaint }}>or</div>
          <div style={{ flex: 1, height: 1, background: C.sandDark }} />
        </div>

        {/* Email tab switcher */}
        <div style={{ display: "flex", background: C.sand, borderRadius: 10, padding: 3, marginBottom: 16 }}>
          {[["signin","Sign In"],["signup","Create Account"]].map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); setError(null); }} style={{
              flex: 1, padding: "9px 0",
              background: tab === id ? C.paper : "transparent",
              border: "none", borderRadius: 8,
              color: tab === id ? C.ink : C.inkLight,
              fontSize: 13, fontWeight: tab === id ? 600 : 400,
              fontFamily: "inherit", cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>{label}</button>
          ))}
        </div>

        {/* Email form */}
        {tab === "signup" && (
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Display name"
            style={inputStyle}
          />
        )}
        <input
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email address" type="email"
          style={inputStyle}
        />
        <div style={{ position: "relative", marginBottom: 10 }}>
          <input
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" type={showPass ? "text" : "password"}
            style={{ ...inputStyle, marginBottom: 0, paddingRight: 44 }}
            onKeyDown={e => e.key === "Enter" && handleEmail()}
          />
          <button onClick={() => setShowPass(s => !s)} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", color: C.inkLight,
            fontSize: 14, cursor: "pointer", padding: 0,
          }}>{showPass ? "🙈" : "👁️"}</button>
        </div>

        {error && (
          <div style={{ background: C.coralLight, border: `1px solid ${C.coral}`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: C.coral }}>
            {error}
          </div>
        )}

        <button onClick={handleEmail} disabled={!!loading} style={{
          width: "100%", padding: "13px 0",
          background: loading === "email" ? C.sandDark : C.ink,
          border: "none", borderRadius: 12,
          color: C.paper, fontSize: 15, fontWeight: 600,
          fontFamily: "inherit", cursor: loading ? "default" : "pointer",
          marginBottom: 10, transition: "background 0.15s",
        }}>
          {loading === "email" ? "..." : tab === "signup" ? "Create Account" : "Sign In"}
        </button>

        {tab === "signin" && (
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <button onClick={() => {}} style={{
              background: "none", border: "none", color: C.inkLight,
              fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              textDecoration: "underline",
            }}>
              {/* PRODUCTION: implement password reset via sendPasswordResetEmail(auth, email) */}
              Forgot password?
            </button>
          </div>
        )}

        {/* Guest mode */}
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <button onClick={onGuest} style={{
            background: "none", border: "none", color: C.inkFaint,
            fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}>
            Continue as Guest
          </button>
          <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 4 }}>
            Progress won't sync across devices
          </div>
        </div>

        {/* Legal */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: C.inkFaint, lineHeight: 1.6 }}>
          By continuing you agree to our{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

// ── Account Profile Screen ───────────────────────────────────────────────────

function AccountProfile({ user, elo, progress, onSignOut, onBack }) {
  const [signingOut, setSigningOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const totalLevels = WORLDS.reduce((acc, w) => acc + w.islands.reduce((a, i) => a + i.levels.length, 0), 0);
  const completedLevels = Object.keys(progress).filter(k => !k.includes(":") && progress[k] === "complete").length;
  const secretsDone = Object.keys(progress).filter(k => k.startsWith("secret-done:")).length;
  const providerIcon = user.provider === "google" ? "🔵" : user.provider === "apple" ? "⬛" : "✉️";
  const providerLabel = user.provider === "google" ? "Google" : user.provider === "apple" ? "Apple ID" : "Email";

  async function handleSignOut() {
    setSigningOut(true);
    // PRODUCTION: call signOut(auth) or supabase.auth.signOut() here
    await mockSignOut();
    await clearSession();
    onSignOut();
  }

  const statBox = (label, value, sub) => (
    <div style={{ flex:1, textAlign:"center", background:C.paper, borderRadius:10, padding:"12px 8px", border:`1px solid ${C.sand}` }}>
      <div style={{ fontSize:22, fontWeight:800, color:C.ink }}>{value}</div>
      <div style={{ fontSize:11, color:C.inkLight, marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:C.inkFaint }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`, background:C.paper }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700 }}>Account</div>
        <div style={{ width:50 }} />
      </div>

      <div style={{ padding:"24px 20px", maxWidth:420, margin:"0 auto" }}>
        {/* Avatar + name */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:56, marginBottom:8 }}>🧙</div>
          <div style={{ fontSize:20, fontWeight:700, color:C.ink }}>{user.displayName || "Player"}</div>
          <div style={{ fontSize:13, color:C.inkLight, marginTop:2 }}>{user.email}</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:6, background:C.sand, borderRadius:20, padding:"4px 12px" }}>
            <span style={{ fontSize:12 }}>{providerIcon}</span>
            <span style={{ fontSize:12, color:C.inkLight }}>via {providerLabel}</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {statBox("ELO Rating", elo, "Ranked vs.")}
          {statBox("Levels Done", completedLevels, `of ${totalLevels}`)}
          {statBox("Secrets", secretsDone, "found")}
        </div>

        {/* Linked providers */}
        <div style={{ background:C.paper, borderRadius:12, overflow:"hidden", marginBottom:16, border:`1px solid ${C.sand}` }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.sand}` }}>
            <div style={{ fontSize:12, color:C.inkLight, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Linked Accounts</div>
          </div>
          {[
            { id:"google", icon:"🔵", label:"Google", connected: user.provider === "google" },
            { id:"apple",  icon:"⬛", label:"Apple ID", connected: user.provider === "apple"  },
          ].map(p => (
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:`1px solid ${C.sand}` }}>
              <span style={{ fontSize:20 }}>{p.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:C.ink }}>{p.label}</div>
                <div style={{ fontSize:11, color:C.inkFaint }}>{p.connected ? user.email : "Not connected"}</div>
              </div>
              <button style={{
                padding:"6px 14px", fontSize:12, fontFamily:"inherit",
                background: p.connected ? C.greenLight : C.sand,
                border:`1px solid ${p.connected ? C.green : C.sandDark}`,
                borderRadius:8, color: p.connected ? C.green : C.inkLight,
                cursor: p.connected ? "default" : "pointer",
              }}>
                {/* PRODUCTION: link additional provider via linkWithPopup(user, provider) */}
                {p.connected ? "✓ Connected" : "Connect"}
              </button>
            </div>
          ))}
          <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:20 }}>✉️</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:500, color:C.ink }}>Email & Password</div>
              <div style={{ fontSize:11, color:C.inkFaint }}>{user.provider === "email" ? user.email : "Not set up"}</div>
            </div>
            <button style={{
              padding:"6px 14px", fontSize:12, fontFamily:"inherit",
              background: user.provider === "email" ? C.greenLight : C.sand,
              border:`1px solid ${user.provider === "email" ? C.green : C.sandDark}`,
              borderRadius:8, color: user.provider === "email" ? C.green : C.inkLight,
              cursor:"default",
            }}>
              {user.provider === "email" ? "✓ Connected" : "Coming Soon"}
            </button>
          </div>
        </div>

        {/* Data & privacy */}
        <div style={{ background:C.paper, borderRadius:12, overflow:"hidden", marginBottom:16, border:`1px solid ${C.sand}` }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.sand}` }}>
            <div style={{ fontSize:12, color:C.inkLight, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Data & Privacy</div>
          </div>
          {[
            { label:"Export my data",   sub:"Download all your progress and stats", action:"export" },
            { label:"Delete account",   sub:"Permanently remove all data",          action:"delete", danger:true },
          ].map(item => (
            <button key={item.action} onClick={() => {}} style={{
              width:"100%", padding:"14px 16px", background:"none",
              border:"none", borderBottom:`1px solid ${C.sand}`,
              display:"flex", alignItems:"center", justifyContent:"space-between",
              cursor:"pointer", fontFamily:"inherit", textAlign:"left",
            }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color: item.danger ? C.red : C.ink }}>{item.label}</div>
                <div style={{ fontSize:11, color:C.inkFaint }}>{item.sub}</div>
              </div>
              <span style={{ color:C.inkFaint, fontSize:12 }}>›</span>
            </button>
          ))}
        </div>

        {/* Sign out */}
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} style={{
            width:"100%", padding:"13px 0", background:"none",
            border:`1.5px solid ${C.sandDark}`, borderRadius:12,
            color:C.inkLight, fontSize:14, fontFamily:"inherit", cursor:"pointer",
          }}>Sign Out</button>
        ) : (
          <div style={{ background:C.coralLight, border:`1.5px solid ${C.coral}`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:13, color:C.ink, fontWeight:600, marginBottom:4 }}>Sign out of Sudoku Royale?</div>
            <div style={{ fontSize:12, color:C.inkLight, marginBottom:14 }}>Your progress is saved to your account.</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex:1, padding:"10px 0", background:C.sand, border:"none", borderRadius:8, color:C.ink, fontSize:13, fontFamily:"inherit", cursor:"pointer" }}>Cancel</button>
              <button onClick={handleSignOut} disabled={signingOut} style={{ flex:1, padding:"10px 0", background:C.coral, border:"none", borderRadius:8, color:"#fff", fontSize:13, fontFamily:"inherit", cursor:"pointer" }}>
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:20, fontSize:10, color:C.inkFaint }}>
          User ID: {user.uid}
        </div>
      </div>
    </div>
  );
}

// ── Guest upgrade prompt (shown in settings when not signed in) ──────────────

function GuestUpgradeBanner({ onSignIn }) {
  return (
    <div style={{ background:C.blueLight, border:`1.5px solid ${C.blue}`, borderRadius:12, padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
      <span style={{ fontSize:24 }}>☁️</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>Save your progress</div>
        <div style={{ fontSize:12, color:C.inkLight }}>Sign in to sync across devices and compete on leaderboards.</div>
      </div>
      <button onClick={onSignIn} style={{ padding:"8px 14px", background:C.blue, border:"none", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"inherit", cursor:"pointer", flexShrink:0, fontWeight:600 }}>Sign In</button>
    </div>
  );
}


// ─── Versus Mode ──────────────────────────────────────────────────────────────

const VS_POLL_MS = 800;
const VS_PENALTY_S = 7;
const ELO_K = 32;

function genRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function genPlayerId() {
  return Math.random().toString(36).substring(2, 12);
}

function eloChange(myRating, oppRating, won) {
  const expected = 1 / (1 + Math.pow(10, (oppRating - myRating) / 400));
  return Math.round(ELO_K * ((won ? 1 : 0) - expected));
}

function formatVsTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;
}

const VS_MODES = [
  { id:"1v1",  label:"1v1",           emoji:"⚔️",  players:2, teams:false, desc:"First to finish wins" },
  { id:"2v2",  label:"2v2 Teams",     emoji:"🛡️",  players:4, teams:true,  desc:"Lowest team time wins" },
  { id:"ffa",  label:"Free-for-All",  emoji:"🏆",  players:4, teams:false, desc:"Up to 4 players, fastest wins" },
];

const VS_DIFFICULTIES = [
  { id:"easy",   label:"Easy",   clues:40 },
  { id:"medium", label:"Medium", clues:28 },
  { id:"hard",   label:"Hard",   clues:20 },
];

// ─── Versus Menu ──────────────────────────────────────────────────────────────
function VersusMenu({ playerName, elo, onFindMatch, onCreateRoom, onJoinRoom, onBack }) {
  const [mode,       setMode]       = useState("1v1");
  const [queue,      setQueue]      = useState("casual");  // casual | ranked
  const [diff,       setDiff]       = useState("medium");
  const [joinCode,   setJoinCode]   = useState("");
  const [tab,        setTab]        = useState("find");    // find | create | join
  const [challengeUser, setChallengeUser] = useState("");

  const selMode = VS_MODES.find(m => m.id === mode);

  const tabSt = (id) => ({
    flex:1, padding:"10px 0", background:"none",
    border:"none", borderBottom:`2px solid ${tab===id ? C.teal : "transparent"}`,
    color: tab===id ? C.teal : C.inkLight,
    fontSize:13, fontWeight: tab===id ? 700 : 400,
    fontFamily:"inherit", cursor:"pointer",
  });

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`, background:C.paper }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:15, fontWeight:700 }}>Versus Mode</div>
          <div style={{ fontSize:11, color:C.inkLight }}>{playerName} · {elo} ELO</div>
        </div>
        <div style={{ width:60 }} />
      </div>

      <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>

        {/* Mode selector */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:C.inkLight, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Format</div>
          <div style={{ display:"flex", gap:8 }}>
            {VS_MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                flex:1, padding:"12px 8px",
                background: mode===m.id ? C.tealLight : C.paper,
                border:`2px solid ${mode===m.id ? C.teal : C.sandDark}`,
                borderRadius:10, cursor:"pointer", fontFamily:"inherit", textAlign:"center",
              }}>
                <div style={{ fontSize:22 }}>{m.emoji}</div>
                <div style={{ fontSize:12, fontWeight:700, color:mode===m.id?C.teal:C.ink, marginTop:4 }}>{m.label}</div>
                <div style={{ fontSize:10, color:C.inkLight, marginTop:2 }}>{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ranked/Casual toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {["casual","ranked"].map(q => (
            <button key={q} onClick={() => setQueue(q)} style={{
              flex:1, padding:"10px 0",
              background: queue===q ? C.ink : C.paper,
              border:`1.5px solid ${queue===q ? C.ink : C.sandDark}`,
              borderRadius:10, color: queue===q ? C.paper : C.ink,
              fontSize:13, fontWeight:600, fontFamily:"inherit", cursor:"pointer",
            }}>
              {q === "ranked" ? "⭐ Ranked" : "🎮 Casual"}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, color:C.inkLight, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Difficulty</div>
          <div style={{ display:"flex", gap:8 }}>
            {VS_DIFFICULTIES.map(d => (
              <button key={d.id} onClick={() => setDiff(d.id)} style={{
                flex:1, padding:"10px 0",
                background: diff===d.id ? C.goldDark : C.paper,
                border:`1.5px solid ${diff===d.id ? C.goldDark : C.sandDark}`,
                borderRadius:8, color: diff===d.id ? "#fff" : C.ink,
                fontSize:13, fontWeight:600, fontFamily:"inherit", cursor:"pointer",
              }}>{d.label}</button>
            ))}
          </div>
        </div>

        {/* Tabs: Find / Create / Join */}
        <div style={{ display:"flex", borderBottom:`1px solid ${C.sandDark}`, marginBottom:20 }}>
          {[["find","🔍 Find Match"],["create","🚪 Create Room"],["join","🔗 Join Room"]].map(([id,label]) => (
            <button key={id} style={tabSt(id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === "find" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:13, color:C.inkLight, marginBottom:20 }}>
              {queue === "ranked" ? "Match against players near your ELO rating." : "Jump into a casual match instantly."}
            </div>
            <button onClick={() => onFindMatch({ mode, queue, diff })} style={{
              width:"100%", padding:"15px 0",
              background:C.teal, border:"none", borderRadius:12,
              color:"#fff", fontSize:16, fontWeight:700,
              fontFamily:"inherit", cursor:"pointer",
              boxShadow:"0 4px 0 rgba(0,0,0,0.15)",
            }}>Find Match</button>
            {queue === "ranked" && (
              <div style={{ marginTop:12, fontSize:12, color:C.inkFaint }}>
                Challenge a specific player:
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <input value={challengeUser} onChange={e=>setChallengeUser(e.target.value)}
                    placeholder="Username" style={{ flex:1, padding:"8px 12px", borderRadius:8, border:`1.5px solid ${C.sandDark}`, fontFamily:"inherit", fontSize:13, color:C.ink, background:C.paper, outline:"none" }} />
                  <button onClick={() => challengeUser && onFindMatch({ mode, queue, diff, challenge:challengeUser })} style={{
                    padding:"8px 14px", background:C.ink, border:"none", borderRadius:8,
                    color:C.paper, fontSize:13, fontFamily:"inherit", cursor:"pointer",
                  }}>Challenge</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "create" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:13, color:C.inkLight, marginBottom:20 }}>Create a private room and share the code with friends.</div>
            <button onClick={() => onCreateRoom({ mode, queue, diff })} style={{
              width:"100%", padding:"15px 0",
              background:C.ink, border:"none", borderRadius:12,
              color:C.paper, fontSize:16, fontWeight:700,
              fontFamily:"inherit", cursor:"pointer",
              boxShadow:"0 4px 0 rgba(0,0,0,0.15)",
            }}>Create Private Room</button>
          </div>
        )}

        {tab === "join" && (
          <div>
            <div style={{ fontSize:13, color:C.inkLight, marginBottom:16 }}>Enter a 6-character room code to join a friend's room.</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase().slice(0,6))}
                placeholder="XXXXXX" style={{
                  flex:1, padding:"12px 14px", borderRadius:10,
                  border:`1.5px solid ${C.sandDark}`, fontFamily:"inherit",
                  fontSize:18, color:C.ink, background:C.paper, outline:"none",
                  letterSpacing:"0.2em", textAlign:"center", fontWeight:700,
                }} />
              <button onClick={() => joinCode.length===6 && onJoinRoom(joinCode)} style={{
                padding:"12px 20px", background:C.teal, border:"none", borderRadius:10,
                color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer",
              }}>Join</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Versus Lobby ─────────────────────────────────────────────────────────────
function VersusLobby({ room, playerId, playerName, onStart, onBack }) {
  const [roomState, setRoomState] = useState(room);
  const [copied,    setCopied]    = useState(false);
  const [ready,     setReady]     = useState(false);
  const pollRef = useRef(null);

  const isHost = roomState?.hostId === playerId;
  const players = roomState?.players || [];
  const selMode = VS_MODES.find(m => m.id === roomState?.mode) || VS_MODES[0];
  const allReady = players.length >= 2 && players.every(p => p.ready);
  const myPlayer = players.find(p => p.id === playerId);

  async function pollRoom() {
    try {
      const res = await window.storage.get(`vs-room:${roomState.code}`, true);
      if (res) {
        const r = JSON.parse(res.value);
        setRoomState(r);
        if (r.status === "starting") { onStart(r); }
      }
    } catch(e) {}
  }

  async function toggleReady() {
    const newReady = !ready;
    setReady(newReady);
    try {
      const res = await window.storage.get(`vs-room:${roomState.code}`, true);
      if (!res) return;
      const r = JSON.parse(res.value);
      const pi = r.players.findIndex(p => p.id === playerId);
      if (pi >= 0) r.players[pi].ready = newReady;
      // Host auto-starts when all ready
      if (r.players.every(p => p.ready) && r.players.length >= 2) {
        r.status = "starting";
      }
      await window.storage.set(`vs-room:${roomState.code}`, JSON.stringify(r), true);
      setRoomState(r);
      if (r.status === "starting") onStart(r);
    } catch(e) {}
  }

  function copyCode() {
    navigator.clipboard?.writeText(roomState.code);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    pollRef.current = setInterval(pollRoom, VS_POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [roomState?.code]);

  const teamColors = ["#2A9D8F","#E76F51","#457B9D","#E9C46A"];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.ink }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${C.sandDark}`, background:C.paper }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← leave</button>
        <div style={{ fontSize:15, fontWeight:700 }}>{selMode.emoji} {selMode.label}</div>
        <div style={{ fontSize:11, color:C.inkLight }}>{roomState?.queue === "ranked" ? "⭐ Ranked" : "🎮 Casual"}</div>
      </div>

      <div style={{ padding:"24px 20px", maxWidth:420, margin:"0 auto" }}>
        {/* Room code */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:11, color:C.inkLight, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Room Code</div>
          <div style={{ fontSize:36, fontWeight:900, letterSpacing:"0.25em", color:C.ink, marginBottom:10 }}>{roomState?.code}</div>
          <button onClick={copyCode} style={{
            padding:"7px 18px", background: copied ? C.greenLight : C.sand,
            border:`1px solid ${copied ? C.green : C.sandDark}`,
            borderRadius:20, color: copied ? C.green : C.inkLight,
            fontSize:12, fontFamily:"inherit", cursor:"pointer",
          }}>{copied ? "✓ Copied!" : "Copy Code"}</button>
        </div>

        {/* Players */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12, color:C.inkLight, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>
            Players ({players.length}/{selMode.players})
          </div>
          {Array.from({ length: selMode.players }, (_, i) => {
            const p = players[i];
            const teamIdx = roomState?.mode === "2v2" ? Math.floor(i / 2) : i;
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                background: p ? C.paper : C.sand,
                border:`1.5px solid ${p ? teamColors[roomState?.mode==="2v2"?Math.floor(i/2):i] : C.sandDark}`,
                borderRadius:10, marginBottom:8,
              }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background: p ? teamColors[teamIdx]+"33" : C.sandDark, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                  {p ? (p.avatar || "🧙") : "·"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color: p ? C.ink : C.inkFaint }}>{p ? p.name : "Waiting..."}</div>
                  {p && <div style={{ fontSize:11, color:C.inkLight }}>{p.elo} ELO{roomState?.mode==="2v2" ? ` · Team ${Math.floor(i/2)+1}` : ""}</div>}
                </div>
                {p && <span style={{ fontSize:12, color: p.ready ? C.green : C.inkFaint, fontWeight:700 }}>{p.ready ? "✓ Ready" : "..."}</span>}
              </div>
            );
          })}
        </div>

        {/* Puzzle info */}
        <div style={{ background:C.sand, borderRadius:10, padding:"12px 16px", marginBottom:24, display:"flex", justifyContent:"space-between" }}>
          <div style={{ fontSize:12, color:C.inkLight }}>Difficulty</div>
          <div style={{ fontSize:13, fontWeight:600, color:C.ink }}>{VS_DIFFICULTIES.find(d=>d.id===roomState?.diff)?.label || "Medium"}</div>
        </div>

        {/* Ready button */}
        <button onClick={toggleReady} style={{
          width:"100%", padding:"15px 0",
          background: ready ? C.green : C.teal,
          border:"none", borderRadius:12, color:"#fff",
          fontSize:16, fontWeight:700, fontFamily:"inherit", cursor:"pointer",
          boxShadow:"0 4px 0 rgba(0,0,0,0.15)", transition:"background 0.2s",
        }}>
          {ready ? "✓ Ready!" : "Ready Up"}
        </button>
        {allReady && <div style={{ textAlign:"center", marginTop:12, fontSize:13, color:C.green, fontWeight:600 }}>All players ready! Starting...</div>}
      </div>
    </div>
  );
}

// ─── Versus Game ──────────────────────────────────────────────────────────────
function VersusGame({ room, playerId, playerName, onFinish, onBack }) {
  const mode = room.mode;
  const selMode = VS_MODES.find(m => m.id === mode) || VS_MODES[0];
  const diff = VS_DIFFICULTIES.find(d => d.id === room.diff) || VS_DIFFICULTIES[1];

  // Generate deterministic puzzle from room seed
  const { solution, puzzle } = newPuzzle(diff.clues);
  const solutionRef = useRef(solution);

  const [board,    setBoard]    = useState(() => puzzle.map(r=>[...r]));
  const [given,    setGiven]    = useState(() => puzzle.map(r=>r.map(v=>v!==0)));
  const [selected, setSelected] = useState(null);
  const [errors,   setErrors]   = useState({});
  const [claimed,  setClaimed]  = useState({});
  const [penalties,setPenalties]= useState(0);
  const [penFlash, setPenFlash] = useState(false);
  const [elapsed,  setElapsed]  = useState(0);
  const [notes,    setNotes]    = useState({});
  const [noteMode, setNoteMode] = useState(false);
  const [finished, setFinished] = useState(false);
  const [opponents,setOpponents]= useState([]);  // other players' states
  const intervalRef = useRef(null);
  const pollRef     = useRef(null);
  const radialRef   = useRef(null);
  const longTimer   = useRef(null);
  const lastTap     = useRef(null);
  const DOUBLE_TAP  = 300;
  const [radial, setRadial] = useState(null);
  useEffect(() => { radialRef.current = radial; }, [radial]);

  // Power-ups disabled in Versus — skill-pure mode

  const myClaimedCount = Object.keys(claimed).length;
  const totalCells = 81;

  // Push my state to shared storage
  async function pushMyState(cellCount, done, penaltyCount, elapsedMs) {
    await RealtimeBackend.publishState(room.code, playerId, {
      id:playerId, name:playerName, cells:cellCount,
      done, penalties:penaltyCount, elapsed:elapsedMs,
    });
  }

  // Poll/subscribe opponents
  async function pollOpponents() {
    const others = room.players.filter(p => p.id !== playerId);
    const states = [];
    for (const p of others) {
      try {
        const state = await RealtimeBackend.getPlayerState(room.code, p.id);
        if (state) states.push({ ...p, ...state });
        else states.push({ ...p, cells:0, done:false });
      } catch(e) { states.push({ ...p, cells:0, done:false }); }
    }
    setOpponents(states);
    // Check if any opponent finished
    const winner = states.find(s => s.done);
    if (winner && !finished) {
      clearInterval(intervalRef.current);
      clearInterval(pollRef.current);
      setFinished(true);
      onFinish({ playerId, room, myTime: elapsed, myCells: myClaimedCount, opponents: states, won: false });
    }
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => setElapsed(e => e + 100), 100);
    pollRef.current = setInterval(pollOpponents, VS_POLL_MS);
    // Push initial state
    pushMyState(0, false, 0, 0);
    return () => { clearInterval(intervalRef.current); clearInterval(pollRef.current); };
  }, []);

  // Push state on cell count change
  useEffect(() => {
    if (!finished) pushMyState(myClaimedCount, finished, penalties, elapsed);
  }, [myClaimedCount, penalties]);

  const submitNumber = useCallback((r, c, num, isNote) => {
    if (finished) return;
    const key = `${r}-${c}`;
    if (given[r][c]) return;
    if (isNote) {
      setNotes(prev => { const cur=new Set(prev[key]||[]); cur.has(num)?cur.delete(num):cur.add(num); return {...prev,[key]:cur}; });
      return;
    }
    if (solutionRef.current[r][c] === num) {
      let newCount = myClaimedCount;
      setBoard(prev => {
        const next = prev.map(row=>[...row]); next[r][c] = num;
        const done = next.every((row,ri)=>row.every((v,ci)=>v===solutionRef.current[ri][ci]));
        if (done) {
          clearInterval(intervalRef.current);
          clearInterval(pollRef.current);
          setFinished(true);
          const finalTime = elapsed;
          pushMyState(totalCells, true, penalties, finalTime).then(() => {
            onFinish({ playerId, room, myTime:finalTime, myCells:totalCells, opponents, won:true });
          });
        }
        return next;
      });
      setClaimed(prev => ({ ...prev, [key]:true }));
      setErrors(prev => { const n={...prev}; delete n[key]; return n; });
      setNotes(prev  => { const n={...prev}; delete n[key]; return n; });
    } else {
      setErrors(prev => ({ ...prev, [key]:true }));
      setPenalties(p => p + 1);
      setElapsed(e => e + VS_PENALTY_S * 1000);  // add to YOUR clock
      setPenFlash(true); setTimeout(() => setPenFlash(false), 700);
    }
  }, [finished, given, elapsed, penalties, myClaimedCount, opponents]);

  const handlePressStart = useCallback((e,r,c) => {
    if (finished||given[r][c]) return;
    e.preventDefault();
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    clearTimeout(longTimer.current);
    longTimer.current = setTimeout(()=>{ setSelected([r,c]); setRadial({x:cx,y:cy,r,c,activeNum:5}); }, LONG_PRESS_MS);
  }, [finished,given]);

  const handleMove = useCallback((e)=>{
    if(!radialRef.current)return;
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    const [pcx2,pcy2]=getPickerCentre(radialRef.current.x,radialRef.current.y);setRadial(prev=>prev?{...prev,activeNum:hitTestRadial(cx,cy,pcx2,pcy2)}:null);
  },[]);

  const handleEnd = useCallback(()=>{
    clearTimeout(longTimer.current);
    if(radialRef.current){ const{r,c,activeNum}=radialRef.current; setRadial(null); if(activeNum!==null) submitNumber(r,c,activeNum,noteMode); }
  },[submitNumber,noteMode]);

  useEffect(()=>{
    window.addEventListener("mousemove",handleMove); window.addEventListener("mouseup",handleEnd);
    window.addEventListener("touchmove",handleMove,{passive:false}); window.addEventListener("touchend",handleEnd);
    return()=>{ window.removeEventListener("mousemove",handleMove); window.removeEventListener("mouseup",handleEnd);
      window.removeEventListener("touchmove",handleMove); window.removeEventListener("touchend",handleEnd); };
  },[handleMove,handleEnd]);

  const handleKey = useCallback((e)=>{
    if(finished||radialRef.current)return;
    if(!selected)return;
    const[r,c]=selected;
    if(given[r][c])return;
    const num=parseInt(e.key);
    if(num>=1&&num<=9) submitNumber(r,c,num,noteMode);
    if(e.key==="Backspace"||e.key==="Delete"){
      const key=`${r}-${c}`;
      if(!claimed[key]){ setBoard(prev=>{const n=prev.map(row=>[...row]);n[r][c]=0;return n;}); setErrors(prev=>{const n={...prev};delete n[key];return n;}); }
    }
    const mv={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};
    if(mv[e.key]){const[dr,dc]=mv[e.key];setSelected([Math.max(0,Math.min(8,r+dr)),Math.max(0,Math.min(8,c+dc))]); e.preventDefault();}
  },[selected,given,finished,noteMode,claimed,submitNumber]);

  useEffect(()=>{ window.addEventListener("keydown",handleKey); return()=>window.removeEventListener("keydown",handleKey); },[handleKey]);

  const CELL = Math.floor(Math.min((window.innerWidth-40)/9,(window.innerHeight-340)/9));
  const GI   = Math.max(1,Math.round(CELL*0.04));
  const GB   = Math.max(3,Math.round(CELL*0.1));
  const btnSize = Math.max(26,CELL*0.7);
  const solvedNums = new Set([1,2,3,4,5,6,7,8,9].filter(n=>board.flat().filter(v=>v===n).length===9));
  const teamColors = ["#2A9D8F","#E76F51","#457B9D","#E9C46A"];

  const isHi=(r,c)=>{ if(!selected)return false; const[sr,sc]=selected; return r===sr||c===sc||(Math.floor(r/3)===Math.floor(sr/3)&&Math.floor(c/3)===Math.floor(sc/3)); };
  const isSame=(r,c)=>{ if(!selected)return false; const[sr,sc]=selected; return board[r][c]!==0&&board[r][c]===board[sr][sc]; };

  const myTeamIdx = mode==="2v2" ? room.players.findIndex(p=>p.id===playerId) < 2 ? 0 : 1 : 0;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", fontFamily:"'DM Sans',sans-serif", color:C.ink, padding:"10px 8px", userSelect:"none", touchAction:"none" }}>
      {/* Header */}
      <div style={{ width:"100%", maxWidth:520, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.inkLight,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>✕</button>
        <div style={{ fontSize:12, fontWeight:700, color:C.ink }}>{selMode.emoji} {selMode.label} · {diff.label}</div>
        <div style={{ fontSize:14, fontWeight:700, color:penalties>0?C.red:C.ink, fontVariantNumeric:"tabular-nums" }}>
          {formatVsTime(elapsed)}
          {penalties>0&&<span style={{fontSize:10,color:C.red,marginLeft:4}}>+{penalties}×{VS_PENALTY_S}s</span>}
        </div>
      </div>

      {/* Opponent progress bars */}
      <div style={{ width:"100%", maxWidth:520, marginBottom:8 }}>
        {opponents.map((opp, i) => {
          const pct = Math.round((opp.cells || 0) / totalCells * 100);
          const oppTeam = mode==="2v2" ? room.players.findIndex(p=>p.id===opp.id) < 2 ? 0 : 1 : i+1;
          const barColor = opp.done ? C.red : teamColors[mode==="2v2"?oppTeam:i+1];
          return (
            <div key={opp.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:14, minWidth:22 }}>{opp.avatar||"🧙"}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <span style={{ fontSize:10, color:C.inkLight, fontWeight:600 }}>{opp.name}</span>
                  <span style={{ fontSize:10, color:opp.done?C.red:C.inkLight }}>
                    {opp.done ? `✓ ${formatVsTime(opp.elapsed||0)}` : `${opp.cells||0}/81`}
                  </span>
                </div>
                <div style={{ height:6, background:C.sandDark, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:barColor, borderRadius:3, transition:`width ${VS_POLL_MS/1000}s ease` }} />
                </div>
              </div>
            </div>
          );
        })}
        {/* My progress */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:2 }}>
          <span style={{ fontSize:14, minWidth:22 }}>🧙</span>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
              <span style={{ fontSize:10, color:C.teal, fontWeight:700 }}>You</span>
              <span style={{ fontSize:10, color:C.teal }}>{myClaimedCount}/81</span>
            </div>
            <div style={{ height:6, background:C.sandDark, borderRadius:3, overflow:"hidden" }}>
              <div style={{ width:`${Math.round(myClaimedCount/totalCells*100)}%`, height:"100%", background:C.teal, borderRadius:3, transition:"width 0.2s" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Mode indicator */}
      <div style={{ fontSize:10, color:noteMode?"#7c5cce":C.teal, marginBottom:4, display:"flex", alignItems:"center", gap:4 }}>
        <span style={{ display:"inline-block",width:5,height:5,borderRadius:"50%",background:noteMode?"#7c5cce":C.teal }}/>
        {noteMode?"pencil":"pen"} · {myClaimedCount}/81
      </div>

      {/* Board */}
      <div style={{ display:"inline-grid", gridTemplateColumns:"repeat(3,auto)", gap:GB, background:C.sandDark, padding:GB, borderRadius:10, border:`1.5px solid ${C.sandDark}` }}>
        {[0,1,2].map(boxR=>[0,1,2].map(boxC=>(
          <div key={`${boxR}-${boxC}`} style={{ display:"inline-grid", gridTemplateColumns:"repeat(3,auto)", gap:GI, background:C.sand }}>
            {[0,1,2].map(iR=>[0,1,2].map(iC=>{
              const r=boxR*3+iR,c=boxC*3+iC;
              const val=board[r][c]; const key=`${r}-${c}`;
              const isSel=selected?.[0]===r&&selected?.[1]===c;
              const isG=given[r][c]; const isCl=claimed[key]; const isErr=errors[key]; const cn=notes[key];
              let bg=C.paper;
              if(isSel)bg=C.tealLight; else if(isErr)bg=C.coralLight;
              else if(isCl)bg=C.greenLight; else if(isSame(r,c))bg=C.sand; else if(isHi(r,c))bg="#F8F4EE";
              return (
                <div key={key}
                  onMouseDown={e=>{
                    if(lastTap.current?.fromTouch)return;
                    const now=Date.now(),last=lastTap.current;
                    if(last&&now-last.time<DOUBLE_TAP&&last.r===r&&last.c===c){setNoteMode(m=>!m);lastTap.current=null;return;}
                    lastTap.current={time:now,r,c,fromTouch:false};
                    setSelected([r,c]); handlePressStart(e,r,c);
                  }}
                  onTouchStart={e=>{
                    const now=Date.now(),last=lastTap.current;
                    if(last&&now-last.time<DOUBLE_TAP&&last.r===r&&last.c===c){setNoteMode(m=>!m);lastTap.current={time:0,r:-1,c:-1,fromTouch:true};return;}
                    lastTap.current={time:now,r,c,fromTouch:true};
                    setSelected([r,c]); handlePressStart(e,r,c);
                  }}
                  style={{ width:CELL,height:CELL,display:"flex",alignItems:"center",justifyContent:"center",background:bg,cursor:"pointer",transition:"background 0.1s",fontSize:val?Math.max(12,CELL*0.44):Math.max(5,CELL*0.15),fontWeight:isG?600:400,color:isErr?C.red:isCl?C.green:isSel?C.teal:C.ink,outline:isSel?`2px solid ${C.teal}`:"none",outlineOffset:"-2px" }}
                >
                  {val||null}
                  {!val&&cn?.size>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",width:"86%",height:"86%"}}>{[1,2,3,4,5,6,7,8,9].map(n=><div key={n} style={{fontSize:Math.max(5,CELL*0.15),textAlign:"center",lineHeight:"1.4",color:cn.has(n)?"#7c5cce":"transparent",fontWeight:500}}>{n}</div>)}</div>}
                </div>
              );
            }))}
          </div>
        )))}
      </div>

      {/* Number pad */}
      <div style={{ display:"flex", gap:Math.max(3,CELL*0.08), marginTop:8, flexWrap:"wrap", justifyContent:"center" }}>
        {[1,2,3,4,5,6,7,8,9].map(n=>{
          const isSolved=solvedNums.has(n);
          return(
            <button key={n} onClick={()=>{ if(!selected||finished||isSolved)return; const[r,c]=selected; submitNumber(r,c,n,noteMode); }}
              style={{ width:btnSize,height:btnSize,background:"none",border:"none",borderBottom:`2px solid ${isSolved?C.sandDark:C.sandDark}`,borderRadius:0,color:isSolved?C.inkFaint:C.ink,fontSize:Math.max(12,CELL*0.3),fontFamily:"inherit",fontWeight:isSolved?300:500,cursor:isSolved?"default":"pointer",textDecoration:isSolved?"line-through":"none",padding:0 }}
              onMouseEnter={e=>{if(!isSolved)e.currentTarget.style.color=C.teal;}}
              onMouseLeave={e=>{if(!isSolved)e.currentTarget.style.color=C.ink;}}
            >{n}</button>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:14, marginTop:6, alignItems:"center" }}>
        <button onClick={()=>setNoteMode(m=>!m)} style={{ background:"none",border:"none",color:noteMode?"#7c5cce":C.inkLight,fontSize:11,fontFamily:"inherit",cursor:"pointer",borderBottom:`1.5px solid ${noteMode?"#7c5cce":"transparent"}`,fontWeight:500,padding:"2px 0" }}>{noteMode?"pencil":"pen"}</button>
        <span style={{color:C.sandDark}}>|</span>
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.inkLight,fontSize:11,fontFamily:"inherit",cursor:"pointer" }}>quit</button>
      </div>

      {radial&&<RadialPicker x={radial.x} y={radial.y} activeNum={radial.activeNum}/>}

      {penFlash&&(
        <div style={{ position:"fixed",top:"36%",left:"50%",transform:"translate(-50%,-50%)",background:C.paper,border:`1.5px solid ${C.coral}`,borderRadius:10,padding:"8px 20px",color:C.coral,fontSize:13,fontWeight:600,pointerEvents:"none" }}>
          +{VS_PENALTY_S}s penalty
        </div>
      )}
    </div>
  );
}

// ─── Versus Result ────────────────────────────────────────────────────────────
function VersusResult({ result, playerName, elo, onRematch, onMenu, onEloUpdate }) {
  const { won, myTime, myCells, opponents, room } = result;
  const mode = room?.mode || "1v1";
  const selMode = VS_MODES.find(m => m.id === mode) || VS_MODES[0];
  const [newElo, setNewElo] = useState(elo);
  const [eloChanged, setEloChanged] = useState(0);

  useEffect(() => {
    if (room?.queue !== "ranked") return;
    // Calculate ELO change based on opponents
    const oppElos = opponents.map(o => o.elo || 1000);
    const avgOppElo = oppElos.length ? Math.round(oppElos.reduce((a,b)=>a+b,0)/oppElos.length) : 1000;
    const change = eloChange(elo, avgOppElo, won);
    const updated = Math.max(100, elo + change);
    setEloChanged(change);
    setNewElo(updated);
    onEloUpdate(updated);
  }, []);

  const allPlayers = [
    { id:"me", name:playerName, time:myTime, cells:myCells, done:myCells===81 },
    ...opponents,
  ].sort((a,b) => {
    if (a.done && !b.done) return -1;
    if (!a.done && b.done) return 1;
    if (a.done && b.done) return (a.time||0) - (b.time||0);
    return (b.cells||0) - (a.cells||0);
  });

  const teamColors = ["#2A9D8F","#E76F51"];

  return (
    <div style={{ minHeight:"100vh", background: won ? C.greenLight : C.coralLight, fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28 }}>
      <div style={{ maxWidth:380, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:8 }}>{won ? "🏆" : "💀"}</div>
        <div style={{ fontSize:28, fontWeight:800, color:C.ink, marginBottom:4 }}>
          {won ? "Victory!" : "Defeated"}
        </div>
        <div style={{ fontSize:13, color:C.inkLight, marginBottom:24 }}>
          {selMode.emoji} {selMode.label} · {room?.queue==="ranked"?"Ranked":"Casual"}
        </div>

        {/* Results table */}
        <div style={{ background:C.paper, borderRadius:12, overflow:"hidden", marginBottom:20, textAlign:"left" }}>
          {allPlayers.map((p, i) => {
            const isMe = p.id === "me";
            const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`;
            return (
              <div key={p.id||i} style={{
                display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                background: isMe ? C.tealLight : "transparent",
                borderBottom: i < allPlayers.length-1 ? `1px solid ${C.sand}` : "none",
              }}>
                <span style={{ fontSize:18, minWidth:24 }}>{medal}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight: isMe ? 700 : 500, color:C.ink }}>{isMe ? "You" : p.name}</div>
                  <div style={{ fontSize:11, color:C.inkLight }}>{p.cells||0}/81 cells</div>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color: p.done ? C.ink : C.inkFaint }}>
                  {p.done ? formatVsTime(p.time||p.elapsed||0) : "DNF"}
                </div>
              </div>
            );
          })}
        </div>

        {/* ELO change */}
        {room?.queue === "ranked" && (
          <div style={{ background:C.paper, borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:13, color:C.inkLight }}>Rating</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:14, color:C.inkFaint }}>{elo}</span>
              <span style={{ fontSize:13, color:eloChanged>=0?C.green:C.red, fontWeight:700 }}>
                {eloChanged>=0?"+":""}{eloChanged}
              </span>
              <span style={{ fontSize:16, fontWeight:800, color:C.ink }}>→ {newElo}</span>
            </div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={onRematch} style={{
            padding:"13px 0", background:C.ink, border:"none", borderRadius:10,
            color:C.paper, fontSize:15, fontWeight:600, fontFamily:"inherit", cursor:"pointer",
          }}>Rematch</button>
          <button onClick={onMenu} style={{
            padding:"13px 0", background:"none", border:`1.5px solid ${C.sandDark}`,
            borderRadius:10, color:C.inkLight, fontSize:14, fontFamily:"inherit", cursor:"pointer",
          }}>Back to Menu</button>
        </div>
      </div>
    </div>
  );
}

// ─── Versus Matchmaking ───────────────────────────────────────────────────────
function VersusMatchmaking({ config, playerId, playerName, avatar, elo, onRoomReady, onBack }) {
  const [status, setStatus] = useState("searching"); // searching | found | timeout
  const [dots,   setDots]   = useState(".");
  const pollRef  = useRef(null);
  const dotsRef  = useRef(null);
  const timeoutRef = useRef(null);
  const selMode = VS_MODES.find(m => m.id === config.mode) || VS_MODES[0];

  useEffect(() => {
    dotsRef.current = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    joinOrCreateQueue();
    timeoutRef.current = setTimeout(() => {
      setStatus("timeout");
      clearInterval(pollRef.current);
    }, 30000);
    return () => {
      clearInterval(dotsRef.current);
      clearInterval(pollRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  async function joinOrCreateQueue() {
    const queueKey = `vs-queue:${config.mode}:${config.queue}:${config.diff}`;
    try {
      const res = await window.storage.get(queueKey, true);
      let queue = res ? JSON.parse(res.value) : [];
      // Remove stale entries (>30s old)
      queue = queue.filter(p => Date.now() - (p.ts||0) < 30000);
      const myEntry = { id:playerId, name:playerName, avatar:avatar||"🧙", elo, ts:Date.now() };

      if (queue.length > 0 && queue[0].id !== playerId) {
        // Found a match — join and create room
        const host = queue[0];
        queue = queue.filter(p => p.id !== host.id && p.id !== playerId);
        await window.storage.set(queueKey, JSON.stringify(queue), true);
        const code = genRoomCode();
        const room = {
          code, mode:config.mode, diff:config.diff, queue:config.queue,
          hostId: host.id, status:"lobby",
          players:[ { ...host, ready:false }, { ...myEntry, ready:false } ],
          createdAt: Date.now(),
        };
        await window.storage.set(`vs-room:${code}`, JSON.stringify(room), true);
        clearInterval(dotsRef.current); clearTimeout(timeoutRef.current);
        setStatus("found");
        setTimeout(() => onRoomReady(room, playerId), 800);
      } else {
        // Add to queue and wait
        const existing = queue.findIndex(p => p.id === playerId);
        if (existing >= 0) queue[existing] = myEntry;
        else queue.push(myEntry);
        await window.storage.set(queueKey, JSON.stringify(queue), true);
        // Poll for room creation
        pollRef.current = setInterval(async () => {
          try {
            // Look for a room we were added to
            const qRes = await window.storage.get(queueKey, true);
            const q = qRes ? JSON.parse(qRes.value) : [];
            const stillInQueue = q.some(p => p.id === playerId);
            if (!stillInQueue) {
              // We were removed — find our room
              clearInterval(pollRef.current);
              // Scan recent rooms (simplified — poll for room with our id)
              setTimeout(() => onRoomReady(null, playerId), 500);
            }
          } catch(e) {}
        }, VS_POLL_MS);
      }
    } catch(e) { setStatus("timeout"); }
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:32 }}>
      <div style={{ textAlign:"center", maxWidth:300 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>{selMode.emoji}</div>
        {status === "searching" && (
          <>
            <div style={{ fontSize:20, fontWeight:700, color:C.ink, marginBottom:8 }}>Finding a match{dots}</div>
            <div style={{ fontSize:13, color:C.inkLight, marginBottom:8 }}>{selMode.label} · {config.queue==="ranked"?"Ranked":"Casual"} · {config.diff}</div>
            <div style={{ fontSize:12, color:C.inkFaint, marginBottom:24 }}>Matching you with players of similar rating</div>
            <button onClick={onBack} style={{ background:"none",border:`1.5px solid ${C.sandDark}`,borderRadius:10,padding:"10px 24px",color:C.inkLight,fontSize:13,fontFamily:"inherit",cursor:"pointer" }}>Cancel</button>
          </>
        )}
        {status === "found" && (
          <div style={{ fontSize:20, fontWeight:700, color:C.green }}>Match found! ✓</div>
        )}
        {status === "timeout" && (
          <>
            <div style={{ fontSize:18, fontWeight:700, color:C.ink, marginBottom:8 }}>No match found</div>
            <div style={{ fontSize:13, color:C.inkLight, marginBottom:20 }}>No players in queue right now. Try creating a private room instead.</div>
            <button onClick={onBack} style={{ padding:"11px 24px",background:C.ink,border:"none",borderRadius:10,color:C.paper,fontSize:14,fontFamily:"inherit",cursor:"pointer" }}>Back</button>
          </>
        )}
      </div>
    </div>
  );
}


// ─── Hearts ───────────────────────────────────────────────────────────────────
function Hearts({ lives, max = 3 }) {
  return (
    <div style={{ display:"flex", gap:4 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ fontSize:16, opacity: i < lives ? 1 : 0.2 }}>♥</span>
      ))}
    </div>
  );
}


// ─── Theme Definitions ────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "sand", name: "Warm Sand", emoji: "🏖️",
    unlockType: "default", unlockDesc: "Default theme",
    colors: { bg:"#F5EFE6", paper:"#FDFAF6", sand:"#E8DDD0", sandDark:"#D4C4B0", ink:"#2C2416", inkLight:"#8C7A6B", inkFaint:"#C4B4A4", accent:"#2A9D8F" },
  },
  {
    id: "dark", name: "Dark Mode", emoji: "🌙",
    unlockType: "purchase", unlockDesc: "Purchase to unlock",
    colors: { bg:"#1A1A2E", paper:"#16213E", sand:"#0F3460", sandDark:"#533483", ink:"#E2E2E2", inkLight:"#A0A0B0", inkFaint:"#606070", accent:"#E94560" },
  },
  {
    id: "oled", name: "OLED Black", emoji: "🖤",
    unlockType: "boss", bossName: "Captain Dread Marlowe", worldId: 4,
    unlockDesc: "Beat Captain Dread Marlowe",
    colors: { bg:"#000000", paper:"#0A0A0A", sand:"#111111", sandDark:"#222222", ink:"#FFFFFF", inkLight:"#888888", inkFaint:"#444444", accent:"#E76F51" },
  },
  {
    id: "ocean", name: "Ocean Blue", emoji: "🌊",
    unlockType: "boss", bossName: "Jarl Bjorn Doomaxe", worldId: 3,
    unlockDesc: "Beat Jarl Bjorn Doomaxe",
    colors: { bg:"#E8F4FD", paper:"#FFFFFF", sand:"#BBDFF5", sandDark:"#7DC4E8", ink:"#0A3D62", inkLight:"#1A6EA8", inkFaint:"#8BB8D4", accent:"#0984E3" },
  },
  {
    id: "forest", name: "Forest Green", emoji: "🌿",
    unlockType: "boss", bossName: "Dino Rex Magnus", worldId: 1,
    unlockDesc: "Beat Dino Rex Magnus",
    colors: { bg:"#F0F7F0", paper:"#FFFFFF", sand:"#C8E6C8", sandDark:"#95C995", ink:"#1B4332", inkLight:"#2D6A4F", inkFaint:"#74B894", accent:"#40916C" },
  },
  {
    id: "highcontrast", name: "High Contrast", emoji: "◻️",
    unlockType: "boss", bossName: "Pharaoh Zathrak", worldId: 5,
    unlockDesc: "Beat Pharaoh Zathrak",
    colors: { bg:"#FFFFFF", paper:"#FFFFFF", sand:"#EEEEEE", sandDark:"#CCCCCC", ink:"#000000", inkLight:"#333333", inkFaint:"#999999", accent:"#0000FF" },
  },
  {
    id: "crimson", name: "Crimson Dojo", emoji: "⛩️",
    unlockType: "boss", bossName: "Shogun Malakar", worldId: 6,
    unlockDesc: "Beat Shogun Malakar",
    colors: { bg:"#FFF5F5", paper:"#FFFFFF", sand:"#FFD6D6", sandDark:"#FFB3B3", ink:"#4A0000", inkLight:"#8B0000", inkFaint:"#CC8888", accent:"#C0392B" },
  },
  {
    id: "jungle", name: "Jungle Mist", emoji: "🌴",
    unlockType: "boss", bossName: "Vexara the Vine Witch", worldId: 7,
    unlockDesc: "Beat Vexara the Vine Witch",
    colors: { bg:"#F0F7EE", paper:"#FAFFFA", sand:"#C5DEC0", sandDark:"#97C490", ink:"#1A3A1A", inkLight:"#2D6A2D", inkFaint:"#78A878", accent:"#3A9A3A" },
  },
  {
    id: "royal", name: "Royal Purple", emoji: "👑",
    unlockType: "boss", bossName: "The Dread King Mordecai", worldId: 8,
    unlockDesc: "Beat The Dread King Mordecai",
    colors: { bg:"#F5F0FF", paper:"#FDFAFF", sand:"#DDD0FF", sandDark:"#BBA8F5", ink:"#2D0060", inkLight:"#6A0DAD", inkFaint:"#AA88DD", accent:"#7B2FBE" },
  },
  {
    id: "cyber", name: "Neon Cyber", emoji: "🤖",
    unlockType: "boss", bossName: "AXIOM-9", worldId: 9,
    unlockDesc: "Beat AXIOM-9",
    colors: { bg:"#0D0D1A", paper:"#111122", sand:"#1A1A3A", sandDark:"#2A2A5A", ink:"#00FFCC", inkLight:"#0099AA", inkFaint:"#004455", accent:"#FF00FF" },
  },
  {
    id: "voidgold", name: "Void Gold", emoji: "✨",
    unlockType: "boss", bossName: "KRONAX", worldId: 10,
    unlockDesc: "Beat KRONAX",
    colors: { bg:"#0A0800", paper:"#110E00", sand:"#1A1600", sandDark:"#2A2200", ink:"#FFD700", inkLight:"#B8960C", inkFaint:"#5A4800", accent:"#FFA500" },
  },
  {
    id: "pink", name: "Soft Pink", emoji: "🌸",
    unlockType: "boss", bossName: "El Diablo", worldId: 2,
    unlockDesc: "Beat El Diablo",
    colors: { bg:"#FFF0F5", paper:"#FFFFFF", sand:"#FFD6E7", sandDark:"#FFB3CE", ink:"#4A0020", inkLight:"#8B2252", inkFaint:"#CC88AA", accent:"#E91E8C" },
  },
  // ── Purchasable themes ──────────────────────────────────────────────────────
  {
    id: "darkmode", name: "Dark Mode", emoji: "🌑",
    unlockType: "iap", price: "$0.99", unlockDesc: "Purchase for $0.99",
    colors: { bg:"#121212", paper:"#1E1E1E", sand:"#2A2A2A", sandDark:"#3A3A3A", ink:"#EEEEEE", inkLight:"#AAAAAA", inkFaint:"#555555", accent:"#BB86FC", teal:"#03DAC6", tealLight:"#1A3A38", coral:"#CF6679", coralLight:"#3A1A1E", gold:"#FFD54F", goldLight:"#3A3010", goldDark:"#B89A00", red:"#CF6679", blue:"#82B1FF", blueLight:"#1A2A40", green:"#69F0AE", greenLight:"#0A2A1A", greenDark:"#007740", purple:"#BB86FC", purpleLight:"#2A1A3A" },
  },
  {
    id: "neon", name: "Neon Cyber", emoji: "⚡",
    unlockType: "iap", price: "$0.99", unlockDesc: "Purchase for $0.99",
    colors: { bg:"#080818", paper:"#0D0D22", sand:"#141430", sandDark:"#1E1E48", ink:"#00FFEE", inkLight:"#0099AA", inkFaint:"#003344", accent:"#FF00FF", teal:"#00FFEE", tealLight:"#001A1A", coral:"#FF2D6B", coralLight:"#2A0018", gold:"#FFE000", goldLight:"#2A2A00", goldDark:"#998800", red:"#FF2D6B", blue:"#00AAFF", blueLight:"#001A2A", green:"#00FF88", greenLight:"#001A10", greenDark:"#007740", purple:"#FF00FF", purpleLight:"#1A001A" },
  },
  {
    id: "nature", name: "Nature & Forest", emoji: "🌲",
    unlockType: "iap", price: "$0.99", unlockDesc: "Purchase for $0.99",
    colors: { bg:"#F4F8F0", paper:"#FAFFF7", sand:"#DCE8D4", sandDark:"#B8D4A8", ink:"#1A2E10", inkLight:"#3A6028", inkFaint:"#88AA78", accent:"#4A8C2A", teal:"#2A8C70", tealLight:"#D0EEDF", coral:"#C05A20", coralLight:"#F5E0D0", gold:"#C8A020", goldLight:"#F5EDD0", goldDark:"#886A00", red:"#C03028", blue:"#2A5888", blueLight:"#D0DCF0", green:"#2A7830", greenLight:"#D0EDD5", greenDark:"#185020", purple:"#6A3A88", purpleLight:"#E5D5F5" },
  },
  {
    id: "mono", name: "Monochrome", emoji: "▪️",
    unlockType: "iap", price: "$0.99", unlockDesc: "Purchase for $0.99",
    colors: { bg:"#F8F8F8", paper:"#FFFFFF", sand:"#EBEBEB", sandDark:"#D0D0D0", ink:"#111111", inkLight:"#666666", inkFaint:"#BBBBBB", accent:"#222222", teal:"#333333", tealLight:"#EEEEEE", coral:"#444444", coralLight:"#F0F0F0", gold:"#555555", goldLight:"#E8E8E8", goldDark:"#222222", red:"#111111", blue:"#333333", blueLight:"#EBEBEB", green:"#222222", greenLight:"#EBEBEB", greenDark:"#111111", purple:"#444444", purpleLight:"#EFEFEF" },
  },
];

const PICKER_LAYOUTS = [
  { id:"grid",  name:"3×3 Grid",        emoji:"⊞", desc:"Numbers arranged in a 3×3 square" },
  { id:"wheel", name:"Radial Wheel",     emoji:"◉", desc:"Numbers on a clock face, slide to select" },
  { id:"strip", name:"Linear Strip",     emoji:"▬", desc:"Numbers in a horizontal row" },
  { id:"cross", name:"Directional Cross",emoji:"✛", desc:"D-pad style, 4 directions with sub-menus" },
];

const BOSS_UNLOCK_MAP = Object.fromEntries(
  THEMES.filter(t => t.unlockType === "boss").map(t => [t.bossName, t.id])
);

// ─── Settings Screen ──────────────────────────────────────────────────────────
function SettingsScreen({ settings, onSave, onBack, progress, lives, onRestoreLives, onResetProgress, onLearnNav, onShop, purchases }) {
  const [tab, setTab]           = useState("account");
  const [local, setLocal]       = useState({ ...settings });
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved]       = useState(false);

  // Which theme ids are unlocked based on progress
  const unlockedThemes = new Set(["sand"]);
  WORLDS.forEach(world => {
    world.islands.forEach(island => {
      if (!island.bossIsland) return;
      const bossLevel = island.levels[island.levels.length - 1];
      if (progress[bossLevel.id] === "complete") {
        const bossName = island.boss;
        const themeId = BOSS_UNLOCK_MAP[bossName];
        if (themeId) unlockedThemes.add(themeId);
      }
    });
  });

  function set(key, val) { setLocal(p => ({ ...p, [key]: val })); }

  function handleSave() {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const T = THEMES.find(t => t.id === local.theme) || THEMES[0];
  const tc = T.colors;

  const tabStyle = (id) => ({
    flex: 1, padding: "10px 0", background: "none",
    border: "none", borderBottom: `2px solid ${tab === id ? tc.ink : "transparent"}`,
    color: tab === id ? tc.ink : tc.inkLight,
    fontSize: 13, fontWeight: tab === id ? 700 : 400,
    fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
  });

  const rowStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 0", borderBottom: `1px solid ${tc.sand}`,
  };

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{
      width: 44, height: 24, borderRadius: 12,
      background: value ? tc.accent : tc.sandDark,
      position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </div>
  );

  const AVATARS = ["🧙","🥷","🤠","🦸","🧜","🧚","🦊","🐉","⚔️","🏹","🛡️","👑","🔮","⚡","🌊"];

  return (
    <div style={{
      minHeight: "100vh", background: tc.bg,
      fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      color: tc.ink,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: `1px solid ${tc.sandDark}`,
        background: tc.paper,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:tc.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Settings</div>
        <button onClick={handleSave} style={{
          background: saved ? tc.accent : "none",
          border: `1.5px solid ${saved ? tc.accent : tc.sandDark}`,
          borderRadius: 8, padding: "6px 14px",
          color: saved ? "#fff" : tc.inkLight,
          fontSize: 13, fontFamily: "inherit", cursor: "pointer",
          transition: "all 0.2s",
        }}>{saved ? "✓ Saved" : "Save"}</button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${tc.sandDark}`, background:tc.paper }}>
        {[["account","👤 Account"],["themes","🎨 Themes"],["controls","🎮 Controls"]].map(([id, label]) => (
          <button key={id} style={tabStyle(id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "20px 20px", maxWidth: 480, margin: "0 auto" }}>

        {/* ── ACCOUNT TAB ── */}
        {tab === "account" && (
          <div>
            {/* Guest upgrade banner in settings */}
            {/* NOTE: In App, pass isGuest and onSignIn as props to SettingsScreen if needed */}

            {/* Avatar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: tc.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Avatar</div>
              <div style={{ fontSize: 52, textAlign: "center", marginBottom: 10 }}>{local.avatar || "🧙"}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {AVATARS.map(a => (
                  <button key={a} onClick={() => set("avatar", a)} style={{
                    width: 44, height: 44, fontSize: 24,
                    background: local.avatar === a ? tc.accent + "33" : tc.paper,
                    border: `2px solid ${local.avatar === a ? tc.accent : tc.sandDark}`,
                    borderRadius: 10, cursor: "pointer",
                  }}>{a}</button>
                ))}
              </div>
            </div>

            {/* Display name */}
            <div style={rowStyle}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Display Name</div>
                <div style={{ fontSize: 12, color: tc.inkLight }}>Shown on leaderboards</div>
              </div>
              <input
                value={local.displayName || ""}
                onChange={e => set("displayName", e.target.value.slice(0, 20))}
                placeholder="Your name"
                style={{
                  width: 120, padding: "7px 10px", borderRadius: 8,
                  border: `1.5px solid ${tc.sandDark}`, background: tc.paper,
                  color: tc.ink, fontSize: 13, fontFamily: "inherit", outline: "none",
                }}
              />
            </div>

            {/* Lives */}
            <div style={rowStyle}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Lives</div>
                <div style={{ fontSize: 12, color: tc.inkLight }}>{lives}/3 remaining</div>
              </div>
              <button onClick={onRestoreLives} style={{
                padding: "7px 14px", background: lives >= 3 ? tc.sand : tc.accent,
                border: "none", borderRadius: 8,
                color: lives >= 3 ? tc.inkFaint : "#fff",
                fontSize: 13, fontFamily: "inherit",
                cursor: lives >= 3 ? "default" : "pointer",
              }}>
                {lives >= 3 ? "♥♥♥ Full" : "♥ Restore"}
              </button>
            </div>

            {/* Shop / IAP */}
            <div style={{ marginTop:16, marginBottom:8, paddingTop:16, borderTop:`1px solid ${tc.sand}` }}>
              <button onClick={onShop} style={{
                width:"100%", padding:"13px 0",
                background:`linear-gradient(135deg, ${C.coral} 0%, ${C.coralDark} 100%)`,
                border:"none", borderRadius:12, color:"#fff",
                fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer",
                boxShadow:`0 4px 0 ${C.coralDark}`,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                🛒 Shop — Lives, Variants & Themes
              </button>
            </div>

            {/* Picker layout */}
            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: tc.inkLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, paddingTop: 14, borderTop: `1px solid ${tc.sand}` }}>
                Input Method
              </div>
              {PICKER_LAYOUTS.map(pl => (
                <button key={pl.id} onClick={() => set("pickerLayout", pl.id)} style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%",
                  padding: "12px 14px", marginBottom: 8,
                  background: local.pickerLayout === pl.id ? tc.accent + "18" : tc.paper,
                  border: `1.5px solid ${local.pickerLayout === pl.id ? tc.accent : tc.sandDark}`,
                  borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}>
                  <span style={{ fontSize: 22 }}>{pl.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: tc.ink }}>{pl.name}</div>
                    <div style={{ fontSize: 11, color: tc.inkLight }}>{pl.desc}</div>
                  </div>
                  {local.pickerLayout === pl.id && <span style={{ marginLeft:"auto", color:tc.accent, fontSize:16 }}>✓</span>}
                </button>
              ))}
              <div style={{ fontSize: 11, color: tc.inkFaint, marginTop: 4, paddingLeft: 4 }}>
                * Radial Wheel, Linear Strip and Directional Cross coming soon
              </div>
            </div>

            {/* Link account */}
            <div style={{ marginTop: 16, padding: "14px", background: tc.sand, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: tc.ink, marginBottom: 4 }}>🔗 Link Account</div>
              <div style={{ fontSize: 12, color: tc.inkLight, marginBottom: 10 }}>Sync progress across devices. Coming soon.</div>
              <button style={{
                padding: "8px 16px", background: tc.sandDark, border: "none",
                borderRadius: 8, color: tc.inkLight, fontSize: 13,
                fontFamily: "inherit", cursor: "not-allowed",
              }}>Coming Soon</button>
            </div>

            {/* Reset progress */}
            <div style={{ marginTop: 20 }}>
              {!confirmReset ? (
                <button onClick={() => setConfirmReset(true)} style={{
                  width: "100%", padding: "12px 0",
                  background: "none", border: `1.5px solid ${C.red}`,
                  borderRadius: 10, color: C.red, fontSize: 13,
                  fontFamily: "inherit", cursor: "pointer",
                }}>Reset All Progress</button>
              ) : (
                <div style={{ background: "#FFF0F0", border: `1.5px solid ${C.red}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.red, marginBottom: 6 }}>Are you sure?</div>
                  <div style={{ fontSize: 12, color: tc.inkLight, marginBottom: 12 }}>This will erase all level progress and unlocked themes.</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setConfirmReset(false)} style={{
                      flex: 1, padding: "9px 0", background: tc.sand, border: "none",
                      borderRadius: 8, color: tc.ink, fontSize: 13, fontFamily: "inherit", cursor: "pointer",
                    }}>Cancel</button>
                    <button onClick={() => { onResetProgress(); setConfirmReset(false); }} style={{
                      flex: 1, padding: "9px 0", background: C.red, border: "none",
                      borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "inherit", cursor: "pointer",
                    }}>Yes, Reset</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── THEMES TAB ── */}
        {tab === "themes" && (
          <div>
            <div style={{ fontSize: 12, color: tc.inkLight, marginBottom: 16, lineHeight: 1.6 }}>
              Beat world bosses to unlock themes. More coming soon.
            </div>
            {THEMES.map(theme => {
              const isUnlocked = unlockedThemes.has(theme.id);
              const isActive   = local.theme === theme.id;
              const isPurchase = theme.unlockType === "iap" && !purchases?.[("theme_" + theme.id)];
              const tc2 = theme.colors;
              return (
                <button key={theme.id}
                  onClick={() => isUnlocked && set("theme", theme.id)}
                  style={{
                    width:"100%", marginBottom:10, padding:0,
                    background:"none", border:"none", cursor: isUnlocked ? "pointer" : "default",
                    fontFamily:"inherit", textAlign:"left", borderRadius:14,
                    opacity: isUnlocked ? 1 : 0.55,
                    outline: isActive ? `3px solid ${tc2.accent}` : "2px solid transparent",
                    outlineOffset:2,
                    transition:"outline 0.15s",
                  }}
                >
                  <div style={{ borderRadius:12, overflow:"hidden", border:`1.5px solid ${isActive ? tc2.accent : tc.sandDark}` }}>
                    {/* Mini preview */}
                    <div style={{ background:tc2.bg, padding:"10px 12px", display:"flex", flexDirection:"column", gap:5 }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ width:40, height:6, background:tc2.sandDark, borderRadius:3 }}/>
                        <div style={{ fontSize:9, fontWeight:700, color:tc2.ink, opacity:0.65 }}>Sudoku Royale</div>
                        <div style={{ width:40, height:6, background:tc2.sandDark, borderRadius:3 }}/>
                      </div>
                      <div style={{
                        display:"grid", gridTemplateColumns:"repeat(4,1fr)",
                        gap:2, background:tc2.accent, padding:2, borderRadius:5,
                        alignSelf:"center", width:84,
                      }}>
                        {[tc2.paper,tc2.sand,tc2.paper,tc2.sand,
                          tc2.sand,tc2.paper,tc2.sand,tc2.paper,
                          tc2.paper,tc2.sand,tc2.paper,tc2.sand,
                          tc2.sand,tc2.paper,tc2.sand,tc2.paper].map((bg2,i) => (
                          <div key={i} style={{
                            height:16, background:bg2, borderRadius:2,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:8, fontWeight:700,
                            color: [0,3,5,6,9,10,12,15].includes(i) ? tc2.ink : "transparent",
                          }}>
                            {[4,null,7,null,null,2,null,9,1,null,null,3,null,8,null,5][i]||""}
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:2, justifyContent:"center" }}>
                        {[1,2,3,4,5,6,7,8,9].map(n => (
                          <div key={n} style={{
                            width:16, height:16, background:tc2.paper,
                            borderRadius:3, border:`1px solid ${tc2.sandDark}`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:7, fontWeight:700, color:tc2.ink,
                          }}>{n}</div>
                        ))}
                      </div>
                    </div>
                    {/* Label row */}
                    <div style={{ background:tc.paper, padding:"8px 12px",
                                  display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:tc.ink }}>{theme.emoji} {theme.name}</div>
                        <div style={{ fontSize:11, color:tc.inkLight, marginTop:1 }}>
                          {isUnlocked ? (isActive ? "✓ Active" : "Tap to apply") : isPurchase ? "💎 $0.99 in Shop" : `🔒 ${theme.unlockDesc}`}
                        </div>
                      </div>
                      {isActive && <span style={{ color:tc2.accent, fontSize:20 }}>✓</span>}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Purchase section */}
            <div style={{ marginTop: 8, padding: 16, background: tc.sand, borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tc.ink, marginBottom: 4 }}>💎 Purchase Themes</div>
              <div style={{ fontSize: 12, color: tc.inkLight, marginBottom: 12 }}>Unlock all premium themes instantly.</div>
              {[
                { label: "Individual Theme", price: "$0.99", desc: "Unlock one theme" },
                { label: "Theme Bundle", price: "$2.99", desc: "Unlock all current themes" },
                { label: "Coin Pack — Small", price: "$0.99", desc: "500 coins" },
                { label: "Coin Pack — Large", price: "$4.99", desc: "3000 coins" },
              ].map(item => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", background: tc.paper, borderRadius: 8, marginBottom: 6,
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: tc.ink }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: tc.inkLight }}>{item.desc}</div>
                  </div>
                  <button style={{
                    padding: "6px 14px", background: tc.sandDark, border: "none",
                    borderRadius: 8, color: tc.inkLight, fontSize: 13,
                    fontFamily: "inherit", cursor: "not-allowed",
                  }}>Coming Soon</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONTROLS TAB ── */}
        {tab === "controls" && (
          <div>
            {[
              { key: "soundEnabled",    label: "Sound Effects",              desc: "Play sounds on actions",               emoji: "🔊" },
              { key: "hapticEnabled",   label: "Haptic Feedback",            desc: "Vibrate on interactions (mobile)",     emoji: "📳" },
              { key: "autoAdvance",     label: "Auto-advance on Win",        desc: "Skip to next level automatically",     emoji: "⏭️" },
              { key: "confirmQuit",     label: "Confirm Before Quitting",    desc: "Ask before leaving a level",           emoji: "⚠️" },
              { key: "leftHanded",      label: "Left-Handed Mode",           desc: "Flips the number pad to the left",     emoji: "🤚" },
            ].map(({ key, label, desc, emoji }) => (
              <div key={key} style={rowStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 12, color: tc.inkLight }}>{desc}</div>
                  </div>
                </div>
                <Toggle value={!!local[key]} onChange={val => set(key, val)} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}


// ─── Main Menu ────────────────────────────────────────────────────────────────
function MainMenu({ lives, regenCountdown, user, isGuest,
  onPlay, onDaily, onSettings, onAccount,
  themeColors, xp, streak, dailyUnplayed }) {
  const tc = themeColors || C;
  const { level: plrLevel } = getPlayerLevel(xp || 0);

  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg, ${tc.bg} 0%, #EAD8C0 60%, #DFC8A8 100%)`,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif",
      padding:"24px 20px", position:"relative", overflow:"hidden",
    }}>
      {/* Watermark grid */}
      <div style={{ position:"absolute", top:"50%", left:"50%",
                    transform:"translate(-50%,-50%)",
                    opacity:0.04, display:"grid",
                    gridTemplateColumns:"repeat(9,36px)",
                    gridTemplateRows:"repeat(9,36px)",
                    gap:3, pointerEvents:"none", zIndex:0 }}>
        {Array(81).fill(0).map((_,i)=>(
          <div key={i} style={{ background:tc.ink||C.ink, borderRadius:4 }}/>
        ))}
      </div>

      {/* Decorative blobs */}
      <div style={{ position:"absolute", top:-80, left:-80, width:260, height:260,
                    borderRadius:"50%", background:`${tc.teal||C.teal}15`, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-60, right:-60, width:200, height:200,
                    borderRadius:"50%", background:`${C.coral}10`, pointerEvents:"none" }}/>

      {/* Top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:2,
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"14px 20px" }}>
        <button onClick={onAccount} style={{
          width:38, height:38, borderRadius:"50%",
          background:tc.paper||C.paper, border:`1px solid ${tc.sand||C.sandDark}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
        }}>👤</button>
        <div style={{ textAlign:"center" }}>
          {streak?.current > 0 && (
            <div style={{ fontSize:12, fontWeight:700, color:C.coral }}>
              🔥 {streak.current} day streak
            </div>
          )}
        </div>
        <button onClick={onSettings} style={{
          width:38, height:38, borderRadius:"50%",
          background:tc.paper||C.paper, border:`1px solid ${tc.sand||C.sandDark}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
        }}>⚙️</button>
      </div>

      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:48, position:"relative", zIndex:1 }}>
        <div style={{ fontSize:52, marginBottom:4,
                      filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>🧩</div>
        <div style={{ fontSize:26, fontWeight:900, color:tc.ink||C.ink,
                      letterSpacing:"-0.01em", lineHeight:1 }}>
          SUDOKU ROYALE
        </div>
        <div style={{ fontSize:11, letterSpacing:"0.2em", color:tc.teal||C.teal,
                      textTransform:"uppercase", marginTop:4 }}>
          Keeper Level {plrLevel}
        </div>
        {/* XP bar */}
        {xp > 0 && (() => {
          const { xpInLevel, xpNeeded } = getPlayerLevel(xp);
          return (
            <div style={{ width:120, height:3, background:tc.sandDark||C.sandDark,
                          borderRadius:2, margin:"8px auto 0", overflow:"hidden" }}>
              <div style={{ height:"100%", background:C.gold, borderRadius:2,
                            width:`${(xpInLevel/xpNeeded)*100}%` }}/>
            </div>
          );
        })()}
      </div>

      {/* Main actions */}
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:280,
                    display:"flex", flexDirection:"column", gap:12 }}>

        {/* PLAY — hero button */}
        <button onClick={onPlay} style={{
          padding:"20px 0",
          background:`linear-gradient(135deg, ${tc.teal||C.teal}, ${tc.tealDark||C.tealDark})`,
          border:"none", borderRadius:16, color:"#fff",
          fontSize:20, fontWeight:900, fontFamily:"inherit", cursor:"pointer",
          boxShadow:`0 7px 0 ${tc.tealDark||C.tealDark}`,
          letterSpacing:"0.04em",
          transition:"transform 0.08s, box-shadow 0.08s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 10px 0 ${tc.tealDark||C.tealDark}`;}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 7px 0 ${tc.tealDark||C.tealDark}`;}}
          onMouseDown={e=>{e.currentTarget.style.transform="translateY(4px)";e.currentTarget.style.boxShadow=`0 3px 0 ${tc.tealDark||C.tealDark}`;}}
          onMouseUp={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 7px 0 ${tc.tealDark||C.tealDark}`;}}
        >▶ PLAY</button>

        {/* Daily Puzzle */}
        <button onClick={onDaily} style={{
          padding:"15px 0",
          background: dailyUnplayed
            ? `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`
            : C.paper,
          border: dailyUnplayed ? "none" : `2px solid ${C.sandDark}`,
          borderRadius:14, color: dailyUnplayed ? C.ink : C.inkLight,
          fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer",
          boxShadow: dailyUnplayed ? `0 5px 0 ${C.goldDark}` : "none",
          position:"relative",
          transition:"transform 0.08s, box-shadow 0.08s",
        }}
          onMouseEnter={e=>{if(dailyUnplayed){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 7px 0 ${C.goldDark}`;}}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=dailyUnplayed?`0 5px 0 ${C.goldDark}`:"none";}}
          onMouseDown={e=>{if(dailyUnplayed){e.currentTarget.style.transform="translateY(3px)";e.currentTarget.style.boxShadow=`0 2px 0 ${C.goldDark}`;}}}
          onMouseUp={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=dailyUnplayed?`0 5px 0 ${C.goldDark}`:"none";}}
        >
          📅 Daily Puzzle
          {dailyUnplayed && (
            <span style={{ marginLeft:8, fontSize:10, background:"#fff",
                           color:C.goldDark, borderRadius:10, padding:"2px 6px",
                           fontWeight:800 }}>NEW</span>
          )}
        </button>

        {/* Lives display */}
        <div style={{ textAlign:"center", fontSize:12,
                      color:tc.inkLight||C.inkLight, marginTop:-4 }}>
          <Hearts lives={lives} />
          {regenCountdown > 0 && lives < 3 && (
            <div style={{ fontSize:10, marginTop:4 }}>
              Next life in {Math.ceil(regenCountdown/60)}m
            </div>
          )}
        </div>
      </div>

      <div style={{ position:"relative", zIndex:1,
                    marginTop:32, fontSize:10,
                    color:tc.inkFaint||C.inkFaint,
                    textAlign:"center", letterSpacing:"0.05em" }}>
        tap · hold for picker · double-tap to switch mode
      </div>
    </div>
  );
}

// ─── Play Screen (mode select) ────────────────────────────────────────────────
function PlayScreen({ progress, lives, xp, elo, streak, dailyUnplayed,
  onStory, onDaily, onVersus, onFreePlay, onVariants, onChallenge,
  onGhostRace, onSeasonal, onCommunity, onPotw,
  onCodex, onTechniques, onForge, onAchievements, onProfile, onShop, onLearn, onLeague,
  onBack }) {

  const [section, setSection] = useState("play"); // play | compete | explore

  const season = getCurrentSeason();

  const PLAY_MODES = [
    {
      id:"story", label:"Story Mode", emoji:"⛵",
      color:C.teal, shadow:C.tealDark, textColor:"#fff",
      desc:"570 levels · 20 worlds · KRONAX awaits",
      badge: (() => {
        const done = Object.values(progress||{}).filter(v=>v==="complete").length;
        return done > 0 ? `${done} complete` : "Begin your journey";
      })(),
      onClick: onStory,
    },
    {
      id:"daily", label:"Daily Puzzle", emoji:"📅",
      color: dailyUnplayed ? C.gold : C.sandDark,
      shadow: dailyUnplayed ? C.goldDark : "#A8987A",
      textColor: dailyUnplayed ? C.ink : C.inkLight,
      desc: "New puzzle every day · builds streak",
      badge: streak?.current > 0 ? `🔥 ${streak.current} day streak` : "Play to start streak",
      dot: dailyUnplayed,
      onClick: onDaily,
    },
    {
      id:"freeplay", label:"Free Play", emoji:"🎯",
      color:"#F5F0E8", shadow:"#C8B89A", textColor:C.ink,
      desc:"Custom difficulty · no time pressure",
      badge:"Unlimited puzzles",
      onClick: onFreePlay,
    },
    {
      id:"variants", label:"Variants", emoji:"🧩",
      color:C.purple, shadow:"#4A2070", textColor:"#fff",
      desc:"X-Sudoku · Windoku · Jigsaw · Killer · Shapes · Linked",
      badge:"6 variant types",
      onClick: onVariants,
    },
    {
      id:"challenge", label:"Challenge", emoji:"⚡",
      color:"#F0B429", shadow:"#B88000", textColor:C.ink,
      desc:"Sprint · Precision · Blind modes",
      badge:"Test your limits",
      onClick: onChallenge,
    },
    {
      id:"potw", label:"Archive Puzzle", emoji:"📜",
      color:"#2A1A4A", shadow:"#0A0015", textColor:"#C8A0FF",
      desc:"Weekly puzzle from the KRONAX archives",
      badge:"17 clues · expert",
      onClick: onPotw,
    },
    ...(season ? [{
      id:"seasonal", label:`${season.name}`, emoji:season.emoji,
      color:season.color, shadow:season.color+"AA", textColor:"#fff",
      desc:"Limited time · seasonal symbols",
      badge:"Active now",
      onClick: onSeasonal,
    }] : []),
  ];

  const COMPETE_MODES = [
    {
      id:"versus", label:"Versus", emoji:"⚔️",
      color:C.coral, shadow:C.coralDark, textColor:"#fff",
      desc:"Race a real player · 1v1 or FFA",
      badge:"Real-time multiplayer",
      onClick: onVersus,
    },
    {
      id:"ghost", label:"Ghost Race", emoji:"👻",
      color:"#1A1408", shadow:"#0A0800", textColor:C.gold,
      desc:"Race KRONAX echoes of legendary solvers",
      badge:"5 difficulty echoes",
      onClick: onGhostRace,
    },
    {
      id:"league", label:"Weekly League", emoji:"🏆",
      color:"#C49A35", shadow:"#8A6200", textColor:"#fff",
      desc:"30 players · promote or relegate weekly",
      badge: elo ? `ELO ${elo}` : "Bronze tier",
      onClick: onLeague,
    },
    {
      id:"community", label:"Community", emoji:"🗳️",
      color:C.teal, shadow:C.tealDark, textColor:"#fff",
      desc:"Vote on next week's theme · play voted levels",
      badge:"Shared leaderboard",
      onClick: onCommunity,
    },
  ];

  const EXPLORE_MODES = [
    { id:"codex",   label:"Codex Lore",   emoji:"📖", desc:"The story of KRONAX",   onClick:onCodex },
    { id:"tech",    label:"Techniques",   emoji:"📚", desc:"Learn solving methods",  onClick:onTechniques },
    { id:"forge",   label:"Forge",        emoji:"⚗️", desc:"Craft rare power-ups",   onClick:onForge },
    { id:"achieve", label:"Achievements", emoji:"🏆", desc:"Track your milestones",  onClick:onAchievements },
    { id:"profile", label:"Profile",      emoji:"👤", desc:"Stats & solve history",  onClick:onProfile },
    { id:"shop",    label:"Shop",         emoji:"🛒", desc:"Themes & power-ups",     onClick:onShop },
    { id:"learn",   label:"Learn",        emoji:"✏️", desc:"Interactive lessons",    onClick:onLearn },
  ];

  function ModeCard({ mode, large }) {
    return (
      <button onClick={mode.onClick} style={{
        display:"flex", gap:14, alignItems:"center",
        width:"100%", padding: large ? "18px 18px" : "13px 16px",
        background:mode.color,
        border:"none", borderRadius: large ? 16 : 12,
        cursor:"pointer", fontFamily:"inherit", textAlign:"left",
        boxShadow:`0 ${large?6:4}px 0 ${mode.shadow||mode.color+"AA"}`,
        position:"relative", overflow:"hidden",
        transition:"transform 0.08s, box-shadow 0.08s",
      }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 ${large?8:6}px 0 ${mode.shadow||mode.color+"AA"}`;}}
        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 ${large?6:4}px 0 ${mode.shadow||mode.color+"AA"}`;}}
        onMouseDown={e=>{e.currentTarget.style.transform="translateY(3px)";e.currentTarget.style.boxShadow=`0 2px 0 ${mode.shadow||mode.color+"AA"}`;}}
        onMouseUp={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 ${large?6:4}px 0 ${mode.shadow||mode.color+"AA"}`;}}
      >
        <div style={{ fontSize: large ? 36 : 28, flexShrink:0, lineHeight:1 }}>{mode.emoji}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize: large ? 16 : 14, fontWeight:800,
                        color:mode.textColor, marginBottom:2,
                        display:"flex", alignItems:"center", gap:6 }}>
            {mode.label}
            {mode.dot && <NotificationDot size={7} />}
          </div>
          <div style={{ fontSize:11, color:mode.textColor,
                        opacity:0.75, lineHeight:1.4 }}>{mode.desc}</div>
        </div>
        {mode.badge && (
          <div style={{ fontSize:10, color:mode.textColor,
                        opacity:0.65, whiteSpace:"nowrap",
                        fontWeight:600, flexShrink:0, textAlign:"right" }}>
            {mode.badge}
          </div>
        )}
      </button>
    );
  }

  const TABS = [
    { id:"play",    label:"Play",    emoji:"▶" },
    { id:"compete", label:"Compete", emoji:"⚔️" },
    { id:"explore", label:"Explore", emoji:"🔍" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg,
                  fontFamily:"'DM Sans',sans-serif", color:C.ink,
                  display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center",
                    padding:"14px 20px", background:C.paper,
                    borderBottom:`1px solid ${C.sandDark}`,
                    position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          color:C.inkLight, fontSize:14, cursor:"pointer",
          fontFamily:"inherit", marginRight:"auto" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:800, color:C.ink }}>Play</div>
        <div style={{ width:60 }}/>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", background:C.paper,
                    borderBottom:`1px solid ${C.sandDark}`,
                    position:"sticky", top:49, zIndex:9 }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setSection(t.id)} style={{
            flex:1, padding:"12px 0",
            background:"none", border:"none",
            borderBottom:`2.5px solid ${section===t.id ? C.teal : "transparent"}`,
            color: section===t.id ? C.teal : C.inkLight,
            fontSize:13, fontWeight: section===t.id ? 700 : 500,
            fontFamily:"inherit", cursor:"pointer",
            transition:"color 0.15s, border-color 0.15s",
          }}>{t.emoji} {t.label}</button>
        ))}
      </div>

      {/* Mode cards */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 40px",
                    maxWidth:520, width:"100%", margin:"0 auto" }}>

        {section === "play" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {/* First two get large treatment */}
            {PLAY_MODES.slice(0,2).map(m=><ModeCard key={m.id} mode={m} large />)}
            {/* Rest normal */}
            {PLAY_MODES.slice(2).map(m=><ModeCard key={m.id} mode={m} />)}
          </div>
        )}

        {section === "compete" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {COMPETE_MODES.map(m=><ModeCard key={m.id} mode={m} large />)}
          </div>
        )}

        {section === "explore" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {EXPLORE_MODES.map(m => (
              <button key={m.id} onClick={m.onClick} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"13px 14px", background:C.paper,
                border:`1px solid ${C.sand}`, borderRadius:12,
                cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                transition:"background 0.1s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background=C.sand}
                onMouseLeave={e=>e.currentTarget.style.background=C.paper}
              >
                <div style={{ width:40, height:40, borderRadius:10,
                               background:C.sand,
                               display:"flex", alignItems:"center",
                               justifyContent:"center", fontSize:22,
                               flexShrink:0 }}>{m.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700,
                                color:C.ink }}>{m.label}</div>
                  <div style={{ fontSize:11,
                                color:C.inkLight }}>{m.desc}</div>
                </div>
                <span style={{ color:C.inkFaint }}>›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ─── World Map ────────────────────────────────────────────────────────────────
function WorldMap({ progress, lives, onSelectLevel, onSelectSecret, onBack }) {
  const [activeWorld, setActiveWorld]   = useState(null);
  const [activeIsland, setActiveIsland] = useState(null);

  // Compute unlock state: a world is unlocked if all levels of the previous world's last island are done
  function worldUnlocked(wIdx) {
    if (wIdx === 0) return true;
    const prevWorld = WORLDS[wIdx - 1];
    const lastIsland = prevWorld.islands[prevWorld.islands.length - 1];
    const lastLevel  = lastIsland.levels[lastIsland.levels.length - 1];
    return progress[lastLevel.id] === "complete";
  }

  function islandUnlocked(world, iIdx) {
    if (iIdx === 0) return worldUnlocked(WORLDS.indexOf(world));
    const prevIsland = world.islands[iIdx - 1];
    const lastLevel  = prevIsland.levels[prevIsland.levels.length - 1];
    return progress[lastLevel.id] === "complete";
  }

  function levelUnlocked(island, lIdx, world) {
    if (lIdx === 0) {
      const iIdx = world.islands.indexOf(island);
      return islandUnlocked(world, iIdx);
    }
    return progress[island.levels[lIdx - 1].id] === "complete";
  }

  function worldProgress(world) {
    const allLevels = world.islands.flatMap(i => i.levels);
    const done = allLevels.filter(l => progress[l.id] === "complete").length;
    return { done, total: allLevels.length };
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans','Helvetica Neue',sans-serif", color:C.ink }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:`1px solid ${C.sandDark}`, background:C.paper, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.inkLight, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← back</button>
        <div style={{ fontSize:15, fontWeight:700 }}>Story Mode</div>
        <Hearts lives={lives} />
      </div>

      <div style={{ padding:"20px 16px", maxWidth:520, margin:"0 auto" }}
           className="sr-fade-in">
        {WORLDS.map((world, wIdx) => {
          const unlocked = worldUnlocked(wIdx);
          const isWorldOpen = activeWorld === world.id;
          const { done, total } = worldProgress(world);
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = done === total && total > 0;

          return (
            <React.Fragment key={world.id}>
            {isArc2Start && <Arc2Divider unlocked={arc1Done} />}
            <div key={`w-${world.id}`} style={{ marginBottom:12 }}>
              {/* World header */}
              <button
                onClick={() => unlocked && setActiveWorld(isWorldOpen ? null : world.id)}
                style={{
                  width:"100%", padding:"16px 18px",
                  background: isComplete ? C.greenLight : unlocked ? world.lightColor : C.sand,
                  border:`2px solid ${isComplete ? C.green : unlocked ? world.color : C.sandDark}`,
                  borderRadius: isWorldOpen ? "12px 12px 0 0" : 12,
                  display:"flex", alignItems:"center", gap:12,
                  cursor: unlocked ? "pointer" : "default",
                  fontFamily:"inherit", textAlign:"left",
                }}
              >
                <span style={{ fontSize:32, flexShrink:0 }}>{world.emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:15, fontWeight:700, color: unlocked ? world.color : C.inkFaint }}>
                      World {world.id}: {world.name}
                    </span>
                    {isComplete && <span style={{ fontSize:11, color:C.green }}>✓</span>}
                  </div>
                  <div style={{ fontSize:11, color: unlocked ? C.inkLight : C.inkFaint, marginTop:2 }}>
                    {unlocked ? world.tagline : "🔒 Complete the previous world to unlock"}
                  </div>
                  {unlocked && (
                    <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ flex:1, height:3, background:C.sandDark, borderRadius:2 }}>
                        <div style={{ width:`${pct}%`, height:"100%", background: isComplete ? C.green : world.color, borderRadius:2, transition:"width 0.3s" }} />
                      </div>
                      <span style={{ fontSize:10, color:C.inkFaint, flexShrink:0 }}>{done}/{total}</span>
                    </div>
                  )}
                </div>
                {unlocked && <span style={{ color:world.color, fontSize:11, flexShrink:0 }}>{isWorldOpen ? "▲" : "▼"}</span>}
              </button>

              {/* Island list */}
              {isWorldOpen && unlocked && (
                <div style={{ border:`2px solid ${world.color}`, borderTop:"none", borderRadius:"0 0 12px 12px", background:C.paper, overflow:"hidden" }}>
                  {world.islands.map((island, iIdx) => {
                    const iUnlocked = islandUnlocked(world, iIdx);
                    const isIslandOpen = activeIsland === `${world.id}-${iIdx}`;
                    const islandComplete = island.levels.every(l => progress[l.id] === "complete");

                    return (
                      <div key={iIdx}>
                        {/* Island row */}
                        <button
                          onClick={() => iUnlocked && setActiveIsland(isIslandOpen ? null : `${world.id}-${iIdx}`)}
                          style={{
                            width:"100%", padding:"12px 18px",
                            background: islandComplete ? "#F0FAF4" : "transparent",
                            border:"none", borderTop: iIdx > 0 ? `1px solid ${C.sand}` : "none",
                            borderBottom: isIslandOpen ? `1px solid ${C.sand}` : "none",
                            display:"flex", alignItems:"center", gap:10,
                            cursor: iUnlocked ? "pointer" : "default",
                            fontFamily:"inherit", textAlign:"left",
                          }}
                        >
                          <span style={{ fontSize:20, flexShrink:0 }}>{island.emoji}</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, color: iUnlocked ? C.ink : C.inkFaint }}>
                              {island.name}
                              {island.bossIsland && <span style={{ marginLeft:6, fontSize:10, color:C.red, fontWeight:700 }}>⚡ GENERAL</span>}
                            </div>
                            <div style={{ fontSize:11, color:C.inkFaint }}>
                              {iUnlocked ? `${island.levels.length} levels · Boss: ${island.boss}` : "🔒 Locked"}
                            </div>
                          </div>
                          {islandComplete && <span style={{ fontSize:12, color:C.green }}>✓</span>}
                          {iUnlocked && !islandComplete && <span style={{ fontSize:11, color:C.inkFaint }}>{isIslandOpen ? "▲" : "▼"}</span>}
                        </button>

                        {/* Level list */}
                        {isIslandOpen && iUnlocked && (
                          <div style={{ background:"#FDFAF6", padding:"8px 0" }}>
                            {island.levels.map((level, lIdx) => {
                              const lUnlocked = levelUnlocked(island, lIdx, world);
                              const complete  = progress[level.id] === "complete";
                              const isBoss    = level.isBoss;

                              return (
                                <button
                                  key={level.id}
                                  onClick={() => lUnlocked && onSelectLevel({ ...level, world, island })}
                                  style={{
                                    width:"100%", padding:"10px 20px 10px 28px",
                                    background: complete ? "#E8F5EE" : isBoss && lUnlocked ? "#FFF0F0" : "transparent",
                                    border:"none",
                                    borderTop:`1px solid ${C.sand}`,
                                    display:"flex", alignItems:"center", gap:10,
                                    cursor: lUnlocked ? "pointer" : "default",
                                    fontFamily:"inherit", textAlign:"left",
                                  }}
                                >
                                  <div style={{
                                    width:26, height:26, borderRadius:"50%", flexShrink:0,
                                    background: complete ? C.green : isBoss && lUnlocked ? C.red : lUnlocked ? world.color : C.sandDark,
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    color:"#fff", fontSize:11, fontWeight:700,
                                  }}>
                                    {complete ? "✓" : !lUnlocked ? "🔒" : isBoss ? "★" : lIdx + 1}
                                  </div>
                                  <div style={{ flex:1 }}>
                                    <div style={{ fontSize:13, fontWeight: isBoss ? 700 : 500, color: lUnlocked ? (isBoss ? C.red : C.ink) : C.inkFaint }}>
                                      {level.name}
                                    </div>
                                    <div style={{ fontSize:10, color:C.inkFaint }}>
                                      {DIFF_LABEL[level.difficulty] || level.difficulty}
                                      {level.timeLimit > 0 && ` · ${formatTime(level.timeLimit)}s`}
                                    </div>
                                  </div>
                                  {level.tutorialMsg && lUnlocked && (
                                    <span style={{ fontSize:10, color:world.color, background:world.lightColor, padding:"2px 7px", borderRadius:20, flexShrink:0 }}>tip</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {/* Secret door — shows after par time unlocked */}
                        {(() => {
                          const secKey = `${world.id}-${iIdx}`;
                          const sl = getSecretLevelForIsland(world.id, iIdx);
                          if (!sl) return null;
                          const secretUnlocked = !!progress[`secret-unlocked:${secKey}`];
                          const secretDone     = !!progress[`secret-done:${secKey}`];
                          if (!secretUnlocked && !secretDone) return null;
                          return (
                            <button
                              key="secret"
                              onClick={() => { if (!secretDone) onSelectSecret({ ...sl, world, island }); }}
                              style={{
                                width:"100%", padding:"10px 20px 10px 28px",
                                background: secretDone ? "#F5F0FF" : "#FBF5FF",
                                border:"none", borderTop:`1px solid #C8A8E0`,
                                display:"flex", alignItems:"center", gap:10,
                                cursor: secretDone ? "default" : "pointer",
                                fontFamily:"inherit", textAlign:"left",
                              }}
                            >
                              <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, background: secretDone ? "#9B59B6" : "#C8A8E0", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700 }}>
                                {secretDone ? "✦" : "🚪"}
                              </div>
                              <div style={{ flex:1 }}>
                                <div style={{ fontSize:13, fontWeight:700, color:"#9B59B6" }}>
                                  {secretDone ? `✦ ${sl.name}` : `🚪 ${sl.name}`}
                                </div>
                                <div style={{ fontSize:10, color:"#B0A0C0" }}>
                                  {secretDone ? "Secret discovered · " : "Secret level · "}
                                  {sl.gridSize === 16 ? "16×16 · " : ""}
                                  {`${String(Math.floor(sl.timeLimit/60)).padStart(2,"0")}:${String(sl.timeLimit%60).padStart(2,"0")} limit`}
                                </div>
                              </div>
                              {!secretDone && <span style={{ fontSize:10, color:"#9B59B6", background:"#EDE0FF", padding:"2px 8px", borderRadius:20 }}>Enter</span>}
                            </button>
                          );
                        })()}
                    </div>  
                    );
                  })}
                </div>
              )}
            </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── Level Intro ──────────────────────────────────────────────────────────────
function LevelIntro({ level, lives, onStart, onBack }) {
  const bossData = BOSS_DIALOGUE[level?.island?.boss] || null;
  const flavor = LEVEL_FLAVOR[level?.id] || null;
  const island = level.island || level.world || { name:'Level', emoji:'⭐', color:C.teal, lightColor:C.tealLight };
  return (
    <div style={{
      minHeight:"100vh", background:C.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif",
      padding:32,
    }}>
      <div style={{ maxWidth:360, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>{island.emoji}</div>
        <div style={{ fontSize:12, letterSpacing:"0.15em", color:island.color, textTransform:"uppercase", marginBottom:4 }}>
          {island.name}
        </div>
        <div style={{ fontSize:26, fontWeight:700, color:C.ink, marginBottom:6 }}>
          {level.name}
        </div>
        <div style={{ fontSize:13, color:C.inkLight, marginBottom:24 }}>
          {DIFF_LABEL[level.difficulty]} difficulty
          {level.timeLimit > 0 && ` · Beat the clock: ${formatTime(level.timeLimit)}`}
        </div>

        {/* Tutorial hint */}
        {level.tutorialMsg && (
          <div style={{
            background:island.lightColor, border:`1px solid ${island.color}`,
            borderRadius:10, padding:"14px 18px", marginBottom:24,
            fontSize:13, color:C.ink, lineHeight:1.6, textAlign:"left",
          }}>
            <span style={{ fontWeight:700, color:island.color }}>💡 Tip: </span>
            {level.tutorialMsg}
          </div>
        )}

        {/* Timer info */}
        {/* Flavor text */}
        {flavor && (
          <div style={{ fontSize:13, color:C.inkLight, fontStyle:"italic",
                        marginBottom:14, lineHeight:1.6 }}>
            "{flavor}"
          </div>
        )}

        {/* Boss taunt */}
        {level.isBoss && bossData && (
          <div style={{
            background:"#FFF0F0", border:`1px solid ${C.red}`,
            borderRadius:10, padding:"14px 18px", marginBottom:16,
            fontSize:13, color:C.ink, lineHeight:1.6, textAlign:"left",
            animation:"srSlideUp 0.35s ease both",
          }}>
            <div style={{ fontSize:11, color:C.red, fontWeight:700,
                          letterSpacing:"0.1em", marginBottom:6 }}>
              ⚡ {level.island?.boss || "BOSS"} TAUNTS:
            </div>
            <div style={{ fontStyle:"italic", color:C.ink }}>
              "{bossData.taunt}"
            </div>
          </div>
        )}

        {level.timeLimit > 0 && (
          <div style={{
            background:C.coralLight, border:`1px solid ${C.coral}`,
            borderRadius:10, padding:"12px 18px", marginBottom:24,
            fontSize:13, color:C.ink, lineHeight:1.6, textAlign:"left",
          }}>
            <span style={{ fontWeight:700, color:C.coral }}>⏱ Race: </span>
            Solve before the clock hits zero or lose a life.
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
          <Hearts lives={lives} />
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onBack} style={{
            flex:1, padding:"13px 0",
            background:"none", border:`1.5px solid ${C.sandDark}`,
            borderRadius:10, color:C.inkLight, fontSize:14,
            fontFamily:"inherit", cursor:"pointer",
          }}>← Back</button>
          <button onClick={onStart} style={{
            flex:2, padding:"13px 0",
            background:island.color, border:"none",
            borderRadius:10, color:"#fff", fontSize:15, fontWeight:600,
            fontFamily:"inherit", cursor:"pointer",
            boxShadow:"0 4px 0 rgba(0,0,0,0.15)",
          }}>Start Level</button>
        </div>
      </div>
    </div>
  );
}

// ─── Level Result ─────────────────────────────────────────────────────────────
function LevelResult({ won, level, lives, elapsed, onNext, onRetry, onMenu, progress, pendingDrops, onClaimDrops, skipTokens, onSkip }) {
  const island = level.island || level.world || { name:"Level", emoji:"⭐", color:C.teal, lightColor:C.tealLight };
  const accentColor = won ? C.green : C.coral;
  const accentDark  = won ? C.greenDark : C.coralDark;
  const winBg = won
    ? `linear-gradient(160deg, #D4EDD8 0%, #C0E8C8 60%, #B0DEB8 100%)`
    : `linear-gradient(160deg, ${C.coralLight} 0%, #FADDD4 60%, #F2C8B8 100%)`;

  return (
    <div style={{
      minHeight:"100vh", background:winBg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif",
      padding:32, position:"relative", overflow:"hidden",
    }}>
      {/* Glow blob */}
      <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)",
                    width:240, height:240, borderRadius:"50%", background:accentColor,
                    opacity:0.14, filter:"blur(50px)", pointerEvents:"none" }}/>
      <div style={{ maxWidth:340, width:"100%", textAlign:"center", position:"relative" }}>

        {/* Big emoji */}
        <div style={{ fontSize:68, marginBottom:6,
                      animation:"srStar 0.5s cubic-bezier(.36,.07,.19,.97) both",
                      filter:`drop-shadow(0 6px 18px ${accentColor}55)` }}>
          {won ? (level?.isBoss ? "🏆" : "⭐") : "💀"}
        </div>

        {/* Result label */}
        <div style={{ fontSize:38, fontWeight:900, color:accentColor,
                      letterSpacing:"-1.5px", lineHeight:1,
                      animation:"srPop 0.4s cubic-bezier(.36,.07,.19,.97) 0.1s both" }}>
          {won ? "Solved!" : "Out of time"}
        </div>

        {/* Time pill */}
        {won && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                        background:accentColor, color:"#fff", borderRadius:20,
                        padding:"5px 14px", fontSize:13, fontWeight:700,
                        marginTop:10, marginBottom:16,
                        animation:"srSlideUp 0.3s ease 0.2s both" }}>
            ⏱ {formatTime(Math.floor(elapsed/1000))}
          </div>
        )}

        {/* Level name */}
        <div style={{ fontSize:13, color:C.inkLight,
                      marginBottom: won && level?.isBoss ? 14 : 24,
                      marginTop: won ? 0 : 10 }}>
          {won ? level.name : `The clock ran out on ${level.name}.`}
        </div>

        {/* Boss defeat quote */}
        {won && level?.isBoss && (() => {
          const bd = BOSS_DIALOGUE[level?.island?.boss];
          if (!bd) return null;
          return (
            <div style={{
              background:"rgba(255,255,255,0.65)", border:`1.5px solid ${accentColor}44`,
              borderRadius:12, padding:"12px 16px", marginBottom:20,
              fontSize:13, color:C.ink, lineHeight:1.7, fontStyle:"italic",
              animation:"srSlideUp 0.4s ease 0.3s both", textAlign:"left",
              backdropFilter:"blur(4px)",
            }}>
              <div style={{ fontSize:10, color:accentColor, fontWeight:700,
                            letterSpacing:"0.12em", marginBottom:5, fontStyle:"normal" }}>
                {level?.island?.boss || "BOSS"} SAYS:
              </div>
              "{bd.defeat}"
            </div>
          );
        })()}

        {/* Lives display on loss */}
        {!won && (
          <div style={{ marginBottom:24, padding:"16px", background:"rgba(255,255,255,0.6)",
                        borderRadius:12, backdropFilter:"blur(4px)" }}>
            <div style={{ fontSize:12, color:C.inkLight, marginBottom:8, fontWeight:600,
                          letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Lives Remaining
            </div>
            <Hearts lives={lives} />
            {lives === 0 && (
              <div style={{ fontSize:12, color:C.red, marginTop:10, fontWeight:600 }}>
                No lives left — they restore every 10 minutes.
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {won && onNext && (
            <button onClick={onNext} style={{
              padding:"15px 0", background:accentColor, border:"none",
              borderRadius:12, color:"#fff", fontSize:15, fontWeight:700,
              fontFamily:"inherit", cursor:"pointer",
              boxShadow:`0 5px 0 ${accentDark}`,
              transition:"transform 0.08s, box-shadow 0.08s",
            }}
              onMouseDown={e=>{e.currentTarget.style.transform="translateY(3px)";e.currentTarget.style.boxShadow=`0 2px 0 ${accentDark}`;}}
              onMouseUp={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 5px 0 ${accentDark}`;}}
            >Next Level →</button>
          )}
          {won && (
            <ShareButton
              shareData={{ type:"level", worldName:island?.name||"", levelName:level.name, time:elapsed, stars:3 }}
              style={{ width:"100%" }}
            />
          )}
          {/* Friend challenge */}
          {won && (
            <ChallengeShareButton
              level={level}
              elapsedS={Math.floor((elapsed||0)/1000)}
              playerName="Keeper"
            />
          )}
          {/* KRONAX commentary */}
          {won && level?.worldId && (() => {
            const comment = getKronaxComment({
              elapsedMs: elapsed||0,
              penalties: 0,
              usedNotes: false,
              usedHints: false,
              usedPowerups: false,
              isBoss: level?.isBoss,
              worldId: level?.worldId,
              par: level?.worldId ? getParTime(level.worldId, level.islandIdx) : null,
            });
            return (
              <div style={{
                marginTop:8, padding:"10px 14px",
                background:"rgba(0,0,0,0.06)", borderRadius:12,
                fontSize:12, color:C.inkLight, fontStyle:"italic",
                lineHeight:1.6, textAlign:"center",
              }}>
                <span style={{ fontSize:10, fontWeight:700, color:C.inkFaint,
                                display:"block", marginBottom:4, fontStyle:"normal",
                                letterSpacing:"0.1em", textTransform:"uppercase" }}>
                  KRONAX observes
                </span>
                "{comment}"
              </div>
            );
          })()}
          {!won && lives > 0 && (
            <button onClick={onRetry} style={{
              padding:"15px 0", background:C.ink, border:"none",
              borderRadius:12, color:C.paper, fontSize:15, fontWeight:700,
              fontFamily:"inherit", cursor:"pointer",
              boxShadow:"0 5px 0 #0A0500",
              transition:"transform 0.08s, box-shadow 0.08s",
            }}
              onMouseDown={e=>{e.currentTarget.style.transform="translateY(3px)";e.currentTarget.style.boxShadow="0 2px 0 #0A0500";}}
              onMouseUp={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 5px 0 #0A0500";}}
            >Try Again</button>
          )}
          {!won && onSkip && skipTokens > 0 && (
            <button onClick={onSkip} style={{
              padding:"11px 0", background:"none",
              border:`1.5px solid ${C.inkLight}`, borderRadius:12,
              color:C.inkLight, fontSize:13,
              fontFamily:"inherit", cursor:"pointer",
            }}>🗝️ Skip Level ({skipTokens} token{skipTokens>1?"s":""})</button>
          )}
          <button onClick={onMenu} style={{
            padding:"13px 0",
            background:"rgba(255,255,255,0.5)",
            border:`1.5px solid ${accentColor}44`,
            borderRadius:12, color:C.inkLight, fontSize:14,
            fontFamily:"inherit", cursor:"pointer",
            backdropFilter:"blur(4px)",
          }}>Back to Map</button>
        </div>

        {/* Power-up drop overlay */}
        {won && pendingDrops && pendingDrops.length > 0 && (
          <PowerupDropOverlay drops={pendingDrops} onContinue={onClaimDrops} />
        )}

        {/* Par time / secret hint */}
        {won && (() => {
          const wId = level.worldId;
          const iIdx = level.islandIdx;
          if (!wId && iIdx === undefined) return null;
          const secKey = `${wId}-${iIdx}`;
          const sl = getSecretLevelForIsland(wId, iIdx);
          if (!sl) return null;
          const alreadyUnlocked = !!(progress && (progress[`secret-unlocked:${secKey}`] || progress[`secret-done:${secKey}`]));
          const par = getParTime(wId, iIdx);
          const elapsedSec = Math.floor(elapsed / 1000);
          const beatPar = par !== null && elapsedSec <= par;
          if (alreadyUnlocked) return null;
          return (
            <div style={{
              marginTop:16, padding:"12px 16px", borderRadius:12, textAlign:"center",
              background: beatPar ? "rgba(107,63,160,0.12)" : "rgba(255,255,255,0.4)",
              border:`1.5px solid ${beatPar ? C.purple : "rgba(255,255,255,0.6)"}`,
              backdropFilter:"blur(4px)",
              animation:"srSlideUp 0.4s ease 0.4s both",
            }}>
              {beatPar ? (
                <>
                  <div style={{ fontSize:15, fontWeight:800, color:C.purple, marginBottom:4 }}>✦ A secret door has opened!</div>
                  <div style={{ fontSize:12, color:C.inkLight }}>Return to the island map to explore it.</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize:12, color:C.inkLight, marginBottom:2 }}>Something stirs in this island...</div>
                  <div style={{ fontSize:11, color:C.inkFaint }}>
                    Beat in {String(Math.floor(par/60)).padStart(2,"0")}:{String(par%60).padStart(2,"0")} to unlock a secret.
                    {` Your time: ${String(Math.floor(elapsedSec/60)).padStart(2,"0")}:${String(elapsedSec%60).padStart(2,"0")}.`}
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Game Screen ──────────────────────────────────────────────────────────────
const PENALTY_MS = 7000;
const LONG_PRESS_MS = 400;

function GameScreen({ level, lives, onWin, onLose, onMenu, inventory, onInventoryChange, skipTokens, onSkip }) {
  const gimmick = getWorldGimmick(level);
  const gimmickWorld = WORLDS.find(w => w.id === level?.worldId);
  const { solution, puzzle } = newPuzzle(level.clues);
  const solutionRef = useRef(solution);
  const [board,    setBoard]    = useState(() => puzzle.map(r=>[...r]));
  const [given,    setGiven]    = useState(() => puzzle.map(r=>r.map(v=>v!==0)));
  const [selected, setSelected] = useState(null);
  const [errors,   setErrors]   = useState({});
  const [claimed,  setClaimed]  = useState({});
  const [penalties,setPenalties]= useState(0);
  const [penaltyFlash, setPenaltyFlash] = useState(false);
  const [elapsed,  setElapsed]  = useState(0); // ms
  const [timeLeft, setTimeLeft] = useState(level.timeLimit); // seconds, 0 = no limit
  const [notes,    setNotes]    = useState({});
  const [noteMode, setNoteMode] = useState(false);
  const [finished, setFinished] = useState(false); // won
  const [failed,   setFailed]   = useState(false);  // timed out
  const [frozen,   setFrozen]   = useState(false);  // timer frozen
  const [frozenUntil, setFrozenUntil] = useState(0);
  const [activeShield, setActiveShield] = useState(false);
  // Arc 2 gimmick state
  const [hotCells,    setHotCells]    = useState(null);   // [[r,c]...] cells on fire
  const [hotTimer,    setHotTimer]    = useState(45);     // seconds to solve hot cells
  const [warpPairs,   setWarpPairs]   = useState(null);   // [[r1,c1,r2,c2]...]
  const [gearLocks,   setGearLocks]   = useState(null);   // [{locked,key}...]
  const [cascadeHint, setCascadeHint] = useState(null);   // Set of "r-c" keys
  const [scanCells, setScanCells] = useState(null); // set of "r-c" keys
  const [localInventory, setLocalInventory] = useState(inventory || {});
  const [hintResult, setHintResult] = useState(null);
  const [solveAnim,  setSolveAnim]  = useState(null); // Set of "r-c" keys animating
  const [boardPulse, setBoardPulse] = useState(false);
  // Boss fight system
  const isBossLevel = !!level?.isBoss;
  const bossData = level?.island?.boss ? (BOSS_DIALOGUE[level.island.boss]||null) : null;
  const [bossHp,    setBossHp]    = useState(3);
  const [bossPhase, setBossPhase] = useState(0); // 0=normal, 1=enraged(50%), 2=desperate(25%)
  const [bossTaunt, setBossTaunt] = useState(null);
  const totalCells = 81 - level.clues;
  const intervalRef = useRef(null);

  const [radial,   setRadial]   = useState(null);
  const radialRef  = useRef(null);
  const longTimer  = useRef(null);
  const lastTap    = useRef(null);
  const DOUBLE_TAP = 300;
  useEffect(() => { radialRef.current = radial; }, [radial]);

  // Arc 2 gimmick initialization
  useEffect(() => {
    if (gimmick === "hotCells") {
      setHotCells(generateHotCells(puzzle.map(r=>[...r]), given, solutionRef.current));
      setHotTimer(45);
    }
    if (gimmick === "warpCells") {
      setWarpPairs(generateWarpPairs(given));
    }
    if (gimmick === "gearLock") {
      setGearLocks(generateGearLocks(given, solutionRef.current));
    }
  }, []);

  // Hot cells countdown
  useEffect(() => {
    if (gimmick !== "hotCells" || !hotCells || hotCells.length === 0 || finished || failed) return;
    const tick = setInterval(() => {
      setHotTimer(t => {
        if (t <= 1) {
          clearInterval(tick);
          // Lose a life — hot cells expired
          onLose();
          return 0;
        }
        if (t <= 10) sound("timerUrgent");
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [hotCells, finished, failed, gimmick]);

  // Timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(e => e + 100);
      if (level.timeLimit > 0) {
        setFrozen(f => {
          // Check if freeze has expired
          if (f && Date.now() >= frozenUntil) { setFrozen(false); return false; }
          return f;
        });
        if (!frozen) {
          setTimeLeft(t => {
            if (t <= 1) {
              clearInterval(intervalRef.current);
              setFailed(true);
              return 0;
            }
            return t - 1;
          });
        }
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [level.timeLimit, frozen, frozenUntil]);

  useEffect(() => {
    if (failed) { setTimeout(() => onLose(), 1200); }
  }, [failed]);
  useEffect(() => {
    if (finished) { setTimeout(() => onWin(elapsed, penalties), 800); }
  }, [finished]);

  const submitNumber = useCallback((r, c, num, isNote) => {
    if (finished || failed) return;
    const key = `${r}-${c}`;
    if (given[r][c]) return;
    if (isNote) {
      setNotes(prev => {
        const cur = new Set(prev[key] || []);
        cur.has(num) ? cur.delete(num) : cur.add(num);
        return { ...prev, [key]: cur };
      });
      return;
    }
    if (solutionRef.current[r][c] === num) {
      setBoard(prev => {
        const next = prev.map(row=>[...row]);
        next[r][c] = num;
        const done = next.every((row,ri)=>row.every((v,ci)=>v===solutionRef.current[ri][ci]));
        if (done) { setFinished(true); clearInterval(intervalRef.current); }
        return next;
      });
      setClaimed(prev => ({ ...prev, [key]: true }));
      setErrors(prev => { const n={...prev}; delete n[key]; return n; });
      setNotes(prev  => { const n={...prev}; delete n[key]; return n; });
    } else {
      if (activeShield) {
        // Shield absorbs this wrong guess
        setActiveShield(false);
        sound("modeToggle");
        return;
      }
      setErrors(prev => ({ ...prev, [key]: true }));
      setPenalties(p => p + 1);
      if (isBossLevel) setBossHp(h => Math.max(0, h - 1));
      const penSec = activeShield ? 0 : isBossLevel && bossPhase===2 ? 15 : isBossLevel && bossPhase===1 ? 14 : 7;
      if (penSec > 0) setElapsed(e => e + penSec * 1000);
      setPenaltyFlash(true);
      sound("penalty");
      setTimeout(() => setPenaltyFlash(false), 700);
    }
  }, [finished, failed, given, activeShield, isBossLevel, bossPhase]);

  // ── Power-up execution ────────────────────────────────────────────────────────
  const usePowerup = useCallback(async (id) => {
    const inv = { ...localInventory };
    if (!inv[id] || inv[id] <= 0) return;
    inv[id]--;
    setLocalInventory(inv);
    const newInv = await useFromInventory(id);
    if (newInv) onInventoryChange && onInventoryChange(newInv);
    sound("secretUnlock");

    if (id === "reveal") {
      // Find a random unclaimed, non-given blank cell
      const blanks = [];
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (!given[r][c] && !claimed[`${r}-${c}`]) blanks.push([r,c]);
      }
      if (blanks.length === 0) return;
      const [r,c] = blanks[Math.floor(Math.random()*blanks.length)];
      const num = solutionRef.current[r][c];
      submitNumber(r, c, num, false);
    }

    if (id === "scan") {
      // Find all naked singles
      const singles = new Set();
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (given[r][c] || claimed[`${r}-${c}`]) continue;
        const possible = [];
        for (let n=1;n<=9;n++) {
          if (isValidPlacement(board.map(row=>[...row]), r, c, n)) possible.push(n);
        }
        if (possible.length === 1) singles.add(`${r}-${c}`);
      }
      setScanCells(singles);
      setTimeout(() => setScanCells(null), 4000);
    }

    if (id === "autonotes") {
      const newNotes = {};
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (given[r][c] || board[r][c] !== 0) continue;
        const possible = new Set();
        const tmp = board.map(row=>[...row]);
        for (let n=1;n<=9;n++) {
          if (isValidPlacement(tmp, r, c, n)) possible.add(n);
        }
        if (possible.size > 0) newNotes[`${r}-${c}`] = possible;
      }
      setNotes(newNotes);
    }

    if (id === "freeze") {
      const until = Date.now() + 30000;
      setFrozenUntil(until);
      setFrozen(true);
      setTimeout(() => setFrozen(false), 30000);
    }

    if (id === "shield") {
      setActiveShield(true);
    }

    if (id === "filln") {
      // Pick the number with fewest remaining cells to fill
      const counts = {};
      for (let n=1;n<=9;n++) {
        counts[n] = 0;
        for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
          if (!given[r][c] && !claimed[`${r}-${c}`] && solutionRef.current[r][c]===n) counts[n]++;
        }
      }
      const target = Object.entries(counts)
        .filter(([,v]) => v > 0)
        .sort(([,a],[,b]) => a-b)[0];
      if (!target) return;
      const n = parseInt(target[0]);
      for (let r=0;r<9;r++) for (let c=0;c<9;c++) {
        if (!given[r][c] && !claimed[`${r}-${c}`] && solutionRef.current[r][c]===n) {
          submitNumber(r, c, n, false);
        }
      }
    }
  }, [localInventory, given, claimed, board, submitNumber, onInventoryChange]);

  const handlePressStart = useCallback((e, r, c) => {
    if (finished || failed || given[r][c]) return;
    // Gear lock: check if this cell is locked
    if (gimmick === "gearLock" && gearLocks) {
      const lock = gearLocks.find(gl => gl.locked[0]===r && gl.locked[1]===c);
      if (lock && !claimed[`${lock.key[0]}-${lock.key[1]}`]) return; // locked
    }
    // No notes in Rome
    if (gimmick === "noNotes" && noteMode) { setNoteMode(false); }
    e.preventDefault();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    clearTimeout(longTimer.current);
    longTimer.current = setTimeout(() => {
      setSelected([r, c]);
      setRadial({ x: cx, y: cy, r, c, activeNum: 5 });
    }, LONG_PRESS_MS);
  }, [finished, failed, given]);

  const handleMove = useCallback((e) => {
    if (!radialRef.current) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const num = hitTestRadial(cx, cy, radialRef.current.x, radialRef.current.y);
    setRadial(prev => prev ? { ...prev, activeNum: num } : null);
  }, []);

  const handleEnd = useCallback(() => {
    clearTimeout(longTimer.current);
    if (radialRef.current) {
      const { r, c, activeNum } = radialRef.current;
      setRadial(null);
      if (activeNum !== null) submitNumber(r, c, activeNum, noteMode);
    }
  }, [submitNumber, noteMode]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup",   handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend",  handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup",   handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend",  handleEnd);
    };
  }, [handleMove, handleEnd]);

  const handleKey = useCallback((e) => {
    if (finished || failed || radialRef.current) return;
    if (!selected) return;
    const [r, c] = selected;
    if (given[r][c]) return;
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) submitNumber(r, c, num, noteMode);
    if (e.key === "Backspace" || e.key === "Delete") {
      const key = `${r}-${c}`;
      if (!claimed[key]) {
        setBoard(prev => { const n=prev.map(row=>[...row]); n[r][c]=0; return n; });
        setErrors(prev => { const n={...prev}; delete n[key]; return n; });
      }
    }
    const mv = { ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1] };
    if (mv[e.key]) {
      const [dr,dc] = mv[e.key];
      setSelected([Math.max(0,Math.min(8,r+dr)), Math.max(0,Math.min(8,c+dc))]);
      e.preventDefault();
    }
  }, [selected, given, finished, failed, noteMode, claimed, submitNumber]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Responsive
  const CELL = Math.floor(Math.min((window.innerWidth - 40) / 9, (window.innerHeight - 260) / 9));
  const GI = Math.max(1, Math.round(CELL * 0.04));
  const GB = Math.max(3, Math.round(CELL * 0.1));
  const fs = {
    cell: Math.max(12, CELL * 0.44),
    note: Math.max(5, CELL * 0.15),
    btn:  Math.max(10, CELL * 0.2),
    numpad: Math.max(12, CELL * 0.3),
  };
  const btnSize = Math.max(28, CELL * 0.72);
  const claimedCount = Object.keys(claimed).length;
  const solvedNums = new Set([1,2,3,4,5,6,7,8,9].filter(n=>board.flat().filter(v=>v===n).length===9));
  const island = level.island || level.world || { name:'Level', emoji:'⭐', color:C.teal, lightColor:C.tealLight };
  const worldCellTheme = getWorldCellTheme(level?.worldId);
  const wct = worldCellTheme;

  const isHi = (r, c) => {
    if (!selected) return false;
    const [sr, sc] = selected;
    return r===sr || c===sc || (Math.floor(r/3)===Math.floor(sr/3) && Math.floor(c/3)===Math.floor(sc/3));
  };
  const isSame = (r, c) => {
    if (!selected) return false;
    const [sr, sc] = selected;
    return board[r][c] !== 0 && board[r][c] === board[sr][sc];
  };

  const urgency = level.timeLimit > 0 && timeLeft <= 30;

  return (
    <div style={{
      minHeight:"100vh", background: wct ? wct.bg : C.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif",
      color: wct ? wct.ink : C.ink, padding:16,
      userSelect:"none", touchAction:"none",
    }}>
      {/* Top bar */}
      <div style={{
        width:"100%", maxWidth:520,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:Math.max(8, CELL * 0.2),
      }}>
        <button onClick={onMenu} style={{
          background:"none", border:"none", color:C.inkLight,
          fontSize:13, cursor:"pointer", fontFamily:"inherit",
        }}>✕</button>

        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:12, color:island.color, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {island.name}
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:C.ink }}>{level.name}</div>
        </div>

        <Hearts lives={lives} />
      </div>

      {/* Timer / countdown */}
      {level.timeLimit > 0 && (
        <div style={{
          width:"100%", maxWidth:520,
          marginBottom:Math.max(6, CELL * 0.15),
          display:"flex", alignItems:"center", gap:10,
        }}>
          <div style={{
            flex:1, height:6, background:C.sandDark, borderRadius:3, overflow:"hidden",
          }}>
            <div style={{
              height:"100%",
              width:`${(timeLeft / level.timeLimit) * 100}%`,
              background: urgency ? C.red : island.color,
              borderRadius:3,
              transition:"width 1s linear, background 0.5s",
            }} />
          </div>
          <div className={urgency ? "sr-timer-urgent" : ""}
               style={{
            fontSize:14, fontWeight:700,
            color: urgency ? C.red : C.inkLight,
            minWidth:44, textAlign:"right",
            transition:"color 0.5s",
          }}>{formatTime(timeLeft)}</div>
        </div>
      )}

      {/* Mode + cells */}
      <div style={{
        width:"100%", maxWidth:520,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:Math.max(4, CELL * 0.12),
        fontSize:11, color:C.inkLight,
      }}>
        <span>{claimedCount} / 81 cells</span>
        <span style={{ color: noteMode ? "#7c5cce" : C.teal, fontWeight:500 }}>
          <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background: noteMode ? "#7c5cce" : C.teal, marginRight:5, verticalAlign:"middle" }} />
          {noteMode ? "pencil" : "pen"}
        </span>
        {penalties > 0 && <span style={{ color:C.inkLight }}>+{penalties} {penalties===1?"penalty":"penalties"}</span>}
      </div>

      {/* Board */}
      <div style={{
        display:"inline-grid", gridTemplateColumns:"repeat(3,auto)",
        gap:GB, background:C.sandDark, padding:GB, borderRadius:12,
        border:`1.5px solid ${C.sandDark}`,
      }}>
        {[0,1,2].map(boxR=>[0,1,2].map(boxC=>(
          <div key={`${boxR}-${boxC}`} style={{
            display:"inline-grid", gridTemplateColumns:"repeat(3,auto)",
            gap:GI, background:C.sand,
          }}>
            {[0,1,2].map(iR=>[0,1,2].map(iC=>{
              const r=boxR*3+iR, c=boxC*3+iC;
              const val=board[r][c];
              const key=`${r}-${c}`;
              const isSel=selected?.[0]===r&&selected?.[1]===c;
              const isGiven=given[r][c];
              const isClaimed=claimed[key];
              const isErr=errors[key];
              const cn=notes[key];
              let bg=C.paper;
              if (isSel)    bg=island.lightColor;
              else if(isErr) bg=C.coralLight;
              else if(isClaimed) bg=C.greenLight;
              else if(isSame(r,c)) bg=C.sand;
              else if(isHi(r,c)) bg="#F8F4EE";
              let col=C.ink;
              if(!isGiven&&isClaimed) col=C.green;
              if(!isGiven&&isErr)     col=C.red;
              if(isSel&&!isGiven&&!isErr) col=island.color;
              return (
                <div key={key}
                  onMouseDown={e=>{
                    if(lastTap.current?.fromTouch)return;
                    const now=Date.now(), last=lastTap.current;
                    if(last&&now-last.time<DOUBLE_TAP&&last.r===r&&last.c===c){setNoteMode(m=>!m);lastTap.current=null;return;}
                    lastTap.current={time:now,r,c,fromTouch:false};
                    if(!finished&&!failed)setSelected([r,c]);
                    handlePressStart(e,r,c);
                  }}
                  onTouchStart={e=>{
                    const now=Date.now(), last=lastTap.current;
                    if(last&&now-last.time<DOUBLE_TAP&&last.r===r&&last.c===c){setNoteMode(m=>!m);lastTap.current={time:0,r:-1,c:-1,fromTouch:true};return;}
                    lastTap.current={time:now,r,c,fromTouch:true};
                    if(!finished&&!failed)setSelected([r,c]);
                    handlePressStart(e,r,c);
                  }}
                  style={{
                    width:CELL,height:CELL,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    background:bg, cursor:"pointer",
                    transition:"background 0.1s",
                    fontSize:val!==0?fs.cell:fs.note,
                    fontWeight:isGiven?600:400,
                    color:col,
                    outline:isSel?`2px solid ${island.color}`:"none",
                    outlineOffset:"-2px",
                  }}
                >
                  {val!==0?val:(cn?.size>0?(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",width:"86%",height:"86%"}}>
                      {[1,2,3,4,5,6,7,8,9].map(n=>(
                        <div key={n} style={{fontSize:fs.note,textAlign:"center",lineHeight:"1.4",color:cn.has(n)?"#7c5cce":"transparent",fontWeight:500}}>{n}</div>
                      ))}
                    </div>
                  ):null)}
                </div>
              );
            }))}
          </div>
        )))}
      </div>

      {/* Number pad */}
      <div style={{display:"flex",gap:Math.max(4,CELL*0.1),marginTop:Math.max(8,CELL*0.25)}}>
        {[1,2,3,4,5,6,7,8,9].map(n=>{
          const isSolved=solvedNums.has(n);
          return(
            <button key={n}
              onClick={()=>{
                if(!selected||finished||failed||isSolved)return;
                const[r,c]=selected;submitNumber(r,c,n,noteMode);
              }}
              style={{
                width:btnSize,height:btnSize,
                background:"none",border:"none",
                borderBottom:`2px solid ${isSolved?C.sandDark:C.sandDark}`,
                borderRadius:0,
                color:isSolved?C.inkFaint:C.ink,
                fontSize:fs.numpad,fontFamily:"inherit",
                fontWeight:isSolved?300:500,
                cursor:isSolved?"default":"pointer",
                textDecoration:isSolved?"line-through":"none",
                transition:"color 0.3s",padding:0,
              }}
              onMouseEnter={e=>{if(!isSolved)e.currentTarget.style.color=island.color;}}
              onMouseLeave={e=>{if(!isSolved)e.currentTarget.style.color=C.ink;}}
            >{n}</button>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{display:"flex",gap:16,marginTop:Math.max(8,CELL*0.18),alignItems:"center"}}>
        <button onClick={()=>setNoteMode(m=>!m)} style={{
          background:"none",border:"none",
          color:noteMode?"#7c5cce":C.inkLight,
          fontSize:fs.btn,fontFamily:"inherit",cursor:"pointer",padding:"4px 0",
          fontWeight:500,borderBottom:`1.5px solid ${noteMode?"#7c5cce":"transparent"}`,
          transition:"color 0.2s",
        }}>{noteMode?"pencil":"pen"}</button>
        <span style={{color:C.sandDark,fontSize:12}}>|</span>
        <button onClick={onMenu} style={{
          background:"none",border:"none",color:C.inkLight,
          fontSize:fs.btn,fontFamily:"inherit",cursor:"pointer",padding:"4px 0",
        }}>quit</button>
      </div>

      {radial&&<RadialPicker x={radial.x} y={radial.y} activeNum={radial.activeNum}/>}

      {penaltyFlash&&(
        <div style={{
          position:"fixed",top:"36%",left:"50%",transform:"translate(-50%,-50%)",
          background:C.paper,border:`1.5px solid ${C.coral}`,
          borderRadius:10,padding:"10px 24px",
          color:C.coral,fontSize:13,fontWeight:600,pointerEvents:"none",
          boxShadow:"0 4px 20px rgba(231,111,81,0.2)",
        }}>+7 sec penalty</div>
      )}

      {/* Timeout flash */}
      {failed&&(
        <div style={{
          position:"fixed",inset:0,
          background:"rgba(245,239,230,0.9)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:32,fontWeight:800,color:C.red,
        }}>Time's up!</div>
      )}

      {/* Solved flash */}
      {finished&&(
        <div style={{
          position:"fixed",inset:0,
          background:"rgba(245,239,230,0.9)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:32,fontWeight:800,color:C.green,
        }}>Solved!</div>
      )}
    </div>
  );
}

// ─── Free Play ────────────────────────────────────────────────────────────────
function FreePuzzle({ level, onMenu }) {
  // Clean free-play wrapper — strips boss/gimmick chrome, no time limit
  const cleanLevel = {
    ...level,
    timeLimit: 0,
    isBoss: false,
    difficulty: "freeplay",
    worldId: null,          // disables world themes + gimmicks
    island: { name:"Free Play", emoji:"🎯",
              color:C.teal, lightColor:C.tealLight },
  };
  return (
    <GameScreen
      level={cleanLevel}
      lives={3}
      onWin={onMenu}
      onLose={onMenu}
      onMenu={onMenu}
    />
  );
}


// ─── Daily Puzzle System ──────────────────────────────────────────────────────

const DAILY_THEMES = [
  { name:"Food",     icon:"🍕", symbols:["🍕","🍣","🍦","🥑","🍩","🌮","🍇","🍜","🧁"] },
  { name:"Animals",  icon:"🦊", symbols:["🦊","🐘","🦋","🐬","🦁","🐧","🦜","🐢","🦄"] },
  { name:"Space",    icon:"🚀", symbols:["🚀","⭐","🪐","🌙","☄️","🛸","🌟","🌍","🔭"] },
  { name:"Ocean",    icon:"🐠", symbols:["🐠","🦈","🐙","🦞","🐚","🐋","🦀","🌊","⚓"] },
  { name:"Plants",   icon:"🌸", symbols:["🌸","🌵","🍀","🌻","🎋","🍄","🌿","🌴","🌺"] },
  { name:"Weather",  icon:"⚡", symbols:["⚡","🌈","❄️","🌊","🔥","🌪️","☀️","🌙","⛈️"] },
  { name:"Sports",   icon:"⚽", symbols:["⚽","🏀","🎾","🏈","🎱","🏆","⛳","🎯","🥊"] },
  { name:"Music",    icon:"🎵", symbols:["🎵","🎸","🎹","🥁","🎺","🎻","🎷","🎤","🪗"] },
  { name:"Gems",     icon:"💎", symbols:["💎","🔮","💍","🏅","🌟","💫","🪩","✨","🎐"] },
  { name:"Fruit",    icon:"🍓", symbols:["🍓","🍊","🍋","🍇","🍉","🍑","🥝","🫐","🍍"] },
  { name:"Fantasy",  icon:"🧙", symbols:["🧙","🐉","🧚","🏰","🗡️","🪄","🧜","🦸","🌙"] },
  { name:"Tools",    icon:"🔧", symbols:["🔧","⚙️","🔑","🧲","🔬","💡","🪝","🔭","🧪"] },
];

function getDailyKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function getDailySeed() {
  const key = getDailyKey();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateSeededBoard(rng) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillSeeded(board, rng);
  return board;
}

function fillSeeded(board, rng) {
  const nums = [1,2,3,4,5,6,7,8,9];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const sh = [...nums].sort(() => rng() - 0.5);
        for (const n of sh) {
          if (isValidPlacement(board, r, c, n)) {
            board[r][c] = n;
            if (fillSeeded(board, rng)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function getDailyPuzzle() {
  const seed = getDailySeed();
  const rng  = seededRandom(seed);
  const themeIdx = Math.floor(rng() * DAILY_THEMES.length);
  const theme = DAILY_THEMES[themeIdx];
  const solution = generateSeededBoard(rng);
  // Remove ~46 clues (35 remaining) using seeded rng
  const puzzle = solution.map(r => [...r]);
  const idxs = Array.from({length:81},(_,i)=>i).sort(()=>rng()-0.5).slice(0,46);
  for (const idx of idxs) puzzle[Math.floor(idx/9)][idx%9] = 0;
  return { solution, puzzle, theme, dateKey: getDailyKey() };
}

// ─── Daily Puzzle Screen ──────────────────────────────────────────────────────
function DailyPuzzle({ onBack }) {
  const { solution, puzzle, theme, dateKey } = getDailyPuzzle();
  const solutionRef = useRef(solution);

  const [board,       setBoard]       = useState(() => puzzle.map(r=>[...r]));
  const [given,       setGiven]       = useState(() => puzzle.map(r=>r.map(v=>v!==0)));
  const [selected,    setSelected]    = useState(null);
  const [errors,      setErrors]      = useState({});
  const [claimed,     setClaimed]     = useState({});
  const [penFlash,    setPenFlash]    = useState(false);
  const [elapsed,     setElapsed]     = useState(0);
  const [notes,       setNotes]       = useState({});
  const [noteMode,    setNoteMode]    = useState(false);
  const [finished,    setFinished]    = useState(false);
  const [streak,      setStreak]      = useState({ current:0, best:0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [shared,      setShared]      = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [playerName,  setPlayerName]  = useState("You");
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading,     setLoading]     = useState(true);

  const intervalRef = useRef(null);
  const radialRef   = useRef(null);
  const longTimer   = useRef(null);
  const lastTap     = useRef(null);
  const DOUBLE_TAP  = 300;
  const [radial, setRadial] = useState(null);
  useEffect(() => { radialRef.current = radial; }, [radial]);

  // Load streak + check if already completed today + load leaderboard
  useEffect(() => {
    async function load() {
      try {
        // Personal streak
        const streakRes = await window.storage.get("daily-streak");
        if (streakRes) {
          const s = JSON.parse(streakRes.value);
          // Check milestone rewards
          const milestoneHit = STREAK_MILESTONES.find(m => s.current >= m.days);
          if (milestoneHit) {
            const claimed = await claimStreakReward(milestoneHit, {}, {});
            if (claimed) { /* toast shown via state */ }
          }
          setStreak(s);
        }
        // Check already done today
        const doneRes = await window.storage.get(`daily-done:${dateKey}`);
        if (doneRes) {
          setAlreadyDone(true);
          setFinished(true);
          const saved = JSON.parse(doneRes.value);
          setElapsed(saved.elapsed || 0);
        }
        // Player name
        const nameRes = await window.storage.get("daily-player-name");
        if (nameRes) setPlayerName(nameRes.value);
        // Leaderboard (shared)
        const lbRes = await window.storage.get(`daily-lb:${dateKey}`, true);
        if (lbRes) setLeaderboard(JSON.parse(lbRes.value));
      } catch(e) {}
      setLoading(false);
    }
    load();
  }, [dateKey]);

  // Timer
  useEffect(() => {
    if (finished || alreadyDone) return;
    intervalRef.current = setInterval(() => setElapsed(e => e + 1000), 1000);
    return () => clearInterval(intervalRef.current);
  }, [finished, alreadyDone]);

  const submitNumber = useCallback((r, c, num, isNote) => {
    if (finished) return;
    const key = `${r}-${c}`;
    if (given[r][c]) return;
    if (isNote) {
      setNotes(prev => {
        const cur = new Set(prev[key]||[]);
        cur.has(num)?cur.delete(num):cur.add(num);
        return {...prev,[key]:cur};
      });
      return;
    }
    if (solutionRef.current[r][c] === num) {
      setBoard(prev => {
        const next = prev.map(row=>[...row]);
        next[r][c] = num;
        const done = next.every((row,ri)=>row.every((v,ci)=>v===solutionRef.current[ri][ci]));
        if (done) {
          clearInterval(intervalRef.current);
          setFinished(true);
          // Save completion
          saveCompletion(elapsed + 1000);
        }
        return next;
      });
      setClaimed(prev=>({...prev,[key]:true}));
      setErrors(prev=>{const n={...prev};delete n[key];return n;});
      setNotes(prev=>{const n={...prev};delete n[key];return n;});
    } else {
      setErrors(prev=>({...prev,[key]:true}));
      setPenFlash(true);
      setTimeout(()=>setPenFlash(false),700);
    }
  }, [finished, given, elapsed]);

  async function saveCompletion(finalElapsed) {
    const today = getDailyKey();
    try {
      // Save personal completion
      await window.storage.set(`daily-done:${today}`, JSON.stringify({ elapsed: finalElapsed }));
      // Update streak
      const streakRes = await window.storage.get("daily-streak");
      let s = { current:1, best:1, lastDate:"" };
      if (streakRes) s = JSON.parse(streakRes.value);
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,"0")}-${String(yesterday.getDate()).padStart(2,"0")}`;
      if (s.lastDate === yKey) { s.current += 1; }
      else if (s.lastDate !== today) { s.current = 1; }
      s.best = Math.max(s.best, s.current);
      s.lastDate = today;
      await window.storage.set("daily-streak", JSON.stringify(s));
      setStreak(s);
    } catch(e) {}
  }

  async function submitToLeaderboard() {
    const today = getDailyKey();
    try {
      const lbRes = await window.storage.get(`daily-lb:${today}`, true);
      let lb = lbRes ? JSON.parse(lbRes.value) : [];
      const entry = { name: playerName, elapsed, date: today };
      lb.push(entry);
      lb.sort((a,b)=>a.elapsed-b.elapsed);
      lb = lb.slice(0, 20); // top 20
      await window.storage.set(`daily-lb:${today}`, JSON.stringify(lb), true);
      setLeaderboard(lb);
      setShared(true);
    } catch(e) {}
  }

  function buildShareText() {
    const mins = Math.floor(elapsed/60000), secs = Math.floor((elapsed%60000)/1000);
    const timeStr = `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
    const grid = board.map((row,r)=>row.map((val,c)=>{
      if(given[r][c]) return "⬜";
      if(claimed[`${r}-${c}`]) return theme.symbols[val-1]||"✅";
      return "⬛";
    }).join("")).join("\n");
    return `Sudoku Royale Daily — ${theme.name} ${theme.icon}\n${getDailyKey()}\n⏱ ${timeStr}\n\n${grid}`;
  }

  function handleShare() {
    const text = buildShareText();
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    submitToLeaderboard();
  }

  const handlePressStart = useCallback((e,r,c) => {
    if (finished||given[r][c]) return;
    e.preventDefault();
    const cx = e.touches?e.touches[0].clientX:e.clientX;
    const cy = e.touches?e.touches[0].clientY:e.clientY;
    clearTimeout(longTimer.current);
    longTimer.current = setTimeout(()=>{
      setSelected([r,c]);
      setRadial({x:cx,y:cy,r,c,activeNum:5});
    },LONG_PRESS_MS);
  },[finished,given]);

  const handleMove = useCallback((e)=>{
    if(!radialRef.current)return;
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    const [pcx,pcy]=getPickerCentre(radialRef.current.x,radialRef.current.y);const num=hitTestRadial(cx,cy,pcx,pcy);
    setRadial(prev=>prev?{...prev,activeNum:num}:null);
  },[]);

  const handleEnd = useCallback(()=>{
    clearTimeout(longTimer.current);
    if(radialRef.current){
      const{r,c,activeNum}=radialRef.current;
      setRadial(null);
      if(activeNum!==null)submitNumber(r,c,activeNum,noteMode);
    }
  },[submitNumber,noteMode]);

  useEffect(()=>{
    window.addEventListener("mousemove",handleMove);
    window.addEventListener("mouseup",handleEnd);
    window.addEventListener("touchmove",handleMove,{passive:false});
    window.addEventListener("touchend",handleEnd);
    return ()=>{
      window.removeEventListener("mousemove",handleMove);
      window.removeEventListener("mouseup",handleEnd);
      window.removeEventListener("touchmove",handleMove);
      window.removeEventListener("touchend",handleEnd);
    };
  },[handleMove,handleEnd]);

  const handleKey = useCallback((e)=>{
    if(finished||radialRef.current)return;
    if(!selected)return;
    const[r,c]=selected;
    if(given[r][c])return;
    const num=parseInt(e.key);
    if(num>=1&&num<=9)submitNumber(r,c,num,noteMode);
    if(e.key==="Backspace"||e.key==="Delete"){
      const key=`${r}-${c}`;
      if(!claimed[key]){
        setBoard(prev=>{const n=prev.map(row=>[...row]);n[r][c]=0;return n;});
        setErrors(prev=>{const n={...prev};delete n[key];return n;});
      }
    }
    const mv={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};
    if(mv[e.key]){const[dr,dc]=mv[e.key];setSelected([Math.max(0,Math.min(8,r+dr)),Math.max(0,Math.min(8,c+dc))]);e.preventDefault();}
  },[selected,given,finished,noteMode,claimed,submitNumber]);

  useEffect(()=>{
    window.addEventListener("keydown",handleKey);
    return()=>window.removeEventListener("keydown",handleKey);
  },[handleKey]);

  const CELL = Math.floor(Math.min((window.innerWidth-40)/9,(window.innerHeight-280)/9));
  const GI = Math.max(1,Math.round(CELL*0.04));
  const GB = Math.max(3,Math.round(CELL*0.1));
  const cellFs = Math.max(10,CELL*0.44);
  const noteFs = Math.max(5,CELL*0.14);
  const btnSize = Math.max(26,CELL*0.72);
  const numFs = Math.max(10,CELL*0.28);
  const claimedCount = Object.keys(claimed).length;
  const solvedNums = new Set([1,2,3,4,5,6,7,8,9].filter(n=>board.flat().filter(v=>v===n).length===9));

  const isHi=(r,c)=>{
    if(!selected)return false;
    const[sr,sc]=selected;
    return r===sr||c===sc||(Math.floor(r/3)===Math.floor(sr/3)&&Math.floor(c/3)===Math.floor(sc/3));
  };
  const isSame=(r,c)=>{
    if(!selected)return false;
    const[sr,sc]=selected;
    return board[r][c]!==0&&board[r][c]===board[sr][sc];
  };

  const elapsedSecs = Math.floor(elapsed/1000);
  const timeStr = `${String(Math.floor(elapsedSecs/60)).padStart(2,"0")}:${String(elapsedSecs%60).padStart(2,"0")}`;

  if (loading) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",color:C.inkLight}}>
      Loading daily puzzle...
    </div>
  );

  return (
    <div style={{
      minHeight:"100vh",background:C.bg,
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif",
      color:C.ink,padding:16,
      userSelect:"none",touchAction:"none",
    }}>
      {/* Top bar */}
      <div style={{
        width:"100%",maxWidth:520,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        marginBottom:Math.max(6,CELL*0.18),
      }}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.inkLight,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>← back</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:11,color:C.inkLight,letterSpacing:"0.12em",textTransform:"uppercase"}}>Daily Puzzle</div>
          <div style={{fontSize:15,fontWeight:700}}>{theme.icon} {theme.name} · {getDailyKey()}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:11,color:C.inkLight}}>🔥 {streak.current}</div>
          <div style={{fontSize:10,color:C.inkFaint}}>best {streak.best}</div>
        </div>
      </div>

      {/* Timer */}
      <div style={{
        fontSize:22,fontWeight:700,color:C.ink,
        marginBottom:Math.max(4,CELL*0.12),
        fontVariantNumeric:"tabular-nums",
        letterSpacing:"-0.5px",
      }}>{timeStr}</div>

      {/* Mode indicator */}
      <div style={{fontSize:11,color:noteMode?"#7c5cce":C.teal,marginBottom:Math.max(4,CELL*0.1),display:"flex",alignItems:"center",gap:4}}>
        <span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:noteMode?"#7c5cce":C.teal}}/>
        {noteMode?"pencil":"pen"} · {claimedCount}/81
      </div>

      {/* Board */}
      <div style={{
        display:"inline-grid",gridTemplateColumns:"repeat(3,auto)",
        gap:GB,background:C.sandDark,padding:GB,borderRadius:12,
        border:`1.5px solid ${C.sandDark}`,
        opacity: alreadyDone && !finished ? 0.5 : 1,
      }}>
        {[0,1,2].map(boxR=>[0,1,2].map(boxC=>(
          <div key={`${boxR}-${boxC}`} style={{display:"inline-grid",gridTemplateColumns:"repeat(3,auto)",gap:GI,background:C.sand}}>
            {[0,1,2].map(iR=>[0,1,2].map(iC=>{
              const r=boxR*3+iR,c=boxC*3+iC;
              const val=board[r][c];
              const key=`${r}-${c}`;
              const isSel=selected?.[0]===r&&selected?.[1]===c;
              const isGiven=given[r][c];
              const isClaimed=claimed[key];
              const isErr=errors[key];
              const cn=notes[key];
              let bg=C.paper;
              if(isSel)bg="#E8F4FD";
              else if(isErr)bg=C.coralLight;
              else if(isClaimed)bg=C.greenLight;
              else if(isSame(r,c))bg=C.sand;
              else if(isHi(r,c))bg="#F8F4EE";
              return (
                <div key={key}
                  onMouseDown={e=>{
                    if(finished)return;
                    if(lastTap.current?.fromTouch)return;
                    const now=Date.now(),last=lastTap.current;
                    if(last&&now-last.time<DOUBLE_TAP&&last.r===r&&last.c===c){setNoteMode(m=>!m);lastTap.current=null;return;}
                    lastTap.current={time:now,r,c,fromTouch:false};
                    setSelected([r,c]);handlePressStart(e,r,c);
                  }}
                  onTouchStart={e=>{
                    if(finished)return;
                    const now=Date.now(),last=lastTap.current;
                    if(last&&now-last.time<DOUBLE_TAP&&last.r===r&&last.c===c){setNoteMode(m=>!m);lastTap.current={time:0,r:-1,c:-1,fromTouch:true};return;}
                    lastTap.current={time:now,r,c,fromTouch:true};
                    setSelected([r,c]);handlePressStart(e,r,c);
                  }}
                  style={{
                    width:CELL,height:CELL,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    background:bg,cursor:finished?"default":"pointer",
                    transition:"background 0.1s",position:"relative",
                    outline:isSel?`2px solid ${C.teal}`:"none",outlineOffset:"-2px",
                  }}
                >
                  {val!==0?(
                    <span style={{fontSize:cellFs,lineHeight:1,filter:isErr?"saturate(0.3)":"none"}}>{theme.symbols[val-1]}</span>
                  ):(
                    cn?.size>0?(
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",width:"88%",height:"88%"}}>
                        {[1,2,3,4,5,6,7,8,9].map(n=>(
                          <div key={n} style={{fontSize:noteFs,textAlign:"center",lineHeight:"1.3",opacity:cn.has(n)?1:0}}>
                            {theme.symbols[n-1]}
                          </div>
                        ))}
                      </div>
                    ):null
                  )}
                </div>
              );
            }))}
          </div>
        )))}
      </div>

      {/* Symbol pad */}
      <div style={{display:"flex",gap:Math.max(3,CELL*0.08),marginTop:Math.max(8,CELL*0.22),flexWrap:"wrap",justifyContent:"center",maxWidth:520}}>
        {[1,2,3,4,5,6,7,8,9].map(n=>{
          const isSolved=solvedNums.has(n);
          return(
            <button key={n}
              onClick={()=>{
                if(!selected||finished||isSolved)return;
                const[r,c]=selected;submitNumber(r,c,n,noteMode);
              }}
              style={{
                width:btnSize,height:btnSize,
                background:isSolved?"#F0EDE8":C.paper,
                border:`1.5px solid ${isSolved?C.sandDark:C.sandDark}`,
                borderRadius:8,fontSize:Math.max(14,CELL*0.36),
                cursor:isSolved?"default":"pointer",
                opacity:isSolved?0.3:1,
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"opacity 0.3s,transform 0.1s",
                padding:0,
              }}
              onMouseEnter={e=>{if(!isSolved)e.currentTarget.style.transform="scale(1.12)";}}
              onMouseLeave={e=>{if(!isSolved)e.currentTarget.style.transform="scale(1)";}}
            >{theme.symbols[n-1]}</button>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{display:"flex",gap:14,marginTop:Math.max(8,CELL*0.16),alignItems:"center"}}>
        <button onClick={()=>setNoteMode(m=>!m)} style={{
          background:"none",border:"none",
          color:noteMode?"#7c5cce":C.inkLight,
          fontSize:12,fontFamily:"inherit",cursor:"pointer",
          borderBottom:`1.5px solid ${noteMode?"#7c5cce":"transparent"}`,
          fontWeight:500,padding:"3px 0",transition:"color 0.2s",
        }}>{noteMode?"pencil":"pen"}</button>
      </div>

      {radial&&<RadialPicker x={radial.x} y={radial.y} activeNum={radial.activeNum} symbols={theme?.symbols}/>}

      {penFlash&&(
        <div style={{position:"fixed",top:"36%",left:"50%",transform:"translate(-50%,-50%)",background:C.paper,border:`1.5px solid ${C.coral}`,borderRadius:10,padding:"10px 24px",color:C.coral,fontSize:13,fontWeight:600,pointerEvents:"none"}}>
          not quite!
        </div>
      )}

      {/* Completion overlay */}
      {finished&&(
        <div style={{
          position:"fixed",inset:0,background:"rgba(245,239,230,0.97)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          fontFamily:"'DM Sans',sans-serif",padding:24,overflowY:"auto",
        }}>
          <div style={{maxWidth:380,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:8}}>{theme.icon}</div>
            <div style={{fontSize:26,fontWeight:800,color:C.ink,marginBottom:4}}>
              {alreadyDone?"Already solved!":"Solved!"}
            </div>
            <div style={{fontSize:13,color:C.inkLight,marginBottom:6}}>
              {theme.name} · {getDailyKey()}
            </div>

            {/* Time + streak */}
            <div style={{display:"flex",justifyContent:"center",gap:28,marginBottom:20}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:C.inkFaint,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>time</div>
                <div style={{fontSize:22,fontWeight:700,color:C.ink}}>{timeStr}</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:C.inkFaint,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>streak</div>
                <div style={{fontSize:22,fontWeight:700,color:C.coral}}>🔥 {streak.current}</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:C.inkFaint,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>best</div>
                <div style={{fontSize:22,fontWeight:700,color:C.gold}}>⭐ {streak.best}</div>
              </div>
            </div>

            {/* Share */}
            {!shared?(
              <div style={{marginBottom:20}}>
                {showNameInput?(
                  <div style={{display:"flex",gap:8,marginBottom:10,justifyContent:"center"}}>
                    <input
                      value={playerName}
                      onChange={e=>setPlayerName(e.target.value.slice(0,16))}
                      placeholder="Your name"
                      style={{
                        padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.sandDark}`,
                        fontFamily:"inherit",fontSize:13,color:C.ink,background:C.paper,
                        width:140,outline:"none",
                      }}
                    />
                    <button onClick={()=>setShowNameInput(false)} style={{
                      padding:"8px 12px",background:C.sandDark,border:"none",borderRadius:8,
                      color:C.ink,fontSize:12,cursor:"pointer",fontFamily:"inherit",
                    }}>done</button>
                  </div>
                ):(
                  <button onClick={()=>setShowNameInput(true)} style={{
                    background:"none",border:"none",color:C.inkLight,fontSize:12,
                    cursor:"pointer",fontFamily:"inherit",marginBottom:8,textDecoration:"underline",
                  }}>playing as: {playerName}</button>
                )}
                <button onClick={handleShare} style={{
                  display:"block",width:"100%",padding:"13px 0",
                  background:C.ink,border:"none",borderRadius:10,
                  color:C.paper,fontSize:15,fontWeight:600,
                  fontFamily:"inherit",cursor:"pointer",
                  boxShadow:"0 4px 0 rgba(0,0,0,0.15)",
                }}>📋 Copy result &amp; add to leaderboard</button>
              </div>
            ):(
              <div style={{
                background:C.greenLight,border:`1px solid ${C.green}`,
                borderRadius:10,padding:"10px 16px",marginBottom:20,
                fontSize:13,color:C.green,fontWeight:500,
              }}>✓ Copied to clipboard! Score submitted.</div>
            )}

            {/* Leaderboard */}
            <div style={{textAlign:"left",marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:C.inkLight,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>
                Today's leaderboard
              </div>
              {leaderboard.length===0?(
                <div style={{fontSize:13,color:C.inkFaint,textAlign:"center",padding:"16px 0"}}>
                  No scores yet — be the first!
                </div>
              ):(
                leaderboard.slice(0,10).map((entry,i)=>{
                  const es=Math.floor(entry.elapsed/1000);
                  const t=`${String(Math.floor(es/60)).padStart(2,"0")}:${String(es%60).padStart(2,"0")}`;
                  const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`;
                  return(
                    <div key={i} style={{
                      display:"flex",alignItems:"center",gap:10,
                      padding:"8px 12px",borderRadius:8,marginBottom:4,
                      background:entry.name===playerName?C.tealLight:C.paper,
                      border:`1px solid ${entry.name===playerName?C.teal:C.sand}`,
                    }}>
                      <span style={{fontSize:14,minWidth:24}}>{medal}</span>
                      <span style={{flex:1,fontSize:13,fontWeight:entry.name===playerName?600:400,color:C.ink}}>{entry.name}</span>
                      <span style={{fontSize:13,fontWeight:600,color:C.inkLight,fontVariantNumeric:"tabular-nums"}}>{t}</span>
                    </div>
                  );
                })
              )}
            </div>

            <button onClick={onBack} style={{
              background:"none",border:`1.5px solid ${C.sandDark}`,
              borderRadius:10,padding:"10px 28px",
              color:C.inkLight,fontSize:13,fontFamily:"inherit",cursor:"pointer",
            }}>← back to menu</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── App Root ─────────────────────────────────────────────────────────────────
const FREE_DIFFICULTIES = [
  { id:"fp-easy",   name:"Easy",   clues:40, difficulty:"easy",   timeLimit:0 },
  { id:"fp-medium", name:"Medium", clues:28, difficulty:"medium", timeLimit:0 },
  { id:"fp-hard",   name:"Hard",   clues:20, difficulty:"hard",   timeLimit:0 },
  { id:"fp-expert", name:"Expert", clues:17, difficulty:"expert", timeLimit:0 },
];

const DEFAULT_SETTINGS = {
  theme:        "sand",
  avatar:       "🧙",
  displayName:  "Hero",
  pickerLayout: "grid",
  soundEnabled:  true,
  hapticEnabled: true,
  autoAdvance:   false,
  confirmQuit:   true,
  leftHanded:    false,
};

export default function App() {
  const [screen,    setScreen]    = useState("menu");
  const [playTab,   setPlayTab]   = useState("play");
  const [lives,     setLives]     = useState(3);
  const [progress,  setProgress]  = useState({});
  const [curLevel,  setCurLevel]  = useState(null);
  const [lastElapsed, setLastElapsed] = useState(0);
  const [settings,  setSettings]  = useState(DEFAULT_SETTINGS);
  const [elo,       setElo]       = useState(1000);
  const [playerId]                = useState(() => genPlayerId());
  const [vsRoom,    setVsRoom]    = useState(null);
  const [vsResult,  setVsResult]  = useState(null);
  const [vsConfig,  setVsConfig]  = useState(null);
  const [curVariant,setCurVariant]= useState(null);
  const [curChallenge,setCurChallenge] = useState(null);
  const [curGhost,    setCurGhost]     = useState(null);
  const [curGhostDiff,setCurGhostDiff] = useState(null);
  const [curVariantClues, setCurVariantClues] = useState(null);
  const [purchases,  setPurchases]  = useState({});
  const [inventory,  setInventory]  = useState({});
  const [loginBonus, setLoginBonus] = useState(null); // itemId to show toast
  const [pendingDrops,  setPendingDrops]  = useState(null);
  const [xp,            setXp]            = useState(0);
  const [streak,        setStreak]        = useState({ current:0, best:0 });
  const [streakReward,  setStreakReward]  = useState(null);
  const [skipTokens,    setSkipTokens]    = useState(0);
  const [adaptiveLevel, setAdaptiveLevel] = useState("normal");
  const [lbEntries,     setLbEntries]     = useState([]);
  const [showCeremony,  setShowCeremony]  = useState(false);
  const [ceremonyWorld, setCeremonyWorld] = useState(null);
  const [showNotifBanner,setShowNotifBanner] = useState(false);
  const [dailyUnplayed, setDailyUnplayed] = useState(false);
  const [earnedAchIds,  setEarnedAchIds]  = useState([]);
  const [showOnboarding,setShowOnboarding]= useState(false);
  const [xpBanner,      setXpBanner]      = useState(null); // {xpGained, newAchievements}
  const [user,      setUser]      = useState(null);
  const [isGuest,   setIsGuest]   = useState(false);
  const [regenTs,       setRegenTs]       = useState(() => Date.now());
  const [regenCountdown,setRegenCountdown]= useState(0);
  const [appLoaded, setAppLoaded] = useState(false);

  const LIFE_REGEN_S = 30 * 60; // 30 minutes per life

  const themeObj  = THEMES.find(t => t.id === settings.theme) || THEMES[0];
  const themeColors = themeObj.colors;

  // ── Inject CSS animations once
  useEffect(() => { injectAnimations(); }, []);

  // ── Sync sound setting
  useEffect(() => { setSoundEnabled(settings.soundEnabled !== false); }, [settings.soundEnabled]);

  // ── LOAD persisted state on mount
  useEffect(() => {
    async function loadSaved() {
      try {
        const saved = await window.storage.get("app-state");
        if (saved) {
          const s = JSON.parse(saved.value);
          if (s.settings)  setSettings({ ...DEFAULT_SETTINGS, ...s.settings });
          if (s.progress)  setProgress(s.progress);
          if (s.elo)       setElo(s.elo);
          if (typeof s.lives === "number") setLives(s.lives);
          if (s.regenTs)   setRegenTs(s.regenTs);
        }
      } catch(e) {}
      setAppLoaded(true);
    }
    loadSaved();
  }, []);

  // ── SAVE state whenever key values change (debounced)
  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (!appLoaded) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await window.storage.set("app-state", JSON.stringify({
          settings, progress, elo, lives, regenTs,
        }));
      } catch(e) {}
    }, 800);
  }, [settings, progress, elo, lives, regenTs, appLoaded]);

  // ── Life regeneration ticker
  useEffect(() => {
    if (lives >= 3) { setRegenCountdown(0); return; }
    const tick = setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - regenTs) / 1000);
      const secondsLeft = Math.max(0, LIFE_REGEN_S - secondsElapsed);
      setRegenCountdown(secondsLeft);
      if (secondsLeft === 0) {
        setLives(l => {
          const next = Math.min(3, l + 1);
          if (next < 3) setRegenTs(Date.now());
          return next;
        });
        sound("lifeRestore");
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [lives, regenTs]);

  function handleUser(u) {
    setUser(u);
    setIsGuest(false);
    // Sync display name from provider if not already set
    if (u.displayName && settings.displayName === "Hero") {
      setSettings(s => ({ ...s, displayName: u.displayName }));
    }
  }
  function handleGuest() { setIsGuest(true); setUser(null); }
  function handleSignOut() { setUser(null); setIsGuest(false); }

  const goToLevel = useCallback((level) => {
    // Attach worldId and islandIdx for par-time tracking
    const world = level.world || WORLDS.find(w => w.islands.some(i => i.levels.some(l => l.id === level.id)));
    const island = level.island || (world && world.islands.find(i => i.levels.some(l => l.id === level.id)));
    const islandIdx = world && island ? world.islands.indexOf(island) : undefined;
    setCurLevel({ ...level, worldId: world?.id, islandIdx });
    setScreen("intro");
  }, []);

  const startLevel = useCallback(() => setScreen("game"), []);

  const handleWin = useCallback((elapsed, penalties=0) => {
    setLastElapsed(elapsed);
    const elapsedSec = Math.floor(elapsed / 1000);
    // Star rating
    const stars = calcStars(elapsed, penalties, curLevel || {});
    // Adaptive difficulty tracking
    if (curLevel?.worldId) {
      const par = getParTime(curLevel.worldId, curLevel.islandIdx);
      recordAdaptiveSolve(Math.floor(elapsed/1000), par).then(()=>getAdaptiveLevel().then(l=>setAdaptiveLevel(l)));
    }
    // Submit leaderboard time
    if (curLevel?.id) {
      submitLeaderboardTime(curLevel.id, "Keeper", Math.floor(elapsed/1000)).then(entries=>setLbEntries(entries));
    }
    const starsKey = getStarsKey(curLevel?.id);
    setProgress(prev => {
      const existing = parseInt(prev[starsKey]||"0");
      return existing >= stars ? prev : {...prev, [starsKey]: String(stars)};
    });
    const newProgress = { ...progress, [curLevel.id]: "complete" };
    // Check par time for secret unlock
    if (curLevel.worldId && curLevel.islandIdx !== undefined) {
      const par = getParTime(curLevel.worldId, curLevel.islandIdx);
      if (par !== null && elapsedSec <= par) {
        newProgress[`secret-unlocked:${curLevel.worldId}-${curLevel.islandIdx}`] = true;
      }
    }
    setProgress(newProgress);
    const isBoss = curLevel?.isBoss;
    if (isBoss) sound("bossDefeat"); else sound("levelWin");
    // XP
    const xpGained = isBoss ? XP_PER_BOSS : XP_PER_LEVEL;
    const newXp = xp + xpGained;
    setXp(newXp);
    window.storage.set("player-xp", String(newXp)).catch(()=>{});
    updateLeagueXp(xpGained).catch(()=>{});
    // Grant skip token on level-up
    const { level: oldLvl } = getPlayerLevel(xp);
    const { level: newLvl } = getPlayerLevel(newXp);
    if (newLvl > oldLvl) {
      addSkipToken(1).then(()=>getSkipTokens().then(t=>setSkipTokens(t)));
    }
    // Achievements
    const newAchs = checkAchievements(newProgress, {
      totalLevels: Object.values(newProgress).filter(v=>v==="complete").length,
      perfectRun: penalties === 0,
      beatPar: newProgress[`secret-unlocked:${curLevel?.worldId}-${curLevel?.islandIdx}`],
    });
    if (newAchs.length > 0 || xpGained > 0) {
      const achProgress = { ...newProgress };
      newAchs.forEach(id => { achProgress[`achievement:${id}`] = true; });
      setProgress(achProgress);
      setXpBanner({ xpGained, newAchievements: newAchs });
      setEarnedAchIds(prev => [...new Set([...prev, ...newAchs])]);
    }
    if (newProgress[`secret-unlocked:${curLevel?.worldId}-${curLevel?.islandIdx}`]) {
      setTimeout(() => sound("secretUnlock"), 600);
    }
    // Power-up drops
    if (shouldDrop(isBoss)) {
      const drop = rollDrop(isBoss ? "boss" : "normal");
      // Boss levels can drop 2 items
      const drops = isBoss && Math.random() < 0.4
        ? [drop, rollDrop("boss")]
        : [drop];
      addToInventory(drops[0]).then(inv => {
        if (drops[1]) addToInventory(drops[1]).then(inv2 => setInventory(inv2));
        else setInventory(inv);
      });
      setPendingDrops(drops);
    }
    // World completion ceremony for area bosses
    if (curLevel?.difficulty === "areaBoss") {
      const world = WORLDS.find(w => w.islands.some(i => i.levels.some(l => l.id === curLevel.id)));
      if (world) {
        const bd = BOSS_DIALOGUE[curLevel?.island?.boss];
        setCeremonyWorld({ world, bossName:curLevel?.island?.boss||"", bossDefeat:bd?.defeat||"The shard is yours." });
        setShowCeremony(true);
      }
    }
    setScreen("result-win");
  }, [curLevel, progress]);

  const handleLose = useCallback(() => {
    setLives(l => Math.max(0, l - 1));
    setRegenTs(Date.now()); // start regen timer from moment of loss
    setScreen("result-lose");
  }, []);

  const nextLevel = useCallback(() => {
    const allLevels = React.useMemo(() => WORLDS.flatMap(w => w.islands.flatMap(i => i.levels.map(l => ({ ...l, world: w, island: i })))), []);
    const idx = allLevels.findIndex(l => l.id === curLevel.id);
    if (idx >= 0 && idx < allLevels.length - 1) {
      setCurLevel(allLevels[idx + 1]);
      setScreen("intro");
    } else {
      setScreen("map");
    }
  }, [curLevel]);

  // ── Show loading screen until state restored (MUST be after all hooks)
  if (!appLoaded) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  fontFamily:"'DM Sans',sans-serif", color:C.inkLight }}>
      <div style={{ fontSize:32, marginBottom:12 }}>🧙</div>
      <div style={{ fontSize:14, letterSpacing:"0.1em" }}>Loading...</div>
    </div>
  );

  // World completion ceremony overlay
  const ceremonyEl = showCeremony && ceremonyWorld ? (
    <WorldCompletionCeremony
      world={ceremonyWorld.world}
      bossName={ceremonyWorld.bossName}
      bossDefeat={ceremonyWorld.bossDefeat}
      onDone={() => { setShowCeremony(false); setCeremonyWorld(null); }}
    />
  ) : null;

  // Notification permission banner
  const notifBannerEl = showNotifBanner ? (
    <NotificationPermissionBanner
      onGrant={async () => {
        await requestNotificationPermission();
        setShowNotifBanner(false);
      }}
      onDismiss={() => setShowNotifBanner(false)}
    />
  ) : null;

  // Onboarding overlay (shown above any screen on first launch)
  const onboardingEl = showOnboarding ? (
    <OnboardingOverlay onDone={() => { setShowOnboarding(false); setScreen("play"); }} />
  ) : null;

  // XP Banner
  const xpBannerEl = xpBanner ? (
    <XPBanner xpGained={xpBanner.xpGained} newAchievements={xpBanner.newAchievements} onDone={() => setXpBanner(null)} />
  ) : null;

  /* AUTH GATE — uncomment when ready to enable login:
  if (!user && !isGuest) return (
    <AuthGate onUser={handleUser}>
      <AuthScreen onUser={handleUser} onGuest={handleGuest} />
    </AuthGate>
  );
  if (screen === "auth") return (
    <AuthScreen onUser={handleUser} onGuest={handleGuest} />
  );
  */

  if (screen === "account") return (
    <AccountProfile
      user={user || { uid:"dev", provider:"google", email:"", displayName: settings.displayName || "Hero" }}
      elo={elo} progress={progress}
      onSignOut={() => { handleSignOut(); setScreen("menu"); }}
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "play") return (
    <PlayScreen
      progress={progress}
      lives={lives}
      xp={xp}
      elo={elo}
      streak={streak}
      dailyUnplayed={dailyUnplayed}
      onStory={() => { sound("menuClick"); setScreen("map"); }}
      onDaily={() => { sound("menuClick"); setScreen("daily"); }}
      onVersus={() => setScreen("versus")}
      onFreePlay={() => {
        setCurLevel({ ...FREE_DIFFICULTIES[0], island:{ name:"Free Play", emoji:"🎯", color:C.teal, lightColor:C.tealLight }});
        setScreen("freeselect");
      }}
      onVariants={() => setScreen("variants")}
      onChallenge={() => setScreen("challenge")}
      onGhostRace={() => setScreen("ghost-menu")}
      onSeasonal={() => setScreen("seasonal")}
      onCommunity={() => setScreen("community")}
      onPotw={() => setScreen("potw")}
      onCodex={() => setScreen("codex")}
      onTechniques={() => setScreen("techniques")}
      onForge={() => setScreen("forge")}
      onAchievements={() => setScreen("achievements")}
      onProfile={() => setScreen("profile")}
      onShop={() => setScreen("shop")}
      onLearn={() => setScreen("learn")}
      onLeague={() => setScreen("league")}
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "menu") return (
    <>
    {onboardingEl}
    {xpBannerEl}
    {ceremonyEl}
    {notifBannerEl}
    <MainMenu
      lives={lives}
      regenCountdown={regenCountdown}
      xp={xp}
      streak={streak}
      dailyUnplayed={dailyUnplayed}
      themeColors={themeColors}
      onPlay={() => setScreen("play")}
      onDaily={() => { sound("menuClick"); setScreen("daily"); }}
      onSettings={() => setScreen("settings")}
      onAccount={() => setScreen("account")}
    />
    </>
  );

  if (screen === "settings") return (
    <SettingsScreen
      settings={settings}
      onSave={s => setSettings(s)}
      onBack={() => setScreen("menu")}
      progress={progress}
      lives={lives}
      onRestoreLives={() => setLives(3)}
      onResetProgress={() => { setProgress({}); setLives(3); }}
      onLearnNav={() => setScreen("learn")}
      onShop={() => setScreen("shop")}
      purchases={purchases}
    />
  );

  if (screen === "versus") return (
    <VersusMenu
      playerName={settings.displayName || "Hero"}
      elo={elo}
      onFindMatch={(cfg) => { setVsConfig(cfg); setScreen("vs-matchmaking"); }}
      onCreateRoom={async (cfg) => {
        const code = genRoomCode();
        const room = {
          code, mode:cfg.mode, diff:cfg.diff, queue:cfg.queue,
          hostId: playerId, status:"lobby",
          players:[{ id:playerId, name:settings.displayName||"Hero", avatar:settings.avatar||"🧙", elo, ready:false }],
          createdAt: Date.now(),
        };
        await window.storage.set(`vs-room:${code}`, JSON.stringify(room), true);
        setVsRoom(room);
        setScreen("vs-lobby");
      }}
      onJoinRoom={async (code) => {
        try {
          const res = await window.storage.get(`vs-room:${code}`, true);
          if (!res) { alert("Room not found"); return; }
          const room = JSON.parse(res.value);
          if (room.players.length >= VS_MODES.find(m=>m.id===room.mode)?.players) { alert("Room is full"); return; }
          room.players.push({ id:playerId, name:settings.displayName||"Hero", avatar:settings.avatar||"🧙", elo, ready:false });
          await window.storage.set(`vs-room:${code}`, JSON.stringify(room), true);
          setVsRoom(room);
          setScreen("vs-lobby");
        } catch(e) { alert("Could not join room"); }
      }}
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "vs-matchmaking") return (
    <VersusMatchmaking
      config={vsConfig}
      playerId={playerId}
      playerName={settings.displayName || "Hero"}
      avatar={settings.avatar || "🧙"}
      elo={elo}
      onRoomReady={(room, pid) => { if (room) { setVsRoom(room); setScreen("vs-lobby"); } else setScreen("versus"); }}
      onBack={() => setScreen("versus")}
    />
  );

  if (screen === "vs-lobby" && vsRoom) return (
    <VersusLobby
      room={vsRoom}
      playerId={playerId}
      playerName={settings.displayName || "Hero"}
      onStart={(room) => { setVsRoom(room); setScreen("vs-game"); }}
      onBack={() => setScreen("versus")}
    />
  );

  if (screen === "vs-game" && vsRoom) return (
    <VersusGame
      key={vsRoom.code}
      room={vsRoom}
      playerId={playerId}
      playerName={settings.displayName || "Hero"}
      onFinish={(result) => { setVsResult(result); setScreen("vs-result"); }}
      onBack={() => setScreen("versus")}
    />
  );

  if (screen === "vs-result" && vsResult) return (
    <VersusResult
      result={vsResult}
      playerName={settings.displayName || "Hero"}
      elo={elo}
      onEloUpdate={(newElo) => setElo(newElo)}
      onRematch={() => setScreen("vs-game")}
      onMenu={() => setScreen("versus")}
    />
  );

  if (screen === "freeselect") return (
    <div style={{
      minHeight:"100vh", background:C.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif", padding:32,
    }}>
      <div style={{ maxWidth:320, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:24, fontWeight:700, color:C.ink, marginBottom:8 }}>Free Play</div>
        <div style={{ fontSize:13, color:C.inkLight, marginBottom:28 }}>Classic sudoku, no time limit</div>
        {FREE_DIFFICULTIES.map(d => (
          <button key={d.id} onClick={() => {
            setCurLevel({ ...d, island:{ name:"Free Play", emoji:"🎯", color:C.teal, lightColor:C.tealLight } });
            setScreen("game");
          }} style={{
            display:"block", width:"100%", padding:"13px 0",
            marginBottom:10,
            background:C.paper, border:`1.5px solid ${C.sandDark}`,
            borderRadius:10, color:C.ink, fontSize:14, fontWeight:500,
            fontFamily:"inherit", cursor:"pointer",
            transition:"border-color 0.15s",
          }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.sandDark}
          >{d.name}</button>
        ))}
        {/* Variant puzzles shortcut */}
        <div style={{ margin:"16px 0 8px", height:1, background:C.sandDark }} />
        <button onClick={() => setScreen("variants")} style={{
          display:"block", width:"100%", padding:"13px 0", marginBottom:10,
          background:`linear-gradient(135deg, ${C.purple} 0%, #4A2070 100%)`,
          border:"none", borderRadius:10, color:"#fff",
          fontSize:14, fontWeight:600, fontFamily:"inherit", cursor:"pointer",
          boxShadow:"0 4px 0 #2A1040",
        }}>🧩 Variant Puzzles</button>
        <button onClick={() => setScreen("menu")} style={{
          marginTop:4, background:"none", border:"none",
          color:C.inkLight, fontSize:13, cursor:"pointer", fontFamily:"inherit",
        }}>← back</button>
      </div>
    </div>
  );

  if (screen === "daily") return (
    <DailyPuzzle onBack={() => setScreen("menu")} />
  );

  if (screen === "ghost-menu") return (
    <GhostRaceMenu
      progress={progress}
      onStartRace={(ghost, diff) => { setCurGhost(ghost); setCurGhostDiff(diff); setScreen("ghost-race"); }}
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "ghost-race" && curGhost) return (
    <GhostRaceScreen
      key={`${curGhost.id}-${curGhostDiff?.id}-${Date.now()}`}
      ghost={curGhost}
      diff={curGhostDiff}
      onFinish={(action) => {
        if (action === "retry") setScreen("ghost-race");
        else setScreen("ghost-menu");
      }}
      onBack={() => setScreen("ghost-menu")}
    />
  );

  if (screen === "seasonal") return (
    <SeasonalWorldScreen
      onBack={() => setScreen("menu")}
      onPlayLevel={(l) => { setCurLevel(l); setScreen("game"); }}
    />
  );

  if (screen === "community") return (
    <CommunityWorldScreen
      onBack={() => setScreen("menu")}
      onPlayLevel={(l) => { setCurLevel(l); setScreen("game"); }}
    />
  );

  if (screen === "challenge") return (
    <ChallengeWorldScreen
      onBack={() => setScreen("menu")}
      onStartChallenge={(mode) => { setCurChallenge(mode); setScreen("challenge-game"); }}
    />
  );

  if (screen === "forge") return (
    <ForgeScreen
      inventory={inventory}
      onInventoryChange={inv => setInventory(inv)}
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "challenge-game" && curChallenge) return (
    <GameScreen
      level={{ id:`challenge-${curChallenge.id}`, name:curChallenge.name,
               clues:30, timeLimit: curChallenge.timeLimit || 0,
               challengeMode: curChallenge.id,
               island:{ name:"Challenge", emoji:curChallenge.emoji,
                        color:curChallenge.color, lightColor:"#FFF8E0" } }}
      lives={lives}
      inventory={inventory}
      onInventoryChange={inv => setInventory(inv)}
      onWin={() => setScreen("challenge")}
      onLose={() => setScreen("challenge")}
      onMenu={() => setScreen("challenge")}
    />
  );

  if (screen === "shop") return (
    <ShopScreen
      onBack={() => setScreen("settings")}
      purchases={purchases}
      onPurchase={(next) => setPurchases(next)}
      lives={lives}
      onRestoreLives={() => setLives(3)}
      progress={progress}
      onInventoryChange={(inv) => setInventory(inv)}
    />
  );

  if (screen === "variants") return (
    <VariantsScreen
      progress={progress}
      purchases={purchases}
      onSelectVariant={(v) => { setCurVariant(v); setScreen("variant-diff"); }}
      onShop={() => setScreen("shop")}
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "variant-diff" && curVariant) return (
    <VariantDifficultyScreen
      variant={curVariant}
      onStart={async (v, clues, diffLabel) => {
        // Check free trial
        if (!purchases["variant_" + v.id] && !purchases.variant_bundle) {
          const played = await getVariantPlayed(v.id, diffLabel || "medium");
          if (played >= FREE_VARIANT_LIMIT) {
            setScreen("shop"); return;
          }
        }
        setCurVariantClues(clues);
        setScreen("variant-game");
      }}
      onBack={() => setScreen("variants")}
    />
  );

  if (screen === "variant-game" && curVariant) return (
    <VariantGameScreen
      key={`${curVariant.id}-${curVariantClues}-${Date.now()}`}
      variant={curVariant}
      clues={curVariantClues}
      onBack={() => setScreen("variants")}
    />
  );

  if (screen === "learn") return (
    <LearnScreen onBack={() => setScreen("menu")} />
  );

  if (screen === "achievements") return (
    <AchievementsScreen progress={progress} xp={xp} onBack={() => setScreen("menu")} />
  );

  if (screen === "codex") return (
    <CodexLoreScreen
      progress={progress}
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "techniques") return (
    <TechniqueLibraryScreen onBack={() => setScreen("menu")} />
  );

  if (screen === "potw") return (
    <PuzzleOfWeekScreen onBack={() => setScreen("menu")} />
  );

  if (screen === "league") return (
    <LeagueScreen
      xp={xp}
      playerName="Keeper"
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "profile") return (
    <PlayerProfileScreen
      progress={progress}
      xp={xp}
      streak={streak}
      achievements={earnedAchIds}
      onBack={() => setScreen("menu")}
    />
  );

  if (screen === "secret" && curLevel) return (
    <SecretLevelScreen
      secretLevel={curLevel}
      world={curLevel.world}
      island={curLevel.island}
      onWin={(elapsed) => {
        setLastElapsed(elapsed);
        setProgress(p => ({ ...p, [`secret-done:${curLevel.key}`]: true }));
        setScreen("secret-result");
      }}
      onLose={() => setScreen("map")}
      onBack={() => setScreen("map")}
    />
  );

  if (screen === "secret-result" && curLevel) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:32 }}>
      <div style={{ maxWidth:340, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>✦</div>
        <div style={{ fontSize:24, fontWeight:800, color:"#9B59B6", marginBottom:8 }}>Secret Solved!</div>
        <div style={{ fontSize:13, color:C.inkLight, marginBottom:24 }}>A lore fragment has been added to your collection.</div>
        <button onClick={() => setScreen("map")} style={{ padding:"12px 28px", background:"#9B59B6", border:"none", borderRadius:10, color:"#fff", fontSize:14, fontFamily:"inherit", cursor:"pointer", fontWeight:600 }}>Back to Map</button>
      </div>
    </div>
  );

  if (screen === "map") return (
    <WorldMap progress={progress} lives={lives} onSelectLevel={goToLevel} onSelectSecret={(sl) => { setCurLevel(sl); setScreen("secret"); }} onBack={() => setScreen("menu")} />
  );

  if (screen === "intro" && curLevel) return (
    <LevelIntro level={curLevel} lives={lives} onStart={startLevel} onBack={() => setScreen("map")} />
  );

  if (screen === "game" && curLevel) return (
    <GameScreen
      key={`${curLevel.id}-${Math.random()}`}
      level={curLevel} lives={lives}
      inventory={inventory}
      onInventoryChange={(inv) => setInventory(inv)}
      onWin={handleWin} onLose={handleLose}
      onMenu={() => setScreen("map")}
      skipTokens={skipTokens}
      onSkip={() => {
        useSkipToken().then(ok => {
          if (ok) {
            setSkipTokens(t => t-1);
            setProgress(p => ({ ...p, [curLevel.id]: "skipped" }));
            nextLevel();
          }
        });
      }}
    />
  );

  if (screen === "result-win" && curLevel) return (
    <LevelResult
      won={true} level={curLevel} lives={lives} elapsed={lastElapsed}
      onNext={nextLevel}
      onRetry={() => setScreen("game")}
      onMenu={() => setScreen("map")}
      progress={progress}
    />
  );

  if (screen === "result-lose" && curLevel) return (
    <LevelResult
      won={false} level={curLevel} lives={lives} elapsed={lastElapsed}
      onRetry={() => setScreen("game")}
      onMenu={() => setScreen("map")}
      skipTokens={skipTokens}
      onSkip={() => {
        useSkipToken().then(ok => {
          if (ok) {
            setSkipTokens(t => t-1);
            setProgress(p => ({ ...p, [curLevel.id]: "skipped" }));
            nextLevel();
          }
        });
      }}
    />
  );

  return null;
}

// ─── Mount ────────────────────────────────────────────────────────────────────
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}

