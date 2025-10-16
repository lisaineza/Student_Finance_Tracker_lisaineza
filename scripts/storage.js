:root{
  --bg:#0b0b0e; --panel:#141419; --text:#fafafa; --muted:#b8b8c3; --accent:#7c5cff; --danger:#ff5c7c;
  --focus: 3px solid #7c5cff; --radius: 14px;
}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0; font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:var(--text); background:var(--bg);}

.skip-link{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden}
.skip-link:focus{position:static;width:auto;height:auto;padding:.5rem 1rem;background:var(--accent);color:#000;border-radius:.5rem}

.site-header{display:flex;gap:1rem;align-items:center;justify-content:space-between;padding:1rem; background:#111; border-bottom:1px solid #222}
.site-header h1{font-size:1.1rem;margin:0}
.site-nav ul{list-style:none;display:flex;gap:.5rem;margin:0;padding:0;flex-wrap:wrap}
.site-nav a{display:inline-block;padding:.4rem .6rem;border-radius:.5rem;color:var(--text);text-decoration:none}
.site-nav a:focus{outline:var(--focus)}
.site-nav a:hover{background:#1b1b22}

main{padding:1rem; max-width:1100px; margin-inline:auto}
section{margin-block:1rem; background:var(--panel); padding:1rem; border-radius:var(--radius); box-shadow:0 2px 8px rgb(0 0 0 / .2)}

.cards{display:grid;grid-template-columns:1fr;gap:1rem}
.card{background:#1a1a21;border-radius:var(--radius);padding:1rem}

.trend{margin-top:1rem}
.bars{display:grid;grid-template-columns:repeat(7,1fr);gap:.5rem;align-items:end;height:140px;padding:.5rem;background:#101015;border-radius:var(--radius)}
.bars .bar{width:100%; border-radius:.4rem .4rem 0 0; background:var(--accent); transition:transform .3s ease}
.bars .bar:focus{outline:var(--focus)}
.trend-legend{display:flex;justify-content:space-between;font-size:.85rem;color:var(--muted);padding:.25rem .25rem 0}

.toolbar{display:flex;flex-direction:column;gap:.75rem}
.search{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.search input{padding:.5rem;border-radius:.5rem;border:1px solid #333;background:#0e0e13;color:var(--text)}
.search button{padding:.5rem .75rem;border-radius:.5rem;border:1px solid #333;background:#13131a;color:var(--text);cursor:pointer}
.checkbox{display:flex;align-items:center;gap:.35rem}

.table-wrap{overflow:auto;border:1px solid #222;border-radius:var(--radius)}
.records{width:100%;border-collapse:collapse}
.records th,.records td{padding:.6rem;border-bottom:1px solid #222;text-align:left}
.records th{position:sticky;top:0;background:#17171f;z-index:1}
.sort{margin-left:.25rem;font:inherit;border:1px solid #333;background:#101015;color:var(--text);border-radius:.3rem;cursor:pointer}
.action-btn{padding:.25rem .5rem;border-radius:.4rem;border:1px solid #333;background:#101015;color:var(--text);cursor:pointer}
.action-btn.danger{border-color:var(--danger);color:#fff;background:#2b0e16}

.field{margin-bottom:.75rem}
.field input, .field textarea{width:100%;padding:.6rem;border-radius:.5rem;border:1px solid #333;background:#0e0e13;color:var(--text)}
.field input:focus, .field textarea:focus{outline:var(--focus)}
.error{color:var(--danger);min-height:1.25rem;display:block}

.actions{display:flex;gap:.5rem;flex-wrap:wrap}
button.danger{background:#2b0e16;border-color:var(--danger)}

.note{color:var(--muted);font-size:.9rem}
.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.sr-status{margin-top:.5rem;min-height:1.25rem}

mark{background:#f7e06e;color:#000}

.site-footer{padding:1rem;color:var(--muted);text-align:center}

/* Focus visibility */
:focus-visible{outline:var(--focus);outline-offset:2px}

/* Animations */
.route{opacity:0; transform:translateY(6px); transition:opacity .25s ease, transform .25s ease}
.route[hidden]{display:none}
.route.active{opacity:1; transform:none}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce){
  *{transition:none!important; animation:none!important}
}

/* Responsive breakpoints */
@media (min-width:768px){
  .cards{grid-template-columns:repeat(2,1fr)}
  .toolbar{flex-direction:row;justify-content:space-between;align-items:center}
}
@media (min-width:1024px){
  .cards{grid-template-columns:repeat(4,1fr)}
}
