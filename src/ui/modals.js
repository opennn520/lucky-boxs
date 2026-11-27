import {
  NUM_COLS,
  MAX_COL_CAP,
  COL_NAMES,
  ITEM_RARITY_ORDER,
  RELIC_RARITY_ORDER,
  RARITY_STYLES
} from '../config/constants.js';
import { THEMES } from '../config/themes.js';
import { SYMBOLS } from '../config/symbols.js';
import { REGULAR_RELICS, ALL_RELICS } from '../config/relics.js';
import { LEVELS, ENDLESS_TARGETS } from '../config/levels.js';
import { PlatformAdapter } from '../platform/PlatformAdapter.js';
import { AdManager, AD_PLACEMENTS } from '../platform/AdManager.js';
import { sound } from '../audio/SoundEngine.js';
import { IconRenderer } from '../render/IconRenderer.js';
import {
  state,
  hasRelic,
  createItem,
  getTotalPoolCount,
  areAllColumnsFull,
  getRecycleValue,
  getShopDiscountedPrice,
  clearSavedGame,
  recordRelicGain
} from '../engine/gameState.js';
import { generateNewShopVisit } from '../engine/shopEngine.js';
import { getCurrentTheme, applyTheme } from './themeManager.js';
import { showToast, setTicker, updateHUD } from './hud.js';
import { formatRichDesc } from './textFormatter.js';

let fxEngineRef = null;

export function initModalBindings({ fxEngine }) {
  fxEngineRef = fxEngine;
}

const ALL_MODAL_IDS = [
  'settingsModal',
  'compendiumModal',
  'shopModal',
  'shopPlaceModal',
  'inspectModal',
  'draftModal',
  'confirmSpinModal',
  'relicModal',
  'poolModal',
  'endModal',
  'modeSelectModal',
  'savePromptModal',
  'turnBreakdownModal',
  'mysteryDeviceModal',
  'exitModal'
];

export function hideAllModals() {
  ALL_MODAL_IDS.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
}

export function openNewShopVisit(reasonText = '') {
  const lv = generateNewShopVisit();
  updateHUD();
  showToast(`🏪 Lv.${lv} 神秘商店已开启！${reasonText}点击底部「商店」按钮进店逛逛`, 3400);
}

export function openShopModal() {
  if (!state.shopOpen) return;
  state.shopVisitedThisVisit = true;
  renderShopModal();
  document.getElementById('shopModal').classList.remove('hidden');
}

