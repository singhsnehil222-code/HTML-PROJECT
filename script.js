/* ============================================================
   CITY BUILDER LITE — script.js
   B.Tech CSE Semester II — HTML/CSS/JavaScript Project
   Author: [Student Name]
   ============================================================ */

// ============================================================
// 1. GAME CONSTANTS & CONFIG
// ============================================================

/** Building definitions: cost, effects, emoji, label */
const BUILDINGS = {
  house:    { cost: 100,  pop: 2,  happy: 1,  revenue: 0,   emoji: '🏠', label: 'House'   },
  factory:  { cost: 200,  pop: 0,  happy: -1, revenue: 30,  emoji: '🏭', label: 'Factory' },
  park:     { cost: 150,  pop: 1,  happy: 3,  revenue: 0,   emoji: '🌳', label: 'Park'    },
  road:     { cost: 50,   pop: 0,  happy: 0,  revenue: 0,   emoji: '🛣️', label: 'Road'    },
  demolish: { cost: 0,    pop: 0,  happy: 0,  revenue: 0,   emoji: '🔨', label: 'Demolish'},
};

/** Game messages for the bottom ticker */
const GAME_TIPS = [
  'Build Houses to grow your population! 🏠',
  'Factories earn $30 revenue per cycle 🏭',
  'Parks boost happiness by 3 points 🌳',
  'Roads help connect your buildings 🛣️',
  'Revenue is collected every 10 seconds 💹',
  'Keep your happiness high to attract more citizens! 😊',
  'Demolish buildings to get 50% refund 🔨',
  'Score = Population + Happiness + Money ÷ 10 ⭐',
  "Don't run out of money or it's game over! 💸",
];

/** Grid size */
const GRID_SIZE = 10; // 10×10 grid

// ============================================================
// 2. GAME STATE
// ============================================================

/** Central game state object — all game data lives here */
let state = {
  playerName: 'Mayor',
  money:      1000,
  population: 0,
  happiness:  5,
  score:      0,
  grid:       [],         // 2D array [row][col] of { building } or null
  counts:     { house: 0, factory: 0, park: 0, road: 0 },
  selected:   'house',    // Currently selected building type
  timerCount: 10,         // Countdown for next revenue
  gameOver:   false,
};

/** Timer references */
let revenueInterval = null;
let timerInterval   = null;
let tipInterval     = null;

// ============================================================
// 3. INTRO & START
// ============================================================

/**
 * Starts the game when player clicks "Start Building"
 * Reads player name and transitions to game screen
 */
function startGame() {
  const nameInput = document.getElementById('player-name');
  const name = nameInput.value.trim() || 'Mayor';
  state.playerName = name;

  // Hide intro, show game
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game-screen').classList.remove('hidden');

  // Set player name in HUD
  document.getElementById('hud-player-name').textContent = `Mayor ${name}`;

  // Initialize the game grid, timers, UI
  initGame();
}

/**
 * Resets all state and re-initializes the game
 */
function restartGame() {
  closeModal('gameover-modal');
  closeModal('leaderboard-modal');
  clearInterval(revenueInterval);
  clearInterval(timerInterval);
  clearInterval(tipInterval);

  // Reset state
  state = {
    playerName: state.playerName,
    money:      1000,
    population: 0,
    happiness:  5,
    score:      0,
    grid:       [],
    counts:     { house: 0, factory: 0, park: 0, road: 0 },
    selected:   'house',
    timerCount: 10,
    gameOver:   false,
  };

  initGame();
}

// ============================================================
// 4. INITIALIZATION
// ============================================================

/**
 * Sets up the game grid, UI, and starts timers
 */
function initGame() {
  buildGrid();         // Build the DOM grid
  initStateGrid();     // Build the JS state grid
  selectBuilding('house'); // Default selection
  updateHUD();         // Refresh UI numbers
  updateBuildCounts(); // Reset counters in info panel
  startRevenueCycle(); // Begin earning money
  startTipRotation();  // Rotate tips in bottom bar
  scrollTips();        // Set up bottom ticker

  addMessage('Welcome, Mayor ' + state.playerName + '! Your city awaits. 🏙️');
}

