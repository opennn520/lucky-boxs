import { ICON_PATHS } from './iconPaths.js';

/**
 * 原创苹果风矢量萌系图标渲染器 (IconRenderer: 36 物品 + 20 摆件)
 */
export const IconRenderer = {
  bitmapCache: {},

  getIconSVG(id, size = 32) {
    const inner = ICON_PATHS[id] || ICON_PATHS.mysteryBox;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" class="inline-block shrink-0">${inner}</svg>`;
  },

  preloadAll() {
    Object.keys(ICON_PATHS).forEach(id => {
      const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 64 64">${ICON_PATHS[id]}</svg>`;
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
      this.bitmapCache[id] = img;
    });
  },

  drawCanvasIcon(ctx, id, cx, cy, size) {
    const img = this.bitmapCache[id];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
    } else {
      ctx.fillStyle = 'rgba(217, 119, 6, 0.18)';
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.36, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