export function renderShopModal() {
  document.getElementById('shopLevelBadge').textContent = `Lv.${state.shopLevel}`;
  document.getElementById('shopCoinsText').textContent = `${state.coins} 🪙`;

  // 1. 4个一次性物品
  const itemsGrid = document.getElementById('shopItemsGrid');
  itemsGrid.innerHTML = '';
  state.shopStock.items.forEach(entry => {
    const def = SYMBOLS[entry.key];
    const st = RARITY_STYLES[def.rarity];
    const price = getShopDiscountedPrice(entry.price);
    const canAfford = state.coins >= price && !entry.bought;

    const card = document.createElement('div');
    card.className = `p-2.5 rounded-2xl border-2 flex flex-col justify-between gap-1.5 ${
      entry.bought ? 'opacity-45 border-gray-200 bg-gray-50' : `${st.twBorder} ${st.twBg}`
    }`;
    card.innerHTML = `
      <div class="shop-item-inspect cursor-pointer flex flex-col gap-1.5">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 flex items-center justify-center shrink-0">${IconRenderer.getIconSVG(entry.key, 34)}</div>
          <div class="min-w-0">
            <div class="text-xs font-extrabold text-gray-900 truncate">${def.name}</div>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${st.badge}">${def.rarity}</span>
          </div>
        </div>
        <p class="text-[10px] text-gray-600 leading-snug line-clamp-2">${formatRichDesc(def.desc)}</p>
      </div>
      <button class="buy-item-btn ios-btn w-full py-1.5 rounded-xl text-xs font-extrabold ${
        entry.bought ? 'bg-gray-300 text-gray-600' : canAfford ? 'bg-amber-500 text-white shadow-xs' : 'bg-gray-200 text-gray-500'
      }" ${canAfford ? '' : 'disabled'}>
        ${entry.bought ? '已售罄' : `${price} 🪙`}
      </button>
    `;
    card.querySelector('.shop-item-inspect').onclick = () => {
      sound.playSelect(1);
      openItemInspectModal({ type: entry.key, bonusBase: 0, durability: def.maxDurability, maxDurability: def.maxDurability });
    };
    card.querySelector('.buy-item-btn').onclick = () => {
      if (entry.bought || state.coins < price) return;
      if (areAllColumnsFull()) {
        showToast(`四列均已满(9/9)，请先打开背包删除物品后再购买「${def.name}」！`, 3200);
        return;
      }
      sound.playSelect(2);
      openShopPlaceModal(entry, price);
    };
    itemsGrid.appendChild(card);
  });

  // 2. 2个商店专属遗物
  const relicsList = document.getElementById('shopRelicsList');
  relicsList.innerHTML = '';
  if (state.shopStock.relics.length === 0) {
    relicsList.innerHTML = `<div class="text-xs text-sub text-center py-3 theme-sub-bg rounded-2xl">商店专属摆件已全部集齐 🎉</div>`;
  } else {
    state.shopStock.relics.forEach(entry => {
      const r = entry.relic;
      const st = RARITY_STYLES['商店专属'];
      const price = getShopDiscountedPrice(entry.price);
      const canAfford = state.coins >= price && !entry.bought;

      const row = document.createElement('div');
      row.className = `p-2.5 rounded-2xl border-2 flex items-center gap-2.5 ${
        entry.bought ? 'opacity-45 border-gray-200 bg-gray-50' : `${st.twBorder} ${st.twBg}`
      }`;
      row.innerHTML = `
        <div class="shop-relic-inspect cursor-pointer flex items-center gap-2.5 flex-1 min-w-0">
          <div class="w-10 h-10 flex items-center justify-center shrink-0">${IconRenderer.getIconSVG(r.id, 38)}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-extrabold text-gray-900">${r.name}</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${st.badge}">商店专属</span>
            </div>
            <p class="text-[10px] text-gray-600 mt-0.5 leading-snug">${formatRichDesc(r.desc)}</p>
          </div>
        </div>
        <button class="buy-relic-btn ios-btn px-3 py-2 rounded-xl text-xs font-extrabold shrink-0 ${
          entry.bought ? 'bg-gray-300 text-gray-600' : canAfford ? 'bg-emerald-500 text-white shadow-xs' : 'bg-gray-200 text-gray-500'
        }" ${canAfford ? '' : 'disabled'}>
          ${entry.bought ? '已拥有' : `${price} 🪙`}
        </button>
      `;
      row.querySelector('.shop-relic-inspect').onclick = () => {
        sound.playSelect(1);
        openRelicInspectModal(r);
      };
      row.querySelector('.buy-relic-btn').onclick = () => {
        if (entry.bought || state.coins < price) return;
        state.coins -= price;
        entry.bought = true;
        state.shopBoughtThisVisit = true;
        state.relics.push(r);
        sound.playShopBuy();
        PlatformAdapter.vibrate(20);
        showToast(`✨ 已购入商店摆件「${r.name}」！`, 2200);
        updateHUD();
        renderShopModal();
      };
      relicsList.appendChild(row);
    });
  }

  // 3. 删牌服务
  const delPrice = getShopDiscountedPrice(state.shopStock.deletePrice);
  const delBtn = document.getElementById('buyDeleteServiceBtn');
  document.getElementById('shopDeleteRemain').textContent = state.deleteChances;
  if (state.shopStock.deleteBought) {
    delBtn.disabled = true;
    delBtn.textContent = '已购买';
    delBtn.className = 'ios-btn px-3.5 py-2 rounded-xl bg-gray-300 text-gray-600 text-xs font-extrabold shrink-0';
  } else {
    const canAfford = state.coins >= delPrice;
    delBtn.disabled = !canAfford;
    delBtn.textContent = `${delPrice} 🪙`;
    delBtn.className = `ios-btn px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 ${
      canAfford ? 'bg-rose-500 text-white shadow-xs' : 'bg-gray-200 text-gray-500'
    }`;
  }
}

export function openShopPlaceModal(entry, price) {
  const itemKey = entry.key;
  let selectedCol = null;
  const def = SYMBOLS[itemKey];
  document.getElementById('shopPlaceIcon').innerHTML = IconRenderer.getIconSVG(itemKey, 42);
  document.getElementById('shopPlaceTitle').textContent = `购买「${def.name}」(${price} 🪙)`;
  document.getElementById('shopPlaceSubtitle').textContent = '点选一列查看该列全部物品，再点击确认购买';

  const colsEl = document.getElementById('shopPlaceCols');
  const previewBox = document.getElementById('shopColPreviewBox');
  const previewTitle = document.getElementById('shopColPreviewTitle');
  const previewGrid = document.getElementById('shopColPreviewGrid');
  const cancelBtn = document.getElementById('cancelShopPlaceBtn');
  const confirmBtn = document.getElementById('confirmShopPlaceBtn');

  previewBox.classList.add('hidden');
  confirmBtn.disabled = true;
  confirmBtn.textContent = '请先选择列';

  const renderCols = () => {
    colsEl.innerHTML = '';
    for (let c = 0; c < NUM_COLS; c++) {
      const isFull = state.columns[c].length >= MAX_COL_CAP;
      const isSelected = selectedCol === c;
      const btn = document.createElement('button');
      btn.disabled = isFull;
      btn.className = `ios-btn p-2.5 rounded-2xl flex flex-col items-center gap-1 border-2 ${
        isFull
          ? 'border-rose-200 bg-rose-50 opacity-60'
          : isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
          : 'border-amber-300 bg-amber-50'
      }`;
      btn.innerHTML = `
        <span class="text-xs font-extrabold text-main">${isFull ? '已满' : COL_NAMES[c]}</span>
        <span class="text-[10px] font-bold text-accent">${state.columns[c].length}/${MAX_COL_CAP}</span>
      `;
      btn.onclick = () => {
        if (isFull) return;
        sound.playSelect(c);
        selectedCol = c;
        renderCols();

        // 展示该列目前所有物品
        const colItems = state.columns[c];
        previewTitle.textContent = `${COL_NAMES[c]} 当前物品 (${colItems.length}/${MAX_COL_CAP})`;
        previewGrid.innerHTML = '';
        if (colItems.length === 0) {
          previewGrid.innerHTML = `<div class="col-span-3 text-[11px] text-sub text-center py-2">这一列目前为空</div>`;
        } else {
          colItems.forEach(it => {
            const itDef = SYMBOLS[it.type];
            const st = RARITY_STYLES[itDef.rarity] || RARITY_STYLES['普通'];
            const cell = document.createElement('div');
            cell.className = `p-1.5 rounded-xl border ${st.twBorder} ${st.twBg} flex items-center gap-1.5`;
            cell.innerHTML = `
              ${IconRenderer.getIconSVG(it.type, 20)}
              <span class="text-[10px] font-extrabold text-gray-800 truncate">${itDef.name}</span>
            `;
            previewGrid.appendChild(cell);
          });
        }
        previewBox.classList.remove('hidden');

        confirmBtn.disabled = false;
        confirmBtn.textContent = `确认放入${COL_NAMES[c]} (-${price}🪙)`;
      };
      colsEl.appendChild(btn);
    }
  };

  cancelBtn.onclick = () => {
    sound.playSelect(0);
    document.getElementById('shopPlaceModal').classList.add('hidden');
  };

  confirmBtn.onclick = () => {
    if (selectedCol === null || entry.bought || state.coins < price) return;
    if (state.columns[selectedCol].length >= MAX_COL_CAP) return;
    state.coins -= price;
    entry.bought = true;
    state.shopBoughtThisVisit = true;
    state.columns[selectedCol].push(createItem(itemKey));
    sound.playShopBuy();
    PlatformAdapter.vibrate(16);
    document.getElementById('shopPlaceModal').classList.add('hidden');
    updateHUD();
    renderShopModal();
    setTicker(`已购入「${def.name}」并放入【${COL_NAMES[selectedCol]}】`);
  };

  renderCols();
  document.getElementById('shopPlaceModal').classList.remove('hidden');
}

