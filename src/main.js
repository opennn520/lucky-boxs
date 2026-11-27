import { ENDLESS_TARGETS } from './config/levels.js';
import { PlatformAdapter } from './platform/PlatformAdapter.js';
import { AdManager, AD_PLACEMENTS } from './platform/AdManager.js';
import { sound } from './audio/SoundEngine.js';
import { IconRenderer } from './render/IconRenderer.js';
import { ParticleEngine } from './render/ParticleEngine.js';
import { ReelBoardCanvas } from './render/ReelBoardCanvas.js';
import {
  state,
  resetRunState,
  getShopDiscountedPrice,
  saveGameToStorage,
  loadGameFromStorage,
  getSavedGameSummary,
  clearSavedGame
} from './engine/gameState.js';
import { executeDraw } from './engine/drawEngine.js';
import { getCurrentTheme, loadSavedTheme, setThemeChangeListener } from './ui/themeManager.js';
import {
  initHudBindings,
  showToast,
  getWalletCenter,
  spawnFloatText,
  triggerShake,
  setTicker,
  showTurnPayoutBanner,
  hideTurnPayoutBanner,
  updateHUD
} from './ui/hud.js';
import {
  initModalBindings,
  hideAllModals,
  openNewShopVisit,
  openShopModal,
  renderShopModal,
  renderThemeList,
  openSettingsModal,
  openItemInspectModal,
  openRelicInspectModal,
  openPendingDraftModal,
  handleLevelClear,
  handleGameOver,
  openPoolModal,
  renderPoolModal,
  openCompendiumModal,
  renderCompendium
} from './ui/modals.js';

const MENU_TIPS = [
  '💡 小贴士：把招财猫或幸运草放进第 2、3 列，最多可辐射周围 8 格！',
  '💡 小贴士：柴犬和橘猫相邻会打架扣金币，记得把它们分开放哦！',
  '💡 小贴士：打工人旁边别放橘猫，不然上班偷撸猫会扣效率金币！',
  '💡 小贴士：矿工旁边尽量别放冰美式或奶茶，洒了要付清理费！',
  '💡 小贴士：魔法棒和万能胶水都能为高产史诗物品续命回耐久！',
  '💡 小贴士：火凤凰最喜欢配合一次性道具与耐久耗尽，越炸越强！',
  '💡 小贴士：商店里点击任意物品或摆件，都可以直接查看详细效果！',
  '💡 小贴士：删除服务只有购买后下一次才会涨价，精简卡组能大幅提升联动率！',
  '💡 小贴士：财神像与聚宝盆十字交叉，能让交叉格产出直接 ×4！',
  '💡 小贴士：点击棋盘上任意非空格子，随时查看剩余耐久与成长身价！'
];

let fxEngine;
let boardEngine;

function refreshMainMenuUI() {
  const tipEl = document.getElementById('mainMenuTip');
  if (tipEl) {
    tipEl.textContent = MENU_TIPS[Math.floor(Math.random() * MENU_TIPS.length)];
  }
  const contBtn = document.getElementById('menuContinueBtn');
  const contMeta = document.getElementById('menuContinueMeta');
  const summary = getSavedGameSummary();
  if (summary) {
    contMeta.textContent = `${summary.label} · ${summary.coins}/${summary.target} 🪙 · 剩 ${summary.drawsLeft} 抽`;
    contBtn.classList.remove('hidden');
  } else {
    contBtn.classList.add('hidden');
  }
}

function showMainMenu() {
  const wasInGame = state.inGame;
  state.inGame = false;
  state.feverTurns = 0;
  document.body.classList.remove('fever-active');
  hideAllModals();
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('flex');
  document.getElementById('mainMenuScreen').classList.remove('hidden');
  refreshMainMenuUI();
  if (wasInGame) {
    AdManager.scheduleInterstitial(AD_PLACEMENTS.INTERSTITIAL_BACK_MENU, 1800);
  }
}

