import {
  SHOP_UTILITY_DISPOSABLES_BY_RARITY,
  DURABLE_BY_RARITY,
  ALL_DURABLE_KEYS,
  GEO_TRIO_KEYS,
  getSymbolEstimatedTurnValue
} from '../config/symbols.js';
import { SHOP_RELICS } from '../config/relics.js';
import { state, hasRelic, getDeleteServicePrice, rollRarityByLevel } from './gameState.js';

function pickShopKeyFromPool(poolByRarity, fallbackPool, usedKeys) {
  const availableRarities = Object.keys(poolByRarity).filter(
    r => poolByRarity[r].some(k => !usedKeys.has(k))
  );
  if (availableRarities.length > 0) {
    const rarity = rollRarityByLevel(availableRarities);
    const candidates = poolByRarity[rarity].filter(k => !usedKeys.has(k));
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    usedKeys.add(picked);
    return picked;
  }
  const rest = fallbackPool.filter(k => !usedKeys.has(k));
  const picked = (rest.length > 0 ? rest : fallbackPool)[Math.floor(Math.random() * (rest.length || fallbackPool.length))];
  usedKeys.add(picked);
  return picked;
}

function calcShopItemPrice(key) {
  if (GEO_TRIO_KEYS.includes(key)) return 15;
  const est = getSymbolEstimatedTurnValue(key);
  const mult = 1.2 + Math.random() * 1.0;
  return Math.max(4, Math.round(est * mult));
}

function getOwnedTypesSet() {
  const set = new Set();
  state.columns.forEach(col => col.forEach(it => set.add(it.type)));
  return set;
}

/**
 * 商店开启与货架生成逻辑
 * - 彻底移除纯一次性加金币道具，仅出售功能联动一次性道具 + 带耐久物品 + 神秘几何摆件
 * - 仅出售 1 件商店专属遗物
 * - 删除服务独立涨价（第一次 50，购买后下次 +25）
 */
export function generateNewShopVisit() {
  state.shopLevel++;
  state.shopOpen = true;
  state.shopVisitedThisVisit = false;
  state.shopBoughtThisVisit = false;
  const lv = state.shopLevel;

  const usedKeys = new Set();
  const allUtilityDisposables = Object.values(SHOP_UTILITY_DISPOSABLES_BY_RARITY).flat();
  const shopKeys = [];

  // 若未合成「神秘装置」，22% 概率刷出 1 件未持有的几何摆件（方块/圆/三角）
  if (!hasRelic('mysteryDevice')) {
    const owned = getOwnedTypesSet();
    const missingGeo = GEO_TRIO_KEYS.filter(k => !owned.has(k));
    if (missingGeo.length > 0 && Math.random() < 0.22) {
      const geoPick = missingGeo[Math.floor(Math.random() * missingGeo.length)];
      usedKeys.add(geoPick);
      shopKeys.push(geoPick);
    }
  }

  // 补齐到 4 件（功能联动一次性 + 带耐久度物品）
  while (shopKeys.length < 2) {
    shopKeys.push(pickShopKeyFromPool(SHOP_UTILITY_DISPOSABLES_BY_RARITY, allUtilityDisposables, usedKeys));
  }
  while (shopKeys.length < 4) {
    shopKeys.push(pickShopKeyFromPool(DURABLE_BY_RARITY, ALL_DURABLE_KEYS, usedKeys));
  }

  const shopItems = shopKeys.map((key, idx) => ({
    slotId: idx,
    key,
    price: calcShopItemPrice(key),
    bought: false
  }));

  // 仅出售 1 件商店专属遗物
  const availableShopRelics = SHOP_RELICS.filter(r => !hasRelic(r.id)).sort(() => Math.random() - 0.5);
  const pickedRelics = availableShopRelics.slice(0, 1).map((r, idx) => ({
    slotId: idx,
    relic: r,
    price: r.basePrice + (lv - 1) * 4,
    bought: false
  }));

  const deletePrice = getDeleteServicePrice();

  state.shopStock = {
    items: shopItems,
    relics: pickedRelics,
    deleteBought: false,
    deletePrice
  };

  return lv;
}
