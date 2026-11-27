// 36 款原创物品（26 款常规/联动 + 10 款一次性道具）
export const SYMBOLS = {
  // === 吃货流 ===
  cat: {
    type: 'cat', name: '橘猫', base: 2, rarity: '普通', archetype: '吃货流',
    desc: '相邻有小鱼干时吃一口(+7🪙且自身永久+1基础)；相邻有牛奶时喝一口(+8🪙并+12%暴走)。'
  },
  fish: {
    type: 'fish', name: '小鱼干', base: 1, rarity: '普通', archetype: '吃货流', maxDurability: 7,
    desc: '【耐久 7】被相邻橘猫吃一口：爆 +7🪙，橘猫永久 +1 基础，自身耐久 -1。'
  },
  milk: {
    type: 'milk', name: '牛奶', base: 2, rarity: '普通', archetype: '吃货流', maxDurability: 6,
    desc: '【耐久 6】被相邻橘猫喝一口：爆 +8🪙 且暴走槽 +12%，自身耐久 -1。【负面】若相邻没有橘猫，变质倒掉 -5🪙！'
  },

  // === 矿工流 ===
  miner: {
    type: 'miner', name: '矿工', base: 2, rarity: '普通', archetype: '矿工流',
    desc: '开采相邻原矿(+8🪙)或宝箱(+16🪙)。【负面】相邻冰美式或奶茶会打翻饮料，清理费 -5🪙！'
  },
  ore: {
    type: 'ore', name: '原矿', base: 1, rarity: '普通', archetype: '矿工流', maxDurability: 7,
    desc: '【耐久 7】被相邻矿工开采：爆 +8🪙 且耐久 -1；耐久归零碎裂时额外爆 +12🪙！'
  },
  chest: {
    type: 'chest', name: '宝箱', base: 2, rarity: '罕见', archetype: '矿工流', maxDurability: 3,
    desc: '【耐久 3】被相邻矿工撬开：爆 +16🪙 且耐久 -1；最后一次开启额外爆 +25🪙！'
  },
  diamond: {
    type: 'diamond', name: '钻石', base: 10, rarity: '史诗', archetype: '矿工流', maxDurability: 5, estValue: 18,
    desc: '【耐久 5】顶级晶矿，基础高达 +10🪙；每相邻 1 颗其他钻石额外 +4🪙！每次登场消耗 1 耐久。'
  },

  // === 摸鱼流 ===
  worker: {
    type: 'worker', name: '打工人', base: 2, rarity: '普通', archetype: '摸鱼流',
    desc: '喝相邻冰美式本轮自身产出 ×2 并爆 +9🪙；紧邻笔记本额外 +6🪙。【负面】相邻橘猫上班摸鱼 -4🪙！'
  },
  coffee: {
    type: 'coffee', name: '冰美式', base: 2, rarity: '普通', archetype: '摸鱼流', maxDurability: 6,
    desc: '【耐久 6】相邻有打工人时：爆 +9🪙 并令打工人本轮产出 ×2，自身耐久 -1。'
  },
  laptop: {
    type: 'laptop', name: '笔记本', base: 2, rarity: '普通', archetype: '摸鱼流',
    desc: '稳定办公神器！紧邻打工人时直接额外爆出 +6🪙（不耗耐久）。'
  },

  // === 甜品流 ===
  boba: {
    type: 'boba', name: '珍珠奶茶', base: 2, rarity: '普通', archetype: '甜品流',
    desc: '与相邻草莓蛋糕组成下午茶套餐：双方甜蜜联动 +10🪙 且暴走 +15%！【负面】相邻有打工人时喝太甜犯困 -6🪙！'
  },
  cake: {
    type: 'cake', name: '草莓蛋糕', base: 3, rarity: '罕见', archetype: '甜品流', maxDurability: 4,
    desc: '【耐久 4】相邻有珍珠奶茶时：甜蜜联动共爆 +10🪙 与 +15% 暴走，自身耐久 -1。【负面】相邻无奶茶或小烤箱时奶油融化 -6🪙！'
  },

  // === 增殖成长流 ===
  hen: {
    type: 'hen', name: '母鸡', base: 2, rarity: '普通', archetype: '增殖流',
    desc: '40% 概率往本列下一枚鸡蛋(列满折现 +6🪙)；相邻鸡蛋触发孵化加速并 +5🪙！'
  },
  egg: {
    type: 'egg', name: '鸡蛋', base: 1, rarity: '普通', archetype: '增殖流', maxDurability: 5,
    desc: '【耐久 5】每抽 40% 概率(或耐久归零必)孵化为橘猫或金蛋！相邻母鸡 +5🪙 并耐久 -1。'
  },
  goldenEgg: {
    type: 'goldenEgg', name: '金蛋', base: 8, rarity: '稀有', archetype: '增殖流', maxDurability: 5, estValue: 12,
    desc: '【耐久 5】闪耀纯金蛋！单格稳定产出 +8🪙，每次登场消耗 1 耐久。'
  },
  slime: {
    type: 'slime', name: '史莱姆', base: 2, rarity: '普通', archetype: '增殖流',
    desc: '周围每有 1 个相邻史莱姆，自身本轮产出 ×2！【负面】相邻有橘猫或柴犬时粘毛清理费 -4🪙！'
  },
  piggyBank: {
    type: 'piggyBank', name: '存钱罐', base: 1, rarity: '罕见', archetype: '成长流', maxDurability: 5,
    desc: '【耐久 5】每次抽中永久 +2 基础并耐久 -1；耐久归零砸开直接狂爆 3 倍累计身价！'
  },
  moneyTree: {
    type: 'moneyTree', name: '摇钱树', base: 4, rarity: '稀有', archetype: '成长流', maxDurability: 6, estValue: 13,
    desc: '【耐久 6】每次抽中永久成长 +1 基础身价并 +10% 暴走，消耗 1 耐久。【负面】每次登场需浇水施肥维护费 -4🪙！'
  },
  goldIngot: {
    type: 'goldIngot', name: '金元宝', base: 5, rarity: '罕见', archetype: '财富流',
    desc: '沉甸甸的金元宝！基础 +5🪙，紧邻聚宝盆或财神像时额外 +5🪙。'
  },

  // === 倍率 / 辅助流 ===
  clover: {
    type: 'clover', name: '幸运草', base: 2, rarity: '罕见', archetype: '倍率流', isMult: true,
    desc: '周围 8 格物品本轮产出 ×1.5。【负面】相邻有矿工或黄金镐时会踩坏草坪 -5🪙！'
  },
  luckyCat: {
    type: 'luckyCat', name: '招财猫', base: 3, rarity: '稀有', archetype: '倍率流', isMult: true,
    desc: '周围 8 格物品本轮产出 ×2。【负面】相邻有柴犬时招财猫受惊 -6🪙！'
  },
  magicWand: {
    type: 'magicWand', name: '魔法棒', base: 3, rarity: '稀有', archetype: '辅助流', isMult: true,
    desc: '为周围 8 格带耐久物品恢复 +1 耐久并令其产出 ×1.5。【负面】相邻有打工人时魔力走火 -5🪙！'
  },
  treasurePot: {
    type: 'treasurePot', name: '聚宝盆', base: 5, rarity: '史诗', archetype: '倍率流', isMult: true, maxDurability: 5, estValue: 22,
    desc: '【耐久 5】令【整列】所有物品本轮产出 ×2（每登场消耗 1 耐久）。【负面】相邻原矿砸伤盆身 -6🪙！'
  },
  wealthGod: {
    type: 'wealthGod', name: '财神像', base: 6, rarity: '史诗', archetype: '倍率流', isMult: true, maxDurability: 5, estValue: 24,
    desc: '【耐久 5】令【整行】所有物品本轮产出 ×2（每登场消耗 1 耐久）。【负面】相邻史莱姆弄脏供桌 -8🪙！'
  },
  koi: {
    type: 'koi', name: '锦鲤', base: 5, rarity: '史诗', archetype: '倍率流', isMult: true, maxDurability: 4, estValue: 24,
    desc: '【耐久 4】暴走槽 +20% 且全场产出 ×1.5（每登场消耗 1 耐久）。【负面】鱼塘维护费 -6🪙，相邻橘猫或小鱼干受惊再 -12🪙！'
  },
  unicorn: {
    type: 'unicorn', name: '彩虹独角兽', base: 7, rarity: '史诗', archetype: '辅助流', isMult: true, maxDurability: 5, estValue: 22,
    desc: '【耐久 5】暴走槽 +25%，令相邻物品 ×1.5 并 +4🪙（每登场消耗 1 耐久）。【负面】每次登场需彩虹口粮 -8🪙！'
  },

  // === 新增 10 款常规 / 流派物品 ===
  dog: {
    type: 'dog', name: '柴犬', base: 2, rarity: '普通', archetype: '吃货流',
    desc: '相邻有大骨头时啃一口(+9🪙)。【负面】相邻有橘猫时会猫狗打架，损失 -5🪙！'
  },
  bone: {
    type: 'bone', name: '大骨头', base: 1, rarity: '普通', archetype: '吃货流', maxDurability: 7, estValue: 9,
    desc: '【耐久 7】被相邻柴犬啃一口：爆 +9🪙 且耐久 -1；耐久归零碎裂额外爆 +14🪙！'
  },
  barista: {
    type: 'barista', name: '咖啡师', base: 3, rarity: '罕见', archetype: '摸鱼流',
    desc: '45% 概率在同列冲泡 1 杯冰美式(列满折现 +7🪙)；相邻冰美式本轮产出 ×2！'
  },
  donut: {
    type: 'donut', name: '甜甜圈', base: 2, rarity: '普通', archetype: '甜品流', maxDurability: 6, estValue: 8,
    desc: '【耐久 6】相邻有珍珠奶茶或冰美式时：甜蜜搭配 +8🪙 且暴走 +10%，耐久 -1。【负面】相邻橘猫或柴犬偷吃弄乱 -6🪙！'
  },
  oven: {
    type: 'oven', name: '小烤箱', base: 3, rarity: '稀有', archetype: '甜品流', isMult: true,
    desc: '相邻有草莓蛋糕或甜甜圈时：烘焙令其产出 ×2 并 +4🪙，50% 概率恢复 +1 耐久。【负面】相邻牛奶或冰美式冷热短路 -6🪙！'
  },
  goldPick: {
    type: 'goldPick', name: '黄金镐', base: 3, rarity: '稀有', archetype: '矿工流', maxDurability: 4, estValue: 16,
    desc: '【耐久 4】相邻有原矿/宝箱/钻石时：暴击开采 +15🪙 并消耗自身 1 耐久；相邻钻石额外 ×1.5！'
  },
  bee: {
    type: 'bee', name: '小蜜蜂', base: 2, rarity: '普通', archetype: '增殖流',
    desc: '相邻有向日葵或幸运草时采蜜 +6🪙；35% 概率在同列种下 1 朵向日葵(列满折现 +5🪙)。'
  },
  flower: {
    type: 'flower', name: '向日葵', base: 2, rarity: '普通', archetype: '增殖流', maxDurability: 6, estValue: 7,
    desc: '【耐久 6】被相邻小蜜蜂采蜜：爆 +6🪙 且耐久 -1；耐久归零结出瓜子额外爆 +10🪙！'
  },
  capsule: {
    type: 'capsule', name: '扭蛋机', base: 3, rarity: '稀有', archetype: '辅助流',
    desc: '每抽随机令相邻 1 个非一次性物品永久 +1 基础身价，并爆 +4🪙！'
  },
  phoenix: {
    type: 'phoenix', name: '火凤凰', base: 8, rarity: '史诗', archetype: '成长流', maxDurability: 6, estValue: 22,
    desc: '【耐久 6】每当本轮有物品耗尽/销毁时永久 +2 基础并 +10🪙（每登场消耗 1 耐久）。【负面】相邻冰美式/牛奶浇灭圣火 -8🪙！'
  },

  // === 商店专属神秘三件套（集齐同现合成商店特殊遗物：神秘装置） ===
  geoSquare: {
    type: 'geoSquare', name: '方块摆件', base: 0, rarity: '商店专属', archetype: '神秘摆件', shopOnly: true, estValue: 10,
    desc: '刻着奇异方纹的古老石块，本身毫无产出，似乎在静待另外两枚几何摆件同时现身棋盘……'
  },
  geoCircle: {
    type: 'geoCircle', name: '圆摆件', base: 0, rarity: '商店专属', archetype: '神秘摆件', shopOnly: true, estValue: 10,
    desc: '一枚完美无瑕的浮雕圆盘，隐约与方块、三角相互呼应，三者同时抽中时必将发生未知异象……'
  },
  geoTriangle: {
    type: 'geoTriangle', name: '三角摆件', base: 0, rarity: '商店专属', archetype: '神秘摆件', shopOnly: true, estValue: 10,
    desc: '散发微光的神秘三角锥，传说集齐三枚几何摆件并同盘现身之刻，会唤醒某种特殊造物……'
  },

  // === 20 款一次性过渡/联动品 ===
  pocketMoney: {
    type: 'pocketMoney', name: '零花钱袋', base: 0, rarity: '普通', archetype: '一次性', oneTime: true, pureCash: true, estValue: 12,
    desc: '【一次性】抽中立即爆 +12🪙，随后自动销毁不占格。'
  },
  receipt: {
    type: 'receipt', name: '便利店小票', base: 0, rarity: '普通', archetype: '一次性', oneTime: true, pureCash: true, estValue: 11,
    desc: '【一次性】抽中报销 +10🪙 且暴走槽 +15%，随后自动销毁。'
  },
  catnip: {
    type: 'catnip', name: '猫薄荷', base: 0, rarity: '普通', archetype: '一次性', oneTime: true, estValue: 12,
    desc: '【一次性·联动】令全场所有橘猫/招财猫永久 +2 基础并各爆 +6🪙（保底 +8🪙），随后销毁。'
  },
  energyDrink: {
    type: 'energyDrink', name: '功能饮料', base: 0, rarity: '普通', archetype: '一次性', oneTime: true, estValue: 12,
    desc: '【一次性·联动】令全场所有打工人/矿工本轮产出 ×2 并各爆 +5🪙，暴走 +15%（保底 +8🪙），随后销毁。'
  },
  scratchCard: {
    type: 'scratchCard', name: '刮刮乐', base: 0, rarity: '罕见', archetype: '一次性', oneTime: true, pureCash: true, estValue: 17,
    desc: '【一次性】抽中随机刮出 10~24🪙，随后自动销毁不占格。'
  },
  mysteryBox: {
    type: 'mysteryBox', name: '神秘快递', base: 0, rarity: '罕见', archetype: '一次性', oneTime: true, estValue: 16,
    desc: '【一次性】抽中爆 +14🪙，并往空余列赠送 1 个随机普通物品，随后销毁。'
  },
  bobaCoupon: {
    type: 'bobaCoupon', name: '奶茶免单券', base: 0, rarity: '罕见', archetype: '一次性', oneTime: true, pureCash: true, estValue: 17,
    desc: '【一次性】抽中省下 +16🪙 且暴走槽 +20%，随后自动销毁。'
  },
  repairKit: {
    type: 'repairKit', name: '万能胶水', base: 0, rarity: '罕见', archetype: '一次性', oneTime: true, estValue: 16,
    desc: '【一次性·联动】为全场所有带耐久物品恢复 +2 耐久，每修复 1 个额外 +5🪙（保底 +10🪙），随后销毁。'
  },
  fertilizer: {
    type: 'fertilizer', name: '魔法化肥', base: 0, rarity: '罕见', archetype: '一次性', oneTime: true, estValue: 16,
    desc: '【一次性·联动】令全场所有向日葵/摇钱树/幸运草永久 +2 基础并各爆 +6🪙（保底 +10🪙），随后销毁。'
  },
  vipPass: {
    type: 'vipPass', name: '甜品试吃券', base: 0, rarity: '罕见', archetype: '一次性', oneTime: true, estValue: 18,
    desc: '【一次性·联动】触发全场所有珍珠奶茶/草莓蛋糕/甜甜圈大派送，每个 +8🪙 且暴走 +10%（保底 +10🪙），随后销毁。'
  },
  redPacket: {
    type: 'redPacket', name: '年终奖红包', base: 0, rarity: '稀有', archetype: '一次性', oneTime: true, pureCash: true, estValue: 30,
    desc: '【一次性】抽中爆 +30🪙 且暴走槽 +25%，随后自动销毁。'
  },
  blindVoucher: {
    type: 'blindVoucher', name: '限时盲盒券', base: 0, rarity: '稀有', archetype: '一次性', oneTime: true, estValue: 24,
    desc: '【一次性】抽中爆 +12🪙，并令本关剩余抽盒次数 +1，随后自动销毁。'
  },
  goldBarBox: {
    type: 'goldBarBox', name: '金条礼盒', base: 0, rarity: '稀有', archetype: '一次性', oneTime: true, pureCash: true, estValue: 36,
    desc: '【一次性】抽中直接变现 +36🪙，随后自动销毁。'
  },
  dynamite: {
    type: 'dynamite', name: '爆破炸药', base: 0, rarity: '稀有', archetype: '一次性', oneTime: true, estValue: 28,
    desc: '【一次性·联动】炸开相邻所有原矿/宝箱（各扣 2 耐久并爆双倍开采奖），保底 +18🪙，随后销毁。'
  },
  goldenFeed: {
    type: 'goldenFeed', name: '黄金饲料', base: 0, rarity: '稀有', archetype: '一次性', oneTime: true, estValue: 26,
    desc: '【一次性·联动】令全场母鸡/鸡蛋/橘猫/柴犬各爆 +10🪙，并往空余列送 1 枚金蛋（保底 +14🪙），随后销毁。'
  },
  feverHorn: {
    type: 'feverHorn', name: '狂热号角', base: 0, rarity: '稀有', archetype: '一次性', oneTime: true, estValue: 20,
    desc: '【一次性·联动】暴走槽 +60%（暴走中延长 +1 回合）。【负面】吹响需消耗 -10🪙 军号费，随后销毁！'
  },
  demolition: {
    type: 'demolition', name: '拆迁补偿款', base: 0, rarity: '史诗', archetype: '一次性', oneTime: true, pureCash: true, estValue: 65,
    desc: '【一次性】一夜暴富！抽中狂爆 +65🪙 且暴走槽 +40%，随后自动销毁。'
  },
  mysteryCheck: {
    type: 'mysteryCheck', name: '神秘支票', base: 0, rarity: '史诗', archetype: '一次性', oneTime: true, pureCash: true, estValue: 65,
    desc: '【一次性】抽中兑现 45~85🪙 随机巨款，随后自动销毁。'
  },
  copyMirror: {
    type: 'copyMirror', name: '复制魔镜', base: 0, rarity: '史诗', archetype: '一次性', oneTime: true, estValue: 42,
    desc: '【一次性·联动】复制相邻基础身价最高的非一次性物品入列（列满折现 +35🪙），并爆 +20🪙，随后销毁。'
  },
  jackpotTicket: {
    type: 'jackpotTicket', name: '超级锦鲤签', base: 0, rarity: '史诗', archetype: '一次性', oneTime: true, estValue: 48,
    desc: '【一次性·联动】立即爆 +30🪙，且令本轮全场所有物品额外 ×1.5 倍率，随后销毁。'
  }
};

