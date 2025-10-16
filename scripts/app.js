import { initUI } from './ui.js';
import { state } from './state.js';

// Apply selected theme by toggling 'dark' class on <html>
function applyTheme(t){
  if (t === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  const btn = document.querySelector('#theme-toggle'); if (btn) btn.setAttribute('aria-pressed', String(t==='dark'));
}

window.addEventListener('DOMContentLoaded', ()=>{
  // preload settings into Settings form
  document.querySelector('#cap').value = state.settings.cap;
  document.querySelector('#baseCode').value = state.settings.currencies.base;
  document.querySelector('#r1').value = state.settings.currencies.r1;
  document.querySelector('#r2').value = state.settings.currencies.r2;
  document.querySelector('#rate1').value = state.settings.currencies.rate1;
  document.querySelector('#rate2').value = state.settings.currencies.rate2;

  // Theme: initialize from localStorage, or fall back to system preference if not set.
  const saved = localStorage.getItem('theme');
  let initial;
  if (saved === 'light' || saved === 'dark') {
    initial = saved;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    initial = 'dark';
  } else {
    initial = 'light';
  }

  applyTheme(initial);

  // If user hasn't explicitly chosen a theme, follow system changes.
  if (!saved && window.matchMedia){
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = e => applyTheme(e.matches ? 'dark' : 'light');
    try { mq.addEventListener('change', listener); } catch { mq.addListener(listener); }
  }

  // Wire up manual toggle: this always takes precedence and saves preference
  const themeBtn = document.querySelector('#theme-toggle');
  if (themeBtn){
    themeBtn.addEventListener('click', ()=>{
      const cur = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next); applyTheme(next);
    });
  }

  initUI();
});