export function renderThemeList() {
  const list = document.getElementById('themeList');
  if (!list) return;
  list.innerHTML = '';
  const active = getCurrentTheme();
  THEMES.forEach(t => {
    const isSelected = t.id === active.id;
    const btn = document.createElement('button');
    btn.className = `ios-btn w-full p-2.5 rounded-2xl flex items-center justify-between border-2 transition-all ${
      isSelected ? 'border-amber-400 bg-amber-50/40' : 'border-transparent theme-sub-bg'
    }`;
    btn.innerHTML = `
      <div class="flex items-center gap-2.5">
        <div class="flex -space-x-1.5">
          <span class="w-5 h-5 rounded-full border-2 border-white shadow-sm" style="background:${t.swatch[0]}"></span>
          <span class="w-5 h-5 rounded-full border-2 border-white shadow-sm" style="background:${t.swatch[1]}"></span>
          <span class="w-5 h-5 rounded-full border-2 border-white shadow-sm" style="background:${t.swatch[2]}"></span>
        </div>
        <div class="text-left">
          <div class="text-xs font-extrabold text-main">${t.name}</div>
          <div class="text-[10px] text-sub">${t.tag}</div>
        </div>
      </div>
      <span class="text-xs font-extrabold ${isSelected ? 'text-accent' : 'opacity-0'}">✓</span>
    `;
    btn.onclick = () => {
      sound.playSelect(2);
      applyTheme(t.id);
    };
    list.appendChild(btn);
  });
}

export function openSettingsModal() {
  renderThemeList();
  document.getElementById('settingSoundIcon').textContent = sound.muted ? '🔇' : '🔊';
  document.getElementById('settingSoundLabel').textContent = sound.muted ? '音效：静音' : '音效：开启';
  document.getElementById('settingAnimIcon').textContent = state.fastMode ? '⚡' : '🎬';
  document.getElementById('settingAnimLabel').textContent = state.fastMode ? '滚轮：极速' : '滚轮：动画';
  const returnBtn = document.getElementById('returnToMenuBtn');
  if (state.inGame) returnBtn.classList.remove('hidden');
  else returnBtn.classList.add('hidden');
  document.getElementById('settingsModal').classList.remove('hidden');
}

export function openItemInspectModal(item) {
  const def = SYMBOLS[item.type];
  const st = RARITY_STYLES[def.rarity];
  document.getElementById('inspectIconWrap').innerHTML = IconRenderer.getIconSVG(item.type, 64);
  document.getElementById('inspectName').textContent = def.name;
  const rEl = document.getElementById('inspectRarity');
  rEl.textContent = def.rarity;
  rEl.className = `px-2 py-0.5 rounded-full text-[10px] font-extrabold ${st.badge}`;

  const bonusStr = item.bonusBase > 0 ? ` (含成长 +${item.bonusBase})` : '';
  document.getElementById('inspectMeta').textContent = def.oneTime
    ? '一次性高爆过渡品'
    : `${def.archetype} · 基础 +${def.base + item.bonusBase} 🪙${bonusStr}`;

  const durEl = document.getElementById('inspectDurability');
  if (typeof item.durability === 'number') {
    durEl.textContent = `剩余耐久: ${item.durability} / ${item.maxDurability}`;
    durEl.classList.remove('hidden');
  } else {
    durEl.classList.add('hidden');
  }

  document.getElementById('inspectRelicStats').classList.add('hidden');
  document.getElementById('inspectDesc').innerHTML = formatRichDesc(def.desc);
  document.getElementById('inspectModal').classList.remove('hidden');
}