export const GEO_TRIO_KEYS = ['geoSquare', 'geoCircle', 'geoTriangle'];

export const COMMON_KEYS = Object.keys(SYMBOLS).filter(
  k => SYMBOLS[k].rarity === '普通' && !SYMBOLS[k].oneTime && !SYMBOLS[k].shopOnly
);

export const SYMBOLS_BY_RARITY = {
  '普通': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].rarity === '普通' && !SYMBOLS[k].shopOnly),
  '罕见': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].rarity === '罕见' && !SYMBOLS[k].shopOnly),
  '稀有': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].rarity === '稀有' && !SYMBOLS[k].shopOnly),
  '史诗': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].rarity === '史诗' && !SYMBOLS[k].shopOnly)
};

// 商店专用一次性道具池（排除纯一次性加钱道具）
export const SHOP_UTILITY_DISPOSABLES_BY_RARITY = {
  '普通': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].oneTime && !SYMBOLS[k].pureCash && SYMBOLS[k].rarity === '普通'),
  '罕见': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].oneTime && !SYMBOLS[k].pureCash && SYMBOLS[k].rarity === '罕见'),
  '稀有': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].oneTime && !SYMBOLS[k].pureCash && SYMBOLS[k].rarity === '稀有'),
  '史诗': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].oneTime && !SYMBOLS[k].pureCash && SYMBOLS[k].rarity === '史诗')
};

