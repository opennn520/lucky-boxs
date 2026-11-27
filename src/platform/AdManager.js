/**
 * 广告管理占位接口（v1.x 不接入真实广告）
 *
 * 预留激励视频点位：
 * - draft_take_all: 三选一“我全都要”
 * - revive_extra_draws: 差一点过关续命（+3 抽）
 * - draft_reroll_rare: 刷新三选一必出稀有
 * - extra_delete_chance: 额外删牌次数
 *
 * 预留插屏广告点位：
 * - 仅在单局彻底结束或返回主界面后延迟 1.5–2 秒低频触发
 */
export const AD_PLACEMENTS = {
  REWARD_DRAFT_TAKE_ALL: 'draft_take_all',
  REWARD_REVIVE: 'revive_extra_draws',
  REWARD_REROLL_RARE: 'draft_reroll_rare',
  REWARD_EXTRA_DELETE: 'extra_delete_chance',
  INTERSTITIAL_RUN_END: 'interstitial_run_end',
  INTERSTITIAL_BACK_MENU: 'interstitial_back_menu'
};

class AdManagerImpl {
  constructor() {
    this.enabled = false;
    this.unitIds = {
      rewardedVideo: '',
      interstitial: ''
    };
    this.lastInterstitialTime = 0;
    this.interstitialCooldownMs = 90000;
  }

  init(config = {}) {
    this.enabled = Boolean(config.enabled);
    if (config.unitIds) {
      this.unitIds = { ...this.unitIds, ...config.unitIds };
    }
  }

  isRewardedReady(_placement) {
    return this.enabled && Boolean(this.unitIds.rewardedVideo);
  }

  async showRewardedVideo(_placement) {
    if (!this.enabled) {
      return { rewarded: false, reason: 'ads_disabled_in_v1' };
    }
    // 微信小游戏阶段接入 wx.createRewardedVideoAd
    return { rewarded: false, reason: 'not_implemented' };
  }

  scheduleInterstitial(_placement, delayMs = 1800) {
    if (!this.enabled || !this.unitIds.interstitial) return;
    const now = Date.now();
    if (now - this.lastInterstitialTime < this.interstitialCooldownMs) return;

    setTimeout(() => {
      this.lastInterstitialTime = Date.now();
      // 微信小游戏阶段接入 wx.createInterstitialAd
    }, delayMs);
  }
}

export const AdManager = new AdManagerImpl();