export function openRelicInspectModal(relic) {
  const st = RARITY_STYLES[relic.rarity];
  document.getElementById('inspectIconWrap').innerHTML = IconRenderer.getIconSVG(relic.id, 64);
  document.getElementById('inspectName').textContent = relic.name;
  const rEl = document.getElementById('inspectRarity');
  rEl.textContent = relic.rarity;
  rEl.className = `px-2 py-0.5 rounded-full text-[10px] font-extrabold ${st.badge}`;
  document.getElementById('inspectMeta').textContent =
    relic.rarity === '神话'
      ? '🌌 神话级终极遗物'
      : relic.rarity === '商店特殊'
      ? '🌀 商店特殊融合遗物'
      : relic.rarity === '商店专属'
      ? '🍀 商店专属永久摆件'
      : '✨ 永久生效原创摆件';
  document.getElementById('inspectDurability').classList.add('hidden');

  const statsBox = document.getElementById('inspectRelicStats');
  if (state.inGame && hasRelic(relic.id)) {
    const stat = state.relicStats[relic.id] || { turn: 0, total: 0 };
    document.getElementById('inspectRelicTurn').textContent = `+${stat.turn} 🪙`;
    document.getElementById('inspectRelicTotal').textContent = `+${stat.total} 🪙`;
    statsBox.classList.remove('hidden');
  } else {
    statsBox.classList.add('hidden');
  }

  document.getElementById('inspectDesc').innerHTML = formatRichDesc(relic.desc);
  document.getElementById('inspectModal').classList.remove('hidden');
}

export function openTurnBreakdownModal() {
  const log = state.lastTurnLog;
  if (!log) return;
  document.getElementById('turnBreakdownSummary').textContent = `本轮净收益：${log.total >= 0 ? '+' : ''}${log.total} 🪙`;
  const body = document.getElementById('turnBreakdownBody');
  body.innerHTML = '';

  const gainsBlock = document.createElement('div');
  gainsBlock.className = 'flex flex-col gap-1';
  gainsBlock.innerHTML = `<div class="text-xs font-extrabold text-emerald-700">🟢 本轮收益项 (${log.gains.length})</div>`;
  if (log.gains.length === 0) {
    gainsBlock.innerHTML += `<div class="text-[11px] text-sub theme-sub-bg rounded-xl p-2">本轮暂无正向收益</div>`;
  } else {
    log.gains.forEach(g => {
      gainsBlock.innerHTML += `
        <div class="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
          <span class="text-gray-800 font-semibold truncate">${g.label}</span>
          <span class="text-emerald-600 font-extrabold shrink-0">+${g.amount} 🪙</span>
        </div>`;
    });
  }
  body.appendChild(gainsBlock);

  if (log.losses.length > 0) {
    const lossesBlock = document.createElement('div');
    lossesBlock.className = 'flex flex-col gap-1 mt-1';
    lossesBlock.innerHTML = `<div class="text-xs font-extrabold text-rose-600">🔴 本轮扣费项 (${log.losses.length})</div>`;
    log.losses.forEach(l => {
      lossesBlock.innerHTML += `
        <div class="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
          <span class="text-gray-800 font-semibold truncate">${l.label}</span>
          <span class="text-rose-600 font-extrabold shrink-0">-${l.amount} 🪙</span>
        </div>`;
    });
    body.appendChild(lossesBlock);
  }

  document.getElementById('turnBreakdownModal').classList.remove('hidden');
}

export function openMysteryDeviceModal(device) {
  document.getElementById('mysteryDeviceIcon').innerHTML = IconRenderer.getIconSVG(device.id, 72);
  document.getElementById('mysteryDeviceDesc').innerHTML = formatRichDesc(device.desc);
  document.getElementById('mysteryDeviceModal').classList.remove('hidden');
}

