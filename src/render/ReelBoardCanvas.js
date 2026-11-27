import { NUM_COLS, NUM_ROWS, BOARD_SIZE, RARITY_STYLES } from '../config/constants.js';
import { SYMBOLS } from '../config/symbols.js';
import { PlatformAdapter } from '../platform/PlatformAdapter.js';
import { sound } from '../audio/SoundEngine.js';
import { IconRenderer } from './IconRenderer.js';

/**
 * 高分屏 Canvas 4×3 独立滚轮渲染引擎（稀有度边框 + 耐久角标）
 */
export class ReelBoardCanvas {
  constructor(canvas, { getState, getTheme, onInspectItem }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.getState = getState;
    this.getTheme = getTheme;
    this.onInspectItem = onInspectItem;

    this.width = 360;
    this.height = 290;
    this.pad = 7;
    this.gap = 6;

    this.reels = Array.from({ length: NUM_COLS }, () => ({
      mode: 'idle',
      strip: [],
      scrollY: 0,
      totalScroll: 0,
      startTime: 0,
      duration: 1200,
      lastTickStep: 0,
      locked: true
    }));

    this.cellFx = Array.from({ length: BOARD_SIZE }, () => ({
      scale: 1,
      glow: 0,
      glowColor: '#F59E0B',
      alpha: 1
    }));

    this.boardStars = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.004 + Math.random() * 0.007,
      size: 2 + Math.random() * 2.5
    }));

    this.resize();
    window.addEventListener('resize', () => this.resize());
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => this.resize()).observe(this.canvas.parentElement);
    }
    this.canvas.addEventListener('click', (e) => this.handleTap(e));
    this.renderLoop();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.floor(rect.width);
    this.height = Math.floor(rect.height);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  getCellMetrics() {
    const cellW = (this.width - this.pad * 2 - this.gap * (NUM_COLS - 1)) / NUM_COLS;
    const cellH = (this.height - this.pad * 2 - this.gap * (NUM_ROWS - 1)) / NUM_ROWS;
    return { cellW, cellH, stepY: cellH + this.gap };
  }

  getSlotScreenCenter(idx) {
    const rect = this.canvas.getBoundingClientRect();
    const col = idx % NUM_COLS;
    const row = Math.floor(idx / NUM_COLS);
    const { cellW, cellH } = this.getCellMetrics();
    return {
      x: rect.left + this.pad + col * (cellW + this.gap) + cellW / 2,
      y: rect.top + this.pad + row * (cellH + this.gap) + cellH / 2
    };
  }

  handleTap(e) {
    const state = this.getState();
    if (state.isAnimating || !state.inGame) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { cellW, cellH } = this.getCellMetrics();

    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        const cx = this.pad + c * (cellW + this.gap);
        const cy = this.pad + r * (cellH + this.gap);
        if (x >= cx && x <= cx + cellW && y >= cy && y <= cy + cellH) {
          const idx = r * NUM_COLS + c;
          const item = state.board[idx];
          if (item && this.onInspectItem) {
            sound.playSelect(2);
            this.onInspectItem(item);
          }
          return;
        }
      }
    }
  }

  resetCellFx() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.cellFx[i] = { scale: 1, glow: 0, glowColor: '#F59E0B', alpha: 1 };
    }
  }

  pulseCell(idx, color = '#F59E0B') {
    if (!this.cellFx[idx]) return;
    this.cellFx[idx].scale = 1.16;
    this.cellFx[idx].glow = 1;
    this.cellFx[idx].glowColor = color;
  }

  consumeCell(idx) {
    if (!this.cellFx[idx]) return;
    this.cellFx[idx].alpha = 0.08;
    this.cellFx[idx].scale = 0.55;
  }

  spinToBoard(targetCols, fastMode = false) {
    const state = this.getState();
    this.resetCellFx();
    const { stepY } = this.getCellMetrics();
    const now = performance.now();

    if (fastMode) {
      return new Promise(resolve => {
        for (let c = 0; c < NUM_COLS; c++) {
          const r = this.reels[c];
          r.mode = 'fastPop';
          r.startTime = now + c * 42;
          r.duration = 200;
          r.locked = false;
          r.strip = targetCols[c];
        }
        for (let c = 0; c < NUM_COLS; c++) {
          setTimeout(() => {
            sound.playLock(c);
            PlatformAdapter.vibrate(10);
          }, 45 + c * 55);
        }
        setTimeout(() => {
          for (let c = 0; c < NUM_COLS; c++) {
            this.reels[c].mode = 'idle';
            this.reels[c].locked = true;
          }
          resolve();
        }, 340);
      });
    }

    const durations = [900, 1200, 1500, 1800];
    const extraSpins = [8, 12, 15, 18];

    return new Promise(resolve => {
      let lockedCount = 0;
      for (let c = 0; c < NUM_COLS; c++) {
        const colPool = state.columns[c];
        const spinCount = extraSpins[c];
        const filler = [];
        for (let k = 0; k < spinCount; k++) {
          if (colPool.length > 0 && (colPool.length >= 3 || Math.random() < 0.72)) {
            filler.push(colPool[Math.floor(Math.random() * colPool.length)]);
          } else {
            filler.push(null);
          }
        }
        const strip = [...targetCols[c], ...filler];
        const r = this.reels[c];
        r.mode = 'spinning';
        r.strip = strip;
        r.totalScroll = spinCount * stepY;
        r.scrollY = r.totalScroll;
        r.startTime = now;
        r.duration = durations[c];
        r.lastTickStep = Math.floor(r.scrollY / stepY);
        r.locked = false;
        r.onLock = () => {
          sound.playLock(c);
          PlatformAdapter.vibrate(c === NUM_COLS - 1 ? 22 : 11);
          lockedCount++;
          if (lockedCount === NUM_COLS) setTimeout(resolve, 130);
        };
      }
    });
  }

  drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  drawCard(ctx, x, y, w, h, item, scale = 1, alpha = 1, glow = 0, glowColor = '#F59E0B', stretchY = 1) {
    const state = this.getState();
    const themeC = this.getTheme().canvas;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale * stretchY);
    ctx.translate(-cx, -cy);

    const radius = Math.max(13, Math.min(w, h) * 0.2);

    if (!item) {
      this.drawRoundedRect(ctx, x, y, w, h, radius);
      ctx.fillStyle = state.feverTurns > 0 ? 'rgba(255, 251, 235, 0.45)' : themeC.slotEmpty;
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.14)';
      ctx.font = `700 ${Math.round(w * 0.22)}px -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('·', cx, cy);
      ctx.restore();
      return;
    }

    const def = SYMBOLS[item.type];
    const rStyle = RARITY_STYLES[def.rarity] || RARITY_STYLES['普通'];
    const val = def.base + (item.bonusBase || 0);

    if (glow > 0.02) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 16 * glow;
    } else if (def.rarity === '史诗') {
      ctx.shadowColor = rStyle.glowHex;
      ctx.shadowBlur = 10;
    } else {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
    }

    // 按稀有度底色填充 + 粗细清晰彩色边框
    this.drawRoundedRect(ctx, x, y, w, h, radius);
    ctx.fillStyle = rStyle.bgHex;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineWidth = glow > 0.05 ? 3 : (def.rarity === '普通' ? 2 : 2.6);
    ctx.strokeStyle = glow > 0.05 ? glowColor : rStyle.borderHex;
    ctx.stroke();

    // 原创矢量图标
    const iconSize = Math.min(w, h) * 0.56;
    IconRenderer.drawCanvasIcon(ctx, item.type, cx, cy - h * 0.11, iconSize);

    // 右上角：耐久度 或 一次性角标
    if (typeof item.durability === 'number' && item.durability > 0) {
      const durColor = item.durability <= 1 ? '#EF4444' : item.durability <= 2 ? '#F97316' : '#475569';
      const bw = 18, bh = 15;
      const bx = x + w - bw - 5, by = y + 5;
      this.drawRoundedRect(ctx, bx, by, bw, bh, 7);
      ctx.fillStyle = durColor;
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 10px -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(item.durability), bx + bw / 2, by + bh / 2 + 0.5);
    } else if (def.oneTime) {
      const bw = 18, bh = 14;
      const bx = x + w - bw - 5, by = y + 5;
      this.drawRoundedRect(ctx, bx, by, bw, bh, 7);
      ctx.fillStyle = '#EF4444';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 8.5px -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1次', bx + bw / 2, by + bh / 2 + 0.5);
    }

    // 底部名称 + 数值小胶囊
    const pillW = w * 0.88;
    const pillH = Math.max(17, h * 0.22);
    const pillX = cx - pillW / 2;
    const pillY = y + h - pillH - h * 0.06;
    this.drawRoundedRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = themeC.badgeBg;
    ctx.fill();

    ctx.font = `700 ${Math.max(9.5, Math.round(w * 0.125))}px -apple-system, "PingFang SC", sans-serif`;
    ctx.fillStyle = themeC.textMain;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const shortName = def.name.length > 4 ? def.name.slice(0, 3) : def.name;
    const label = def.oneTime ? shortName : `${shortName}+${val}`;
    ctx.fillText(label, cx, pillY + pillH / 2 + 0.5);

    ctx.restore();
  }

  renderLoop() {
    const ctx = this.ctx;
    const now = performance.now();
    const state = this.getState();
    const themeC = this.getTheme().canvas;
    const { cellW, cellH, stepY } = this.getCellMetrics();
    const isFever = state.inGame && state.feverTurns > 0;

    ctx.clearRect(0, 0, this.width, this.height);
    this.drawRoundedRect(ctx, 0, 0, this.width, this.height, 16);
    if (isFever) {
      const shift = Math.sin(now * 0.004) * 0.15;
      const grad = ctx.createLinearGradient(0, 0, this.width, this.height);
      grad.addColorStop(0, '#FEF08A');
      grad.addColorStop(0.5 + shift, '#FDBA74');
      grad.addColorStop(1, '#FDE047');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.save();
      ctx.clip();
      for (let i = 0; i < 6; i++) {
        const lx = ((i * 68 + now * 0.06) % (this.width + 40)) - 20;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, this.height);
        ctx.stroke();
      }
      this.boardStars.forEach(s => {
        s.y -= s.speed;
        if (s.y < -0.05) {
          s.y = 1.05;
          s.x = Math.random();
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.beginPath();
        ctx.arc(s.x * this.width, s.y * this.height, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    } else {
      ctx.fillStyle = themeC.boardBg;
      ctx.fill();
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      const fx = this.cellFx[i];
      if (fx.alpha > 0.2) fx.scale += (1 - fx.scale) * 0.16;
      fx.glow *= 0.9;
    }

    for (let c = 0; c < NUM_COLS; c++) {
      const r = this.reels[c];
      const colX = this.pad + c * (cellW + this.gap);

      ctx.save();
      this.drawRoundedRect(ctx, colX - 2, this.pad - 2, cellW + 4, this.height - this.pad * 2 + 4, 14);
      ctx.clip();

      if (r.mode === 'spinning') {
        const elapsed = now - r.startTime;
        const t = Math.min(1, elapsed / r.duration);
        let currentOffset = 0;
        let stretchY = 1;
        if (t < 0.1) {
          const p = t / 0.1;
          currentOffset = r.totalScroll + Math.sin(p * Math.PI) * 12;
        } else {
          const p = (t - 0.1) / 0.9;
          const c1 = 1.25;
          const c3 = c1 + 1;
          const eased = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
          currentOffset = r.totalScroll * (1 - eased);
          stretchY = 1 + Math.sin(p * Math.PI) * 0.08;
        }

        const curStep = Math.floor(currentOffset / stepY);
        if (curStep !== r.lastTickStep && t > 0.1 && t < 0.92) {
          r.lastTickStep = curStep;
          if (c === NUM_COLS - 1 || Math.random() < 0.4) sound.playTick();
        }

        for (let k = 0; k < r.strip.length; k++) {
          const cardY = this.pad + k * stepY - currentOffset;
          if (cardY > -cellH - 12 && cardY < this.height + 12) {
            this.drawCard(ctx, colX, cardY, cellW, cellH, r.strip[k], 1, 1, 0, '#F59E0B', stretchY);
          }
        }

        if (t >= 1 && !r.locked) {
          r.locked = true;
          r.mode = 'idle';
          if (r.onLock) r.onLock();
        }
      } else if (r.mode === 'fastPop') {
        const elapsed = Math.max(0, now - r.startTime);
        const t = Math.min(1, elapsed / r.duration);
        const c1 = 1.7;
        const c3 = c1 + 1;
        const scale = t === 0 ? 0.4 : 0.4 + 0.6 * (1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2));
        for (let row = 0; row < NUM_ROWS; row++) {
          const cardY = this.pad + row * stepY;
          this.drawCard(ctx, colX, cardY, cellW, cellH, r.strip[row], scale, Math.min(1, t * 2), 0);
        }
      } else {
        for (let row = 0; row < NUM_ROWS; row++) {
          const idx = row * NUM_COLS + c;
          const item = state.board[idx];
          const fx = this.cellFx[idx];
          const cardY = this.pad + row * stepY;
          this.drawCard(ctx, colX, cardY, cellW, cellH, item, fx.scale, fx.alpha, fx.glow, fx.glowColor, 1);
        }
      }
      ctx.restore();
    }

    requestAnimationFrame(() => this.renderLoop());
  }
}
