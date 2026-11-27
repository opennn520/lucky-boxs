// 5 关目标、抽礼节奏与商店中段开启时机（每关抽奖次数 +2）
export const LEVELS = [
  { level: 1, name: '交水电费', draws: 7, draftEvery: 1, giftsPerDraft: 2, shopMidSpin: 3, target: 65 },
  { level: 2, name: '交本月房租', draws: 8, draftEvery: 1, giftsPerDraft: 1, shopMidSpin: 4, target: 190 },
  { level: 3, name: '买下整栋楼', draws: 8, draftEvery: 2, giftsPerDraft: 1, shopMidSpin: 4, target: 420 },
  { level: 4, name: '全款拿下海景大别墅', draws: 11, draftEvery: 3, giftsPerDraft: 1, shopMidSpin: 5, target: 950 },
  { level: 5, name: '买下整个地球', draws: 10, draftEvery: 4, giftsPerDraft: 1, shopMidSpin: 5, target: 2000 }
];

export const ENDLESS_TARGETS = [3400, 5800, 9500];

// 随关卡递增的稀有度权重曲线（普通 : 罕见 : 稀有 : 史诗）
// 越稀有的物品越难出，随关卡逐步提升
export const RARITY_WEIGHTS_BY_LEVEL = [
  { '普通': 72, '罕见': 22, '稀有': 5,  '史诗': 1  }, // 第 1 关
  { '普通': 60, '罕见': 28, '稀有': 9,  '史诗': 3  }, // 第 2 关
  { '普通': 48, '罕见': 32, '稀有': 14, '史诗': 6  }, // 第 3 关
  { '普通': 38, '罕见': 34, '稀有': 19, '史诗': 9  }, // 第 4 关
  { '普通': 30, '罕见': 35, '稀有': 23, '史诗': 12 }  // 第 5 关 & 无尽
];
