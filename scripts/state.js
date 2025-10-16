import { storage, defaultSettings } from './storage.js';

export const state = {
  data: storage.load(),
  settings: storage.loadSettings(),
  sort: { key:'date', dir:'desc' },
  search: { pattern:'', flags:'i' },
};

export function upsert(record){
  const idx = state.data.findIndex(r => r.id === record.id);
  if (idx >= 0) state.data[idx] = record; else state.data.push(record);
  storage.save(state.data);
}

export function remove(id){
  state.data = state.data.filter(r => r.id !== id);
  storage.save(state.data);
}

export function setSettings(s){ state.settings = s; storage.saveSettings(s); }
export function resetAll(){ state.data=[]; setSettings(defaultSettings()); storage.reset(); }
