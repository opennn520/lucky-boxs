/**
 * 平台能力适配层（Web / 微信小游戏无缝切换点）
 * 后续打包微信小游戏时，仅需在此处对接 wx.vibrateShort / wx.getStorageSync / wx.setStorageSync
 */
const isWechatMiniGame = typeof wx !== 'undefined' && typeof wx.getSystemInfoSync === 'function';

export const PlatformAdapter = {
  isWechatMiniGame,

  vibrate(pattern) {
    try {
      if (isWechatMiniGame && typeof wx.vibrateShort === 'function') {
        const heavy = Array.isArray(pattern) || (typeof pattern === 'number' && pattern >= 25);
        wx.vibrateShort({ type: heavy ? 'medium' : 'light' });
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  },

  getStorage(key, fallback = null) {
    try {
      if (isWechatMiniGame && typeof wx.getStorageSync === 'function') {
        const val = wx.getStorageSync(key);
        return val !== '' && val !== undefined && val !== null ? val : fallback;
      }
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  },

  setStorage(key, value) {
    try {
      if (isWechatMiniGame && typeof wx.setStorageSync === 'function') {
        wx.setStorageSync(key, value);
        return;
      }
      localStorage.setItem(key, value);
    } catch (e) {}
  }
};
