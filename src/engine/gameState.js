import { NUM_COLS, NUM_ROWS, BOARD_SIZE, MAX_COL_CAP, ITEM_RARITY_ORDER } from '../config/constants.js';
import { SYMBOLS, COMMON_KEYS, SYMBOLS_BY_RARITY } from '../config/symbols.js';
import { LEVELS, ENDLESS_TARGETS, RARITY_WEIGHTS_BY_LEVEL } from '../config/levels.js';
import { PlatformAdapter } from '../platform/PlatformAdapter.js';

const SAVE_STORAGE_KEY = 'lucky_boxs_save_v1';
let uidCounter = 1;

export const state = {
  inGame: false,
  levelIndex: 0,
  endless: false,
  endlessRound: 1,
  coins: 0,
  displayedCoins: 0,
  totalEarned: 0,
  bestTurn: 0,
  feverCount: 0,
  drawsLeft: 7,
  spinsInLevel: 0,
  target: 65,
  feverCharge: 0,
  feverTurns: 0,
  fastMode: false,
  deleteChances: 2,
  deletePurchaseCount: 0,
  columns: [[], [], [], []],
  relics: [],
  board: new Array(BOARD_SIZE).fill(null),
  isAnimating: false,
  activePoolTab: 0,
  compendiumTab: 'items',
  selectedDraftKey: null,
  pendingDrafts: [],
  // 商店状态
  shopOpen: false,
  shopLevel: 0,
  shopVisitedThisVisit: false,
  shopBoughtThisVisit: false,
  shopStock: { items: [], relics: [], deleteBought: false, deletePrice: 50 },
  pendingShopPlacement: null,
  confirmMode: null // 'draft' | 'shop'
};

export function hasRelic(id) {
  return state.relics.some(r => r.id === id);
}

export function createItem(type) {
  const def = SYMBOLS[type];
  const item = { id: uidCounter++, type, bonusBase: 0 };
  if (def.maxDurability) {
    const extra = hasRelic('careOil') ? 2 : 0;
    item.maxDurability = def.maxDurability + extra;
    item.durability = item.maxDurability;
  }
  return item;
}

export function getCurrentLevelCfg() {
  return state.endless
    ? { draws: 10, draftEvery: 3, giftsPerDraft: 1, shopMidSpin: 5 }
    : LEVELS[state.levelIndex];
}

export function getTotalPoolCount() {
  return state.columns.reduce((sum, col) => sum + col.length, 0);
}

export function areAllColumnsFull() {
  return state.columns.every(col => col.length >= MAX_COL_CAP);
}

export function getRecycleValue() {
  let val = hasRelic('vipCard') ? 6 : 2;
  if (hasRelic('recycleCoupon')) val += 3;
  return val;
}

export function getShopDiscountedPrice(raw) {
  return hasRelic('shopDiscount') ? Math.max(1, Math.floor(raw * 0.85)) : raw;
}

export function getDeleteServicePrice() {
  return 50 + state.deletePurchaseCount * 25;
}

export function getCurrentRarityWeights() {
  if (state.endless) return RARITY_WEIGHTS_BY_LEVEL[RARITY_WEIGHTS_BY_LEVEL.length - 1];
  const idx = Math.min(state.levelIndex, RARITY_WEIGHTS_BY_LEVEL.length - 1);
  return RARITY_WEIGHTS_BY_LEVEL[idx];
}

export function rollRarityByLevel(allowedRarities = ITEM_RARITY_ORDER) {
  const weights = getCurrentRarityWeights();
  const entries = allowedRarities.map(r => ({ rarity: r, w: weights[r] || 1 }));
  const totalW = entries.reduce((sum, e) => sum + e.w, 0);
  let roll = Math.random() * totalW;
  for (const e of entries) {
    roll -= e.w;
    if (roll <= 0) return e.rarity;
  }
  return entries[0].rarity;
}

export function getNeighbors(idx) {
  const r = Math.floor(idx / NUM_COLS);
  const c = idx % NUM_COLS;
  const res = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < NUM_ROWS && nc >= 0 && nc < NUM_COLS) {
        res.push(nr * NUM_COLS + nc);
      }
    }
  }
  return res;
}

export function pickWeightedDraftChoices(count = 3) {
  const chosen = [];
  const chosenSet = new Set();
  let safety = 0;

  while (chosen.length < count && safety < 50) {
    safety++;
    const rarity = rollRarityByLevel();
    const candidates = (SYMBOLS_BY_RARITY[rarity] || []).filter(k => !chosenSet.has(k));
    if (candidates.length === 0) continue;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    chosenSet.add(picked);
    chosen.push(picked);
  }
  return chosen;
}