function initGame({ endless = false } = {}) {
  clearSavedGame();
  resetRunState({ endless });
  if (boardEngine) boardEngine.resetCellFx();
  document.body.classList.remove('fever-active');
  document.getElementById('boardCard').classList.remove('fever-glow');
  hideAllModals();
  updateHUD();
  setTicker(
    endless
      ? '🌌 无尽模式开启！10 次抽盒 + 最高稀有度概率池，冲刺银河首富！'
      : '开局 4 个普通礼品 + 2 次删除机会！第 1 关每抽领 2 礼 ✨'
  );
}

function startNewGame({ endless = false } = {}) {
  state.inGame = true;
  document.getElementById('mainMenuScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
  document.getElementById('gameScreen').classList.add('flex');
  initGame({ endless });
  requestAnimationFrame(() => {
    if (boardEngine) boardEngine.resize();
  });
}

function continueSavedGame() {
  if (!loadGameFromStorage()) {
    showToast('未找到有效存档，已为你准备新对局', 2200);
    return;
  }
  state.inGame = true;
  document.getElementById('mainMenuScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
  document.getElementById('gameScreen').classList.add('flex');
  if (boardEngine) boardEngine.resetCellFx();
  hideAllModals();
  updateHUD();
  setTicker('💾 已恢复上次存档进度，继续暴富之路！');
  requestAnimationFrame(() => {
    if (boardEngine) boardEngine.resize();
  });
}

function runDraw() {
  executeDraw({
    boardEngine,
    fxEngine,
    ui: {
      updateHUD,
      showToast,
      setTicker,
      getWalletCenter,
      spawnFloatText,
      triggerShake,
      showTurnPayoutBanner,
      hideTurnPayoutBanner,
      openPendingDraftModal,
      openNewShopVisit,
      handleLevelClear,
      handleGameOver
    }
  });
}

function onSpinButtonClick() {
  if (state.isAnimating || state.drawsLeft <= 0) return;
  if (state.pendingDrafts.length > 0) {
    sound.playSelect(0);
    state.confirmMode = 'draft';
    document.getElementById('confirmSpinIcon').textContent = '🎁';
    document.getElementById('confirmSpinTitle').textContent = `还有 ${state.pendingDrafts.length} 份待领礼品！`;
    document.getElementById('confirmSpinBody').textContent = '直接开抽将会放弃这些暂存礼品，确定要跳过吗？';
    document.getElementById('confirmActionBtn').textContent = '去领礼品';
    document.getElementById('confirmSpinModal').classList.remove('hidden');
    return;
  }
  if (state.shopOpen && !state.shopVisitedThisVisit) {
    sound.playSelect(0);
    state.confirmMode = 'shop';
    document.getElementById('confirmSpinIcon').textContent = '🏪';
    document.getElementById('confirmSpinTitle').textContent = '确定跳过商店吗？';
    document.getElementById('confirmSpinBody').textContent = '商店已经开启，你还没进去逛过，确定跳过商店直接抽奖吗？';
    document.getElementById('confirmActionBtn').textContent = '去逛商店';
    document.getElementById('confirmDirectSpinBtn').textContent = '跳过并抽奖';
    document.getElementById('confirmSpinModal').classList.remove('hidden');
    return;
  }
  runDraw();
}

function bootstrap() {
  IconRenderer.preloadAll();

  setThemeChangeListener(() => renderThemeList());
  loadSavedTheme();

  fxEngine = new ParticleEngine(document.getElementById('fxCanvas'), {
    isFeverActive: () => state.inGame && state.feverTurns > 0
  });

  boardEngine = new ReelBoardCanvas(document.getElementById('boardCanvas'), {
    getState: () => state,
    getTheme: () => getCurrentTheme(),
    onInspectItem: item => openItemInspectModal(item)
  });

  initHudBindings({
    boardEngine,
    onInspectRelic: relic => openRelicInspectModal(relic)
  });

  initModalBindings({ fxEngine });

  // 主界面按钮
  document.getElementById('menuContinueBtn').addEventListener('click', () => {
    sound.playSelect(3);
    continueSavedGame();
  });
  document.getElementById('menuStartBtn').addEventListener('click', () => {
    sound.playSelect(3);
    document.getElementById('modeSelectModal').classList.remove('hidden');
  });
  document.getElementById('closeModeSelectBtn').addEventListener('click', () => {
    document.getElementById('modeSelectModal').classList.add('hidden');
  });
  document.getElementById('selectStandardModeBtn').addEventListener('click', () => {
    sound.playSelect(3);
    document.getElementById('modeSelectModal').classList.add('hidden');
    startNewGame({ endless: false });
  });
  document.getElementById('selectEndlessModeBtn').addEventListener('click', () => {
    sound.playFever();
    document.getElementById('modeSelectModal').classList.add('hidden');
    startNewGame({ endless: true });
  });
  document.getElementById('menuSettingsBtn').addEventListener('click', () => {
    sound.playSelect(1);
    openSettingsModal();
  });
  document.getElementById('menuExitBtn').addEventListener('click', () => {
    sound.playSelect(0);
    document.getElementById('exitModal').classList.remove('hidden');
  });
  document.getElementById('backFromExitBtn').addEventListener('click', () => {
    sound.playSelect(2);
    document.getElementById('exitModal').classList.add('hidden');
  });

  // 设置与图鉴
  document.getElementById('inGameSettingsBtn').addEventListener('click', () => {
    sound.playSelect(1);
    openSettingsModal();
  });
  document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.add('hidden');
  });
  document.getElementById('openEncyclopediaFromSettingsBtn').addEventListener('click', () => {
    sound.playSelect(2);
    document.getElementById('settingsModal').classList.add('hidden');
    openCompendiumModal('items');
  });
  document.getElementById('backToSettingsFromCompendiumBtn').addEventListener('click', () => {
    sound.playSelect(1);
    document.getElementById('compendiumModal').classList.add('hidden');
    openSettingsModal();
  });
  document.getElementById('settingSoundBtn').addEventListener('click', () => {
    sound.muted = !sound.muted;
    openSettingsModal();
  });
  document.getElementById('settingAnimBtn').addEventListener('click', () => {
    state.fastMode = !state.fastMode;
    sound.playSelect(state.fastMode ? 3 : 1);
    openSettingsModal();
  });
  document.getElementById('returnToMenuBtn').addEventListener('click', () => {
    sound.playSelect(0);
    document.getElementById('settingsModal').classList.add('hidden');
    document.getElementById('savePromptModal').classList.remove('hidden');
  });
  document.getElementById('saveAndExitBtn').addEventListener('click', () => {
    sound.playSelect(3);
    saveGameToStorage();
    document.getElementById('savePromptModal').classList.add('hidden');
    showMainMenu();
    showToast('💾 进度已保存！下次可点击「继续游戏」恢复', 2400);
  });
  document.getElementById('discardAndExitBtn').addEventListener('click', () => {
    sound.playSelect(0);
    clearSavedGame();
    document.getElementById('savePromptModal').classList.add('hidden');
    showMainMenu();
  });
  document.getElementById('cancelSavePromptBtn').addEventListener('click', () => {
    sound.playSelect(1);
    document.getElementById('savePromptModal').classList.add('hidden');
  });

  document.getElementById('tabItemsBtn').addEventListener('click', () => {
    sound.playSelect(1);
    state.compendiumTab = 'items';
    renderCompendium();
  });
  document.getElementById('tabRelicsBtn').addEventListener('click', () => {
    sound.playSelect(2);
    state.compendiumTab = 'relics';
    renderCompendium();
  });
  document.getElementById('closeCompendiumBtn').addEventListener('click', () => {
    document.getElementById('compendiumModal').classList.add('hidden');
  });

  // 商店
  document.getElementById('shopBtn').addEventListener('click', () => {
    sound.playSelect(2);
    openShopModal();
  });
  document.getElementById('closeShopBtn').addEventListener('click', () => {
    document.getElementById('shopModal').classList.add('hidden');
  });
  document.getElementById('buyDeleteServiceBtn').addEventListener('click', () => {
    if (state.shopStock.deleteBought) return;
    const price = getShopDiscountedPrice(state.shopStock.deletePrice);
    if (state.coins < price) return;
    state.coins -= price;
    state.deleteChances++;
    state.deletePurchaseCount++; // 仅购买后才让下一次删除服务价格 +25
    state.shopStock.deleteBought = true;
    state.shopBoughtThisVisit = true;
    sound.playShopBuy();
    PlatformAdapter.vibrate(18);
    showToast(`✂️ 已购买删除服务，删除次数 +1（当前 ${state.deleteChances} 次）`, 2200);
    updateHUD();
    renderShopModal();
  });

  // 详情弹窗
  document.getElementById('closeInspectBtn').addEventListener('click', () => {
    document.getElementById('inspectModal').classList.add('hidden');
  });
  document.getElementById('inspectModal').addEventListener('click', e => {
    if (e.target.id === 'inspectModal') document.getElementById('inspectModal').classList.add('hidden');
  });

  // 底部操作栏与暂存确认
  document.getElementById('drawBtn').addEventListener('click', onSpinButtonClick);
  document.getElementById('backpackBtn').addEventListener('click', () => {
    sound.playSelect(1);
    openPoolModal(0);
  });
  document.getElementById('pendingDraftPill').addEventListener('click', () => {
    sound.playSelect(2);
    openPendingDraftModal();
  });

  document.getElementById('tempSkipDraftBtn').addEventListener('click', () => {
    sound.playSelect(0);
    document.getElementById('draftModal').classList.add('hidden');
    updateHUD();
    showToast('礼品已暂存，下次抽奖前可随时点击底部胶囊领取 🎁', 2400);
  });
  document.getElementById('confirmActionBtn').addEventListener('click', () => {
    sound.playSelect(2);
    document.getElementById('confirmSpinModal').classList.add('hidden');
    if (state.confirmMode === 'draft') openPendingDraftModal();
    else if (state.confirmMode === 'shop') openShopModal();
  });
  document.getElementById('confirmDirectSpinBtn').addEventListener('click', () => {
    sound.playSelect(0);
    document.getElementById('confirmSpinModal').classList.add('hidden');
    runDraw();
  });

  // 4 列快捷入口与背包
  document.querySelectorAll('[data-col-header]').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playSelect(1);
      openPoolModal(Number(btn.dataset.colHeader));
    });
  });
  document.querySelectorAll('.pool-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      sound.playSelect(1);
      state.activePoolTab = Number(tab.dataset.poolTab);
      renderPoolModal();
    });
  });
  document.getElementById('closePoolBtn').addEventListener('click', () => {
    document.getElementById('poolModal').classList.add('hidden');
  });

  // 结算弹窗
  document.getElementById('restartBtn').addEventListener('click', () => {
    sound.playSelect(2);
    initGame();
  });
  document.getElementById('endToMenuBtn').addEventListener('click', () => {
    sound.playSelect(0);
    showMainMenu();
  });
  document.getElementById('endlessBtn').addEventListener('click', () => {
    sound.playFever();
    state.endless = true;
    state.endlessRound = 1;
    state.drawsLeft = 8;
    state.spinsInLevel = 0;
    state.target = ENDLESS_TARGETS[0];
    document.getElementById('endModal').classList.add('hidden');
    updateHUD();
    openNewShopVisit('（无尽模式开局）');
    setTicker('🌌 无尽模式「收购银河系」已开启，冲刺最高身家！');
  });

  showMainMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