export function openPendingDraftModal() {
  if (state.pendingDrafts.length === 0) return;
  if (areAllColumnsFull()) {
    document.getElementById('draftModal').classList.add('hidden');
    updateHUD();
    showToast('四列均已满(9/9)！礼品已暂存，请先打开「🎒 背包」删牌后再领取。', 4000);
    setTicker('⚠️ 四列均已满(9/9)，请先打开「🎒 背包」删牌后再领礼品');
    return;
  }

  state.selectedDraftKey = null;
  const currentChoices = state.pendingDrafts[0];
  document.getElementById('draftQueueTag').textContent =
    state.pendingDrafts.length > 1 ? `策略补给站 · 剩余 ${state.pendingDrafts.length} 份待选` : '策略补给站';

  const container = document.getElementById('draftOptions');
  container.innerHTML = '';

  currentChoices.forEach((key, idx) => {
    const def = SYMBOLS[key];
    const st = RARITY_STYLES[def.rarity];
    const durTag = def.maxDurability
      ? `<span class="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-orange-100 text-orange-700">耐久 ${
          def.maxDurability + (hasRelic('careOil') ? 2 : 0)
        }</span>`
      : '';
    const oneTag = def.oneTime
      ? `<span class="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-100 text-rose-700">一次性</span>`
      : '';

    const btn = document.createElement('button');
    btn.dataset.draftKey = key;
    btn.className = `draft-card ios-btn w-full p-2.5 rounded-2xl border-2 ${st.twBorder} ${st.twBg} flex items-center gap-2.5 text-left transition-all`;
    btn.innerHTML = `
      <div class="w-11 h-11 flex items-center justify-center shrink-0">${IconRenderer.getIconSVG(key, 42)}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center flex-wrap gap-1">
          <span class="font-extrabold text-gray-900 text-sm">${def.name}</span>
          <span class="px-1.5 py-0.5 rounded-md text-[10px] font-bold ${st.badge}">${def.rarity}</span>
          ${durTag}${oneTag}
          ${def.oneTime ? '' : `<span class="text-[11px] font-extrabold text-amber-600 ml-auto">基础 +${def.base}</span>`}
        </div>
        <p class="text-[11px] text-gray-600 mt-0.5 leading-snug">${formatRichDesc(def.desc)}</p>
      </div>
    `;
    btn.onclick = () => {
      sound.playSelect(idx);
      state.selectedDraftKey = key;
      container.querySelectorAll('.draft-card').forEach(el => el.classList.remove('draft-card-selected'));
      btn.classList.add('draft-card-selected');
      renderColumnPicker();
    };
    container.appendChild(btn);
  });

  renderColumnPicker();
  document.getElementById('draftModal').classList.remove('hidden');
}

export function renderColumnPicker() {
  const section = document.getElementById('columnPickerSection');
  const hint = document.getElementById('pickerHint');
  const btnsContainer = document.getElementById('columnPickerBtns');
  const selectedDef = state.selectedDraftKey ? SYMBOLS[state.selectedDraftKey] : null;

  if (selectedDef) {
    section.classList.remove('opacity-45', 'pointer-events-none');
    hint.textContent = `把「${selectedDef.name}」放入哪一列？`;
  } else {
    section.classList.add('opacity-45', 'pointer-events-none');
    hint.textContent = '👆 请先点选上方一个礼品';
  }

  btnsContainer.innerHTML = '';
  for (let c = 0; c < NUM_COLS; c++) {
    const colItems = state.columns[c];
    const isFull = colItems.length >= MAX_COL_CAP;
    const recommendMid = !isFull && selectedDef && selectedDef.isMult && (c === 1 || c === 2);

    const colBtn = document.createElement('button');
    colBtn.disabled = isFull;
    colBtn.className = `ios-btn p-2 rounded-2xl flex flex-col items-center gap-1 border-2 relative ${
      isFull
        ? 'border-rose-200 bg-rose-50/70 opacity-65'
        : recommendMid
        ? 'border-amber-400 bg-amber-50'
        : 'border-transparent theme-sub-bg'
    }`;
    const miniIcons = colItems.slice(0, 3).map(it => IconRenderer.getIconSVG(it.type, 16)).join('');
    colBtn.innerHTML = `
      ${recommendMid ? '<span class="absolute -top-2 px-1 py-0.5 rounded-full bg-amber-500 text-white text-[8px] font-extrabold">推荐</span>' : ''}
      <div class="text-[11px] font-extrabold ${isFull ? 'text-rose-600' : 'text-main'}">${isFull ? '已满' : COL_NAMES[c]}</div>
      <div class="text-[10px] font-bold ${isFull ? 'text-rose-500' : 'text-accent'}">${colItems.length}/${MAX_COL_CAP}</div>
      <div class="flex items-center justify-center gap-0.5 h-4">${miniIcons || '<span class="text-[10px] text-sub">空</span>'}</div>
    `;
    colBtn.onclick = () => {
      if (!state.selectedDraftKey || isFull) return;
      const def = SYMBOLS[state.selectedDraftKey];
      state.columns[c].push(createItem(state.selectedDraftKey));
      state.pendingDrafts.shift();
      sound.playLock(c);
      PlatformAdapter.vibrate(14);
      updateHUD();
      setTicker(`已将「${def.name}」放入【${COL_NAMES[c]}】(${state.columns[c].length}/9)`);

      if (state.pendingDrafts.length > 0) {
        openPendingDraftModal();
      } else {
        document.getElementById('draftModal').classList.add('hidden');
      }
    };
    btnsContainer.appendChild(colBtn);
  }
}

