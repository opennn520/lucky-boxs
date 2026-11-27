import { NUM_COLS, MAX_COL_CAP, RARITY_STYLES } from '../config/constants.js';
import { LEVELS } from '../config/levels.js';
import { sound } from '../audio/SoundEngine.js';
import { IconRenderer } from '../render/IconRenderer.js';
import { state, hasRelic, getCurrentLevelCfg, getTotalPoolCount } from '../engine/gameState.js';

let toastTimer = null;
let coinAnimFrame = null;
let boardEngineRef = null;
let onInspectRelicRef = null;

export function initHudBindings({ boardEngine, onInspectRelic }) {
  boardEngineRef = boardEngine;
  onInspectRelicRef = onInspectRelic;
}

export function showToast(msg, duration = 2800) {
  const el = document.getElementById('toastBanner');
  el.textContent = msg;
  el.classList.remove('-translate-y-24', 'opacity-0');
  el.classList.add('translate-y-0', 'opacity-100');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('translate-y-0', 'opacity-100');
    el.classList.add('-translate-y-24', 'opacity-0');
  }, duration);
}

export function getWalletCenter() {
  const el = document.getElementById('walletTarget');
  const rect = el.getBoundingClientRect();
  return { x: rect.left + 44, y: rect.top + rect.height / 2 };
}

export function spawnFloatText(idx, text, isBig = false, isBreak = false) {
  if (!boardEngineRef) return;
  const pos = boardEngineRef.getSlotScreenCenter(idx);
  const el = document.createElement('div');
  el.className = 'float-coin ' + (isBig ? 'text-lg' : 'text-sm') + (isBreak ? ' float-break' : '');
  el.style.left = pos.x + 'px';
  el.style.top = (pos.y - 8) + 'px';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 930);
}

export function triggerShake(heavy = false) {
  const app = document.getElementById('gameScreen');
  app.classList.remove('shake-light', 'shake-heavy');
  void app.offsetWidth;
  app.classList.add(heavy ? 'shake-heavy' : 'shake-light');
}

export function setTicker(msg) {
  document.getElementById('statusTicker').textContent = msg;
}

export function showTurnPayoutBanner(text) {
  const banner = document.getElementById('turnPayoutBanner');
  banner.textContent = text;
  banner.style.opacity = '1';
  banner.style.transform = 'translate(-50%, -4px)';
  banner.classList.remove('pointer-events-none');
  banner.classList.add('pointer-events-auto', 'cursor-pointer');
}

export function hideTurnPayoutBanner() {
  const banner = document.getElementById('turnPayoutBanner');
  banner.style.opacity = '0';
  banner.style.transform = 'translate(-50%, 0)';
  banner.classList.add('pointer-events-none');
  banner.classList.remove('pointer-events-auto', 'cursor-pointer');
}

export function animateCoinsTo(targetVal) {
  if (coinAnimFrame) cancelAnimationFrame(coinAnimFrame);
  const step = () => {
    const diff = targetVal - state.displayedCoins;
    if (Math.abs(diff) < 1) {
      state.displayedCoins = targetVal;
      document.getElementById('coinDisplay').textContent = Math.floor(state.displayedCoins);
      return;
    }
    state.displayedCoins += diff * 0.22;
    document.getElementById('coinDisplay').textContent = Math.floor(state.displayedCoins);
    coinAnimFrame = requestAnimationFrame(step);
  };
  coinAnimFrame = requestAnimationFrame(step);
}