export const DISPOSABLE_BY_RARITY = {
  '普通': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].oneTime && SYMBOLS[k].rarity === '普通'),
  '罕见': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].oneTime && SYMBOLS[k].rarity === '罕见'),
  '稀有': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].oneTime && SYMBOLS[k].rarity === '稀有'),
  '史诗': Object.keys(SYMBOLS).filter(k => SYMBOLS[k].oneTime && SYMBOLS[k].rarity === '史诗')
};

export const DURABLE_BY_RARITY = {
  '普通': Object.keys(SYMBOLS).filter(k => Boolean(SYMBOLS[k].maxDurability) && SYMBOLS[k].rarity === '普通'),
  '罕见': Object.keys(SYMBOLS).filter(k => Boolean(SYMBOLS[k].maxDurability) && SYMBOLS[k].rarity === '罕见'),
  '稀有': Object.keys(SYMBOLS).filter(k => Boolean(SYMBOLS[k].maxDurability) && SYMBOLS[k].rarity === '稀有'),
  '史诗': Object.keys(SYMBOLS).filter(k => Boolean(SYMBOLS[k].maxDurability) && SYMBOLS[k].rarity === '史诗')
};

export const ALL_DURABLE_KEYS = Object.keys(SYMBOLS).filter(k => Boolean(SYMBOLS[k].maxDurability));

export function getSymbolEstimatedTurnValue(key) {
  const def = SYMBOLS[key];
  if (!def) return 10;
  if (typeof def.estValue === 'number') return def.estValue;
  // 为老的耐久物品提供合理的单回合期望收益
  const fallbackMap = {
    fish: 8,
    milk: 10,
    ore: 9,
    chest: 18,
    coffee: 11,
    cake: 13,
    egg: 7,
    piggyBank: 12
  };
  return fallbackMap[key] || Math.max(6, def.base * 3);
}
