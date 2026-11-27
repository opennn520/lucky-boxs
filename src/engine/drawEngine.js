import { NUM_COLS, NUM_ROWS, BOARD_SIZE, COL_NAMES } from '../config/constants.js';
import { SYMBOLS, COMMON_KEYS } from '../config/symbols.js';
import { SPECIAL_RELICS } from '../config/relics.js';
import { PlatformAdapter } from '../platform/PlatformAdapter.js';
import { sound } from '../audio/SoundEngine.js';
import {
  state,
  hasRelic,
  getCurrentLevelCfg,
  getNeighbors,
  pickWeightedDraftChoices,
  removeItemFromColumns,
  trySpawnIntoColumn,
  addFeverCharge,
  resetRelicTurnStats,
  recordRelicGain
} from './gameState.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * 核心抽奖、耐久消耗、联动与 20 件摆件结算引擎
 * 通过注入的 { boardEngine, fxEngine, ui } 与渲染/界面层解耦
 */
export async function executeDraw({ boardEngine, fxEngine, ui }) {
  if (state.isAnimating || state.drawsLeft <= 0) return;
  sound.init();
  state.pendingDrafts = [];
  state.shopOpen = false; // 开抽即关闭本回合商店
  state.isAnimating = true;
  state.drawsLeft--;
  state.spinsInLevel++;
  ui.hideTurnPayoutBanner();
  ui.updateHUD();

  const isFeverTurn = state.feverTurns > 0;
  const feverMult = isFeverTurn ? (hasRelic('feverCrown') ? 3 : 2) : 1;
  const coreTriggered = hasRelic('coreEngine') && Math.random() < 0.25;
  const coreMult = coreTriggered ? 1.5 : 1;

  if (hasRelic('spareBattery')) addFeverCharge(6);

  // 1. 四列独立随机抽取
  const targetCols = [[], [], [], []];
  const nextBoard = new Array(BOARD_SIZE).fill(null);

  for (let c = 0; c < NUM_COLS; c++) {
    const shuffled = [...state.columns[c]].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, NUM_ROWS);
    while (picked.length < NUM_ROWS) picked.push(null);
    picked.sort(() => Math.random() - 0.5);
    targetCols[c] = picked;
    for (let row = 0; row < NUM_ROWS; row++) {
      nextBoard[row * NUM_COLS + c] = picked[row];
    }
  }

  ui.setTicker(state.fastMode ? '⚡ 极速开盒中...' : '🎁 四列独立滚轮旋转中...');
  state.board = nextBoard;

  await boardEngine.spinToBoard(targetCols, state.fastMode);

  if (coreTriggered) {
    ui.showToast('⚡ 终极盲盒机芯超频！本抽全盘产出 ×1.5！', 2200);
    sound.playFever();
  }

  // 2. 结算辅助器
  resetRelicTurnStats();
  const turnLog = { total: 0, gains: [], losses: [] };
  let turnTotal = 0;
  let comboCount = 0;
  let negativeCount = 0;
  let destroyedCount = 0;
  let jackpotMult = 1;
  const consumedIndices = new Set();
  const boostedWorkers = new Set();
  const walletPos = ui.getWalletCenter();
  const windChimeBonus = hasRelic('windChime') ? 2 : 0;
  const miniBellBonus = hasRelic('miniBell') ? 1 : 0;
  const synergyRelicBonus = windChimeBonus + miniBellBonus;

  const addSynergyHit = async (srcIdx, tgtIdx, rawBonus, label, beamColor = '#F59E0B', extraCharge = 14) => {
    comboCount++;
    const srcItem = state.board[srcIdx];
    const isCommonSrc = srcItem && SYMBOLS[srcItem.type]?.rarity === '普通';
    // 普通品质物品不能增加暴走值
    const actualCharge = isCommonSrc ? 0 : extraCharge;

    const withRelics = rawBonus + synergyRelicBonus;
    const finalBonus = Math.round(withRelics * feverMult * coreMult);
    if (windChimeBonus > 0) recordRelicGain('windChime', Math.round(windChimeBonus * feverMult * coreMult));
    if (miniBellBonus > 0) recordRelicGain('miniBell', Math.round(miniBellBonus * feverMult * coreMult));

    turnTotal += finalBonus;
    state.coins += finalBonus;
    state.totalEarned += finalBonus;
    turnLog.gains.push({ label, amount: finalBonus });
    if (actualCharge > 0) addFeverCharge(actualCharge);

    const srcPos = boardEngine.getSlotScreenCenter(srcIdx);
    const tgtPos = boardEngine.getSlotScreenCenter(tgtIdx);
    if (srcIdx !== tgtIdx) fxEngine.spawnBeam(srcPos.x, srcPos.y, tgtPos.x, tgtPos.y, beamColor);
    fxEngine.spawnCoins(srcPos.x, srcPos.y, walletPos.x, walletPos.y, Math.min(10, Math.max(3, Math.floor(finalBonus / 5))));

    boardEngine.pulseCell(srcIdx, beamColor);
    sound.playSynergy(comboCount - 1);
    PlatformAdapter.vibrate(14);
    ui.spawnFloatText(srcIdx, `+${finalBonus}`, finalBonus >= 22);
    ui.setTicker(label);
    ui.updateHUD();
    await sleep(state.fastMode ? 105 : 170);
  };

  const addNegativePenalty = async (srcIdx, tgtIdx, rawLoss, label) => {
    negativeCount++;
    const loss = Math.min(state.coins, rawLoss);
    state.coins = Math.max(0, state.coins - rawLoss);
    turnTotal -= loss;
    turnLog.losses.push({ label, amount: rawLoss });
    const srcPos = boardEngine.getSlotScreenCenter(srcIdx);
    const tgtPos = boardEngine.getSlotScreenCenter(tgtIdx);
    if (srcIdx !== tgtIdx) fxEngine.spawnBeam(srcPos.x, srcPos.y, tgtPos.x, tgtPos.y, '#EF4444');
    boardEngine.pulseCell(srcIdx, '#EF4444');
    sound.playBreak();
    PlatformAdapter.vibrate(20);
    ui.spawnFloatText(srcIdx, `-${rawLoss}🪙`, true, true);
    ui.setTicker(label);
    ui.updateHUD();
    await sleep(state.fastMode ? 105 : 165);
  };

  const consumeDurability = async (idx, onBreak, amount = 1) => {
    const it = state.board[idx];
    if (!it || typeof it.durability !== 'number') return;
    it.durability -= amount;
    if (it.durability <= 0) {
      destroyedCount++;
      consumedIndices.add(idx);
      removeItemFromColumns(it.id);
      boardEngine.consumeCell(idx);
      const pos = boardEngine.getSlotScreenCenter(idx);
      fxEngine.spawnBurst(pos.x, pos.y, '#EF4444', 16);
      sound.playBreak();
      ui.spawnFloatText(idx, '💥 耗尽!', true, true);
      if (hasRelic('coffeeThermos')) {
        const thermosBonus = Math.round(8 * feverMult * coreMult);
        turnTotal += thermosBonus;
        state.coins += thermosBonus;
        state.totalEarned += thermosBonus;
        recordRelicGain('coffeeThermos', thermosBonus);
        turnLog.gains.push({ label: '保温杯（耐久耗尽返还）', amount: thermosBonus });
        ui.spawnFloatText(idx, `保温杯 +${thermosBonus}`, false);
      }
      if (onBreak) await onBreak();
    }
  };

  // 3a-0. 商店神秘三件套（方块/圆/三角摆件）同时现身棋盘 → 全部销毁并合成「神秘装置」
  if (!hasRelic('mysteryDevice')) {
    const sqIdx = state.board.findIndex(it => it && it.type === 'geoSquare');
    const ciIdx = state.board.findIndex(it => it && it.type === 'geoCircle');
    const trIdx = state.board.findIndex(it => it && it.type === 'geoTriangle');
    if (sqIdx !== -1 && ciIdx !== -1 && trIdx !== -1) {
      const trioIndices = [sqIdx, ciIdx, trIdx];
      trioIndices.forEach(idx => {
        const it = state.board[idx];
        destroyedCount++;
        consumedIndices.add(idx);
        removeItemFromColumns(it.id);
        boardEngine.consumeCell(idx);
        const pos = boardEngine.getSlotScreenCenter(idx);
        fxEngine.spawnBurst(pos.x, pos.y, '#10B981', 20);
        ui.spawnFloatText(idx, '✨ 融合!', true);
      });
      const device = SPECIAL_RELICS.find(r => r.id === 'mysteryDevice');
      if (device) state.relics.push(device);
      sound.playVictory();
      fxEngine.spawnConfetti(100);
      ui.triggerShake(true);
      ui.setTicker('🌀 方块 × 圆 × 三角融合成功！获得商店特殊遗物「神秘装置」！');
      ui.updateHUD();
      if (ui.openMysteryDeviceModal && device) {
        ui.openMysteryDeviceModal(device);
      } else {
        ui.showToast('🌀 奇迹降临！三枚几何摆件融合为商店特殊遗物「神秘装置」(独立 ×1.25)！', 4200);
      }
      await sleep(state.fastMode ? 240 : 420);
    }
  }

  // 3a. 魔法棒先为相邻耐久物品回血 +1
  for (let i = 0; i < BOARD_SIZE; i++) {
    const item = state.board[i];
    if (!item || item.type !== 'magicWand') continue;
    for (const nIdx of getNeighbors(i)) {
      const t = state.board[nIdx];
      if (t && typeof t.durability === 'number' && t.durability < t.maxDurability) {
        t.durability++;
        boardEngine.pulseCell(nIdx, '#A855F7');
        ui.spawnFloatText(nIdx, '+1耐久', false);
      }
    }
  }

  // 3b. 一次性物品 & 耐久联动结算
  const magnetBonus = hasRelic('magnetCharm') ? 6 : 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    const item = state.board[i];
    if (!item || consumedIndices.has(i)) continue;
    const neighbors = getNeighbors(i);
    const colIdx = i % NUM_COLS;

    // 20 款一次性物品（含 10 款与常规物品联动）
    if (SYMBOLS[item.type].oneTime) {
      destroyedCount++;
      consumedIndices.add(i);
      removeItemFromColumns(item.id);
      boardEngine.consumeCell(i);
      const pos = boardEngine.getSlotScreenCenter(i);
      fxEngine.spawnBurst(pos.x, pos.y, '#F59E0B', 14);

      if (item.type === 'pocketMoney') {
        await addSynergyHit(i, i, 12 + magnetBonus, '零花钱袋打开 +12🪙 后销毁', '#F59E0B', 8);
      } else if (item.type === 'receipt') {
        await addSynergyHit(i, i, 10 + magnetBonus, '便利店小票报销 +10🪙，暴走 +15%', '#64748B', 15);
      } else if (item.type === 'catnip') {
        let hit = 0;
        for (let j = 0; j < BOARD_SIZE; j++) {
          const t = state.board[j];
          if (t && !consumedIndices.has(j) && (t.type === 'cat' || t.type === 'luckyCat')) {
            t.bonusBase += 2;
            hit++;
            await addSynergyHit(i, j, 6, `猫薄荷生效！「${SYMBOLS[t.type].name}」永久基础 +2 且爆 +6🪙`, '#22C55E', 8);
          }
        }
        if (hit === 0) await addSynergyHit(i, i, 8 + magnetBonus, '猫薄荷保底变现 +8🪙', '#22C55E', 8);
        else if (magnetBonus > 0) await addSynergyHit(i, i, magnetBonus, `金币磁铁额外吸附 +${magnetBonus}🪙`, '#EF4444', 4);
      } else if (item.type === 'energyDrink') {
        let hit = 0;
        for (let j = 0; j < BOARD_SIZE; j++) {
          const t = state.board[j];
          if (t && !consumedIndices.has(j) && (t.type === 'worker' || t.type === 'miner')) {
            boostedWorkers.add(j);
            hit++;
            await addSynergyHit(i, j, 5, `功能饮料生效！「${SYMBOLS[t.type].name}」本轮 ×2 并爆 +5🪙`, '#38BDF8', 15);
          }
        }
        if (hit === 0) await addSynergyHit(i, i, 8 + magnetBonus, '功能饮料提神 +8🪙，暴走 +15%', '#38BDF8', 15);
        else if (magnetBonus > 0) await addSynergyHit(i, i, magnetBonus, `金币磁铁额外吸附 +${magnetBonus}🪙`, '#EF4444', 4);
      } else if (item.type === 'scratchCard') {
        const prize = 10 + Math.floor(Math.random() * 15);
        await addSynergyHit(i, i, prize + magnetBonus, `刮刮乐刮出 +${prize}🪙 后自动销毁`, '#F59E0B', 10);
      } else if (item.type === 'mysteryBox') {
        const randCommon = COMMON_KEYS[Math.floor(Math.random() * COMMON_KEYS.length)];
        const sc = trySpawnIntoColumn(colIdx, randCommon);
        const msg = sc !== -1 ? `神秘快递 +14🪙，并在${COL_NAMES[sc]}送出「${SYMBOLS[randCommon].name}」` : '神秘快递 +14🪙（背包已满）';
        await addSynergyHit(i, i, 14 + magnetBonus, msg, '#3B82F6', 10);
      } else if (item.type === 'bobaCoupon') {
        await addSynergyHit(i, i, 16 + magnetBonus, '奶茶免单券省下 +16🪙，暴走 +20%！', '#EC4899', 20);
      } else if (item.type === 'repairKit') {
        let repaired = 0;
        for (let j = 0; j < BOARD_SIZE; j++) {
          const t = state.board[j];
          if (t && !consumedIndices.has(j) && typeof t.durability === 'number' && t.durability < t.maxDurability) {
            t.durability = Math.min(t.maxDurability, t.durability + 2);
            repaired++;
            boardEngine.pulseCell(j, '#F59E0B');
            ui.spawnFloatText(j, '+2耐久', false);
          }
        }
        const totalBonus = repaired > 0 ? repaired * 5 : 10;
        await addSynergyHit(i, i, totalBonus + magnetBonus, `万能胶水修复 ${repaired} 件物品，爆 +${totalBonus}🪙！`, '#F59E0B', 12);
      } else if (item.type === 'fertilizer') {
        let hit = 0;
        for (let j = 0; j < BOARD_SIZE; j++) {
          const t = state.board[j];
          if (t && !consumedIndices.has(j) && (t.type === 'flower' || t.type === 'moneyTree' || t.type === 'clover')) {
            t.bonusBase += 2;
            hit++;
            await addSynergyHit(i, j, 6, `魔法化肥催熟「${SYMBOLS[t.type].name}」！永久 +2 基础并 +6🪙`, '#16A34A', 10);
          }
        }
        if (hit === 0) await addSynergyHit(i, i, 10 + magnetBonus, '魔法化肥保底变现 +10🪙', '#16A34A', 10);
        else if (magnetBonus > 0) await addSynergyHit(i, i, magnetBonus, `金币磁铁额外吸附 +${magnetBonus}🪙`, '#EF4444', 4);
      } else if (item.type === 'vipPass') {
        let hit = 0;
        for (let j = 0; j < BOARD_SIZE; j++) {
          const t = state.board[j];
          if (t && !consumedIndices.has(j) && (t.type === 'boba' || t.type === 'cake' || t.type === 'donut')) {
            hit++;
            await addSynergyHit(i, j, 8, `甜品试吃券触发「${SYMBOLS[t.type].name}」大派送！+8🪙 且暴走 +10%`, '#EC4899', 10);
          }
        }
        if (hit === 0) await addSynergyHit(i, i, 10 + magnetBonus, '甜品试吃券折现 +10🪙', '#EC4899', 12);
        else if (magnetBonus > 0) await addSynergyHit(i, i, magnetBonus, `金币磁铁额外吸附 +${magnetBonus}🪙`, '#EF4444', 4);
      } else if (item.type === 'redPacket') {
        await addSynergyHit(i, i, 45 + magnetBonus, '年终奖红包拆开 +45🪙，暴走 +20%！', '#EF4444', 20);
      } else if (item.type === 'blindVoucher') {
        state.drawsLeft++;
        await addSynergyHit(i, i, 12 + magnetBonus, '限时盲盒券生效 +12🪙，本关抽盒次数 +1！', '#8B5CF6', 12);
      } else if (item.type === 'goldBarBox') {
        await addSynergyHit(i, i, 55 + magnetBonus, '金条礼盒变现 +55🪙！', '#D97706', 15);
      } else if (item.type === 'dynamite') {
        let hit = 0;
        for (const nIdx of neighbors) {
          const t = state.board[nIdx];
          if (!t || consumedIndices.has(nIdx)) continue;
          if (t.type === 'ore') {
            hit++;
            await addSynergyHit(i, nIdx, 16, '爆破炸药炸开原矿！双倍开采 +16🪙', '#EF4444', 14);
            await consumeDurability(nIdx, async () => {
              await addSynergyHit(nIdx, i, 12, '原矿被炸碎！额外爆出 +12🪙 尾矿大奖！', '#38BDF8', 15);
            }, 2);
          } else if (t.type === 'chest') {
            hit++;
            await addSynergyHit(i, nIdx, 32, '爆破炸药轰开宝箱！双倍宝藏 +32🪙', '#EF4444', 18);
            await consumeDurability(nIdx, async () => {
              await addSynergyHit(nIdx, i, 25, '宝箱彻底炸空！额外狂爆 +25🪙 终极宝藏！', '#D97706', 20);
            }, 2);
          }
        }
        if (hit === 0) await addSynergyHit(i, i, 18 + magnetBonus, '爆破炸药空爆保底 +18🪙', '#EF4444', 14);
        else if (magnetBonus > 0) await addSynergyHit(i, i, magnetBonus, `金币磁铁额外吸附 +${magnetBonus}🪙`, '#EF4444', 4);
      } else if (item.type === 'goldenFeed') {
        let hit = 0;
        for (let j = 0; j < BOARD_SIZE; j++) {
          const t = state.board[j];
          if (t && !consumedIndices.has(j) && (t.type === 'hen' || t.type === 'egg' || t.type === 'cat' || t.type === 'dog')) {
            hit++;
            await addSynergyHit(i, j, 10, `黄金饲料投喂「${SYMBOLS[t.type].name}」！狂爆 +10🪙`, '#F59E0B', 10);
          }
        }
        const sc = trySpawnIntoColumn(colIdx, 'goldenEgg');
        const eggMsg = sc !== -1 ? `并在${COL_NAMES[sc]}送出「金蛋」` : '（背包已满）';
        if (hit === 0) await addSynergyHit(i, i, 14 + magnetBonus, `黄金饲料保底 +14🪙 ${eggMsg}`, '#F59E0B', 12);
        else ui.showToast(`🥚 黄金饲料生效！${eggMsg}`, 2000);
      } else if (item.type === 'feverHorn') {
        await addNegativePenalty(i, i, 10, '吹响狂热号角消耗 -10🪙 军号费！');
        if (state.feverTurns > 0) {
          state.feverTurns++;
          ui.showToast('🎺 狂热号角生效！暴走回合 +1！', 2000);
        } else {
          addFeverCharge(60);
          ui.showToast('🎺 狂热号角生效！暴走槽 +60%！', 2000);
        }
        ui.updateHUD();
      } else if (item.type === 'demolition') {
        await addSynergyHit(i, i, 95 + magnetBonus, '拆迁补偿款到账！狂爆 +95🪙，暴走 +30%！', '#D97706', 30);
      } else if (item.type === 'mysteryCheck') {
        const prize = 70 + Math.floor(Math.random() * 51);
        await addSynergyHit(i, i, prize + magnetBonus, `神秘支票兑现巨款 +${prize}🪙！`, '#10B981', 25);
      } else if (item.type === 'copyMirror') {
        let bestTarget = null;
        let bestScore = -1;
        for (const nIdx of neighbors) {
          const t = state.board[nIdx];
          if (!t || consumedIndices.has(nIdx) || SYMBOLS[t.type].oneTime) continue;
          const scVal = SYMBOLS[t.type].base + (t.bonusBase || 0);
          if (scVal > bestScore) {
            bestScore = scVal;
            bestTarget = t;
          }
        }
        if (bestTarget) {
          const sc = trySpawnIntoColumn(colIdx, bestTarget.type);
          const extra = sc !== -1 ? 20 : 55;
          const msg = sc !== -1
            ? `复制魔镜复制了「${SYMBOLS[bestTarget.type].name}」放入${COL_NAMES[sc]}，并爆 +20🪙！`
            : `复制魔镜触发（背包已满折现）狂爆 +55🪙！`;
          await addSynergyHit(i, i, extra + magnetBonus, msg, '#A855F7', 20);
        } else {
          await addSynergyHit(i, i, 35 + magnetBonus, '复制魔镜周围无目标，折现 +35🪙！', '#A855F7', 18);
        }
      } else if (item.type === 'jackpotTicket') {
        jackpotMult *= 1.5;
        await addSynergyHit(i, i, 30 + magnetBonus, '超级锦鲤签生效！+30🪙 且本轮全场产出额外 ×1.5！', '#F59E0B', 25);
      }
      continue;
    }

    // 吃货流（普通品质不加暴走）
    if (item.type === 'cat') {
      const catRelic = hasRelic('catBell') ? 4 : 0;
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (!target || consumedIndices.has(nIdx)) continue;
        if (target.type === 'fish') {
          item.bonusBase += 1;
          if (catRelic > 0) recordRelicGain('catBell', Math.round(catRelic * feverMult * coreMult));
          await addSynergyHit(i, nIdx, 4 + catRelic, '橘猫咬了一口小鱼干！+4🪙 且永久基础 +1', '#F97316', 0);
          await consumeDurability(nIdx);
        } else if (target.type === 'milk') {
          if (catRelic > 0) recordRelicGain('catBell', Math.round(catRelic * feverMult * coreMult));
          await addSynergyHit(i, nIdx, 5 + catRelic, '橘猫喝了一口牛奶！+5🪙', '#38BDF8', 0);
          await consumeDurability(nIdx);
        }
      }
    }

    // 矿工流（含负面：相邻饮料洒了 -5🪙）
    if (item.type === 'miner') {
      const minerRelic = hasRelic('minerLamp') ? 5 : 0;
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (!target || consumedIndices.has(nIdx)) continue;
        if (target.type === 'ore') {
          if (minerRelic > 0) recordRelicGain('minerLamp', Math.round(minerRelic * feverMult * coreMult));
          await addSynergyHit(i, nIdx, 4 + minerRelic, '矿工敲击原矿！爆出 +4🪙', '#0EA5E9', 0);
          await consumeDurability(nIdx, async () => {
            await addSynergyHit(nIdx, i, 15, '原矿碎裂！额外爆出 +15🪙 尾矿大奖！', '#38BDF8', 0);
          });
        } else if (target.type === 'chest') {
          if (minerRelic > 0) recordRelicGain('minerLamp', Math.round(minerRelic * feverMult * coreMult));
          await addSynergyHit(i, nIdx, 12 + minerRelic, '矿工撬开宝箱！爆出 +12🪙', '#F59E0B', 0);
          await consumeDurability(nIdx, async () => {
            await addSynergyHit(nIdx, i, 22, '宝箱彻底清空！额外狂爆 +22🪙 终极宝藏！', '#D97706', 0);
          });
        } else if (target.type === 'coffee' || target.type === 'boba') {
          await addNegativePenalty(i, nIdx, 5, '矿坑打翻饮料！清理费 -5🪙');
        }
      }
    }

    // 摸鱼流（喝冰美式只 ×2 不加 9，笔记本 +2，负面橘猫 -4）
    if (item.type === 'worker') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (!target || consumedIndices.has(nIdx)) continue;
        if (target.type === 'coffee') {
          boostedWorkers.add(i);
          boardEngine.pulseCell(i, '#92400E');
          ui.spawnFloatText(i, '☕ 产出×2!', false);
          ui.setTicker('打工人猛吸冰美式！本轮产出 ×2');
          await consumeDurability(nIdx);
        } else if (target.type === 'laptop') {
          await addSynergyHit(i, nIdx, 2, '打工人敲响笔记本！产出 +2🪙', '#64748B', 0);
        } else if (target.type === 'cat') {
          await addNegativePenalty(i, nIdx, 4, '打工人上班偷撸橘猫！效率下降 -4🪙');
        }
      }
    }

    // 甜品流
    if (item.type === 'boba') {
      const sweetBonus = hasRelic('sweetApron') ? 4 : 0;
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && target.type === 'cake') {
          if (sweetBonus > 0) recordRelicGain('sweetApron', Math.round(sweetBonus * feverMult * coreMult));
          await addSynergyHit(i, nIdx, 6 + sweetBonus, '珍珠奶茶×草莓蛋糕甜蜜套餐！+6🪙', '#EC4899', 0);
          addFeverCharge(hasRelic('sweetApron') ? 17 : 12);
          await consumeDurability(nIdx);
        }
      }
    }

    // 增殖流
    if (item.type === 'hen') {
      if (Math.random() < 0.4) {
        const sc = trySpawnIntoColumn(colIdx, 'egg');
        const msg = sc !== -1 ? `母鸡在${COL_NAMES[sc]}下了一枚鸡蛋！` : '背包已满，鸡蛋折现 +4🪙！';
        await addSynergyHit(i, i, sc !== -1 ? 1 : 4, msg, '#FB7185', 0);
      }
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && target.type === 'egg') {
          await addSynergyHit(nIdx, i, 3, '母鸡孵暖鸡蛋！+3🪙', '#F59E0B', 0);
          await consumeDurability(nIdx, async () => {
            const hatchType = Math.random() < 0.45 ? 'goldenEgg' : 'cat';
            trySpawnIntoColumn(nIdx % NUM_COLS, hatchType);
            ui.showToast(`🐣 鸡蛋破壳而出！获得了「${SYMBOLS[hatchType].name}」！`, 2200);
          });
        }
      }
    }

    if (item.type === 'egg' && !consumedIndices.has(i)) {
      if (Math.random() < 0.4) {
        consumedIndices.add(i);
        removeItemFromColumns(item.id);
        boardEngine.consumeCell(i);
        const hatchType = Math.random() < 0.45 ? 'goldenEgg' : 'cat';
        trySpawnIntoColumn(colIdx, hatchType);
        const pos = boardEngine.getSlotScreenCenter(i);
        fxEngine.spawnBurst(pos.x, pos.y, '#FBBF24', 12);
        await addSynergyHit(i, i, 4, `鸡蛋惊喜孵化！变成了「${SYMBOLS[hatchType].name}」！`, '#F59E0B', 12);
      }
    }

    if (item.type === 'piggyBank') {
      item.bonusBase += 2;
      boardEngine.pulseCell(i, '#EC4899');
      await consumeDurability(i, async () => {
        const smashVal = (SYMBOLS.piggyBank.base + item.bonusBase) * 3;
        await addSynergyHit(i, i, smashVal, `存钱罐砸开啦！3 倍返现狂爆 +${smashVal}🪙！`, '#EC4899', 22);
      });
    }

    if (item.type === 'moneyTree') {
      item.bonusBase += 1;
      addFeverCharge(10);
      await addNegativePenalty(i, i, 4, '摇钱树浇水施肥维护费 -4🪙');
    }

    if (item.type === 'milk') {
      const hasCat = neighbors.some(nIdx => state.board[nIdx] && !consumedIndices.has(nIdx) && state.board[nIdx].type === 'cat');
      if (!hasCat) {
        await addNegativePenalty(i, i, 1, '牛奶旁边没有橘猫，变质倒掉 -1🪙 且耐久 -1');
        await consumeDurability(i);
      }
    }

    if (item.type === 'boba') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && target.type === 'worker') {
          await addNegativePenalty(i, nIdx, 6, '打工人喝奶茶太甜犯困！-6🪙');
        }
      }
    }

    if (item.type === 'cake') {
      const hasPartner = neighbors.some(
        nIdx => state.board[nIdx] && !consumedIndices.has(nIdx) && (state.board[nIdx].type === 'boba' || state.board[nIdx].type === 'oven')
      );
      if (!hasPartner) {
        await addNegativePenalty(i, i, 6, '草莓蛋糕孤零零融化了！-6🪙');
      }
    }

    if (item.type === 'slime') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && (target.type === 'cat' || target.type === 'dog')) {
          await addNegativePenalty(i, nIdx, 4, '史莱姆粘到宠物毛发！清理费 -4🪙');
        }
      }
    }

    if (item.type === 'clover') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && (target.type === 'miner' || target.type === 'goldPick')) {
          await addNegativePenalty(i, nIdx, 5, '矿工踩坏了幸运草坪！-5🪙');
        }
      }
    }

    if (item.type === 'luckyCat') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && target.type === 'dog') {
          await addNegativePenalty(i, nIdx, 6, '招财猫被相邻柴犬吓到！-6🪙');
        }
      }
    }

    if (item.type === 'magicWand') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && target.type === 'worker') {
          await addNegativePenalty(i, nIdx, 5, '魔法棒在打工人旁魔力走火！-5🪙');
        }
      }
    }

    if (item.type === 'koi') {
      addFeverCharge(20);
      await addNegativePenalty(i, i, 6, '锦鲤鱼塘维护费 -6🪙');
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && (target.type === 'cat' || target.type === 'fish')) {
          await addNegativePenalty(i, nIdx, 12, '锦鲤被猫/小鱼干吓到！损失 -12🪙');
        }
      }
    }

    if (item.type === 'unicorn') {
      addFeverCharge(25);
      await addNegativePenalty(i, i, 8, '彩虹独角兽口粮消耗 -8🪙');
    }

    // === 新增 10 款常规物品联动（含强势物品负面联动） ===
    if (item.type === 'dog') {
      const catRelic = hasRelic('catBell') ? 4 : 0;
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (!target || consumedIndices.has(nIdx)) continue;
        if (target.type === 'bone') {
          if (catRelic > 0) recordRelicGain('catBell', Math.round(catRelic * feverMult * coreMult));
          await addSynergyHit(i, nIdx, 5 + catRelic, '柴犬啃了一口大骨头！+5🪙', '#F59E0B', 0);
          await consumeDurability(nIdx, async () => {
            await addSynergyHit(nIdx, i, 10, '大骨头啃完啦！额外爆出 +10🪙 骨髓奖！', '#D97706', 0);
          });
        } else if (target.type === 'cat') {
          await addNegativePenalty(i, nIdx, 5, '柴犬与橘猫打架啦！损失 -5🪙');
        }
      }
    }

    if (item.type === 'treasurePot') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && target.type === 'ore') {
          await addNegativePenalty(i, nIdx, 6, '原矿碎石砸伤聚宝盆！维修费 -6🪙');
        }
      }
    }

    if (item.type === 'wealthGod') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && target.type === 'slime') {
          await addNegativePenalty(i, nIdx, 8, '史莱姆弄脏财神供桌！香火 -8🪙');
        }
      }
    }

    if (item.type === 'phoenix') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (target && !consumedIndices.has(nIdx) && (target.type === 'coffee' || target.type === 'milk')) {
          await addNegativePenalty(i, nIdx, 8, '冷饮浇灭凤凰圣火！损失 -8🪙');
        }
      }
    }

    if (item.type === 'barista') {
      if (Math.random() < 0.45) {
        const sc = trySpawnIntoColumn(colIdx, 'coffee');
        const msg = sc !== -1 ? `咖啡师在${COL_NAMES[sc]}冲泡了 1 杯冰美式！` : '背包已满，冰美式折现 +7🪙！';
        await addSynergyHit(i, i, sc !== -1 ? 3 : 7, msg, '#78350F', 10);
      }
    }

    if (item.type === 'donut') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (!target || consumedIndices.has(nIdx)) continue;
        if (target.type === 'cat' || target.type === 'dog') {
          await addNegativePenalty(i, nIdx, 6, '甜甜圈被宠物偷吃弄乱！-6🪙');
        } else if (target.type === 'boba' || target.type === 'coffee') {
          await addSynergyHit(i, nIdx, 8, '甜甜圈甜蜜下午茶搭配！+8🪙 且暴走 +10%', '#F472B6', 10);
          await consumeDurability(i);
          break;
        }
      }
    }

    if (item.type === 'oven') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (!target || consumedIndices.has(nIdx)) continue;
        if (target.type === 'milk' || target.type === 'coffee') {
          await addNegativePenalty(i, nIdx, 6, '冷饮洒进小烤箱短路！维修费 -6🪙');
        } else if (target.type === 'cake' || target.type === 'donut') {
          if (typeof target.durability === 'number' && target.durability < target.maxDurability && Math.random() < 0.5) {
            target.durability++;
            boardEngine.pulseCell(nIdx, '#EA580C');
            ui.spawnFloatText(nIdx, '+1耐久', false);
          }
          await addSynergyHit(i, nIdx, 4, `小烤箱烘焙增香「${SYMBOLS[target.type].name}」！+4🪙 且产出 ×2`, '#EA580C', 8);
        }
      }
    }

    if (item.type === 'goldIngot') {
      const richN = neighbors.find(
        nIdx => state.board[nIdx] && (state.board[nIdx].type === 'treasurePot' || state.board[nIdx].type === 'wealthGod')
      );
      if (richN !== undefined) {
        await addSynergyHit(i, richN, 5, '金元宝聚财共鸣！额外 +5🪙', '#F59E0B', 8);
      }
    }

    if (item.type === 'goldPick') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (!target || consumedIndices.has(nIdx) || consumedIndices.has(i)) continue;
        if (target.type === 'ore' || target.type === 'chest' || target.type === 'diamond') {
          await addSynergyHit(i, nIdx, 15, `黄金镐暴击开采「${SYMBOLS[target.type].name}」！+15🪙`, '#FACC15', 14);
          await consumeDurability(i);
        }
      }
    }

    if (item.type === 'bee') {
      for (const nIdx of neighbors) {
        const target = state.board[nIdx];
        if (!target || consumedIndices.has(nIdx)) continue;
        if (target.type === 'flower') {
          await addSynergyHit(i, nIdx, 6, '小蜜蜂采集向日葵花蜜！+6🪙', '#FACC15', 10);
          await consumeDurability(nIdx, async () => {
            await addSynergyHit(nIdx, i, 10, '向日葵结出饱满瓜子！额外 +10🪙！', '#CA8A04', 12);
          });
        } else if (target.type === 'clover') {
          await addSynergyHit(i, nIdx, 6, '小蜜蜂在幸运草采蜜！+6🪙', '#22C55E', 10);
        }
      }
      if (Math.random() < 0.35) {
        const sc = trySpawnIntoColumn(colIdx, 'flower');
        const msg = sc !== -1 ? `小蜜蜂在${COL_NAMES[sc]}种下 1 朵向日葵！` : '背包已满，花蜜折现 +5🪙！';
        await addSynergyHit(i, i, sc !== -1 ? 2 : 5, msg, '#FACC15', 8);
      }
    }

    if (item.type === 'capsule') {
      const validNeighbors = neighbors.filter(
        nIdx => state.board[nIdx] && !consumedIndices.has(nIdx) && !SYMBOLS[state.board[nIdx].type].oneTime
      );
      if (validNeighbors.length > 0) {
        const pickIdx = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
        state.board[pickIdx].bonusBase += 1;
        await addSynergyHit(i, pickIdx, 4, `扭蛋机强化了「${SYMBOLS[state.board[pickIdx].type].name}」永久基础 +1 并 +4🪙！`, '#A855F7', 10);
      }
    }
  }

  // 火凤凰浴火重生结算（响应本轮任意物品耐久归零或一次性销毁）
  if (destroyedCount > 0) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      const item = state.board[i];
      if (!item || consumedIndices.has(i) || item.type !== 'phoenix') continue;
      item.bonusBase += destroyedCount * 2;
      await addSynergyHit(
        i,
        i,
        destroyedCount * 10,
        `火凤凰浴火重生 ×${destroyedCount}！永久基础 +${destroyedCount * 2} 且狂爆 +${destroyedCount * 10}🪙！`,
        '#F97316',
        destroyedCount * 10
      );
    }
  }

  if (hasRelic('clockwork') && comboCount >= 3) {
    const bonus = Math.round(18 * feverMult * coreMult);
    turnTotal += bonus;
    state.coins += bonus;
    state.totalEarned += bonus;
    sound.playSynergy(6);
    ui.showToast(`⚙️ 连锁发条触发（${comboCount}连击）！额外 +${bonus}🪙`, 2000);
    ui.updateHUD();
  }

  // 3c. 基础产出 + 倍率流
  const koiCount = state.board.filter((it, idx) => it && !consumedIndices.has(idx) && it.type === 'koi').length;
  const globalKoiMult = koiCount > 0 ? Math.pow(1.5, koiCount) : 1;

  const colPotMult = [1, 1, 1, 1];
  const rowGodMult = [1, 1, 1];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const it = state.board[i];
    if (!it || consumedIndices.has(i)) continue;
    if (it.type === 'treasurePot') colPotMult[i % NUM_COLS] *= 2;
    if (it.type === 'wealthGod') rowGodMult[Math.floor(i / NUM_COLS)] *= 2;
  }

  let baseSum = 0;
  let emptyCount = 0;
  const stampedExtraBase = hasRelic('stampedCoin') ? 1 : 0;

  for (let i = 0; i < BOARD_SIZE; i++) {
    const item = state.board[i];
    if (!item || consumedIndices.has(i)) {
      emptyCount++;
      continue;
    }
    const def = SYMBOLS[item.type];
    let val = def.base + item.bonusBase + stampedExtraBase;

    if (item.type === 'diamond') {
      const adjDiamonds = getNeighbors(i).filter(
        nIdx => state.board[nIdx] && !consumedIndices.has(nIdx) && state.board[nIdx].type === 'diamond'
      ).length;
      val += adjDiamonds * 4;
    }

    let mult = 1;
    if (boostedWorkers.has(i)) mult *= 2;

    for (const nIdx of getNeighbors(i)) {
      const nItem = state.board[nIdx];
      if (!nItem || consumedIndices.has(nIdx)) continue;
      if (nItem.type === 'clover') mult *= 1.5;
      if (nItem.type === 'luckyCat') mult *= 2;
      if (nItem.type === 'unicorn') {
        mult *= 1.5;
        val += 4;
      }
      if (nItem.type === 'magicWand' && typeof item.durability === 'number') mult *= 1.5;
      if (nItem.type === 'slime' && item.type === 'slime') mult *= 2;
      if (nItem.type === 'barista' && item.type === 'coffee') mult *= 2;
      if (nItem.type === 'oven' && (item.type === 'cake' || item.type === 'donut')) mult *= 2;
      if (nItem.type === 'goldPick' && item.type === 'diamond') mult *= 1.5;
    }

    mult *= colPotMult[i % NUM_COLS];
    mult *= rowGodMult[Math.floor(i / NUM_COLS)];
    mult *= globalKoiMult;
    mult *= jackpotMult;

    const finalCellVal = Math.round(val * mult * feverMult * coreMult);
    baseSum += finalCellVal;

    if (mult > 1) {
      boardEngine.pulseCell(i, '#F59E0B');
      ui.spawnFloatText(i, `×${Number(mult.toFixed(1))} (+${finalCellVal})`, finalCellVal >= 20);
      const pos = boardEngine.getSlotScreenCenter(i);
      fxEngine.spawnCoins(pos.x, pos.y, walletPos.x, walletPos.y, 2);
    }
  }

  // 各类摆件保底补贴（并逐一记入遗物收益统计与本轮明细）
  const addRelicFlat = (id, label, rawAmt, applyMult = true) => {
    if (!hasRelic(id) || rawAmt <= 0) return;
    const amt = applyMult ? Math.round(rawAmt * feverMult * coreMult) : rawAmt;
    if (amt <= 0) return;
    baseSum += amt;
    recordRelicGain(id, amt);
    turnLog.gains.push({ label: `摆件「${label}」`, amount: amt });
  };

  if (baseSum > 0) {
    turnLog.gains.push({ label: '盘面物品基础与倍率产出', amount: baseSum });
  }

  addRelicFlat('coinBox', '零钱收纳盒', 3);
  addRelicFlat('piggyCharm', '招财猪挂件', 4);
  addRelicFlat('woodenCoin', '木头硬币', 1);
  addRelicFlat('stampedCoin', '印花金币', 2);
  addRelicFlat('coinPouch', '幸运硬币袋', emptyCount, false);
  if (comboCount === 0) addRelicFlat('starCharm', '许愿星挂坠', 8);
  if (comboCount > 0) addRelicFlat('tinyBell', '小铜铃', 2);
  if (negativeCount > 0) addRelicFlat('eraser', '橡皮擦', 2, false);
  if (hasRelic('luckyPenny')) {
    const commonCnt = Math.min(
      4,
      state.board.filter((it, idx) => it && !consumedIndices.has(idx) && SYMBOLS[it.type].rarity === '普通').length
    );
    addRelicFlat('luckyPenny', '幸运便士', commonCnt, false);
  }
  if (hasRelic('goldenClover')) {
    const multItemsCount = state.board.filter(
      (it, idx) => it && !consumedIndices.has(idx) && SYMBOLS[it.type].isMult
    ).length;
    addRelicFlat('goldenClover', '四叶金草', multItemsCount * 3);
  }
  if (hasRelic('luckyDice')) {
    const allDiverse = state.columns.every(col => new Set(col.map(it => it.type)).size >= 2);
    if (allDiverse) addRelicFlat('luckyDice', '幸运骰子', 6);
  }

  if (baseSum > 0) {
    turnTotal += baseSum;
    state.coins += baseSum;
    state.totalEarned += baseSum;
    sound.playCoin();
    const centerPos = boardEngine.getSlotScreenCenter(5);
    fxEngine.spawnCoins(
      centerPos.x,
      centerPos.y,
      walletPos.x,
      walletPos.y,
      Math.min(14, Math.max(4, Math.floor(baseSum / 4)))
    );
    ui.updateHUD();
  }

  // 彩虹棱镜：单抽 ≥4 联动，本轮总收益额外 ×1.25
  if (hasRelic('rainbowPrism') && comboCount >= 4 && turnTotal > 0) {
    const prismBonus = Math.round(turnTotal * 0.25);
    turnTotal += prismBonus;
    state.coins += prismBonus;
    state.totalEarned += prismBonus;
    recordRelicGain('rainbowPrism', prismBonus);
    turnLog.gains.push({ label: '摆件「彩虹棱镜」(×1.25)', amount: prismBonus });
    ui.showToast(`🌈 彩虹棱镜折射！本轮额外 +${prismBonus}🪙`, 2000);
    ui.updateHUD();
  }

  // 商店特殊遗物「神秘装置」：每轮结算最终收益独立乘算 ×1.25
  if (hasRelic('mysteryDevice') && turnTotal > 0) {
    const deviceBonus = Math.round(turnTotal * 0.25);
    turnTotal += deviceBonus;
    state.coins += deviceBonus;
    state.totalEarned += deviceBonus;
    recordRelicGain('mysteryDevice', deviceBonus);
    turnLog.gains.push({ label: '商店特殊「神秘装置」(独立×1.25)', amount: deviceBonus });
    ui.showToast(`🌀 神秘装置独立增幅 ×1.25！额外 +${deviceBonus}🪙`, 2000);
    ui.updateHUD();
  }

  // 高收益带耐久核心物品每登场消耗 1 耐久（防超模）
  const perSpinDecayTypes = new Set(['diamond', 'goldenEgg', 'moneyTree', 'treasurePot', 'wealthGod', 'koi', 'unicorn', 'phoenix']);
  for (let i = 0; i < BOARD_SIZE; i++) {
    const it = state.board[i];
    if (it && !consumedIndices.has(i) && perSpinDecayTypes.has(it.type)) {
      await consumeDurability(i);
    }
  }

  if (hasRelic('miniCalc') && turnTotal > 30) {
    turnTotal += 4;
    state.coins += 4;
    state.totalEarned += 4;
    recordRelicGain('miniCalc', 4);
    turnLog.gains.push({ label: '摆件「便携计算器」', amount: 4 });
    ui.updateHUD();
  }

  if (turnTotal > state.bestTurn) state.bestTurn = turnTotal;
  turnLog.total = turnTotal;
  state.lastTurnLog = turnLog;

  ui.showTurnPayoutBanner(`📊 本轮 ${turnTotal >= 0 ? '+' : ''}${turnTotal} 🪙${isFeverTurn ? ` (暴走×${feverMult}!)` : ''} · 点看明细`);

  if (turnTotal >= 32) {
    ui.triggerShake(turnTotal >= 80);
    PlatformAdapter.vibrate(38);
  }

  // 4. 每回合结束基础暴走 +15%，以及暴走触发与倒计时
  if (isFeverTurn) {
    state.feverTurns--;
  } else {
    addFeverCharge(15);
    if (state.feverCharge >= 100) {
      state.feverCharge = 0;
      state.feverTurns = 3;
      state.feverCount++;
      sound.playFever();
      fxEngine.spawnConfetti(55);
      ui.triggerShake(true);
      PlatformAdapter.vibrate([30, 40, 60]);
      ui.setTicker(`🔥 超级暴走启动！接下来 3 回合全收益 ×${hasRelic('feverCrown') ? '3' : '2'}！`);
    }
  }
  ui.updateHUD();

  await sleep(state.fastMode ? 280 : 440);
  state.isAnimating = false;
  ui.updateHUD();

  // 5. 过关 / 失败 / 中段商店 & 抽礼触发
  if (state.coins >= state.target) {
    ui.handleLevelClear();
  } else if (state.drawsLeft <= 0) {
    ui.handleGameOver();
  } else {
    const cfg = getCurrentLevelCfg();
    if (state.spinsInLevel === cfg.shopMidSpin) {
      ui.openNewShopVisit('（关卡中段补给）');
    }
    if (state.spinsInLevel % cfg.draftEvery === 0) {
      for (let g = 0; g < cfg.giftsPerDraft; g++) {
        state.pendingDrafts.push(pickWeightedDraftChoices(3));
      }
      ui.openPendingDraftModal();
    } else {
      const left = cfg.draftEvery - (state.spinsInLevel % cfg.draftEvery);
      ui.setTicker(`再抽 ${left} 次即可领取策略礼品 🎁`);
    }
  }
}