export function updateHUD() {
  const lvlName = state.endless
    ? `🌌 无尽 #${state.endlessRound} · 收购银河系`
    : `第 ${LEVELS[state.levelIndex].level}/5 关 · ${LEVELS[state.levelIndex].name}`;
  document.getElementById('levelBadge').textContent = lvlName;
  document.getElementById('targetDisplay').textContent = state.target;
  document.getElementById('drawsDisplay').textContent = state.drawsLeft;
  document.getElementById('backpackCountText').textContent = `${getTotalPoolCount()}/36 · 删${state.deleteChances}`;

  // 领礼倒计时胶囊
  const cfg = getCurrentLevelCfg();
  const rem = cfg.draftEvery - (state.spinsInLevel % cfg.draftEvery);
  const cadencePill = document.getElementById('giftCadencePill');
  if (rem === 1) {
    cadencePill.textContent = `🎁 本次抽完领 ${cfg.giftsPerDraft} 礼`;
    cadencePill.className = 'px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold whitespace-nowrap shrink-0';
  } else {
    cadencePill.textContent = `🎁 再抽 ${rem} 次领 ${cfg.giftsPerDraft} 礼`;
    cadencePill.className = 'px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/70 text-amber-800 text-[10px] font-extrabold whitespace-nowrap shrink-0';
  }

  // 商店 | 抽奖 合并操作条状态
  const shopBtn = document.getElementById('shopBtn');
  const shopStatus = document.getElementById('shopStatusText');
  const drawBtnText = document.getElementById('drawBtnText');
  if (state.shopOpen && !state.isAnimating) {
    shopBtn.classList.remove('hidden');
    shopBtn.disabled = false;
    shopStatus.textContent = `商店`;
    drawBtnText.textContent = '抽奖';
  } else {
    shopBtn.classList.add('hidden');
    shopBtn.disabled = true;
    drawBtnText.textContent = '开抽！';
  }

  for (let c = 0; c < NUM_COLS; c++) {
    const len = state.columns[c].length;
    const badge = document.getElementById(`colCount${c}`);
    badge.textContent = `${len}/${MAX_COL_CAP}`;
    if (len >= MAX_COL_CAP) {
      badge.classList.add('bg-rose-500', 'text-white');
      badge.classList.remove('bg-white/85', 'text-accent');
    } else {
      badge.classList.remove('bg-rose-500', 'text-white');
      badge.classList.add('bg-white/85', 'text-accent');
    }
  }

  animateCoinsTo(state.coins);

  const pct = Math.min(100, (state.coins / state.target) * 100);
  document.getElementById('rentProgress').style.width = pct + '%';

  const feverPct = state.feverTurns > 0 ? 100 : Math.min(100, state.feverCharge);
  document.getElementById('feverProgress').style.width = feverPct + '%';
  document.getElementById('feverPercent').textContent = Math.floor(feverPct) + '%';

  const feverBanner = document.getElementById('feverBanner');
  const boardCard = document.getElementById('boardCard');
  if (state.feverTurns > 0) {
    feverBanner.classList.remove('hidden');
    document.getElementById('feverMultText').textContent = hasRelic('feverCrown') ? '3' : '2';
    document.getElementById('feverTurnsText').textContent = state.feverTurns;
    document.body.classList.add('fever-active');
    boardCard.classList.add('fever-glow');
  } else {
    feverBanner.classList.add('hidden');
    document.body.classList.remove('fever-active');
    boardCard.classList.remove('fever-glow');
  }

  const pendingPill = document.getElementById('pendingDraftPill');
  if (state.pendingDrafts.length > 0 && !state.isAnimating) {
    document.getElementById('pendingDraftText').textContent = `有待领礼品 (${state.pendingDrafts.length} 份)`;
    pendingPill.classList.remove('hidden');
  } else {
    pendingPill.classList.add('hidden');
  }

  // 摆件栏
  const relicList = document.getElementById('relicList');
  if (state.relics.length > 0) {
    relicList.innerHTML = '';
    state.relics.forEach(r => {
      const st = RARITY_STYLES[r.rarity];
      const chip = document.createElement('button');
      chip.className = `ios-btn px-2.5 py-1 rounded-xl border-2 ${st.twBorder} ${st.twBg} flex items-center gap-1.5 shrink-0 shadow-xs`;
      chip.innerHTML = `${IconRenderer.getIconSVG(r.id, 18)}<span class="text-[11px] font-extrabold text-gray-800">${r.name}</span>`;
      chip.onclick = () => {
        sound.playSelect(2);
        if (onInspectRelicRef) onInspectRelicRef(r);
      };
      relicList.appendChild(chip);
    });
  } else {
    relicList.innerHTML = `<span class="text-[11px] text-sub opacity-75">过关或逛商店可获得强力幸运摆件</span>`;
  }

  document.getElementById('drawBtn').disabled = state.isAnimating || state.drawsLeft <= 0;
}
