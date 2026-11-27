/**
 * 60fps 粒子、连线、爆裂与礼花特效引擎
 */
export class ParticleEngine {
  constructor(canvas, { isFeverActive }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isFeverActive = isFeverActive || (() => false);
    this.coins = [];
    this.beams = [];
    this.confetti = [];
    this.bursts = [];
    this.feverSparks = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  spawnCoins(fromX, fromY, toX, toY, count = 5) {
    for (let i = 0; i < count; i++) {
      const ctrlX = (fromX + toX) / 2 + (Math.random() - 0.5) * 140;
      const ctrlY = Math.min(fromY, toY) - 55 - Math.random() * 80;
      this.coins.push({
        t: 0,
        speed: 0.028 + Math.random() * 0.018,
        x0: fromX + (Math.random() - 0.5) * 20,
        y0: fromY + (Math.random() - 0.5) * 20,
        cx: ctrlX,
        cy: ctrlY,
        x1: toX,
        y1: toY,
        r: 4.5 + Math.random() * 2.5
      });
    }
  }

  spawnBurst(x, y, color = '#F97316', count = 14) {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const spd = 2.2 + Math.random() * 3.5;
      this.bursts.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: 3 + Math.random() * 3.5,
        alpha: 1,
        color
      });
    }
  }

  spawnBeam(x1, y1, x2, y2, color = '#F59E0B') {
    this.beams.push({ x1, y1, x2, y2, color, alpha: 1 });
  }

  spawnConfetti(count = 70) {
    const colors = ['#FF6B8B', '#F59E0B', '#FBBF24', '#10B981', '#3B82F6', '#8B5CF6'];
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: window.innerWidth * Math.random(),
        y: -20 - Math.random() * 140,
        vx: (Math.random() - 0.5) * 4.5,
        vy: 2.6 + Math.random() * 4.2,
        size: 6 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.22,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  loop() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (this.isFeverActive()) {
      if (this.feverSparks.length < 22 && Math.random() < 0.35) {
        this.feverSparks.push({
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 10,
          vy: 1.8 + Math.random() * 2.4,
          size: 3 + Math.random() * 4,
          alpha: 0.85,
          color: Math.random() < 0.5 ? '#FBBF24' : '#FFF7ED'
        });
      }
    }

    for (let i = this.feverSparks.length - 1; i >= 0; i--) {
      const s = this.feverSparks[i];
      s.y -= s.vy;
      s.alpha -= 0.008;
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (s.alpha <= 0 || s.y < -15) this.feverSparks.splice(i, 1);
    }

    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.restore();
      b.alpha -= 0.048;
      if (b.alpha <= 0) this.beams.splice(i, 1);
    }

    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const p = this.bursts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14;
      p.alpha -= 0.032;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (p.alpha <= 0) this.bursts.splice(i, 1);
    }

    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.t += c.speed;
      if (c.t >= 1) {
        this.coins.splice(i, 1);
        continue;
      }
      const u = 1 - c.t;
      const x = u * u * c.x0 + 2 * u * c.t * c.cx + c.t * c.t * c.x1;
      const y = u * u * c.y0 + 2 * u * c.t * c.cy + c.t * c.t * c.y1;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = '#FCD34D';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#D97706';
      ctx.stroke();
      ctx.restore();
    }

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const p = this.confetti[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
      if (p.y > window.innerHeight + 30) this.confetti.splice(i, 1);
    }

    requestAnimationFrame(() => this.loop());
  }
}