export function handleLevelClear() {
  sound.playVictory();
  if (fxEngineRef) fxEngineRef.spawnConfetti(65);
  PlatformAdapter.vibrate([30, 50, 30]);
  state.pendingDrafts = [];
  state.shopOpen = false;

  // 删牌次数阶段性奖励：第1关结束+2，第2关及以后+1
  const delBonus = !state.endless && state.levelIndex === 0 ? 2 : 1;
  state.deleteChances += delBonus;

  const extraNotes = [`过关获赠删除次数 +${delBonus}`];
  if (hasRelic('goldScale')) {
    const interest = Math.min(80, Math.floor(state.coins * 0.1));
    if (interest > 0) {
      state.coins += interest;
      state.totalEarned += interest;
      recordRelicGain('goldScale', interest);
      extraNotes.push(`黄金天平利息 +${interest}🪙`);
    }
  }
  if (hasRelic('passbook')) {
    state.coins += 12;
    state.totalEarned += 12;
    recordRelicGain('passbook', 12);
    extraNotes.push(`零钱存折 +12🪙`);
  }
  if (hasRelic('oldWallet')) {
    const curLvlNum = state.endless ? state.endlessRound + 5 : state.levelIndex + 1;
    const walletBonus = getTotalPoolCount() * curLvlNum;
    if (walletBonus > 0) {
      state.coins += walletBonus;
      state.totalEarned += walletBonus;
      recordRelicGain('oldWallet', walletBonus);
      extraNotes.push(`旧钱包 +${walletBonus}🪙`);
    }
  }

  if (!state.endless && state.levelIndex < LEVELS.length - 1) {
    openRelicModal(extraNotes.join(' · '));
  } else if (!state.endless && state.levelIndex === LEVELS.length - 1) {
    openEndModal(true);
  } else {
    state.endlessRound++;
    state.drawsLeft = 10 + (hasRelic('timeHourglass') ? 1 : 0);
    state.spinsInLevel = 0;
    const idx = state.endlessRound - 1;
    state.target = idx < ENDLESS_TARGETS.length ? ENDLESS_TARGETS[idx] : Math.round(state.target * 1.65);
    updateHUD();
    openNewShopVisit('（无尽新轮次开局）');
  }
}

export function openRelicModal(extraMsg = '') {
  const container = document.getElementById('relicOptions');
  container.innerHTML = '';
  document.getElementById('relicModalSubtitle').textContent = extraMsg || '永久被动生效，助你买下全世界';

  // 按稀有度加权抽取过关摆件（神话品质掉落概率最低）
  const relicWeights = { '普通': 45, '罕见': 30, '稀有': 16, '史诗': 7, '神话': 1.5 };
  const pool = REGULAR_RELICS.filter(r => !hasRelic(r.id));
  const available = [];
  while (available.length < 3 && pool.length > 0) {
    const totalW = pool.reduce((sum, r) => sum + (relicWeights[r.rarity] || 10), 0);
    let roll = Math.random() * totalW;
    let pickIdx = 0;
    for (let j = 0; j < pool.length; j++) {
      roll -= relicWeights[pool[j].rarity] || 10;
      if (roll <= 0) {
        pickIdx = j;
        break;
      }
    }
    available.push(pool[pickIdx]);
    pool.splice(pickIdx, 1);
  }

  available.forEach(relic => {
    const st = RARITY_STYLES[relic.rarity];
    const btn = document.createElement('button');
    btn.className = `ios-btn w-full p-3.5 rounded-2xl ${st.twBg} border-2 ${st.twBorder} flex items-center gap-3 text-left`;
    btn.innerHTML = `
      <div class="w-11 h-11 flex items-center justify-center shrink-0">${IconRenderer.getIconSVG(relic.id, 42)}</div>
      <div class="flex-1">
        <div class="flex items-center gap-1.5">
          <span class="font-extrabold text-gray-900 text-sm">${relic.name}</span>
          <span class="px-1.5 py-0.5 rounded-md text-[10px] font-bold ${st.badge}">${relic.rarity}</span>
        </div>
        <p class="text-xs text-gray-600 mt-0.5 leading-snug">${formatRichDesc(relic.desc)}</p>
      </div>
    `;
    btn.onclick = () => {
      sound.playSelect(4);
      state.relics.push(relic);
      state.levelIndex++;
      state.drawsLeft = LEVELS[state.levelIndex].draws + (hasRelic('timeHourglass') ? 1 : 0);
      state.spinsInLevel = 0;
      state.target = LEVELS[state.levelIndex].target;
      document.getElementById('relicModal').classList.add('hidden');
      updateHUD();
      // 第 2 关及以后每关开局自动开启商店
      openNewShopVisit(`（第 ${state.levelIndex + 1} 关开局补给）`);
      setTicker(`获得摆件「${relic.name}」！第 ${state.levelIndex + 1} 关商店已开启 🏪`);
    };
    container.appendChild(btn);
  });

  document.getElementById('relicModal').classList.remove('hidden');
}

export function handleGameOver() {
  state.pendingDrafts = [];
  state.shopOpen = false;
  sound.playDefeat();
  openEndModal(false);
  AdManager.scheduleInterstitial(AD_PLACEMENTS.INTERSTITIAL_RUN_END, 1800);
}

