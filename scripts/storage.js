// Storage module for finance app — uses localStorage
const DATA_KEY = 'finance:data:v1';
const SETTINGS_KEY = 'finance:settings:v1';

export function defaultSettings(){
  return {
    cap: 0,
    // Use USD as base, with CAD and RWF as additional rates
    currencies: { base: 'USD', r1: 'CAD', r2: 'RWF', rate1: 1.35, rate2: 1440 },
    categories: ['Food','Books','Transport','Entertainment','Fees','Other']
  };
}

export const storage = {
  load() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('storage.load parse error', e);
      return [];
    }
  },

  save(data) {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data || []));
    } catch (e) {
      console.warn('storage.save error', e);
    }
  },

  reset() {
    try {
      localStorage.removeItem(DATA_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    } catch (e) {
      console.warn('storage.reset error', e);
    }
  },

  loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return defaultSettings();
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : defaultSettings();
    } catch (e) {
      console.warn('storage.loadSettings parse error', e);
      return defaultSettings();
    }
  },

  saveSettings(s) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s || defaultSettings()));
    } catch (e) {
      console.warn('storage.saveSettings error', e);
    }
  }
};
