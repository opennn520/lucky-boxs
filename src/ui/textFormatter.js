/**
 * 物品/遗物描述富文本着色器：
 * - 涉及减钱/负面（包含触发条件）的整段文本染红
 * - 涉及加钱/正向收益/乘算的文本染绿
 */
export function formatRichDesc(text) {
  if (!text) return '';
  let safe = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 1. 先将【负面】整句（含触发条件和扣费）高亮为红色
  safe = safe.replace(/(【负面】[^。！!]*[。！!]?)/g, '<span class="text-rose-600 font-extrabold">$1</span>');

  // 2. 不在【负面】内的独立扣费片段（如“扣 -10🪙”或“-5🪙”）染红
  safe = safe.replace(/(?<![\d>])(-\d+🪙)/g, '<span class="text-rose-600 font-extrabold">$1</span>');

  // 3. 加钱与乘算倍率高亮为绿色（如 +7🪙、10~24🪙、×1.5、×2、×1.25）
  safe = safe.replace(/(\+\d+(?:~\d+)?🪙|\d+~\d+🪙|×\d+(?:\.\d+)?)/g, '<span class="text-emerald-600 font-extrabold">$1</span>');

  return safe;
}
