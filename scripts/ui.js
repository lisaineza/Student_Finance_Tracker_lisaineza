import { state, upsert, remove, setSettings, resetAll } from './state.js';
import { sanitizeDescription, validateRecord, highlight } from './validators.js';
import { storage } from './storage.js';
import { applySearch } from './search.js';

// Short selector helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

export function initUI(){
  // routing: wire up nav links with data-route
  $$('[data-route]').forEach(a => a.addEventListener('click', (e)=>{
    e.preventDefault(); routeTo(a.getAttribute('href'));
  }));
  routeTo(location.hash || '#dashboard');
  window.addEventListener('hashchange', ()=> routeTo(location.hash));

  // set current year in footer
  $('#year').textContent = new Date().getFullYear();

  // populate category datalist
  renderCategories();

  // form handlers
  $('#record-form').addEventListener('submit', onSaveRecord);
  $('#record-form').addEventListener('reset', ()=> setFormStatus('Form cleared'));

  // search form
  $('#search-form').addEventListener('submit', e=>{ e.preventDefault(); doSearch(); });
  $('#clear-search').addEventListener('click', ()=>{ $('#pattern').value=''; doSearch(); $('#pattern').focus();});

  // sorting
  $$('.sort').forEach(btn => btn.addEventListener('click', ()=>{
    const key = btn.dataset.sort; toggleSort(key); renderTable();
  }));

  // import/export
  $('#export-json').addEventListener('click', exportJSON);
  $('#import-file').addEventListener('change', importJSON);

  // settings
  $('#settings-form').addEventListener('submit', onSaveSettings);
  $('#reset-data').addEventListener('click', onResetAll);

  // seed loader
  $('#load-seed').addEventListener('click', loadSeed);

  // initial render
  renderTable();
  renderStats();
}

// Navigate to a route (section id) and toggle visibility
function routeTo(hash){
  const id = (hash||'').replace('#','') || 'dashboard';
  $$('[data-route-panel]').forEach(sec=>{
    sec.hidden = sec.id !== id;
    sec.classList.toggle('active', sec.id===id && !sec.hidden);
  });
  $('#main').focus();
}

function nextId(){ return 'rec_' + Math.random().toString(36).slice(2,8); }

// Load seed.json and replace current data
async function loadSeed(){
  try{
    const res = await fetch('seed.json');
    const arr = await res.json();
    if (Array.isArray(arr)){
      state.data = arr;
      storage.save(arr);
      renderTable(); renderStats();
      announce('#settings-status','Loaded seed.json');
    }
  }catch(err){ announce('#settings-status','Failed to load seed'); }
}

// Handle saving a new or edited record
function onSaveRecord(e){
  e.preventDefault();
  const id = $('#id').value || nextId();
  const now = new Date().toISOString();
  const record = {
    id,
    description: sanitizeDescription($('#description').value),
    amount: Number($('#amount').value),
    category: $('#category').value.trim(),
    date: $('#date').value,
    createdAt: $('#id').value ? undefined : now,
    updatedAt: now
  };
  const errs = validateRecord(record);
  clearErrors();
  if (Object.keys(errs).length){
    for (const k in errs){ $(`[data-err-for="${k}"]`).textContent = errs[k]; }
    setFormStatus('Fix errors to save');
    return;
  }
  if (!record.createdAt){
    const existing = state.data.find(r=>r.id===id);
    record.createdAt = existing?.createdAt || now;
  }
  upsert(record);
  setFormStatus('Saved');
  renderTable();
  renderStats();
  e.target.reset(); $('#id').value='';
}

function setFormStatus(msg){ announce('#form-status', msg); }
function clearErrors(){ $$('.error').forEach(el=> el.textContent=''); }

// Render category datalist and settings text area
function renderCategories(){
  const dl = $('#cats');
  dl.innerHTML = '';
  state.settings.categories.forEach(c=>{
    const o = document.createElement('option'); o.value=c; dl.appendChild(o);
  });
  $('#catsText').value = state.settings.categories.join(', ');
  $('[data-stat="base-code"]').textContent = state.settings.currencies.base;
}