/**
 * Creates a 10×10 null grid in state
 */
function initStateGrid() {
  state.grid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    state.grid[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      state.grid[r][c] = null; // null = empty tile
    }
  }
}

/**
 * Generates 100 tile DOM elements inside .city-grid
 */
function buildGrid() {
  const gridEl = document.getElementById('city-grid');
  gridEl.innerHTML = '';

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.row = r;
      tile.dataset.col = c;
      tile.title = `Row ${r+1}, Col ${c+1}`;

      // Click handler — place or demolish building
      tile.addEventListener('click', () => handleTileClick(r, c, tile));

      // Hover tooltip for demolish mode
      tile.addEventListener('mouseenter', () => {
        if (state.selected === 'demolish' && state.grid[r][c]) {
          tile.classList.add('demolish-target');
        }
      });
      tile.addEventListener('mouseleave', () => {
        tile.classList.remove('demolish-target');
      });

      gridEl.appendChild(tile);
    }
  }
}

// ============================================================
// 5. BUILDING PLACEMENT & DEMOLISH LOGIC
// ============================================================

/**
 * Handles a tile click — places or demolishes a building
 * @param {number} row   - Grid row index
 * @param {number} col   - Grid column index
 * @param {HTMLElement} tileEl - The clicked tile DOM element
 */
function handleTileClick(row, col, tileEl) {
  if (state.gameOver) return;

  const selected = state.selected;

  // ---- DEMOLISH MODE ----
  if (selected === 'demolish') {
    demolishBuilding(row, col, tileEl);
    return;
  }

  // ---- PLACE BUILDING ----
  if (state.grid[row][col] !== null) {
    showToast('⚠️ Tile already occupied!');
    return;
  }

  const building = BUILDINGS[selected];

  // Check if player has enough money
  if (state.money < building.cost) {
    showToast(`💸 Not enough money! Need $${building.cost}`);
    flashHUD('hud-money', false);
    return;
  }

  // Deduct cost & update state
  state.money      -= building.cost;
  state.population += building.pop;
  state.happiness  += building.happy;
  state.happiness   = Math.max(0, state.happiness); // Happiness can't go below 0
  state.grid[row][col] = selected;
  state.counts[selected]++;

  // Update tile appearance
  tileEl.classList.add(selected, 'placed');
  tileEl.textContent = building.emoji;

  // Remove animation class after animation ends
  tileEl.addEventListener('animationend', () => tileEl.classList.remove('placed'), { once: true });

  // Refresh UI
  updateHUD();
  updateBuildCounts();
  flashHUD('hud-money', false);
  if (building.pop > 0)    flashHUD('hud-pop', true);
  if (building.happy !== 0) flashHUD('hud-happy', building.happy > 0);

  addMessage(`🏗️ Built ${building.label} at (${row+1},${col+1}) for $${building.cost}`);
  checkGameOver();
}

/**
 * Demolishes a building at a tile, refunding 50% of cost
 * @param {number} row
 * @param {number} col
 * @param {HTMLElement} tileEl
 */
function demolishBuilding(row, col, tileEl) {
  const buildingType = state.grid[row][col];
  if (!buildingType) {
    showToast('🤷 Nothing to demolish here!');
    return;
  }

  const building = BUILDINGS[buildingType];
  const refund   = Math.floor(building.cost * 0.5); // 50% refund

  // Reverse effects
  state.money      += refund;
  state.population  = Math.max(0, state.population - building.pop);
  state.happiness   = Math.max(0, state.happiness  - building.happy);
  state.grid[row][col] = null;
  state.counts[buildingType]--;

  // Reset tile appearance
  tileEl.className = 'tile';
  tileEl.textContent = '';

  // Re-attach event listeners (they were on the original element, still work)
  updateHUD();
  updateBuildCounts();
  flashHUD('hud-money', true);
  addMessage(`🔨 Demolished ${building.label} — Refunded $${refund}`);
}

// ============================================================
// 6. BUILDING SELECTION
// ============================================================

