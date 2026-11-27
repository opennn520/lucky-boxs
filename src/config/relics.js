// 20 款常规过关摆件 + 8 款商店专属摆件 = 28 款
export const REGULAR_RELICS = [
  { id: 'coinBox', name: '零钱收纳盒', rarity: '普通', desc: '每次开抽基础保底额外 +3🪙。' },
  { id: 'luckyDice', name: '幸运骰子', rarity: '普通', desc: '背包中拥有 ≥6 种不同物品时，每次开抽额外 +6🪙。' },
  { id: 'powerBank', name: '小型充电宝', rarity: '普通', desc: '狂热暴走槽的所有充能速度 +20%。' },
  { id: 'piggyCharm', name: '招财猪挂件', rarity: '普通', desc: '每次开抽稳定额外 +4🪙，细水长流。' },
  { id: 'woodenCoin', name: '木头硬币', rarity: '普通', desc: '当场上有普通物品时，每个普通物品额外 +1🪙。' },
  { id: 'oldWallet', name: '旧钱包', rarity: '普通', desc: '过关时获得【当前拥有物品总数 × 当前关卡数】🪙。' },
  { id: 'tinyBell', name: '小铜铃', rarity: '普通', desc: '每触发 1 个一次性物品时，额外获得 +4🪙。' },
  { id: 'paperClip', name: '回形针', rarity: '普通', desc: '每次在背包删除物品时，额外返还 +1🪙。' },
  { id: 'luckyPenny', name: '幸运便士', rarity: '普通', desc: '获取稀有与史诗物品的概率权重提升 +20%！' },
  { id: 'eraser', name: '橡皮擦', rarity: '普通', desc: '每触发 1 次负面扣费，立即补贴 +2🪙。' },
  { id: 'windChime', name: '招财风铃', rarity: '罕见', desc: '每次触发羁绊联动或一次性爆发时，额外 +2🪙。' },
  { id: 'vipCard', name: '黑金会员卡', rarity: '罕见', desc: '背包删除物品返还从 2🪙 提升至 6🪙！' },
  { id: 'careOil', name: '耐久保养油', rarity: '罕见', desc: '此后新获得的带耐久物品，初始耐久上限与当前耐久均 +2！' },
  { id: 'starCharm', name: '许愿星挂坠', rarity: '罕见', desc: '每次开抽若未触发任何联动，保底安慰奖 +8🪙。' },
  { id: 'goldenClover', name: '四叶金草', rarity: '罕见', desc: '每次开抽，盘面上每个倍率/辅助类物品额外 +3🪙。' },
  { id: 'coffeeThermos', name: '保温杯', rarity: '罕见', desc: '每当有带耐久物品耐久归零耗尽时，额外返还 +8🪙。' },
  { id: 'feverCrown', name: '暴走王冠', rarity: '稀有', desc: '狂热暴走期间，总收益倍率额外 +1×（2× 升级为 3×）！' },
  { id: 'clockwork', name: '连锁发条', rarity: '稀有', desc: '单次开抽触发 ≥3 次联动时，额外奖励 +18🪙！' },
  { id: 'magnetCharm', name: '金币磁铁', rarity: '稀有', desc: '每次一次性物品爆发时，额外吸附 +6🪙。' },
  { id: 'catBell', name: '猫咪响铃', rarity: '稀有', desc: '吃货流（橘猫/柴犬/鱼/奶/骨头）触发正向联动时，额外 +4🪙。' },
  { id: 'minerLamp', name: '矿工头灯', rarity: '稀有', desc: '矿工流（矿工/黄金镐/原矿/宝箱/钻石）触发联动时，额外 +5🪙。' },
  { id: 'sweetApron', name: '甜品围裙', rarity: '稀有', desc: '甜品流（奶茶/蛋糕/甜甜圈/烤箱）触发联动时，额外 +4🪙 且暴走 +5%。' },
  { id: 'goldScale', name: '黄金天平', rarity: '史诗', desc: '每次过关额外获得当前剩余金币 10% 的利息（上限 +80🪙）。' },
  { id: 'coreEngine', name: '终极盲盒机芯', rarity: '史诗', desc: '每次开抽有 25% 概率触发超频，全盘产出 ×1.5！' },
  { id: 'timeHourglass', name: '幸运沙漏', rarity: '史诗', desc: '此后每关开局额外获得 +1 次抽盒机会！' },
  { id: 'rainbowPrism', name: '彩虹棱镜', rarity: '史诗', desc: '单次开抽触发 ≥4 次联动时，本轮最终总收益额外 ×1.25！' },
  { id: 'goldPearl', name: '金珍珠', rarity: '史诗', desc: '结算时基础倍率 ×1.05，本轮每触发 1 次物品联动/爆发，倍率额外 +0.05！' },
  { id: 'galaxyPearl', name: '银河珍珠', rarity: '神话', desc: '基础倍率 ×0.5，你每拥有 1 件遗物，回合结束时独立乘算倍率 +0.5！' }
];

export const SHOP_RELICS = [
  { id: 'stampedCoin', name: '印花金币', rarity: '商店专属', basePrice: 32, desc: '每抽 1 次获得 +2🪙，且盘面所有基础金币获取额外 +1🪙。' },
  { id: 'passbook', name: '零钱存折', rarity: '商店专属', basePrice: 24, desc: '每次过关额外存入 +12🪙 零花利息。' },
  { id: 'shopDiscount', name: '折扣会员卡', rarity: '商店专属', basePrice: 36, desc: '商店内所有商品与服务永久享 85 折优惠！' },
  { id: 'spareBattery', name: '备用电池', rarity: '商店专属', basePrice: 26, desc: '每次开抽稳定为暴走槽额外充能 +6%。' },
  { id: 'coinPouch', name: '幸运硬币袋', rarity: '商店专属', basePrice: 26, desc: '盘面上每出现 1 个空格子，本轮补贴 +1🪙。' },
  { id: 'miniCalc', name: '便携计算器', rarity: '商店专属', basePrice: 30, desc: '每当单轮总收益超过 30🪙 时，额外凑整奖励 +4🪙。' },
  { id: 'miniBell', name: '迷你招财铃', rarity: '商店专属', basePrice: 28, desc: '每次触发羁绊联动时，额外响铃 +1🪙。' },
  { id: 'recycleCoupon', name: '回收优惠券', rarity: '商店专属', basePrice: 22, desc: '每次在背包删除物品时，额外返还 +3🪙。' }
];

export const SPECIAL_RELICS = [
  {
    id: 'mysteryDevice',
    name: '神秘装置',
    rarity: '商店特殊',
    desc: '由方块、圆、三角三枚神秘摆件融合而成的未知造物。每轮结算时最终收益独立乘算 ×1.25！'
  }
];

export const ALL_RELICS = [...REGULAR_RELICS, ...SHOP_RELICS, ...SPECIAL_RELICS];
