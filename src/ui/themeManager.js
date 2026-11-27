import { THEMES } from '../config/themes.js';
import { PlatformAdapter } from '../platform/PlatformAdapter.js';

const THEME_STORAGE_KEY = 'lucky_boxs_theme';
let currentTheme = THEMES[0];
let onThemeApplied = null;

export function setThemeChangeListener(cb) {
  onThemeApplied = cb;
}

export function getCurrentTheme() {
  return currentTheme;
}

export function applyTheme(themeId) {
  const found = THEMES.find(t => t.id === themeId) || THEMES[0];
  currentTheme = found;
  const root = document.documentElement;
  Object.entries(found.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  PlatformAdapter.setStorage(THEME_STORAGE_KEY, found.id);
  if (onThemeApplied) onThemeApplied(found);
}

export function loadSavedTheme() {
  const saved = PlatformAdapter.getStorage(THEME_STORAGE_KEY, 'cream') || 'cream';
  applyTheme(saved);
}