export function openEndModal(isVictory) {
  clearSavedGame();
  const iconEl = document.getElementById('endIcon');
  const stampEl = document.getElementById('defeatStamp');
  const titleEl = document.getElementById('endTitle');
  const narrativeEl = document.getElementById('endNarrative');
  const endlessBtn = document.getElementById('endlessBtn');

  document.getElementById('statTotalCoins').textContent = state.totalEarned;
  document.getElementById('statBestTurn').textContent = state.bestTurn;
  document.getElementById('statFeverCount').textContent = state.feverCount;

  if (isVictory) {
    iconEl.textContent = '🌍';
    iconEl.className = 'text-6xl mt-1 victory-bounce';
    stampEl.classList.add('hidden');
    titleEl.textContent = '买下全世界！';
    narrativeEl.textContent =
      '恭喜宇宙首富诞生！\n你一路横扫买下了：【交水电费 → 交本月房租 → 买下整栋楼 → 全款拿下海景大别墅 → 买下整个地球】！\n接下来，要不要顺便收购银河系？';
    endlessBtn.classList.remove('hidden');
    if (fxEngineRef) {
      fxEngineRef.spawnConfetti(110);
      setTimeout(() => fxEngineRef.spawnConfetti(70), 650);
    }
  } else {
    iconEl.textContent = '💸';
    iconEl.className = 'text-6xl mt-1';
    stampEl.classList.remove('hidden');
    titleEl.textContent = '资金链断啦...';
    const cleared = LEVELS.slice(0, state.levelIndex).map(l => l.name);
    const clearedText = cleared.length > 0 ? `【${cleared.join('、')}】` : '【啥也没买到（水电费都没交上）】';
    const curName = state.endless ? `收购银河系 #${state.endlessRound}` : LEVELS[state.levelIndex].name;
    const diff = Math.max(1, state.target - state.coins);
    narrativeEl.textContent =
      `你成功买下了：${clearedText}\n但可惜的是，距离【${curName}】只差最后 ${diff} 🪙……\n合理逛商店与精简卡组，下局直接起飞！`;
    endlessBtn.classList.add('hidden');
  }

  document.getElementById('endModal').classList.remove('hidden');
}

export function openPoolModal(colTab = 0) {
  state.activePoolTab = colTab;
  renderPoolModal();
  document.getElementById('poolModal').classList.remove('hidden');
}

export function renderPoolModal() {
  const refund = getRecycleValue();
  document.getElementById('recycleRefundLabel').textContent = `+${refund} 🪙`;
  document.getElementById('poolDeleteCount').textContent = state.deleteChances;

  // 背包内展示所有已持有遗物
  const poolRelicCount = document.getElementById('poolRelicCount');
  const poolRelicsList = document.getElementById('poolRelicsList');
  if (poolRelicCount && poolRelicsList) {
    poolRelicCount.textContent = state.relics.length;
    poolRelicsList.innerHTML = '';
    if (state.relics.length === 0) {
      poolRelicsList.innerHTML = `<span class="text-[11px] text-sub opacity-75">暂未持有幸运摆件</span>`;
    } else {
      state.relics.forEach(r => {
        const st = RARITY_STYLES[r.rarity] || RARITY_STYLES['普通'];
        const chip = document.createElement('button');
        chip.className = `ios-btn px-2 py-1 rounded-xl border-2 ${st.twBorder} ${st.twBg} flex items-center gap-1 shrink-0 shadow-xs`;
        chip.innerHTML = `${IconRenderer.getIconSVG(r.id, 18)}<span class="text-[11px] font-extrabold text-gray-800">${r.name}</span>`;
        chip.onclick = () => {
          sound.playSelect(2);
          openRelicInspectModal(r);
        };
        poolRelicsList.appendChild(chip);
      });
    }
  }

  const hintBox = document.getElementById('poolHintBox');
  if (state.deleteChances <= 0) {
    hintBox.innerHTML = '⚠️ <b>删除次数已用完</b>：可在「🏪 商店」购买删除服务，或过关后自动获赠！';
  } else {
    hintBox.innerHTML = '💡 <b>精简技巧</b>：点击图标可查看详细联动与耐久；删除多余物品可大幅提高联动率。';
  }

  document.querySelectorAll('.pool-tab').forEach(tab => {
    const idx = Number(tab.dataset.poolTab);
    const len = state.columns[idx].length;
    tab.textContent = `${COL_NAMES[idx]} ${len}/9`;
    tab.className =
      idx === state.activePoolTab
        ? 'pool-tab ios-btn py-1.5 rounded-xl text-[11px] font-extrabold bg-white text-accent shadow-sm'
        : 'pool-tab ios-btn py-1.5 rounded-xl text-[11px] font-bold text-sub';
  });

  const grid = document.getElementById('poolGrid');
  grid.innerHTML = '';
  const colList = state.columns[state.activePoolTab];

  if (colList.length === 0) {
    grid.innerHTML = `<div class="col-span-3 py-8 text-center text-xs text-sub font-semibold">这一列目前空空如也 ~</div>`;
    return;
  }

  const canDelete = getTotalPoolCount() > 1 && state.deleteChances > 0;
  colList.forEach(item => {
    const def = SYMBOLS[item.type];
    const st = RARITY_STYLES[def.rarity];
    const durBadge =
      typeof item.durability === 'number'
        ? `<span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
            item.durability <= 2 ? 'bg-orange-500 text-white' : 'bg-gray-700 text-white'
          }">耐久 ${item.durability}/${item.maxDurability}</span>`
        : `<span class="text-[10px] font-bold text-amber-700">${def.oneTime ? '一次性' : `基础 +${def.base + item.bonusBase}`}</span>`;

    const card = document.createElement('div');
    card.className = `p-2 rounded-2xl flex flex-col items-center justify-between gap-1 border-2 ${st.twBorder} ${st.twBg}`;
    card.innerHTML = `
      <div class="w-10 h-10 flex items-center justify-center cursor-pointer">${IconRenderer.getIconSVG(item.type, 38)}</div>
      <div class="text-[11px] font-extrabold text-gray-800 truncate w-full text-center">${def.name}</div>
      ${durBadge}
      <button class="recycle-item-btn ios-btn w-full py-1 rounded-xl text-[10px] font-extrabold ${
        canDelete ? 'bg-white text-rose-600 border border-rose-200 shadow-xs' : 'bg-black/5 text-gray-400'
      }" ${canDelete ? '' : 'disabled'}>${state.deleteChances > 0 ? `删除 +${refund}🪙` : '无删除次'}</button>
    `;
    card.querySelector('.cursor-pointer').onclick = () => {
      sound.playSelect(1);
      openItemInspectModal(item);
    };
    card.querySelector('.recycle-item-btn').onclick = () => {
      if (getTotalPoolCount() <= 1 || state.deleteChances <= 0) return;
      state.columns[state.activePoolTab] = state.columns[state.activePoolTab].filter(p => p.id !== item.id);
      state.deleteChances--;
      state.coins += refund;
      state.totalEarned += refund;
      sound.playCoin();
      PlatformAdapter.vibrate(12);
      showToast(`已删除「${def.name}」，返还 +${refund}🪙（剩余删除 ${state.deleteChances} 次）`, 2000);
      updateHUD();
      renderPoolModal();
    };
    grid.appendChild(card);
  });
}