function rowToHTML(r, re){
  const esc = s => s.replace(/[&<>\"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const desc = re ? highlight(esc(r.description), re) : esc(r.description);
  const cat  = re ? highlight(esc(r.category), re) : esc(r.category);
  const date = re ? highlight(r.date, re) : r.date;
  const amt  = re ? highlight(String(r.amount.toFixed(2)), re) : r.amount.toFixed(2);
  return `<tr>
    <td>${date}</td>
    <td>${desc}</td>
    <td>${amt}</td>
    <td>${cat}</td>
    <td>
      <button class="action-btn" data-edit="${r.id}">Edit</button>
      <button class="action-btn danger" data-del="${r.id}">Delete</button>
    </td>
  </tr>`;
}

function cmp(a,b,key){
  if (key==='amount') return a.amount - b.amount;
  if (key==='date') return a.date.localeCompare(b.date);
  return a.description.localeCompare(b.description, undefined, {sensitivity:'base'});
}

function toggleSort(key){
  const cur = state.sort;
  if (cur.key === key) cur.dir = cur.dir==='asc'?'desc':'asc'; else {cur.key=key; cur.dir='asc';}
}

function renderTable(){
  let rows = [...state.data];
  rows.sort((a,b)=> cmp(a,b,state.sort.key) * (state.sort.dir==='asc'?1:-1));

  const pattern = $('#pattern')?.value || '';
  const flags = $('#casei')?.checked ? 'i' : '';
  const { rows: filtered, re, invalid } = applySearch(rows, pattern, flags);

  const tbody = $('[data-tbody]');
  tbody.innerHTML = filtered.map(r=> rowToHTML(r, re)).join('') || '<tr><td colspan="5">No records</td></tr>';

  tbody.querySelectorAll('[data-edit]').forEach(btn=> btn.addEventListener('click', ()=> editRow(btn.dataset.edit)));
  tbody.querySelectorAll('[data-del]').forEach(btn=> btn.addEventListener('click', ()=> delRow(btn.dataset.del)));

  const msg = invalid ? 'Invalid regex — showing all rows' : `${filtered.length} of ${rows.length} shown`;
  announce('#search-status', msg);
}

function editRow(id){
  const r = state.data.find(x=> x.id===id); if (!r) return;
  $('#id').value = r.id;
  $('#date').value = r.date;
  $('#description').value = r.description;
  $('#amount').value = r.amount;
  $('#category').value = r.category;
  location.hash = '#add';
  announce('#form-status', 'Editing record');
}

function delRow(id){
  const r = state.data.find(x=> x.id===id); if (!r) return;
  if (confirm(`Delete \n${r.date} • ${r.description} • ${r.amount.toFixed(2)}?`)){
    remove(id); renderTable(); renderStats(); announce('#search-status', 'Deleted');
  }
}

function doSearch(){ renderTable(); }

function sumAmounts(rows){ return rows.reduce((acc,r)=> acc + Number(r.amount||0), 0); }

function renderStats(){
  const count = state.data.length;
  const sum = sumAmounts(state.data);
  $('[data-stat="count"]').textContent = String(count);
  $('[data-stat="sum"]').textContent = sum.toFixed(2);
  $('[data-stat="cap"]').textContent = Number(state.settings.cap||0).toFixed(2);

  const map = new Map();
  state.data.forEach(r=> map.set(r.category, (map.get(r.category)||0)+r.amount));
  const top = [...map.entries()].sort((a,b)=> b[1]-a[1])[0]?.[0] || '—';
  $('[data-stat="topcat"]').textContent = top;

  const remaining = Number(state.settings.cap||0) - sum;
  $('[data-stat="remaining"]').textContent = remaining.toFixed(2);
  const card = $('#cap-card');
  if (remaining < 0){ card.setAttribute('aria-live','assertive'); card.style.border = '1px solid var(--danger)'; announce('#cap-card','Cap exceeded!'); }
  else { card.setAttribute('aria-live','polite'); card.style.border = ''; announce('#cap-card',`Remaining ${remaining.toFixed(2)} ${state.settings.currencies.base}`); }

  const today = new Date(); today.setHours(0,0,0,0);
  const days = Array.from({length:7}, (_,i)=>{
    const d = new Date(today); d.setDate(today.getDate() - (6-i));
    const key = d.toISOString().slice(0,10);
    const val = state.data.filter(r => r.date===key).reduce((a,b)=> a+b.amount, 0);
    return { key, val };
  });
  const max = Math.max(1, ...days.map(d=>d.val));
  const wrap = document.querySelector('[data-trend]');
  wrap.innerHTML = '';
  days.forEach(d=>{
    const bar = document.createElement('button');
    bar.className='bar';
    bar.style.height = `${(d.val/max)*100}%`;
    bar.title = `${d.key}: ${d.val.toFixed(2)} ${state.settings.currencies.base}`;
    bar.addEventListener('click', ()=>{
      $('#pattern').value = d.key; routeTo('#records'); renderTable(); $('#pattern').focus();
    });
    wrap.appendChild(bar);
  });
}

function exportJSON(){
  const blob = new Blob([JSON.stringify(state.data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'finance-data.json';
  a.click();
}

async function importJSON(e){
  const file = e.target.files?.[0]; if (!file) return;
  try{
    const text = await file.text();
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error('Root must be an array');
    const ok = arr.every(r=> r && r.id && r.description && typeof r.amount==='number' && r.category && r.date);
    if (!ok) throw new Error('Invalid structure');
    state.data = arr; storage.save(arr); renderTable(); renderStats(); announce('#search-status','Import successful');
  }catch(err){ announce('#search-status', 'Import failed: ' + err.message); }
  e.target.value='';
}

function onSaveSettings(e){
  e.preventDefault();
  const s = structuredClone(state.settings);
  s.cap = Number($('#cap').value || 0);
  s.currencies.base = $('#baseCode').value || s.currencies.base;
  s.currencies.r1 = $('#r1').value || s.currencies.r1;
  s.currencies.r2 = $('#r2').value || s.currencies.r2;
  s.currencies.rate1 = Number($('#rate1').value || s.currencies.rate1);
  s.currencies.rate2 = Number($('#rate2').value || s.currencies.rate2);
  s.categories = $('#catsText').value.split(',').map(x=> x.trim()).filter(Boolean);
  setSettings(s); renderCategories(); renderStats();
  announce('#settings-status','Settings saved');
}

function onResetAll(){
  if (confirm('Reset ALL data & settings?')){
    resetAll(); renderCategories(); renderTable(); renderStats(); announce('#settings-status','All data cleared');
  }
}

function announce(selector, msg){
  const el = typeof selector==='string' ? document.querySelector(selector) : selector; if (!el) return;
  el.textContent = msg;
}
