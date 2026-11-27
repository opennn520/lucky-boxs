export const NUM_COLS = 4;
export const NUM_ROWS = 3;
export const BOARD_SIZE = NUM_COLS * NUM_ROWS;
export const MAX_COL_CAP = 9;
export const COL_NAMES = ['第1列', '第2列', '第3列', '第4列'];

export const ITEM_RARITY_ORDER = ['普通', '罕见', '稀有', '史诗', '商店专属'];
export const RELIC_RARITY_ORDER = ['普通', '罕见', '稀有', '史诗', '神话', '商店专属', '商店特殊'];

// 全场景统一的稀有度颜色系统（Canvas 边框 + DOM 卡片边框 + 徽章）
export const RARITY_STYLES = {
  '普通': {
    badge: 'bg-gray-100 text-gray-700 border border-gray-300',
    borderHex: '#D1D5DB',
    bgHex: '#FFFFFF',
    glowHex: 'rgba(209, 213, 219, 0.45)',
    twBorder: 'border-gray-300',
    twBg: 'bg-white'
  },
  '罕见': {
    badge: 'bg-blue-100 text-blue-700 border border-blue-300',
    borderHex: '#3B82F6',
    bgHex: '#EFF6FF',
    glowHex: 'rgba(59, 130, 246, 0.35)',
    twBorder: 'border-blue-400',
    twBg: 'bg-blue-50'
  },
  '稀有': {
    badge: 'bg-purple-100 text-purple-700 border border-purple-300',
    borderHex: '#A855F7',
    bgHex: '#FAF5FF',
    glowHex: 'rgba(168, 85, 247, 0.38)',
    twBorder: 'border-purple-400',
    twBg: 'bg-purple-50'
  },
  '史诗': {
    badge: 'bg-amber-100 text-amber-800 border border-amber-400',
    borderHex: '#F59E0B',
    bgHex: '#FFFBEB',
    glowHex: 'rgba(245, 158, 11, 0.45)',
    twBorder: 'border-amber-400',
    twBg: 'bg-amber-50'
  },
  '商店专属': {
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-400',
    borderHex: '#10B981',
    bgHex: '#ECFDF5',
    glowHex: 'rgba(16, 185, 129, 0.4)',
    twBorder: 'border-emerald-400',
    twBg: 'bg-emerald-50'
  },
  '商店特殊': {
    badge: 'rarity-wave-green-badge text-white border border-emerald-300',
    borderHex: '#059669',
    bgHex: '#D1FAE5',
    glowHex: 'rgba(16, 185, 129, 0.65)',
    twBorder: 'border-emerald-500',
    twBg: 'rarity-wave-green-card'
  },
  '神话': {
    badge: 'rarity-wave-red-badge text-white border border-rose-300',
    borderHex: '#E11D48',
    bgHex: '#FFE4E6',
    glowHex: 'rgba(244, 63, 94, 0.7)',
    twBorder: 'border-rose-500',
    twBg: 'rarity-wave-red-card'
  }
};