export function openCompendiumModal(tab = 'items') {
  state.compendiumTab = tab;
  renderCompendium();
  document.getElementById('compendiumModal').classList.remove('hidden');
}

export function renderCompendium() {
  const tabItemsBtn = document.getElementById('tabItemsBtn');
  const tabRelicsBtn = document.getElementById('tabRelicsBtn');
  const body = document.getElementById('compendiumBody');
  body.innerHTML = '';

  if (state.compendiumTab === 'items') {
    tabItemsBtn.className = 'ios-btn py-2 rounded-xl text-xs font-extrabold bg-white text-accent shadow-sm';
    tabRelicsBtn.className = 'ios-btn py-2 rounded-xl text-xs font-bold text-sub';

    const ownedMap = {};
    state.columns.forEach(col =>
      col.forEach(it => {
        ownedMap[it.type] = (ownedMap[it.type] || 0) + 1;
      })
    );

    ITEM_RARITY_ORDER.forEach(rarity => {
      const items = Object.values(SYMBOLS).filter(s => s.rarity === rarity);
      const st = RARITY_STYLES[rarity];
      const group = document.createElement('div');
      group.className = 'flex flex-col gap-1.5';
      group.innerHTML = `
        <span class="self-start px-2.5 py-0.5 rounded-full text-xs font-extrabold ${st.badge}">${rarity} (${items.length})</span>
        <div class="flex flex-col gap-1.5">
          ${items
            .map(def => {
              const count = state.inGame ? ownedMap[def.type] || 0 : 0;
              const durTag = def.maxDurability
                ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-orange-100 text-orange-700">耐久 ${def.maxDurability}</span>`
                : '';
              const oneTag = def.oneTime
                ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-700">一次性</span>`
                : '';
              return `
                <div class="p-2.5 rounded-2xl flex items-center gap-2.5 border-2 ${st.twBorder} ${st.twBg}">
                  <div class="w-10 h-10 flex items-center justify-center shrink-0">${IconRenderer.getIconSVG(def.type, 38)}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center flex-wrap gap-1">
                      <span class="font-extrabold text-gray-900 text-xs">${def.name}</span>
                      <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/85 text-gray-700">${def.archetype}</span>
                      ${durTag}${oneTag}
                      ${def.oneTime ? '' : `<span class="text-[10px] font-extrabold text-amber-700">基础 +${def.base}</span>`}
                      ${
                        count > 0
                          ? `<span class="ml-auto px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold">✓ 已持有 ×${count}</span>`
                          : ''
                      }
                    </div>
                    <p class="text-[11px] text-gray-600 mt-0.5 leading-snug">${formatRichDesc(def.desc)}</p>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      `;
      body.appendChild(group);
    });
  } else {
    tabRelicsBtn.className = 'ios-btn py-2 rounded-xl text-xs font-extrabold bg-white text-accent shadow-sm';
    tabItemsBtn.className = 'ios-btn py-2 rounded-xl text-xs font-bold text-sub';

    RELIC_RARITY_ORDER.forEach(rarity => {
      const list = ALL_RELICS.filter(r => r.rarity === rarity);
      const st = RARITY_STYLES[rarity];
      const group = document.createElement('div');
      group.className = 'flex flex-col gap-1.5';
      group.innerHTML = `
        <span class="self-start px-2.5 py-0.5 rounded-full text-xs font-extrabold ${st.badge}">${rarity} (${list.length})</span>
        <div class="flex flex-col gap-1.5">
          ${list
            .map(r => {
              const owned = state.inGame && hasRelic(r.id);
              return `
                <div class="p-2.5 rounded-2xl flex items-center gap-2.5 border-2 ${st.twBorder} ${st.twBg}">
                  <div class="w-10 h-10 flex items-center justify-center shrink-0">${IconRenderer.getIconSVG(r.id, 38)}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="font-extrabold text-gray-900 text-xs">${r.name}</span>
                      ${
                        owned
                          ? `<span class="ml-auto px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold">✓ 已持有</span>`
                          : ''
                      }
                    </div>
                    <p class="text-[11px] text-gray-600 mt-0.5 leading-snug">${formatRichDesc(r.desc)}</p>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      `;
      body.appendChild(group);
    });
  }
}