/**
 * Selects a building type from the build menu
 * @param {string} type - 'house' | 'factory' | 'park' | 'road' | 'demolish'
 */
function selectBuilding(type) {
  state.selected = type;

  // Remove active from all buttons
  document.querySelectorAll('.build-btn').forEach(btn => btn.classList.remove('active'));

  // Add active to selected button
  const btn = document.getElementById('btn-' + type);
  if (btn) btn.classList.add('active');

  // Update right info panel
  const b = BUILDINGS[type];
  document.getElementById('selected-info').innerHTML = `
    <span class="sel-icon">${b.emoji}</span>
    <span class="sel-name">${b.label}</span>
  `;
}

// ============================================================
// 7. REVENUE SYSTEM — Triggered Every 10 Seconds
// ============================================================

/**
 * Starts the revenue cycle:
 * - Base income $50
 * - Each factory adds $30
 * Collected every 10 seconds
 */
function startRevenueCycle() {
  state.timerCount = 10;

  // Update countdown every second
  timerInterval = setInterval(() => {
    if (state.gameOver) return;
    state.timerCount--;
    document.getElementById('timer-count').textContent = state.timerCount;

    if (state.timerCount <= 0) {
      collectRevenue();
      state.timerCount = 10; // Reset countdown
    }
  }, 1000);
}

/**
 * Collects revenue and adds to money
 * Formula: Base($50) + Factories × $30
 */
function collectRevenue() {
  const baseRev    = 50;
  const factoryRev = state.counts.factory * 30;
  const total      = baseRev + factoryRev;

  state.money += total;
  updateHUD();
  updateBuildCounts();
  flashHUD('hud-money', true);
  addMessage(`💹 Revenue collected! +$${total} (Base $${baseRev} + Factories $${factoryRev})`);
  showToast(`+$${total} Revenue! 💰`);
}

// ============================================================
// 8. SCORE CALCULATION
// ============================================================

/**
 * Calculates current score
 * Formula: Population + Happiness + Math.floor(Money / 10)
 */
function calculateScore() {
  return state.population + state.happiness + Math.floor(state.money / 10);
}

// ============================================================
// 9. HUD UPDATES
// ============================================================

/**
 * Updates all the numeric displays in the top HUD
 */
function updateHUD() {
  state.score = calculateScore();

  document.getElementById('display-money').textContent      = state.money;
  document.getElementById('display-population').textContent = state.population;
  document.getElementById('display-happiness').textContent  = state.happiness;
  document.getElementById('display-score').textContent      = state.score;
}

/**
 * Updates building counts and revenue info in the right panel
 */
function updateBuildCounts() {
  document.getElementById('count-house').textContent   = state.counts.house;
  document.getElementById('count-factory').textContent = state.counts.factory;
  document.getElementById('count-park').textContent    = state.counts.park;
  document.getElementById('count-road').textContent    = state.counts.road;
  document.getElementById('count-total').textContent   =
    state.counts.house + state.counts.factory + state.counts.park + state.counts.road;

  const factoryRev = state.counts.factory * 30;
  document.getElementById('factory-rev').textContent = `$${factoryRev}`;
  document.getElementById('total-rev').textContent   = `$${50 + factoryRev}`;
}

/**
 * Flashes a HUD element green (gain) or red (loss)
 * @param {string}  id   - Element id
 * @param {boolean} gain - true = green flash, false = red flash
 */
function flashHUD(id, gain) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('flash-gain', 'flash-lose');
  void el.offsetWidth; // Force reflow to restart animation
  el.classList.add(gain ? 'flash-gain' : 'flash-lose');
}

// ============================================================
// 10. GAME OVER LOGIC
// ============================================================

/**
 * Checks if the player is out of money (lose condition)
 */
function checkGameOver() {
  if (state.money <= 0) {
    triggerGameOver();
  }
}

/**
 * Triggers game over: saves score, shows modal
 */
function triggerGameOver() {
  state.gameOver = true;
  clearInterval(revenueInterval);
  clearInterval(timerInterval);
  clearInterval(tipInterval);

  const finalScore = calculateScore();
  saveScore(state.playerName, finalScore);

  document.getElementById('gameover-message').textContent =
    `You ran out of money, Mayor ${state.playerName}! Final Score: ${finalScore}`;

  showModal('gameover-modal');
}

