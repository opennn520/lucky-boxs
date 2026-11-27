// 56 个原创矢量萌系图标 SVG 路径（36 物品 + 12 常规摆件 + 8 商店专属摆件）
export const ICON_PATHS = {
  // === 36 款物品矢量图标 ===
  goldenEgg: `
    <defs><linearGradient id="ge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFF3B0"/><stop offset="50%" stop-color="#FBBF24"/><stop offset="100%" stop-color="#D97706"/></linearGradient></defs>
    <path d="M32 8 C46 8 52 27 52 39 C52 51 43 57 32 57 C21 57 12 51 12 39 C12 27 18 8 32 8 Z" fill="url(#ge)" stroke="#B45309" stroke-width="2.5"/>
    <ellipse cx="25" cy="24" rx="4.5" ry="9" transform="rotate(-18 25 24)" fill="#FFFFFF" opacity="0.65"/>
    <path d="M51 13 L53 8 L55 13 L60 15 L55 17 L53 22 L51 17 L46 15 Z" fill="#F59E0B"/>`,
  egg: `
    <path d="M32 9 C45 9 50 27 50 39 C50 50 42 56 32 56 C22 56 14 50 14 39 C14 27 19 9 32 9 Z" fill="#FEF3DF" stroke="#D4A373" stroke-width="2.5"/>
    <ellipse cx="25" cy="24" rx="3.5" ry="7" transform="rotate(-16 25 24)" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="38" cy="36" r="2.2" fill="#D4A373" opacity="0.65"/><circle cx="29" cy="45" r="1.8" fill="#D4A373" opacity="0.6"/>`,
  cat: `
    <path d="M16 26 L12 10 L27 18 Z" fill="#FB923C" stroke="#C2410C" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M48 26 L52 10 L37 18 Z" fill="#FB923C" stroke="#C2410C" stroke-width="2.4" stroke-linejoin="round"/>
    <ellipse cx="32" cy="36" rx="22" ry="19" fill="#FDBA74" stroke="#C2410C" stroke-width="2.5"/>
    <path d="M29 18 L29 24 M32 17 L32 25 M35 18 L35 24" stroke="#EA580C" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="23" cy="35" r="3" fill="#431407"/><circle cx="41" cy="35" r="3" fill="#431407"/>
    <circle cx="22" cy="34" r="1" fill="#FFF"/><circle cx="40" cy="34" r="1" fill="#FFF"/>
    <polygon points="30,39 34,39 32,42" fill="#F43F5E"/>
    <path d="M27 44 Q32 47 32 42 Q32 47 37 44" fill="none" stroke="#431407" stroke-width="2" stroke-linecap="round"/>`,
  fish: `
    <path d="M47 32 L58 20 L55 32 L58 44 Z" fill="#60A5FA" stroke="#1D4ED8" stroke-width="2.3" stroke-linejoin="round"/>
    <path d="M8 32 C15 17 38 17 49 32 C38 47 15 47 8 32 Z" fill="#93C5FD" stroke="#1D4ED8" stroke-width="2.4"/>
    <circle cx="18" cy="29" r="2.8" fill="#1E3A8A"/><circle cx="17.2" cy="28.2" r="1" fill="#FFF"/>
    <path d="M31 28 L38 30 M31 35 L38 34" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>`,
  milk: `
    <path d="M20 20 L24 10 L40 10 L44 20 Z" fill="#DBEAFE" stroke="#2563EB" stroke-width="2.4" stroke-linejoin="round"/>
    <rect x="18" y="20" width="28" height="34" rx="5" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.4"/>
    <rect x="18" y="30" width="28" height="14" fill="#60A5FA"/>
    <circle cx="32" cy="37" r="4.5" fill="#FFFFFF"/>`,
  miner: `
    <circle cx="32" cy="36" r="16" fill="#FDE68A" stroke="#92400E" stroke-width="2.4"/>
    <path d="M14 31 C14 17 50 17 50 31 Z" fill="#FACC15" stroke="#B45309" stroke-width="2.5"/>
    <rect x="12" y="29" width="40" height="5" rx="2.5" fill="#EAB308" stroke="#B45309" stroke-width="2"/>
    <circle cx="32" cy="23" r="5" fill="#FEF08A" stroke="#D97706" stroke-width="2"/>
    <circle cx="26" cy="39" r="2.3" fill="#451A03"/><circle cx="38" cy="39" r="2.3" fill="#451A03"/>
    <path d="M29 45 Q32 48 35 45" fill="none" stroke="#451A03" stroke-width="2" stroke-linecap="round"/>`,
  ore: `
    <polygon points="16,49 11,33 21,17 42,15 54,30 49,50" fill="#94A3B8" stroke="#334155" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="24,25 32,19 37,28 29,34" fill="#38BDF8" stroke="#0284C7" stroke-width="1.8"/>
    <polygon points="37,34 46,31 47,42 38,44" fill="#22D3EE" stroke="#0891B2" stroke-width="1.8"/>`,
  chest: `
    <rect x="11" y="27" width="42" height="26" rx="5" fill="#B45309" stroke="#78350F" stroke-width="2.5"/>
    <path d="M11 27 C11 16 53 16 53 27 Z" fill="#D97706" stroke="#78350F" stroke-width="2.5"/>
    <rect x="11" y="25" width="42" height="5" fill="#FBBF24" stroke="#92400E" stroke-width="1.8"/>
    <rect x="27" y="24" width="10" height="12" rx="3" fill="#FDE047" stroke="#92400E" stroke-width="2"/>`,
  diamond: `
    <polygon points="18,16 46,16 56,29 32,54 8,29" fill="#38BDF8" stroke="#0284C7" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="18,16 46,16 39,29 25,29" fill="#BAE6FD"/>
    <polygon points="25,29 39,29 32,54" fill="#7DD3FC"/>
    <line x1="8" y1="29" x2="56" y2="29" stroke="#0284C7" stroke-width="2"/>`,
  slime: `
    <path d="M12 43 C12 24 23 14 32 14 C41 14 52 24 52 43 C52 52 44 54 32 54 C20 54 12 52 12 43 Z" fill="#4ADE80" stroke="#15803D" stroke-width="2.5"/>
    <ellipse cx="24" cy="24" rx="5" ry="3" transform="rotate(-25 24 24)" fill="#DCFCE7" opacity="0.8"/>
    <circle cx="24" cy="38" r="2.8" fill="#14532D"/><circle cx="40" cy="38" r="2.8" fill="#14532D"/>
    <path d="M29 42 Q32 45 35 42" fill="none" stroke="#14532D" stroke-width="2" stroke-linecap="round"/>`,
  hen: `
    <path d="M27 16 C27 10 33 10 33 15 C36 10 41 12 39 18 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="1.8"/>
    <path d="M14 40 C14 26 22 18 33 18 C43 18 48 25 48 34 C53 34 55 40 50 47 C45 53 19 53 14 40 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.4"/>
    <polygon points="10,31 18,28 18,35" fill="#F59E0B" stroke="#B45309" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="23" cy="28" r="2.5" fill="#1E293B"/>`,
  worker: `
    <circle cx="32" cy="28" r="15" fill="#FED7AA" stroke="#9A3412" stroke-width="2.3"/>
    <path d="M17 26 C18 14 46 14 47 26 C42 21 22 21 17 26 Z" fill="#334155"/>
    <rect x="20" y="25" width="10" height="7" rx="2.5" fill="#E0F2FE" stroke="#1E293B" stroke-width="2"/>
    <rect x="34" y="25" width="10" height="7" rx="2.5" fill="#E0F2FE" stroke="#1E293B" stroke-width="2"/>
    <path d="M16 54 C17 44 47 44 48 54 Z" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2.2"/>`,
  coffee: `
    <line x1="37" y1="8" x2="33" y2="24" stroke="#10B981" stroke-width="3.5" stroke-linecap="round"/>
    <polygon points="18,22 46,22 42,54 22,54" fill="#F8FAFC" stroke="#64748B" stroke-width="2.4" stroke-linejoin="round"/>
    <polygon points="20,29 44,29 41,53 23,53" fill="#78350F"/>
    <rect x="16" y="19" width="32" height="5" rx="2.5" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>`,
  laptop: `
    <rect x="14" y="14" width="36" height="25" rx="4" fill="#CBD5E1" stroke="#475569" stroke-width="2.4"/>
    <rect x="18" y="18" width="28" height="17" rx="2" fill="#38BDF8"/>
    <path d="M8 41 L56 41 L52 48 L12 48 Z" fill="#94A3B8" stroke="#475569" stroke-width="2.3" stroke-linejoin="round"/>`,
  boba: `
    <rect x="31" y="7" width="5" height="16" rx="2" transform="rotate(10 33 15)" fill="#F43F5E"/>
    <polygon points="18,21 46,21 42,54 22,54" fill="#FDE68A" stroke="#B45309" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="26" cy="48" r="3" fill="#451A03"/><circle cx="33" cy="49" r="3" fill="#451A03"/><circle cx="39" cy="47" r="3" fill="#451A03"/>`,
  cake: `
    <polygon points="12,30 52,22 52,50 12,50" fill="#FFFBEB" stroke="#D97706" stroke-width="2.4" stroke-linejoin="round"/>
    <rect x="12" y="38" width="40" height="5" fill="#FDA4AF"/>
    <path d="M32 10 C38 10 41 18 32 24 C23 18 26 10 32 10 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="2"/>`,
  clover: `
    <path d="M32 34 C32 45 35 52 40 56" fill="none" stroke="#15803D" stroke-width="3.2" stroke-linecap="round"/>
    <circle cx="24" cy="23" r="10" fill="#4ADE80" stroke="#15803D" stroke-width="2.2"/>
    <circle cx="40" cy="23" r="10" fill="#22C55E" stroke="#15803D" stroke-width="2.2"/>
    <circle cx="24" cy="38" r="10" fill="#22C55E" stroke="#15803D" stroke-width="2.2"/>
    <circle cx="40" cy="38" r="10" fill="#4ADE80" stroke="#15803D" stroke-width="2.2"/>`,
  luckyCat: `
    <path d="M18 24 L15 11 L27 17 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M46 24 L49 11 L37 17 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.2" stroke-linejoin="round"/>
    <ellipse cx="32" cy="36" rx="20" ry="19" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.4"/>
    <rect x="20" y="39" width="24" height="5" rx="2.5" fill="#EF4444"/>
    <circle cx="32" cy="47" r="6" fill="#FBBF24" stroke="#B45309" stroke-width="2"/>`,
  treasurePot: `
    <ellipse cx="32" cy="21" rx="12" ry="6" fill="#FBBF24" stroke="#B45309" stroke-width="2"/>
    <path d="M12 28 L52 28 C52 46 44 54 32 54 C20 54 12 46 12 28 Z" fill="#DC2626" stroke="#991B1B" stroke-width="2.5"/>
    <rect x="10" y="25" width="44" height="6" rx="3" fill="#FBBF24" stroke="#B45309" stroke-width="2"/>
    <circle cx="32" cy="41" r="6" fill="#FDE047" stroke="#B45309" stroke-width="1.8"/>`,
  wealthGod: `
    <rect x="10" y="18" width="44" height="6" rx="3" fill="#EF4444" stroke="#991B1B" stroke-width="2"/>
    <path d="M18 22 C18 11 46 11 46 22 Z" fill="#DC2626" stroke="#991B1B" stroke-width="2.2"/>
    <circle cx="32" cy="36" r="14" fill="#FED7AA" stroke="#9A3412" stroke-width="2.2"/>
    <path d="M20 43 C24 54 40 54 44 43 Z" fill="#1E293B"/>`,
  moneyTree: `
    <polygon points="22,42 42,42 39,55 25,55" fill="#EA580C" stroke="#9A3412" stroke-width="2.2"/>
    <rect x="29" y="26" width="6" height="16" fill="#92400E"/>
    <circle cx="32" cy="21" r="14" fill="#4ADE80" stroke="#15803D" stroke-width="2.3"/>
    <circle cx="25" cy="18" r="4.5" fill="#FBBF24"/><circle cx="39" cy="18" r="4.5" fill="#FBBF24"/><circle cx="32" cy="27" r="4.5" fill="#FDE047"/>`,
  goldIngot: `
    <path d="M10 34 C14 48 50 48 54 34 L48 26 C42 32 22 32 16 26 Z" fill="#FBBF24" stroke="#B45309" stroke-width="2.5" stroke-linejoin="round"/>
    <ellipse cx="32" cy="26" rx="11" ry="7" fill="#FEF08A" stroke="#B45309" stroke-width="2.2"/>`,
  piggyBank: `
    <ellipse cx="32" cy="36" rx="20" ry="15" fill="#F9A8D4" stroke="#DB2777" stroke-width="2.5"/>
    <rect x="27" y="23" width="10" height="3" rx="1.5" fill="#9D174D"/>
    <ellipse cx="14" cy="37" rx="5" ry="4" fill="#F472B6" stroke="#DB2777" stroke-width="2"/>
    <circle cx="22" cy="32" r="2.2" fill="#831843"/>`,
  koi: `
    <path d="M12 36 C16 16 38 14 48 26 C53 20 58 24 52 32 C58 40 53 44 48 38 C38 50 16 48 12 36 Z" fill="#FFFFFF" stroke="#EA580C" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M20 26 C26 21 34 23 35 30 C29 33 22 32 20 26 Z" fill="#FB923C"/>
    <circle cx="19" cy="34" r="2.3" fill="#1E293B"/>`,
  magicWand: `
    <line x1="12" y1="52" x2="36" y2="28" stroke="#A855F7" stroke-width="5" stroke-linecap="round"/>
    <polygon points="40,10 44,20 55,21 47,28 49,39 40,33 31,39 33,28 25,21 36,20" fill="#FDE047" stroke="#D97706" stroke-width="2.2" stroke-linejoin="round"/>`,
  unicorn: `
    <polygon points="32,8 37,22 27,22" fill="#FDE047" stroke="#D97706" stroke-width="2"/>
    <circle cx="32" cy="36" r="17" fill="#FFFFFF" stroke="#A855F7" stroke-width="2.5"/>
    <path d="M17 28 C12 22 18 16 24 22" fill="#F472B6" stroke="#DB2777" stroke-width="2"/>
    <path d="M47 28 C52 22 46 16 40 22" fill="#38BDF8" stroke="#0284C7" stroke-width="2"/>
    <circle cx="26" cy="35" r="2.5" fill="#4C1D95"/><circle cx="38" cy="35" r="2.5" fill="#4C1D95"/>
    <path d="M29 42 Q32 45 35 42" fill="none" stroke="#DB2777" stroke-width="2.2" stroke-linecap="round"/>`,
  // 新增一次性物品 (共10种)
  pocketMoney: `
    <path d="M22 16 L42 16 L47 48 C47 53 17 53 17 48 Z" fill="#FDE68A" stroke="#B45309" stroke-width="2.4"/>
    <path d="M20 20 Q32 25 44 20" fill="none" stroke="#DC2626" stroke-width="3"/>
    <text x="32" y="42" text-anchor="middle" font-size="16" font-weight="900" fill="#B45309">¥</text>`,
  receipt: `
    <path d="M16 10 H48 V54 L42 49 L36 54 L30 49 L24 54 L16 49 Z" fill="#FFFFFF" stroke="#64748B" stroke-width="2.4" stroke-linejoin="round"/>
    <line x1="22" y1="20" x2="42" y2="20" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="22" y1="29" x2="38" y2="29" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="22" y1="38" x2="40" y2="38" stroke="#F59E0B" stroke-width="2.8" stroke-linecap="round"/>`,
  scratchCard: `
    <rect x="10" y="16" width="44" height="32" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="2.5"/>
    <rect x="16" y="23" width="32" height="18" rx="4" fill="#CBD5E1" stroke="#64748B" stroke-width="1.8"/>
    <polygon points="32,25 34.5,30 40,30.5 36,34 37,39.5 32,36.8 27,39.5 28,34 24,30.5 29.5,30" fill="#F59E0B"/>`,
  mysteryBox: `
    <rect x="12" y="18" width="40" height="34" rx="6" fill="#D9A066" stroke="#854D0E" stroke-width="2.5"/>
    <rect x="27" y="18" width="10" height="12" fill="#FEF08A" stroke="#CA8A04" stroke-width="1.6"/>
    <text x="32" y="45" text-anchor="middle" font-size="18" font-weight="900" fill="#78350F">?</text>`,
  bobaCoupon: `
    <rect x="10" y="18" width="44" height="28" rx="6" fill="#FFE4E6" stroke="#E11D48" stroke-width="2.4"/>
    <circle cx="24" cy="32" r="7" fill="#FDE68A" stroke="#B45309" stroke-width="1.8"/>
    <text x="41" y="36" text-anchor="middle" font-size="12" font-weight="900" fill="#E11D48">免单</text>`,
  redPacket: `
    <rect x="15" y="10" width="34" height="44" rx="6" fill="#EF4444" stroke="#B91C1C" stroke-width="2.5"/>
    <path d="M15 22 Q32 33 49 22" fill="none" stroke="#FBBF24" stroke-width="2.8"/>
    <circle cx="32" cy="28" r="7" fill="#FBBF24" stroke="#B45309" stroke-width="2"/>`,
  blindVoucher: `
    <path d="M10 20 H54 V27 A5 5 0 0 0 54 37 V44 H10 V37 A5 5 0 0 0 10 27 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="2.4" stroke-linejoin="round"/>
    <text x="34" y="36" text-anchor="middle" font-size="12" font-weight="900" fill="#B45309">+1抽</text>`,
  goldBarBox: `
    <polygon points="14,42 22,22 42,22 50,42" fill="#FBBF24" stroke="#B45309" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="22,22 42,22 39,30 25,30" fill="#FEF08A"/>
    <line x1="18" y1="42" x2="46" y2="42" stroke="#92400E" stroke-width="3"/>`,
  demolition: `
    <rect x="14" y="12" width="36" height="40" rx="5" fill="#FFFBEB" stroke="#B45309" stroke-width="2.5"/>
    <circle cx="32" cy="32" r="12" fill="#EF4444" stroke="#991B1B" stroke-width="2"/>
    <text x="32" y="37" text-anchor="middle" font-size="14" font-weight="900" fill="#FFF">拆</text>`,
  mysteryCheck: `
    <rect x="8" y="18" width="48" height="28" rx="5" fill="#ECFDF5" stroke="#059669" stroke-width="2.4"/>
    <line x1="15" y1="28" x2="33" y2="28" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="15" y1="36" x2="27" y2="36" stroke="#6EE7B7" stroke-width="2.5" stroke-linecap="round"/>
    <text x="44" y="36" text-anchor="middle" font-size="14" font-weight="900" fill="#047857">$</text>`,

  // === 12 款常规摆件矢量图标 ===
  coinBox: `
    <rect x="12" y="22" width="40" height="28" rx="6" fill="#FDBA74" stroke="#C2410C" stroke-width="2.5"/>
    <circle cx="32" cy="18" r="7" fill="#FBBF24" stroke="#B45309" stroke-width="2"/>`,
  luckyDice: `
    <rect x="14" y="14" width="36" height="36" rx="9" fill="#FFFDF7" stroke="#475569" stroke-width="2.5"/>
    <circle cx="24" cy="24" r="3.2" fill="#EF4444"/><circle cx="40" cy="40" r="3.2" fill="#EF4444"/>
    <circle cx="32" cy="32" r="3.2" fill="#334155"/>`,
  powerBank: `
    <rect x="18" y="12" width="28" height="42" rx="7" fill="#6EE7B7" stroke="#047857" stroke-width="2.5"/>
    <polygon points="34,21 26,34 32,34 30,45 38,32 32,32" fill="#FDE047" stroke="#B45309" stroke-width="1.6"/>`,
  windChime: `
    <path d="M18 32 C18 16 46 16 46 32 Z" fill="#BAE6FD" stroke="#0284C7" stroke-width="2.5"/>
    <rect x="27" y="41" width="10" height="14" rx="2" fill="#FB7185" stroke="#BE123C" stroke-width="2"/>`,
  vipCard: `
    <rect x="10" y="18" width="44" height="28" rx="6" fill="#F472B6" stroke="#BE185D" stroke-width="2.5"/>
    <rect x="16" y="25" width="11" height="8" rx="2" fill="#FDE047"/>`,
  careOil: `
    <rect x="26" y="10" width="12" height="9" rx="2" fill="#475569"/>
    <path d="M22 25 C22 19 42 19 42 25 L46 47 C46 52 18 52 18 47 Z" fill="#FBBF24" stroke="#B45309" stroke-width="2.4"/>`,
  feverCrown: `
    <polygon points="12,46 12,22 24,32 32,16 40,32 52,22 52,46" fill="#FBBF24" stroke="#B45309" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="32" cy="36" r="4.5" fill="#EF4444"/>`,
  clockwork: `
    <circle cx="32" cy="32" r="14" fill="#F59E0B" stroke="#92400E" stroke-width="2.5"/>
    <circle cx="32" cy="32" r="6" fill="#FEF3C7" stroke="#92400E" stroke-width="2"/>`,
  goldScale: `
    <line x1="32" y1="14" x2="32" y2="50" stroke="#B45309" stroke-width="3.2" stroke-linecap="round"/>
    <line x1="14" y1="22" x2="50" y2="22" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>
    <path d="M10 35 Q18 43 26 35 Z" fill="#FBBF24" stroke="#B45309" stroke-width="2"/>
    <path d="M38 35 Q46 43 54 35 Z" fill="#FBBF24" stroke="#B45309" stroke-width="2"/>`,
  coreEngine: `
    <circle cx="32" cy="32" r="19" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2.6"/>
    <polygon points="32,16 36,27 48,28 39,35 42,46 32,40 22,46 25,35 16,28 28,27" fill="#FBBF24" stroke="#D97706" stroke-width="2"/>`,
  starCharm: `
    <polygon points="32,10 38,24 53,26 42,36 45,51 32,44 19,51 22,36 11,26 26,24" fill="#A78BFA" stroke="#6D28D9" stroke-width="2.4" stroke-linejoin="round"/>`,
  magnetCharm: `
    <path d="M18 18 V36 A14 14 0 0 0 46 36 V18 H38 V36 A6 6 0 0 1 26 36 V18 Z" fill="#EF4444" stroke="#991B1B" stroke-width="2.4"/>
    <rect x="18" y="16" width="8" height="7" fill="#E2E8F0"/><rect x="38" y="16" width="8" height="7" fill="#E2E8F0"/>`,

  // === 8 款商店专属摆件矢量图标 ===
  stampedCoin: `
    <circle cx="32" cy="32" r="20" fill="#FDE047" stroke="#B45309" stroke-width="2.8"/>
    <circle cx="32" cy="32" r="14" fill="none" stroke="#D97706" stroke-width="2" stroke-dasharray="3 2"/>
    <polygon points="32,21 35,28 42,29 37,34 38,41 32,37 26,41 27,34 22,29 29,28" fill="#10B981" stroke="#047857" stroke-width="1.5"/>`,
  passbook: `
    <rect x="12" y="16" width="40" height="32" rx="5" fill="#A7F3D0" stroke="#047857" stroke-width="2.4"/>
    <rect x="12" y="23" width="40" height="6" fill="#059669"/>
    <line x1="18" y1="37" x2="36" y2="37" stroke="#047857" stroke-width="2.5" stroke-linecap="round"/>`,
  shopDiscount: `
    <path d="M14 22 L34 12 L52 30 L32 50 L14 32 Z" fill="#34D399" stroke="#047857" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="25" cy="25" r="3" fill="#FFF"/>
    <text x="35" y="38" text-anchor="middle" font-size="11" font-weight="900" fill="#FFF">%</text>`,
  spareBattery: `
    <rect x="20" y="14" width="24" height="38" rx="5" fill="#D1FAE5" stroke="#059669" stroke-width="2.4"/>
    <rect x="27" y="9" width="10" height="5" rx="1.5" fill="#059669"/>
    <rect x="25" y="22" width="14" height="24" rx="2" fill="#34D399"/>`,
  coinPouch: `
    <path d="M22 18 L42 18 L48 44 C48 52 16 52 16 44 Z" fill="#6EE7B7" stroke="#047857" stroke-width="2.4"/>
    <circle cx="32" cy="36" r="7" fill="#FBBF24" stroke="#B45309" stroke-width="1.8"/>`,
  miniCalc: `
    <rect x="16" y="12" width="32" height="40" rx="6" fill="#E2E8F0" stroke="#475569" stroke-width="2.4"/>
    <rect x="21" y="17" width="22" height="10" rx="2" fill="#A7F3D0" stroke="#059669" stroke-width="1.6"/>
    <circle cx="24" cy="35" r="2.5" fill="#64748B"/><circle cx="32" cy="35" r="2.5" fill="#64748B"/><circle cx="40" cy="35" r="2.5" fill="#10B981"/>
    <circle cx="24" cy="43" r="2.5" fill="#64748B"/><circle cx="32" cy="43" r="2.5" fill="#64748B"/><circle cx="40" cy="43" r="2.5" fill="#10B981"/>`,
  miniBell: `
    <path d="M20 40 C20 22 44 22 44 40 L48 44 H16 Z" fill="#FDE047" stroke="#B45309" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="32" cy="47" r="4" fill="#10B981" stroke="#047857" stroke-width="1.8"/>`,
  recycleCoupon: `
    <rect x="10" y="18" width="44" height="28" rx="6" fill="#D1FAE5" stroke="#059669" stroke-width="2.4"/>
    <text x="32" y="36" text-anchor="middle" font-size="12" font-weight="900" fill="#047857">回收+</text>`,

  // === 新增 10 款常规物品矢量图标 ===
  dog: `
    <path d="M16 26 L13 11 L26 19 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M48 26 L51 11 L38 19 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2.4" stroke-linejoin="round"/>
    <ellipse cx="32" cy="36" rx="21" ry="18" fill="#FCD34D" stroke="#B45309" stroke-width="2.5"/>
    <ellipse cx="32" cy="42" rx="13" ry="10" fill="#FFFBEB"/>
    <circle cx="24" cy="33" r="2.8" fill="#451A03"/><circle cx="40" cy="33" r="2.8" fill="#451A03"/>
    <ellipse cx="32" cy="39" rx="3.5" ry="2.5" fill="#451A03"/>
    <path d="M28 44 Q32 47 36 44" fill="none" stroke="#451A03" stroke-width="2" stroke-linecap="round"/>`,
  bone: `
    <path d="M18 27 H46 V37 H18 Z" fill="#FFFBEB" stroke="#B45309" stroke-width="2.4"/>
    <circle cx="16" cy="25" r="6" fill="#FFFBEB" stroke="#B45309" stroke-width="2.4"/>
    <circle cx="16" cy="39" r="6" fill="#FFFBEB" stroke="#B45309" stroke-width="2.4"/>
    <circle cx="48" cy="25" r="6" fill="#FFFBEB" stroke="#B45309" stroke-width="2.4"/>
    <circle cx="48" cy="39" r="6" fill="#FFFBEB" stroke="#B45309" stroke-width="2.4"/>
    <rect x="17" y="28.5" width="30" height="7" fill="#FFFBEB"/>`,
  barista: `
    <circle cx="32" cy="28" r="14" fill="#FED7AA" stroke="#78350F" stroke-width="2.3"/>
    <path d="M18 22 C18 13 46 13 46 22 Z" fill="#78350F"/>
    <path d="M16 54 C17 42 47 42 48 54 Z" fill="#15803D" stroke="#14532D" stroke-width="2.3"/>
    <circle cx="26" cy="28" r="2.2" fill="#451A03"/><circle cx="38" cy="28" r="2.2" fill="#451A03"/>
    <path d="M29 34 Q32 37 35 34" fill="none" stroke="#451A03" stroke-width="2" stroke-linecap="round"/>`,
  donut: `
    <circle cx="32" cy="32" r="20" fill="#FDBA74" stroke="#C2410C" stroke-width="2.5"/>
    <path d="M14 28 C18 14 46 14 50 28 C46 34 40 28 36 33 C32 37 26 30 22 33 C18 35 15 31 14 28 Z" fill="#F472B6"/>
    <circle cx="32" cy="32" r="7.5" fill="#FFFDF7" stroke="#C2410C" stroke-width="2.3"/>
    <circle cx="24" cy="21" r="1.8" fill="#FEF08A"/><circle cx="39" cy="20" r="1.8" fill="#38BDF8"/><circle cx="32" cy="17" r="1.8" fill="#FFFFFF"/>`,
  oven: `
    <rect x="10" y="16" width="44" height="36" rx="7" fill="#F8FAFC" stroke="#475569" stroke-width="2.5"/>
    <rect x="16" y="25" width="24" height="20" rx="4" fill="#FED7AA" stroke="#EA580C" stroke-width="2.2"/>
    <circle cx="46" cy="28" r="3" fill="#EF4444"/><circle cx="46" cy="38" r="3" fill="#F59E0B"/>
    <path d="M22 38 Q28 31 34 38" fill="none" stroke="#EA580C" stroke-width="2.4" stroke-linecap="round"/>`,
  goldPick: `
    <line x1="16" y1="48" x2="42" y2="22" stroke="#92400E" stroke-width="5" stroke-linecap="round"/>
    <path d="M22 14 C36 12 48 22 50 38 L42 32 C40 24 34 20 26 21 Z" fill="#FACC15" stroke="#B45309" stroke-width="2.4" stroke-linejoin="round"/>`,
  bee: `
    <ellipse cx="26" cy="20" rx="7" ry="5" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2"/>
    <ellipse cx="38" cy="20" rx="7" ry="5" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2"/>
    <ellipse cx="32" cy="36" rx="18" ry="13" fill="#FACC15" stroke="#854D0E" stroke-width="2.5"/>
    <line x1="27" y1="24" x2="27" y2="48" stroke="#451A03" stroke-width="4"/>
    <line x1="36" y1="24" x2="36" y2="48" stroke="#451A03" stroke-width="4"/>
    <circle cx="20" cy="34" r="2.3" fill="#451A03"/>`,
  flower: `
    <circle cx="32" cy="14" r="7" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/>
    <circle cx="46" cy="22" r="7" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/>
    <circle cx="46" cy="38" r="7" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/>
    <circle cx="32" cy="46" r="7" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/>
    <circle cx="18" cy="38" r="7" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/>
    <circle cx="18" cy="22" r="7" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/>
    <circle cx="32" cy="30" r="11" fill="#92400E" stroke="#78350F" stroke-width="2.3"/>
    <circle cx="29" cy="29" r="1.8" fill="#FEF08A"/><circle cx="35" cy="29" r="1.8" fill="#FEF08A"/>`,
  capsule: `
    <circle cx="32" cy="32" r="20" fill="#FFFFFF" stroke="#6D28D9" stroke-width="2.5"/>
    <path d="M12 32 A20 20 0 0 1 52 32 Z" fill="#A78BFA" stroke="#6D28D9" stroke-width="2.5"/>
    <circle cx="32" cy="32" r="6" fill="#FEF08A" stroke="#6D28D9" stroke-width="2.4"/>`,
  phoenix: `
    <path d="M10 30 C16 14 26 20 32 10 C38 20 48 14 54 30 C48 40 42 46 32 54 C22 46 16 40 10 30 Z" fill="#FB923C" stroke="#C2410C" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M22 30 C26 22 38 22 42 30 C38 38 35 42 32 46 C29 42 26 38 22 30 Z" fill="#FDE047"/>
    <circle cx="28" cy="28" r="2.2" fill="#7C2D12"/><circle cx="36" cy="28" r="2.2" fill="#7C2D12"/>`,

  // === 新增 10 款一次性联动道具矢量图标 ===
  catnip: `
    <path d="M32 52 C32 38 22 24 14 18 C26 16 34 22 34 34" fill="#4ADE80" stroke="#15803D" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M32 52 C32 36 42 22 50 16 C38 14 30 22 30 34" fill="#22C55E" stroke="#15803D" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="32" cy="14" r="4" fill="#F472B6"/>`,
  energyDrink: `
    <rect x="20" y="12" width="24" height="42" rx="6" fill="#38BDF8" stroke="#0369A1" stroke-width="2.5"/>
    <rect x="24" y="9" width="16" height="4" rx="2" fill="#E2E8F0" stroke="#475569" stroke-width="1.6"/>
    <polygon points="34,20 26,34 32,34 30,46 39,31 33,31" fill="#FDE047" stroke="#B45309" stroke-width="1.5"/>`,
  repairKit: `
    <path d="M22 14 H42 L46 48 C46 52 18 52 18 48 Z" fill="#FBBF24" stroke="#B45309" stroke-width="2.4"/>
    <rect x="27" y="8" width="10" height="7" rx="2" fill="#EF4444" stroke="#991B1B" stroke-width="1.8"/>
    <text x="32" y="38" text-anchor="middle" font-size="11" font-weight="900" fill="#78350F">修复</text>`,
  fertilizer: `
    <rect x="16" y="16" width="32" height="36" rx="6" fill="#86EFAC" stroke="#15803D" stroke-width="2.5"/>
    <path d="M32 24 C37 24 39 30 32 35 C25 30 27 24 32 24 Z" fill="#16A34A"/>
    <line x1="32" y1="35" x2="32" y2="44" stroke="#15803D" stroke-width="2.5" stroke-linecap="round"/>`,
  vipPass: `
    <rect x="8" y="18" width="48" height="28" rx="6" fill="#FBCFE8" stroke="#DB2777" stroke-width="2.5"/>
    <text x="32" y="36" text-anchor="middle" font-size="12" font-weight="900" fill="#BE185D">甜品券</text>`,
  dynamite: `
    <rect x="18" y="20" width="12" height="32" rx="3" fill="#EF4444" stroke="#991B1B" stroke-width="2.2"/>
    <rect x="34" y="20" width="12" height="32" rx="3" fill="#EF4444" stroke="#991B1B" stroke-width="2.2"/>
    <path d="M32 20 Q34 10 42 10" fill="none" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="44" cy="10" r="4" fill="#FDE047"/>`,
  goldenFeed: `
    <path d="M14 34 H50 L45 50 H19 Z" fill="#F59E0B" stroke="#92400E" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="24" cy="28" r="5" fill="#FDE047" stroke="#CA8A04" stroke-width="1.8"/>
    <circle cx="34" cy="26" r="5" fill="#FDE047" stroke="#CA8A04" stroke-width="1.8"/>
    <circle cx="42" cy="29" r="4.5" fill="#FDE047" stroke="#CA8A04" stroke-width="1.8"/>`,
  feverHorn: `
    <polygon points="14,36 46,16 46,48 14,36" fill="#F97316" stroke="#C2410C" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="12" y="32" width="8" height="10" rx="2" fill="#FDE047" stroke="#B45309" stroke-width="2"/>
    <line x1="50" y1="22" x2="56" y2="18" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="51" y1="32" x2="57" y2="32" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>`,
  copyMirror: `
    <ellipse cx="32" cy="28" rx="16" ry="19" fill="#E0F2FE" stroke="#7C3AED" stroke-width="3"/>
    <line x1="25" y1="20" x2="35" y2="32" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
    <rect x="28" y="47" width="8" height="10" rx="3" fill="#A855F7" stroke="#6D28D9" stroke-width="2"/>`,
  jackpotTicket: `
    <rect x="8" y="16" width="48" height="32" rx="7" fill="#FEF08A" stroke="#D97706" stroke-width="2.6"/>
    <polygon points="32,21 35,28 43,29 37,34 39,42 32,38 25,42 27,34 21,29 29,28" fill="#F59E0B" stroke="#B45309" stroke-width="1.6"/>`,

  // === 新增 8 款常规摆件矢量图标 ===
  piggyCharm: `
    <circle cx="32" cy="34" r="18" fill="#FBCFE8" stroke="#DB2777" stroke-width="2.5"/>
    <ellipse cx="32" cy="37" rx="7" ry="5" fill="#F472B6" stroke="#DB2777" stroke-width="2"/>
    <circle cx="29.5" cy="37" r="1.4" fill="#831843"/><circle cx="34.5" cy="37" r="1.4" fill="#831843"/>
    <circle cx="24" cy="29" r="2.2" fill="#831843"/><circle cx="40" cy="29" r="2.2" fill="#831843"/>`,
  goldenClover: `
    <circle cx="24" cy="24" r="9.5" fill="#FDE047" stroke="#B45309" stroke-width="2.2"/>
    <circle cx="40" cy="24" r="9.5" fill="#FACC15" stroke="#B45309" stroke-width="2.2"/>
    <circle cx="24" cy="38" r="9.5" fill="#FACC15" stroke="#B45309" stroke-width="2.2"/>
    <circle cx="40" cy="38" r="9.5" fill="#FDE047" stroke="#B45309" stroke-width="2.2"/>
    <path d="M32 36 C32 46 36 52 40 56" fill="none" stroke="#B45309" stroke-width="3" stroke-linecap="round"/>`,
  coffeeThermos: `
    <rect x="21" y="16" width="22" height="38" rx="6" fill="#F97316" stroke="#9A3412" stroke-width="2.4"/>
    <rect x="24" y="10" width="16" height="7" rx="3" fill="#475569" stroke="#1E293B" stroke-width="2"/>
    <rect x="21" y="28" width="22" height="10" fill="#FED7AA"/>`,
  catBell: `
    <circle cx="32" cy="34" r="17" fill="#FBBF24" stroke="#B45309" stroke-width="2.5"/>
    <rect x="24" y="12" width="16" height="6" rx="3" fill="#EF4444" stroke="#991B1B" stroke-width="2"/>
    <circle cx="32" cy="39" r="3.5" fill="#78350F"/><line x1="20" y1="39" x2="44" y2="39" stroke="#B45309" stroke-width="2"/>`,
  minerLamp: `
    <path d="M16 38 C16 20 48 20 48 38 Z" fill="#FACC15" stroke="#B45309" stroke-width="2.5"/>
    <circle cx="32" cy="30" r="7" fill="#FEF08A" stroke="#D97706" stroke-width="2.2"/>
    <rect x="14" y="38" width="36" height="6" rx="3" fill="#EAB308" stroke="#B45309" stroke-width="2"/>`,
  sweetApron: `
    <path d="M22 14 H42 L48 52 H16 Z" fill="#FDA4AF" stroke="#BE123C" stroke-width="2.4" stroke-linejoin="round"/>
    <rect x="24" y="32" width="16" height="12" rx="3" fill="#FFF1F2" stroke="#BE123C" stroke-width="2"/>`,
  timeHourglass: `
    <rect x="16" y="10" width="32" height="5" rx="2" fill="#B45309"/>
    <rect x="16" y="49" width="32" height="5" rx="2" fill="#B45309"/>
    <polygon points="20,15 44,15 32,32" fill="#BAE6FD" stroke="#0284C7" stroke-width="2.2"/>
    <polygon points="32,32 44,49 20,49" fill="#FDE047" stroke="#D97706" stroke-width="2.2"/>`,
  rainbowPrism: `
    <polygon points="32,10 54,50 10,50" fill="#E0E7FF" stroke="#6366F1" stroke-width="2.6" stroke-linejoin="round"/>
    <line x1="36" y1="28" x2="56" y2="24" stroke="#EF4444" stroke-width="2.6" stroke-linecap="round"/>
    <line x1="38" y1="33" x2="58" y2="33" stroke="#F59E0B" stroke-width="2.6" stroke-linecap="round"/>
    <line x1="40" y1="38" x2="56" y2="42" stroke="#38BDF8" stroke-width="2.6" stroke-linecap="round"/>`,

  // === 商店专属神秘三件套 + 商店特殊遗物：神秘装置 ===
  geoSquare: `
    <rect x="14" y="14" width="36" height="36" rx="6" fill="#A7F3D0" stroke="#047857" stroke-width="3"/>
    <rect x="22" y="22" width="20" height="20" rx="3" fill="none" stroke="#10B981" stroke-width="2.2" stroke-dasharray="3 2"/>
    <circle cx="32" cy="32" r="4" fill="#059669"/>`,
  geoCircle: `
    <circle cx="32" cy="32" r="20" fill="#A7F3D0" stroke="#047857" stroke-width="3"/>
    <circle cx="32" cy="32" r="12" fill="none" stroke="#10B981" stroke-width="2.2" stroke-dasharray="4 2"/>
    <circle cx="32" cy="32" r="4.5" fill="#059669"/>`,
  geoTriangle: `
    <polygon points="32,11 53,49 11,49" fill="#A7F3D0" stroke="#047857" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="32,23 43,43 21,43" fill="none" stroke="#10B981" stroke-width="2"/>
    <circle cx="32" cy="36" r="3.5" fill="#059669"/>`,
  mysteryDevice: `
    <circle cx="32" cy="32" r="22" fill="#6EE7B7" stroke="#047857" stroke-width="2.8"/>
    <rect x="20" y="20" width="24" height="24" rx="4" fill="#ECFDF5" stroke="#059669" stroke-width="2.2"/>
    <polygon points="32,18 44,40 20,40" fill="#34D399" stroke="#047857" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="32" cy="33" r="4.5" fill="#FEF08A" stroke="#047857" stroke-width="1.8"/>`
};