export function removeItemFromColumns(itemId) {
  for (let c = 0; c < NUM_COLS; c++) {
    const idx = state.columns[c].findIndex(p => p.id === itemId);
    if (idx !== -1) {
      state.columns[c].splice(idx, 1);
      return c;
    }
  }
  return -1;
}

export function trySpawnIntoColumn(preferredCol, itemType) {
  if (state.columns[preferredCol].length < MAX_COL_CAP) {
    state.columns[preferredCol].push(createItem(itemType));
    return preferredCol;
  }
  for (let c = 0; c < NUM_COLS; c++) {
    if (state.columns[c].length < MAX_COL_CAP) {
      state.columns[c].push(createItem(itemType));
      return c;
    }
  }
  return -1;
}

export function addFeverCharge(amount) {
  if (state.feverTurns > 0) return;
  const mult = hasRelic('powerBank') ? 1.2 : 1;
  state.feverCharge = Math.min(100, state.feverCharge + amount * mult);
}

export function resetRunState({ endless = false } = {}) {
  state.levelIndex = 0;
  state.endless = endless;
  state.endlessRound = 1;
  state.coins = 0;
  state.displayedCoins = 0;
  state.totalEarned = 0;
  state.bestTurn = 0;
  state.feverCount = 0;
  state.drawsLeft = endless ? 10 : LEVELS[0].draws;
  state.spinsInLevel = 0;
  state.target = endless ? 120 : LEVELS[0].target;
  state.feverCharge = 0;
  state.feverTurns = 0;
  state.deleteChances = 2;
  state.deletePurchaseCount = 0;
  state.relics = [];
  state.isAnimating = false;
  state.selectedDraftKey = null;
  state.pendingDrafts = [];
  state.shopOpen = false;
  state.shopLevel = 0;
  state.shopVisitedThisVisit = false;
  state.shopBoughtThisVisit = false;
  state.pendingShopPlacement = null;

  // 开局 4 个随机普通礼品，每列 1 个
  state.columns = [[], [], [], []];
  const shuffledCommon = [...COMMON_KEYS].sort(() => Math.random() - 0.5).slice(0, NUM_COLS);
  for (let c = 0; c < NUM_COLS; c++) {
    state.columns[c].push(createItem(shuffledCommon[c]));
  }

  state.board = new Array(BOARD_SIZE).fill(null);
  for (let c = 0; c < NUM_COLS; c++) {
    state.board[c] = state.columns[c][0] || null;
  }
}

export function saveGameToStorage() {
  const payload = {
    version: 1,
    savedAt: Date.now(),
    uidCounter,
    data: {
      levelIndex: state.levelIndex,
      endless: state.endless,
      endlessRound: state.endlessRound,
      coins: state.coins,
      totalEarned: state.totalEarned,
      bestTurn: state.bestTurn,
      feverCount: state.feverCount,
      drawsLeft: state.drawsLeft,
      spinsInLevel: state.spinsInLevel,
      target: state.target,
      feverCharge: state.feverCharge,
      feverTurns: state.feverTurns,
      deleteChances: state.deleteChances,
      deletePurchaseCount: state.deletePurchaseCount,
      columns: state.columns,
      relics: state.relics,
      board: state.board,
      pendingDrafts: state.pendingDrafts,
      shopOpen: state.shopOpen,
      shopLevel: state.shopLevel,
      shopVisitedThisVisit: state.shopVisitedThisVisit,
      shopBoughtThisVisit: state.shopBoughtThisVisit,
      shopStock: state.shopStock
    }
  };
  PlatformAdapter.setStorage(SAVE_STORAGE_KEY, JSON.stringify(payload));
}

export function getSavedGameSummary() {
  const raw = PlatformAdapter.getStorage(SAVE_STORAGE_KEY, null);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data) return null;
    const d = parsed.data;
    const label = d.endless
      ? `无尽模式 #${d.endlessRound}`
      : `第 ${d.levelIndex + 1}/5 关`;
    return { label, coins: d.coins, target: d.target, drawsLeft: d.drawsLeft };
  } catch (e) {
    return null;
  }
}

export function hasSavedGame() {
  return Boolean(getSavedGameSummary());
}

export function loadGameFromStorage() {
  const raw = PlatformAdapter.getStorage(SAVE_STORAGE_KEY, null);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data) return false;
    uidCounter = Math.max(uidCounter, parsed.uidCounter || 1);
    Object.assign(state, parsed.data);
    state.displayedCoins = state.coins;
    state.isAnimating = false;
    state.selectedDraftKey = null;
    state.pendingShopPlacement = null;
    return true;
  } catch (e) {
    return false;
  }
}

export function clearSavedGame() {
  PlatformAdapter.setStorage(SAVE_STORAGE_KEY, '');
}