// ============================================================
// 11. LEADERBOARD (localStorage)
// ============================================================

/**
 * Saves player score to localStorage
 * @param {string} name
 * @param {number} score
 */
function saveScore(name, score) {
  let scores = JSON.parse(localStorage.getItem('cityBuilderScores') || '[]');
  scores.push({ name, score, date: new Date().toLocaleDateString() });
  scores.sort((a, b) => b.score - a.score); // Sort highest first
  scores = scores.slice(0, 10);              // Keep top 10 only
  localStorage.setItem('cityBuilderScores', JSON.stringify(scores));
}

/**
 * Loads and displays the leaderboard in the modal
 */
function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('cityBuilderScores') || '[]');
  const listEl = document.getElementById('leaderboard-list');
  const medals = ['🥇', '🥈', '🥉'];

  if (scores.length === 0) {
    listEl.innerHTML = '<p style="color:#888;font-size:0.9rem;padding:0.8rem">No scores yet. Play a game!</p>';
  } else {
    listEl.innerHTML = scores.map((entry, i) => `
      <div class="lb-row">
        <span class="lb-rank">${medals[i] || (i + 1)}</span>
        <span class="lb-name">${escapeHtml(entry.name)}</span>
        <span class="lb-score">${entry.score} pts</span>
      </div>
    `).join('');
  }

  showModal('leaderboard-modal');
}

/** Escapes HTML to prevent injection in player name */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ============================================================
// 12. MODAL HELPERS
// ============================================================

function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// ============================================================
// 13. MESSAGES & TIPS
// ============================================================

/**
 * Adds a message to the bottom scrolling ticker
 * @param {string} msg
 */
function addMessage(msg) {
  const log = document.getElementById('msg-log');
  const span = document.createElement('span');
  span.className = 'msg-item';
  span.textContent = msg;
  log.appendChild(span);

  // Also duplicate it so the scroll loop works seamlessly
  const clone = span.cloneNode(true);
  log.appendChild(clone);
}

/**
 * Initialises the bottom bar with all tips duplicated for infinite scroll
 */
function scrollTips() {
  const log = document.getElementById('msg-log');
  log.innerHTML = '';
  const all = [...GAME_TIPS, ...GAME_TIPS]; // Duplicate for seamless loop
  all.forEach(tip => {
    const span = document.createElement('span');
    span.className = 'msg-item';
    span.textContent = tip;
    log.appendChild(span);
  });
}

/**
 * Rotates the right-panel tip text every 5 seconds
 */
function startTipRotation() {
  let tipIdx = 0;
  const tipEl = document.getElementById('tip-text');

  function rotateTip() {
    tipEl.textContent = GAME_TIPS[tipIdx % GAME_TIPS.length];
    tipIdx++;
  }

  rotateTip();
  tipInterval = setInterval(rotateTip, 5000);
}

// ============================================================
// 14. TOAST NOTIFICATION
// ============================================================

let toastTimeout = null;

/**
 * Shows a floating toast message
 * @param {string} message
 */
function showToast(message) {
  // Create toast if not present
  let toast = document.getElementById('game-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'game-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  // Auto-hide after 2 seconds
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ============================================================
// 15. KEYBOARD SHORTCUTS (Bonus UX)
// ============================================================

/**
 * Keyboard shortcuts:
 * 1 = House, 2 = Factory, 3 = Park, 4 = Road, D = Demolish
 */
document.addEventListener('keydown', e => {
  if (state.gameOver) return;
  const map = { '1': 'house', '2': 'factory', '3': 'park', '4': 'road', 'd': 'demolish', 'D': 'demolish' };
  if (map[e.key]) selectBuilding(map[e.key]);
});

// ============================================================
// 16. ALLOW ENTER KEY ON NAME INPUT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('player-name');
  if (nameInput) {
    nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') startGame();
    });
  }
});

/* ============================================================
   END OF SCRIPT.JS
   ============================================================ */