// ============================================================
// components.js — Letra Caribe universal components
// ============================================================

// ── LegoCard CSS ───────────────────────────────────────────
(function injectLegoStyles() {
  if (document.getElementById('lego-styles')) return;
  const s = document.createElement('style');
  s.id = 'lego-styles';
  s.textContent = [
    '.lego-card{display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border:1px solid var(--border);border-radius:var(--r);background:var(--white);margin-bottom:8px;}.lego-card--clickable{cursor:pointer;transition:border-color 0.15s,box-shadow 0.15s;}.lego-card--clickable:hover{border-color:var(--coral);box-shadow:0 2px 8px rgba(0,0,0,0.08);}',
    '.lego-card--fixed{min-height:72px;}',
    '.lego-card--stack{flex-direction:column;align-items:stretch;gap:10px;}.lego-stack-top{display:flex;align-items:center;gap:12px;}.lego-stack-top .lego-main{flex:1;min-width:0;}.lego-corner{margin-left:auto;flex-shrink:0;}.lego-stack-bottom{display:flex;align-items:center;gap:8px;}.lego-card--stack .lego-actions{margin-left:auto;}',
    '.lego-l1{flex-shrink:0;display:flex;align-items:center;}',
    '.lego-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;}',
    '.lego-l2{font-weight:600;font-size:14px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.lego-l3{font-size:12px;color:var(--muted);}',
    '.lego-badges{display:flex;flex-wrap:wrap;gap:4px;}',
    '.lego-badge{font-size:11px;padding:2px 8px;border-radius:99px;background:var(--sand);color:var(--muted);font-weight:500;}.lego-badge--level{background:#E6F1FB;color:#185FA5;}.lego-badge--cat{background:#EEEDFE;color:#534AB7;}',
    '.lego-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:auto;}',
    '.lego-action{display:flex;align-items:center;}',
    '.lego-category{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--white);border:1px solid var(--border);border-radius:var(--r);gap:12px;}.lego-category__info{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;}.lego-category__name{font-size:14px;font-weight:600;color:var(--ink);}.lego-category__meta{display:flex;align-items:center;gap:8px;}.lego-category__count{font-size:12px;color:var(--muted);}.lego-category__actions{display:flex;gap:6px;flex-shrink:0;}'
  ].join('');
  document.head.appendChild(s);
})();

// ── LegoScore ──────────────────────────────────────────────
// Circulo de porcentaje con color segun rango
// LegoScore(85) → elemento DOM

function LegoScore(pct) {
  const color = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--yellow, #f59e0b)' : 'var(--red)';
  const el = document.createElement('div');
  el.className = 'lego-score';
  el.style.cssText = 'width:40px;height:40px;border-radius:50%;border:3px solid ' + color + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:' + color + ';flex-shrink:0';
  el.textContent = pct + '%';
  return el;
}

// ── LegoCard ───────────────────────────────────────────────
// Card universal de 10 slots. Slots vacios colapsan.
//
// Layout:
//   [ L1 ] [ L2 titulo          ] [ L8 ] [ L9 ] [ L10 ]
//          [ L3 subtitulo       ]
//          [ L4 ] [ L5 ] [ L6 ] [ L7 ]
//
// Uso:
//   LegoCard({ L1: iconoEl, L2: 'Titulo', L4: 'B1', L8: btnEl })

function LegoCard(slots) {
  slots = slots || {};

  function mkSlot(content, cls) {
    if (content === undefined || content === null || content === '') return null;
    const el = document.createElement('div');
    el.className = cls;
    if (content instanceof HTMLElement) el.appendChild(content);
    else el.textContent = content;
    return el;
  }

  function badgeRow() {
    const keys = ['L4', 'L5', 'L6', 'L7'];
    const active = keys.filter(function(k){ return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
    if (!active.length) return null;
    const row = document.createElement('div');
    row.className = 'lego-badges';
    active.forEach(function(k) { const b = mkSlot(slots[k], 'lego-badge'); if (b) row.appendChild(b); });
    return row;
  }

  function actionRow() {
    const keys = ['L8', 'L9', 'L10'];
    const active = keys.filter(function(k){ return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
    if (!active.length) return null;
    const row = document.createElement('div');
    row.className = 'lego-actions';
    active.forEach(function(k) { const a = mkSlot(slots[k], 'lego-action'); if (a) row.appendChild(a); });
    return row;
  }

  const stack = slots.layout === 'stack';
  const card = document.createElement('div');
  card.className = 'lego-card' + (slots.fixedHeight ? ' lego-card--fixed' : '') + (stack ? ' lego-card--stack' : '');

  if (stack) {
    const top = document.createElement('div');
    top.className = 'lego-stack-top';
    const l1 = mkSlot(slots.L1, 'lego-l1');
    if (l1) top.appendChild(l1);
    const main = document.createElement('div');
    main.className = 'lego-main';
    const l2 = mkSlot(slots.L2, 'lego-l2'); if (l2) main.appendChild(l2);
    const l3 = mkSlot(slots.L3, 'lego-l3'); if (l3) main.appendChild(l3);
    top.appendChild(main);
    const corner = mkSlot(slots.corner, 'lego-corner');
    if (corner) top.appendChild(corner);
    card.appendChild(top);
    const br = badgeRow();
    const ar = actionRow();
    if (br || ar) {
      const bottom = document.createElement('div');
      bottom.className = 'lego-stack-bottom';
      if (br) bottom.appendChild(br);
      if (ar) bottom.appendChild(ar);
      card.appendChild(bottom);
    }
  } else {
    const l1 = mkSlot(slots.L1, 'lego-l1');
    if (l1) card.appendChild(l1);
    const main = document.createElement('div');
    main.className = 'lego-main';
    const l2 = mkSlot(slots.L2, 'lego-l2'); if (l2) main.appendChild(l2);
    const l3 = mkSlot(slots.L3, 'lego-l3'); if (l3) main.appendChild(l3);
    const br = badgeRow(); if (br) main.appendChild(br);
    card.appendChild(main);
    const ar = actionRow(); if (ar) card.appendChild(ar);
  }

  if (slots.onclick) { card.classList.add('lego-card--clickable'); card.onclick = slots.onclick; }
  return card;
}
// -- LegoForm -----------------------------------------------
// Formulario universal de 15 slots. Slots vacios colapsan.
//
// Slots:
//   F1  - titulo    F2  - nivel    F3  - categoria
//   F4 F5 F6        - campos especificos del tipo
//   F7 F8 F9        - campos secundarios
//   F10 F11 F12     - slots reservados
//   F13 F14 F15     - acciones (guardar, previsualizar, cancelar)
//
// Uso:
//   LegoForm({ F1: campoTitulo, F2: campoNivel, F13: btnGuardar })

function LegoForm(slots) {
  slots = slots || {};

  function mkSlot(content, cls) {
    if (content === undefined || content === null || content === '') return null;
    const el = document.createElement('div');
    el.className = cls;
    if (content instanceof HTMLElement) el.appendChild(content);
    else el.textContent = content;
    return el;
  }

  const form = document.createElement('div');
  form.className = 'lego-form';

  // Header - F1 F2 F3
  const headerKeys = ['F1', 'F2', 'F3'];
  const activeHeader = headerKeys.filter(function(k) { return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
  if (activeHeader.length) {
    const row = document.createElement('div');
    row.className = 'lego-form-header';
    activeHeader.forEach(function(k) {
      const f = mkSlot(slots[k], 'lego-form-field lego-form-' + k.toLowerCase());
      if (f) row.appendChild(f);
    });
    form.appendChild(row);
  }

  // Body - F4 through F12
  const bodyKeys = ['F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
  const activeBody = bodyKeys.filter(function(k) { return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
  if (activeBody.length) {
    const row = document.createElement('div');
    row.className = 'lego-form-body';
    activeBody.forEach(function(k) {
      const f = mkSlot(slots[k], 'lego-form-field lego-form-' + k.toLowerCase());
      if (f) row.appendChild(f);
    });
    form.appendChild(row);
  }

  // Actions - F13 F14 F15
  const actionKeys = ['F13', 'F14', 'F15'];
  const activeActions = actionKeys.filter(function(k) { return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
  if (activeActions.length) {
    const row = document.createElement('div');
    row.className = 'lego-form-actions';
    activeActions.forEach(function(k) {
      const a = mkSlot(slots[k], 'lego-form-action');
      if (a) row.appendChild(a);
    });
    form.appendChild(row);
  }

  return form;
}

// -- LegoForm CSS -------------------------------------------
(function injectLegoFormStyles() {
  if (document.getElementById('lego-form-styles')) return;
  const s = document.createElement('style');
  s.id = 'lego-form-styles';
  s.textContent = [
    '.lego-form{display:flex;flex-direction:column;gap:14px;}',
    '.lego-form-header{display:flex;flex-wrap:wrap;gap:10px;}',
    '.lego-form-body{display:flex;flex-direction:column;gap:12px;}',
    '.lego-form-actions{display:flex;gap:8px;margin-top:4px;}',
    '.lego-form-field{display:flex;flex-direction:column;gap:4px;}',
    '.lego-form-f1{flex:2;min-width:200px;}',
    '.lego-form-f2{flex:1;min-width:100px;}',
    '.lego-form-f3{flex:1;min-width:120px;}',
    '.lego-form-action{display:flex;align-items:center;}'
  ].join('');
  document.head.appendChild(s);
})();
/* LegoHub ------------------------------------------------
   Frame outer: header + breadcrumb + pills + contenido
   Slots: H1 titulo, H2 subtitulo, H3 H4 H5 acciones,
          B1 breadcrumb, pills array, default id
   Retorna elemento DOM con .switchTo(id)
*/
function LegoHub(cfg) {
  cfg = cfg || {};

  function mk(tag, cls, style) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (style) el.style.cssText = style;
    return el;
  }

  function appendSlot(parent, content, cls) {
    if (content === undefined || content === null || content === '') return;
    var wrap = mk('div', cls);
    if (content instanceof HTMLElement) wrap.appendChild(content);
    else wrap.textContent = content;
    parent.appendChild(wrap);
  }

  var hub = mk('div', 'lego-hub');

  var header = mk('div', 'lego-hub-header');
  var headerLeft = mk('div', 'lego-hub-header-left');
  appendSlot(headerLeft, cfg.H1, 'lego-hub-h1');
  appendSlot(headerLeft, cfg.H2, 'lego-hub-h2');
  if (headerLeft.children.length) header.appendChild(headerLeft);

  var actKeys = ['H3', 'H4', 'H5'];
  var activeActs = actKeys.filter(function(k) { return cfg[k] !== undefined && cfg[k] !== null && cfg[k] !== ''; });
  if (activeActs.length) {
    var acts = mk('div', 'lego-hub-actions');
    activeActs.forEach(function(k) { appendSlot(acts, cfg[k], 'lego-hub-action'); });
    header.appendChild(acts);
  }
  hub.appendChild(header);

  if (cfg.B1 !== undefined && cfg.B1 !== null && cfg.B1 !== '') {
    appendSlot(hub, cfg.B1, 'lego-hub-breadcrumb');
  }

  var pills = cfg.pills || [];
  var activeId = cfg.default || (pills[0] && pills[0].id);

  if (pills.length) {
    var pillRow = mk('div', 'lego-hub-pills');
    var contentArea = mk('div', 'lego-hub-content');

    pills.forEach(function(p) {
      var btn = mk('button', 'lego-hub-pill' + (p.id === activeId ? ' active' : ''));
      btn.textContent = p.label;
      btn.type = 'button';
      pillRow.appendChild(btn);

      var panel = mk('div', 'lego-hub-panel');
      panel.style.display = p.id === activeId ? '' : 'none';
      if (p.content instanceof HTMLElement) panel.appendChild(p.content);
      else if (p.content) panel.textContent = p.content;
      contentArea.appendChild(panel);

      btn.addEventListener('click', function() { hub.switchTo(p.id); });
    });

    hub.appendChild(pillRow);
    hub.appendChild(contentArea);

    if (activeId) {
      var activePill = pills.find(function(p) { return p.id === activeId; });
      if (activePill && activePill.onShow) activePill.onShow();
    }
  }

  hub.switchTo = function(id) {
    var pr = hub.querySelector('.lego-hub-pills');
    var ca = hub.querySelector('.lego-hub-content');
    if (!pr || !ca) return;
    pills.forEach(function(p, i) {
      var isTarget = p.id === id;
      pr.children[i].classList.toggle('active', isTarget);
      ca.children[i].style.display = isTarget ? '' : 'none';
      if (isTarget && p.onShow) p.onShow();
    });
    activeId = id;
  };

  return hub;
}

/* LegoInnerHub --------------------------------------------
   Hub de tabs interior: tabs + contenido. Sin header ni breadcrumb.
   Slots: tabs array { id, label, content, onShow }, default id
   Retorna elemento DOM con .switchTo(id)
*/
function LegoInnerHub(cfg) {
  cfg = cfg || {};

  var tabs = cfg.tabs || [];
  var activeId = cfg.default || (tabs[0] && tabs[0].id);

  function mk(tag, cls) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  }

  var hub = mk('div', 'lego-inner-hub');
  var tabRow = mk('div', 'lego-inner-tabs');
  var contentArea = mk('div', 'lego-inner-content');

  tabs.forEach(function(t) {
    var btn = mk('button', 'lego-inner-tab' + (t.id === activeId ? ' active' : ''));
    btn.textContent = t.label;
    btn.type = 'button';
    tabRow.appendChild(btn);

    var panel = mk('div', 'lego-inner-panel');
    panel.style.display = t.id === activeId ? '' : 'none';
    if (t.content instanceof HTMLElement) panel.appendChild(t.content);
    else if (t.content) panel.textContent = t.content;
    contentArea.appendChild(panel);

    btn.addEventListener('click', function() { hub.switchTo(t.id); });
  });

  hub.appendChild(tabRow);
  hub.appendChild(contentArea);

  hub.switchTo = function(id) {
    tabs.forEach(function(t, i) {
      var isTarget = t.id === id;
      tabRow.children[i].classList.toggle('active', isTarget);
      contentArea.children[i].style.display = isTarget ? '' : 'none';
      if (isTarget && t.onShow) t.onShow();
    });
    activeId = id;
  };

  if (activeId) {
    var activeTab = tabs.find(function(t) { return t.id === activeId; });
    if (activeTab && activeTab.onShow) activeTab.onShow();
  }

  return hub;
}

/* LegoHub + LegoInnerHub CSS */
(function injectLegoHubStyles() {
  if (document.getElementById('lego-hub-styles')) return;
  var s = document.createElement('style');
  s.id = 'lego-hub-styles';
  s.textContent = [
    '.lego-hub{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--r);background:var(--white);overflow:hidden;}',
    '.lego-hub-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);}',
    '.lego-hub-header-left{display:flex;flex-direction:column;gap:2px;}',
    '.lego-hub-h1{font-size:15px;font-weight:600;color:var(--ink);}',
    '.lego-hub-h2{font-size:12px;color:var(--muted);}',
    '.lego-hub-actions{display:flex;align-items:center;gap:8px;}',
    '.lego-hub-action{display:flex;align-items:center;}',
    '.lego-hub-breadcrumb{padding:6px 16px;font-size:12px;color:var(--muted);border-bottom:1px solid var(--border);}',
    '.lego-hub-pills{display:flex;gap:4px;padding:8px 16px;border-bottom:1px solid var(--border);}',
    '.lego-hub-pill{font-size:12px;padding:4px 14px;border-radius:99px;border:1px solid var(--border);background:var(--sand);color:var(--muted);cursor:pointer;font-weight:500;}',
    '.lego-hub-pill.active{background:#185FA5;color:#E6F1FB;border-color:#185FA5;}',
    '.lego-hub-content{flex:1;}',
    '.lego-hub-panel{padding:16px;}',
    '.lego-inner-hub{display:flex;flex-direction:column;}',
    '.lego-inner-tabs{display:flex;gap:3px;padding:8px 12px;border-bottom:1px solid var(--border);flex-wrap:wrap;}',
    '.lego-inner-tab{font-size:12px;padding:3px 12px;border-radius:99px;border:1px solid transparent;background:transparent;color:var(--muted);cursor:pointer;font-weight:500;}',
    '.lego-inner-tab.active{background:var(--white);border-color:var(--border);color:var(--ink);}',
    '.lego-inner-content{flex:1;}',
    '.lego-inner-panel{padding:12px;}.lego-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:1000;}.lego-modal{background:var(--white);border-radius:var(--r);width:90%;max-width:560px;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column;}.lego-modal-header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);}.lego-modal-m0{flex-shrink:0;}.lego-modal-m1{flex:1;font-size:16px;font-weight:600;color:var(--ink);text-align:center;}.lego-modal-m6{flex-shrink:0;}.lego-modal-m2{font-size:13px;color:var(--muted);padding:10px 20px;border-bottom:1px solid var(--border);text-align:center;}.lego-modal-m3{padding:20px;}.lego-modal-m4{padding:0 20px 16px;}.lego-modal-actions{display:flex;gap:8px;padding:14px 20px;border-top:1px solid var(--border);}.lego-modal-m5{flex:1;}.lego-modal-m7{flex:1;}.lego-modal-footer{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-top:1px solid var(--border);font-size:12px;color:var(--muted);}.lego-modal-m8,.lego-modal-m9,.lego-modal-m10{}'
  ].join('');
  document.head.appendChild(s);
})();

function LegoModal(slots) {
  slots = slots || {};

  function mkSlot(content, cls) {
    if (content === undefined || content === null || content === '') return null;
    var el = document.createElement('div');
    el.className = cls;
    if (content instanceof HTMLElement) el.appendChild(content);
    else el.textContent = content;
    return el;
  }

  var overlay = document.createElement('div');
  overlay.className = 'lego-modal-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) LegoModal.close(); };

  var modal = document.createElement('div');
  modal.className = 'lego-modal';

  var header = document.createElement('div');
  header.className = 'lego-modal-header';
  var m0 = mkSlot(slots.M0, 'lego-modal-m0');
  var m1 = mkSlot(slots.M1, 'lego-modal-m1');
  var m6 = mkSlot(slots.M6, 'lego-modal-m6');
  if (m0) header.appendChild(m0);
  if (m1) header.appendChild(m1);
  if (m6) header.appendChild(m6);
  modal.appendChild(header);

  var m2 = mkSlot(slots.M2, 'lego-modal-m2');
  if (m2) modal.appendChild(m2);

  var m3 = mkSlot(slots.M3, 'lego-modal-m3');
  if (m3) modal.appendChild(m3);

  var m4 = mkSlot(slots.M4, 'lego-modal-m4');
  if (m4) modal.appendChild(m4);

  var actions = document.createElement('div');
  actions.className = 'lego-modal-actions';
  var m5 = mkSlot(slots.M5, 'lego-modal-m5');
  var m7 = mkSlot(slots.M7, 'lego-modal-m7');
  if (m5) actions.appendChild(m5);
  if (m7) actions.appendChild(m7);
  if (actions.children.length) modal.appendChild(actions);

  var footer = document.createElement('div');
  footer.className = 'lego-modal-footer';
  var m8  = mkSlot(slots.M8,  'lego-modal-m8');
  var m9  = mkSlot(slots.M9,  'lego-modal-m9');
  var m10 = mkSlot(slots.M10, 'lego-modal-m10');
  if (m8)  footer.appendChild(m8);
  if (m10) footer.appendChild(m10);
  if (m9)  footer.appendChild(m9);
  if (footer.children.length) modal.appendChild(footer);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  LegoModal.close = function() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };

  return overlay;
}
function LegoCategory(cat, opts) {
  if (!opts) opts = {};
  var card = document.createElement('div');
  card.className = 'lego-category';
  var actCount = opts.actCount || 0;
  var statusBg = cat.active ? '#E6F4EA' : '#F5F5F5';
  var statusColor = cat.active ? '#2E7D32' : '#888';
  var statusLabel = cat.active ? 'Activa' : 'Inactiva';
  var actLabel = actCount + (actCount !== 1 ? ' actividades' : ' actividad');
  var info = document.createElement('div');
  info.className = 'lego-category__info';
  var nameDiv = document.createElement('div');
  nameDiv.className = 'lego-category__name';
  nameDiv.textContent = cat.name;
  var badge = LegoChip(statusLabel, { bg: statusBg, color: statusColor });
  var count = document.createElement('span');
  count.className = 'lego-category__count';
  count.textContent = actLabel;
  var meta = document.createElement('div');
  meta.className = 'lego-category__meta';
  meta.append(badge, count);
  info.append(nameDiv, meta);
  var actions = document.createElement('div');
  actions.className = 'lego-category__actions';
  if (opts.onEdit) {
    var btnEdit = document.createElement('button');
    btnEdit.className = 'btn btn-sm';
    btnEdit.textContent = 'Editar';
    btnEdit.onclick = opts.onEdit;
    actions.appendChild(btnEdit);
  }
  if (opts.onToggle) {
    var btnToggle = document.createElement('button');
    btnToggle.className = 'btn btn-sm';
    btnToggle.textContent = cat.active ? 'Desactivar' : 'Activar';
    btnToggle.onclick = opts.onToggle;
    actions.appendChild(btnToggle);
  }
  if (opts.onDelete) {
    var btnDel = document.createElement('button');
    btnDel.className = 'btn btn-sm';
    btnDel.style.color = 'var(--danger)';
    btnDel.textContent = 'Eliminar';
    btnDel.onclick = opts.onDelete;
    actions.appendChild(btnDel);
  }
  card.appendChild(info);
  card.appendChild(actions);
  return card;
}
// -- LegoChip ----------------------------------------------
// Pildora de texto sellada: badge (nivel/categoria/estado) o chip removible.
//   LegoChip('A1', 'level')                                       badge de nivel
//   LegoChip('Verbos', 'cat')                                     badge de categoria
//   LegoChip('Completada', { bg: '#E6F4EA', color: '#2E7D32' })   estado con color
//   LegoChip('Mate', { onRemove: fn })                            chip removible con x
function LegoChip(text, opts) {
  opts = opts || {};
  if (typeof opts === 'string') opts = { variant: opts };
  if (!document.getElementById('lego-chip-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-chip-styles';
    st.textContent = '.lego-chip--removable{display:inline-flex;align-items:center;gap:4px;}.lego-chip__x{border:none;background:none;cursor:pointer;font-size:13px;line-height:1;color:inherit;opacity:.6;padding:0;font-family:inherit;}.lego-chip__x:hover{opacity:1;}';
    document.head.appendChild(st);
  }
  var chip = document.createElement('span');
  chip.className = 'lego-badge' + (opts.variant ? ' lego-badge--' + opts.variant : '');
  if (opts.bg) chip.style.background = opts.bg;
  if (opts.color) chip.style.color = opts.color;
  chip.textContent = text;
  if (opts.onRemove) {
    chip.classList.add('lego-chip--removable');
    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'lego-chip__x';
    x.textContent = '×';
    x.setAttribute('aria-label', 'Quitar');
    x.onclick = function(e) { e.stopPropagation(); opts.onRemove(); };
    chip.appendChild(x);
  }
  return chip;
}

// -- LegoIcon ----------------------------------------------
// Atomo de icono: devuelve un <i> Tabler. name = 'ti-...'.
//   LegoIcon('ti-pencil')
//   LegoIcon('ti-check', { size: 14, color: '#2E7D32' })
function LegoIcon(name, opts) {
  opts = opts || {};
  var i = document.createElement('i');
  i.className = 'ti ' + name;
  var s = '';
  if (opts.size)  s += 'font-size:' + opts.size + 'px;';
  if (opts.color) s += 'color:' + opts.color + ';';
  if (s) i.style.cssText = s;
  return i;
}

// -- LegoSelect --------------------------------------------
// Picker sellado: devuelve un <select> DOM. value = id (el cable), label = texto.
//   LegoSelect({ options: cats.map(c=>({value:c.id,label:c.name})), value: a.grammar_category_id, id:'rd-grammar-cat', placeholder:'— Sin categoría —' })
function LegoSelect(opts) {
  opts = opts || {};
  var sel = document.createElement('select');
  sel.className = opts.className || 'form-select';
  if (opts.id) sel.id = opts.id;
  if (opts.placeholder !== undefined && opts.placeholder !== null) {
    var ph = document.createElement('option');
    ph.value = '';
    ph.textContent = opts.placeholder;
    sel.appendChild(ph);
  }
  (opts.options || []).forEach(function(o) {
    var op = document.createElement('option');
    op.value = (o.value === null || o.value === undefined) ? '' : String(o.value);
    op.textContent = (o.label === null || o.label === undefined) ? '' : String(o.label);
    sel.appendChild(op);
  });
  if (opts.value !== undefined && opts.value !== null) sel.value = String(opts.value);
  if (typeof opts.onChange === 'function') {
    sel.addEventListener('change', function(e) { opts.onChange(e.target.value, e); });
  }
  return sel;
}

// -- LegoEmpty ---------------------------------------------
// Estado vacío sellado: devuelve un nodo .empty. El icono es slot opcional (colapsa si falta).
//   LegoEmpty({ text: 'No hay nada.' })
//   LegoEmpty({ icon: '📚', text: 'No hay actividades aún.' })
function LegoEmpty(opts) {
  opts = opts || {};
  if (typeof opts === 'string') opts = { text: opts };
  if (!document.getElementById('lego-empty-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-empty-styles';
    st.textContent = '.empty{text-align:center;padding:44px 20px;color:var(--muted)}.empty-icon{font-size:32px;margin-bottom:10px}.empty-text{font-size:13px;line-height:1.6}';
    document.head.appendChild(st);
  }
  var wrap = document.createElement('div');
  wrap.className = 'empty';
  if (opts.icon) {
    var ic = document.createElement('div');
    ic.className = 'empty-icon';
    ic.textContent = opts.icon;
    wrap.appendChild(ic);
  }
  var txt = document.createElement('div');
  txt.className = 'empty-text';
  txt.textContent = opts.text || '';
  wrap.appendChild(txt);
  return wrap;
}

// -- LegoBanner --------------------------------------------
// Banner sellado con variante de color. icon (emoji o 'ti-...') y action opcionales (colapsan).
//   LegoBanner({ variant:'success', icon:'✓', text:'Guardado.' })
//   LegoBanner({ variant:'warning', icon:'ti-pencil', text:'Editando: X', action:{ label:'Cancelar', onClick:fn } })
function LegoBanner(opts) {
  opts = opts || {};
  if (!document.getElementById('lego-banner-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-banner-styles';
    st.textContent = '.lego-banner{display:flex;align-items:center;gap:8px;border-radius:var(--r);padding:10px 13px;font-size:13px;border:1px solid transparent}.lego-banner__text{flex:1}.lego-banner--success{background:var(--green-lt);border-color:var(--green);color:var(--green)}.lego-banner--error{background:var(--red-lt);border-color:var(--red);color:var(--red)}.lego-banner--info{background:var(--sand);border-color:transparent;color:var(--muted);font-size:12px}.lego-banner--warning{background:#FDF0E4;border-color:#F5D3B0;color:#B85A00}.lego-banner__action{background:none;border:none;cursor:pointer;font-size:12px;color:inherit;text-decoration:underline;font-family:inherit}';
    document.head.appendChild(st);
  }
  var wrap = document.createElement('div');
  wrap.className = 'lego-banner lego-banner--' + (opts.variant || 'info');
  if (opts.icon) {
    if (typeof opts.icon === 'string' && opts.icon.indexOf('ti-') === 0) {
      wrap.appendChild(LegoIcon(opts.icon));
    } else {
      var ie = document.createElement('span');
      ie.textContent = opts.icon;
      wrap.appendChild(ie);
    }
  }
  var txt = document.createElement('span');
  txt.className = 'lego-banner__text';
  txt.textContent = opts.text || '';
  wrap.appendChild(txt);
  if (opts.action) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lego-banner__action';
    btn.textContent = opts.action.label;
    btn.onclick = opts.action.onClick;
    wrap.appendChild(btn);
  }
  return wrap;
}


// -- LegoPlayer --------------------------------------------
// Reproductor sellado de actividades. Puro: rinde + juega + califica, reporta via onResult. NO toca DB.
//   LegoPlayer(activity, { mode:'play'|'review', onResult: fn })  -> nodo DOM
//   onResult({ type, score, total, answers:[{key,questionText,answer,isCorrect}] })
// Extensible: cada tipo es un helper que registra state.score() y state.detail(). Agregar tipo = un helper, sin tocar el core.
function LegoPlayer(activity, opts) {
  opts = opts || {};
  var mode = opts.mode || 'play';
  var onResult = typeof opts.onResult === 'function' ? opts.onResult : null;
  if (!document.getElementById('lego-player-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-player-styles';
    st.textContent = '.lego-player{font-size:15px}.lp-instr{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:14px}.lp-legend{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;font-size:11px;font-weight:500}.lp-sentence{font-family:var(--serif,serif);font-size:15px;line-height:2.2;color:var(--ink);margin-bottom:10px}.lp-input{border:none;border-bottom:2px solid var(--border);background:transparent;font-family:inherit;font-size:15px;text-align:center;min-width:70px;outline:none;padding:2px 4px}.lp-input.correct{border-color:var(--green);color:var(--green)}.lp-input.tilde{border-color:#DAA520;color:#DAA520}.lp-input.wrong{border-color:var(--red);color:var(--red)}.lp-fb{font-size:11px;margin-top:2px;min-height:13px}.lp-score{font-weight:700;margin-bottom:12px;color:var(--ink-soft)}.lp-text{font-family:var(--serif,serif);font-size:15px;line-height:1.8;color:var(--ink);margin-bottom:14px}.lp-mc-block{margin-bottom:16px}.lp-mc-q{display:flex;gap:8px;font-weight:600;margin-bottom:8px;align-items:flex-start}.lp-mc-num{background:var(--coral);color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}.lp-mc-opts{display:flex;flex-direction:column;gap:6px}.lp-mc-opt{text-align:left;padding:9px 12px;border:1px solid var(--border);border-radius:8px;background:var(--white,#fff);cursor:pointer;font:inherit;font-size:14px}.lp-mc-opt:disabled{cursor:default}.lp-mc-opt.correct{background:var(--green-lt);border-color:var(--green);color:var(--green)}.lp-mc-opt.wrong{background:var(--red-lt);border-color:var(--red);color:var(--red)}.lp-mc-fb{font-size:12px;margin-top:6px;min-height:14px}.lp-open{width:100%;border:1px solid var(--border);border-radius:8px;padding:8px;font:inherit;font-size:14px}';
    document.head.appendChild(st);
  }
  var content = {};
  try { content = typeof activity.content === 'string' ? JSON.parse(activity.content) : (activity.content || {}); } catch(e) {}
  var type = activity.type || content.type || 'mc';
  var state = { answers: {}, score: function(){ return { correct:0, total:0 }; }, detail: function(){ return []; } };
  var root = document.createElement('div');
  root.className = 'lego-player';
  var scoreEl = document.createElement('div');
  scoreEl.className = 'lp-score';
  function refreshScore(){ var sc = state.score(); scoreEl.textContent = sc.correct + '/' + (sc.total || '?'); }

  var body, supported = true;
  if (type === 'fill-blank' || type === 'dropdown') {
    body = _lpFillBlank(content, type === 'dropdown', state, refreshScore);
  } else if (type === 'mc' || type === 'reading') {
    body = _lpMC(content, activity, state, refreshScore);
  } else if (type === 'audio') {
    body = _lpAudio(content, activity, state, refreshScore);
  } else if (type === 'match') {
    body = _lpMatch(content, state, refreshScore);
  } else if (type === 'mixed') {
    body = _lpMixed(content, activity, state, refreshScore);
  } else if (type === 'drag-drop') {
    body = _lpDragDrop(content, state, refreshScore);
  } else {
    supported = false;
    body = LegoEmpty({ icon: 'i', text: 'Tipo "' + type + '" aun no soportado por LegoPlayer.' });
  }

  if (mode === 'review' && supported) { body = _lpReview(content, activity, type, opts.saved || []); scoreEl.style.display = 'none'; }
  if (mode === 'edit' && supported) { body = _lpEdit(content, activity, type); scoreEl.style.display = 'none'; }
  if (supported) root.appendChild(scoreEl);
  root.appendChild(body);
  if (supported) refreshScore();

  if (mode === 'play' && supported) {
    var submit = document.createElement('button');
    submit.className = 'btn btn-coral';
    submit.style.marginTop = '16px';
    submit.textContent = 'Enviar respuestas';
    submit.onclick = function(){
      var sc = state.score();
      submit.disabled = true;
      if (onResult) onResult({ type: type, score: sc.correct, total: sc.total, answers: state.detail() });
    };
    root.appendChild(submit);
  }
  return root;
}

function _lpFillBlank(content, isDropdown, state, refreshScore) {
  var answers = state.answers;
  var wrap = document.createElement('div');
  var instr = document.createElement('div');
  instr.className = 'lp-instr';
  instr.textContent = content.instructions || 'Completa los espacios en blanco.';
  wrap.appendChild(instr);
  if (!isDropdown) {
    var legend = document.createElement('div');
    legend.className = 'lp-legend';
    [['var(--green)','Correcto'],['#DAA520','Falta tilde'],['var(--red)','Incorrecto']].forEach(function(p){
      var sp = document.createElement('span'); sp.style.color = p[0]; sp.textContent = p[1]; legend.appendChild(sp);
    });
    wrap.appendChild(legend);
  }
  function norm(s){ return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim(); }
  (content.sentences||[]).forEach(function(s, si){
    if (!s.hasBlank || !s.parts) {
      var pr = document.createElement('p'); pr.className = 'lp-sentence'; pr.textContent = s.text || ''; wrap.appendChild(pr); return;
    }
    var line = document.createElement('div');
    line.className = 'lp-sentence';
    s.parts.forEach(function(part, pi){
      var seg = document.createElement('span'); seg.textContent = part; line.appendChild(seg);
      if (pi < s.blanks.length) {
        var blank = s.blanks[pi] || {};
        var key = si + '-' + pi;
        if (isDropdown && (blank.options||[]).length) {
          var sel = document.createElement('select');
          sel.className = 'lp-input';
          var pho = document.createElement('option'); pho.value = ''; pho.textContent = 'elige'; sel.appendChild(pho);
          (blank.options||[]).forEach(function(o){ var op = document.createElement('option'); op.value = o; op.textContent = o; sel.appendChild(op); });
          sel.addEventListener('change', function(){
            var val = sel.value, ans = (blank.answer||'').trim();
            if (!val) { sel.className = 'lp-input'; delete answers[key]; refreshScore(); return; }
            if (val.toLowerCase() === ans.toLowerCase()) { sel.className = 'lp-input correct'; sel.disabled = true; answers[key] = { correct:true, answer:val }; }
            else { sel.className = 'lp-input wrong'; answers[key] = { correct:false, answer:val }; }
            refreshScore();
          });
          line.appendChild(sel);
        } else {
          var box = document.createElement('span');
          box.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 4px';
          var input = document.createElement('input');
          input.className = 'lp-input';
          input.placeholder = blank.hint || '___';
          input.setAttribute('autocomplete','off'); input.setAttribute('autocorrect','off'); input.spellcheck = false;
          var fb = document.createElement('span');
          fb.className = 'lp-fb';
          input.addEventListener('input', function(){
            var val = input.value.trim(), ans = (blank.answer||'').trim();
            if (!val) { input.className = 'lp-input'; fb.textContent = ''; delete answers[key]; refreshScore(); return; }
            if (val.toLowerCase() === ans.toLowerCase()) { input.className = 'lp-input correct'; fb.style.color = 'var(--green)'; fb.textContent = 'ok'; answers[key] = { correct:true, tilde:false, answer:val }; }
            else if (norm(val) === norm(ans)) { input.className = 'lp-input tilde'; fb.style.color = '#DAA520'; fb.textContent = 'tilde: ' + ans; answers[key] = { correct:false, tilde:true, answer:val }; }
            else if (val.length >= ans.length || val.length >= 3) { input.className = 'lp-input wrong'; fb.style.color = 'var(--red)'; fb.textContent = 'x'; answers[key] = { correct:false, tilde:false, answer:val }; }
            else { input.className = 'lp-input'; fb.textContent = ''; delete answers[key]; }
            refreshScore();
          });
          box.appendChild(input); box.appendChild(fb);
          line.appendChild(box);
        }
      }
    });
    wrap.appendChild(line);
  });
  state.score = function(){
    var total = 0, correct = 0;
    (content.sentences||[]).forEach(function(s, si){
      if (!s.hasBlank || !s.blanks) return;
      s.blanks.forEach(function(b, bi){ total++; var a = answers[si+'-'+bi]; if (a && a.correct) correct++; });
    });
    return { correct: correct, total: total };
  };
  state.detail = function(){
    var d = [];
    (content.sentences||[]).forEach(function(s, si){
      if (!s.hasBlank || !s.blanks) return;
      s.blanks.forEach(function(b, bi){
        var a = answers[si+'-'+bi] || {};
        d.push({ key: si+'-'+bi, questionText: (s.parts||[]).join(' ___ '), answer: a.answer || '', isCorrect: !!a.correct });
      });
    });
    return d;
  };
  return wrap;
}

function _lpMC(content, activity, state, refreshScore) {
  var answers = state.answers;
  var wrap = document.createElement('div');
  var readingText = content.readingText || (activity && activity.reading_text) || '';
  if (readingText) {
    var rt = document.createElement('div'); rt.className = 'lp-text'; rt.textContent = readingText; wrap.appendChild(rt);
  }
  var questions = content.questions || [];
  questions.forEach(function(q, qi){
    var block = document.createElement('div');
    block.className = 'lp-mc-block';
    var qrow = document.createElement('div');
    qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(q.num || qi+1);
    var qtext = document.createElement('span'); qtext.style.flex = '1'; qtext.textContent = q.text || q.q || '';
    qrow.appendChild(num); qrow.appendChild(qtext);
    block.appendChild(qrow);
    if (q.type === 'open') {
      var ta = document.createElement('textarea');
      ta.className = 'lp-open'; ta.rows = 2; ta.placeholder = 'Escribe tu respuesta...';
      ta.addEventListener('input', function(){ answers['open-'+qi] = { open:true, answer: ta.value.trim() }; });
      block.appendChild(ta);
    } else {
      var opts = q.opts || [];
      var correctIdx = q.correct !== undefined ? q.correct : (q.ans || 0);
      var optsWrap = document.createElement('div'); optsWrap.className = 'lp-mc-opts';
      var fb = document.createElement('div'); fb.className = 'lp-mc-fb';
      var btns = [];
      opts.forEach(function(o, oi){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'lp-mc-opt'; b.textContent = o;
        b.addEventListener('click', function(){
          if (block.dataset.done) return;
          block.dataset.done = '1';
          btns.forEach(function(bb, i){ bb.disabled = true; if (i === correctIdx) bb.classList.add('correct'); else if (i === oi) bb.classList.add('wrong'); });
          var ok = oi === correctIdx;
          answers['mc-'+qi] = { correct: ok, answer: o };
          fb.style.color = ok ? 'var(--green)' : 'var(--red)';
          fb.textContent = ok ? 'Correcto' : 'Incorrecto';
          refreshScore();
        });
        btns.push(b); optsWrap.appendChild(b);
      });
      block.appendChild(optsWrap); block.appendChild(fb);
    }
    wrap.appendChild(block);
  });
  state.score = function(){
    var total = 0, correct = 0;
    questions.forEach(function(q, qi){ if (q.type === 'open') return; total++; var a = answers['mc-'+qi]; if (a && a.correct) correct++; });
    return { correct: correct, total: total };
  };
  state.detail = function(){
    return questions.map(function(q, qi){
      if (q.type === 'open') { var oa = answers['open-'+qi] || {}; return { key:'open-'+qi, questionText: q.text||q.q||'', answer: oa.answer||'', isCorrect: null }; }
      var a = answers['mc-'+qi] || {};
      return { key:'mc-'+qi, questionText: q.text||q.q||'', answer: a.answer||'', isCorrect: a.correct === undefined ? false : a.correct };
    });
  };
  return wrap;
}

function _lpAudioControls(content) {
  var audioUrl = content.audioUrl || content.audio_url || '';
  var youtubeUrl = content.youtubeUrl || content.youtube_url || '';
  var title = content.audioTitle || content.title || 'Audio';
  if (youtubeUrl) {
    var ytId = (youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]{11})/) || [])[1] || '';
    var yt = document.createElement('div');
    if (ytId) {
      yt.style.cssText = 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;margin-bottom:18px';
      var ifr = document.createElement('iframe');
      ifr.src = 'https://www.youtube.com/embed/' + ytId;
      ifr.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0';
      ifr.allowFullscreen = true;
      yt.appendChild(ifr);
    }
    return yt;
  }
  if (audioUrl && audioUrl.indexOf('drive.google.com') !== -1) {
    var driveId = '';
    var dPos = audioUrl.indexOf('/d/');
    if (dPos !== -1) { driveId = audioUrl.substring(dPos + 3).split('/')[0].split('?')[0]; }
    else { var iPos = audioUrl.indexOf('id='); if (iPos !== -1) driveId = audioUrl.substring(iPos + 3).split('&')[0]; }
    var dv = document.createElement('div'); dv.style.cssText = 'margin-bottom:18px';
    if (driveId) {
      var difr = document.createElement('iframe');
      difr.src = 'https://drive.google.com/file/d/' + driveId + '/preview';
      difr.style.cssText = 'width:100%;height:80px;border:0;border-radius:10px';
      difr.setAttribute('allow', 'autoplay');
      dv.appendChild(difr);
    }
    return dv;
  }  if (!audioUrl) return document.createElement('div');
  if (!document.getElementById('lego-audio-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-audio-styles';
    st.textContent = '.lp-audio{display:flex;align-items:center;gap:12px;background:var(--sand);border-radius:12px;padding:12px 14px;margin-bottom:18px}.lp-audio-play{width:44px;height:44px;border-radius:50%;border:none;background:var(--coral);color:#fff;font-size:16px;cursor:pointer;flex-shrink:0}.lp-audio-info{flex:1}.lp-audio-title{font-weight:600;font-size:13px;margin-bottom:6px}.lp-audio-prog{height:6px;background:var(--border);border-radius:3px;cursor:pointer;overflow:hidden;margin-bottom:4px}.lp-audio-bar{height:100%;background:var(--coral);width:0%}.lp-audio-time{font-size:11px;color:var(--muted)}.lp-audio-ctrl{background:none;border:none;color:var(--muted);font-size:11px;cursor:pointer;margin-left:8px}';
    document.head.appendChild(st);
  }
  var repeat = false;
  var audio = document.createElement('audio');
  audio.src = audioUrl; audio.preload = 'auto';
  var wrap = document.createElement('div'); wrap.className = 'lp-audio';
  var playBtn = document.createElement('button'); playBtn.className = 'lp-audio-play'; playBtn.textContent = 'play';
  var info = document.createElement('div'); info.className = 'lp-audio-info';
  var titleEl = document.createElement('div'); titleEl.className = 'lp-audio-title'; titleEl.textContent = title;
  var prog = document.createElement('div'); prog.className = 'lp-audio-prog';
  var bar = document.createElement('div'); bar.className = 'lp-audio-bar'; prog.appendChild(bar);
  var row = document.createElement('div'); row.style.cssText = 'display:flex;justify-content:space-between;align-items:center';
  var timeEl = document.createElement('span'); timeEl.className = 'lp-audio-time'; timeEl.textContent = '0:00 / 0:00';
  var ctrls = document.createElement('div');
  var repeatBtn = document.createElement('button'); repeatBtn.className = 'lp-audio-ctrl'; repeatBtn.textContent = 'Repetir'; repeatBtn.style.opacity = '0.6';
  var restartBtn = document.createElement('button'); restartBtn.className = 'lp-audio-ctrl'; restartBtn.textContent = 'Inicio';
  ctrls.appendChild(repeatBtn); ctrls.appendChild(restartBtn);
  row.appendChild(timeEl); row.appendChild(ctrls);
  info.appendChild(titleEl); info.appendChild(prog); info.appendChild(row);
  wrap.appendChild(playBtn); wrap.appendChild(info); wrap.appendChild(audio);
  function fmt(s){ return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0'); }
  function updateBar(){ if (isNaN(audio.duration)) return; bar.style.width = (audio.currentTime/audio.duration*100) + '%'; timeEl.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration); }
  playBtn.addEventListener('click', function(){ if (audio.paused) { audio.play(); playBtn.textContent = 'pausa'; } else { audio.pause(); playBtn.textContent = 'play'; } });
  audio.addEventListener('timeupdate', updateBar);
  audio.addEventListener('loadedmetadata', updateBar);
  audio.addEventListener('ended', function(){ playBtn.textContent = 'play'; if (repeat) { audio.currentTime = 0; audio.play(); playBtn.textContent = 'pausa'; } });
  prog.addEventListener('click', function(e){ if (isNaN(audio.duration)) return; var rect = prog.getBoundingClientRect(); audio.currentTime = (e.clientX - rect.left) / rect.width * audio.duration; });
  repeatBtn.addEventListener('click', function(){ repeat = !repeat; repeatBtn.style.opacity = repeat ? '1' : '0.6'; });
  restartBtn.addEventListener('click', function(){ audio.currentTime = 0; audio.play(); playBtn.textContent = 'pausa'; });
  return wrap;
}

function _lpTrueFalse(content, state, refreshScore) {
  var answers = state.answers;
  var wrap = document.createElement('div');
  var statements = content.statements || [];
  statements.forEach(function(s, si){
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var qrow = document.createElement('div'); qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(si+1);
    var txt = document.createElement('span'); txt.style.flex = '1'; txt.textContent = s.text || '';
    qrow.appendChild(num); qrow.appendChild(txt); block.appendChild(qrow);
    var optsWrap = document.createElement('div'); optsWrap.className = 'lp-mc-opts';
    var fb = document.createElement('div'); fb.className = 'lp-mc-fb';
    var btns = [];
    [true, false].forEach(function(val){
      var b = document.createElement('button'); b.type = 'button'; b.className = 'lp-mc-opt'; b.textContent = val ? 'Verdadero' : 'Falso';
      b.addEventListener('click', function(){
        if (block.dataset.done) return;
        block.dataset.done = '1';
        var ok = val === s.correct;
        btns.forEach(function(bb, i){ bb.disabled = true; var bv = (i === 0); if (bv === s.correct) bb.classList.add('correct'); else if (bv === val) bb.classList.add('wrong'); });
        answers['tf-'+si] = { correct: ok, answer: val ? 'Verdadero' : 'Falso' };
        fb.style.color = ok ? 'var(--green)' : 'var(--red)';
        fb.textContent = ok ? 'Correcto' : 'Incorrecto';
        refreshScore();
      });
      btns.push(b); optsWrap.appendChild(b);
    });
    block.appendChild(optsWrap); block.appendChild(fb);
    wrap.appendChild(block);
  });
  state.score = function(){ var t = 0, c = 0; statements.forEach(function(s, si){ t++; var a = answers['tf-'+si]; if (a && a.correct) c++; }); return { correct: c, total: t }; };
  state.detail = function(){ return statements.map(function(s, si){ var a = answers['tf-'+si] || {}; return { key:'tf-'+si, questionText: s.text || '', answer: a.answer || '', isCorrect: a.correct === undefined ? false : a.correct }; }); };
  return wrap;
}

function _lpAudio(content, activity, state, refreshScore) {
  var wrap = document.createElement('div');
  wrap.appendChild(_lpAudioControls(content));
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Escucha el audio y responde.';
  wrap.appendChild(instr);
  var subtype = content.audioType || content.subtype || 'comprehension';
  if (subtype === 'comprehension' || subtype === 'mc') {
    wrap.appendChild(_lpMC(content, activity, state, refreshScore));
  } else if (subtype === 'fillblank') {
    wrap.appendChild(_lpFillBlank(content, false, state, refreshScore));
  } else if (subtype === 'dictation') {
    var ta = document.createElement('textarea'); ta.className = 'lp-open'; ta.rows = 6; ta.placeholder = 'Escribe lo que escuchas...';
    ta.addEventListener('input', function(){ state.answers['open-0'] = { open: true, answer: ta.value.trim() }; });
    wrap.appendChild(ta);
    state.score = function(){ return { correct: 0, total: 0 }; };
    state.detail = function(){ var a = state.answers['open-0'] || {}; return [{ key:'dictation', questionText: 'Dictado', answer: a.answer || '', isCorrect: null }]; };
  } else if (subtype === 'truefalse') {
    wrap.appendChild(_lpTrueFalse(content, state, refreshScore));
  } else if (subtype === 'order') {
    wrap.appendChild(_lpOrder(content, state, refreshScore));
  } else if (subtype === 'vocab') {
    wrap.appendChild(_lpVocab(content, state, refreshScore));
  } else {
    wrap.appendChild(LegoEmpty({ text: 'Subtipo de audio "' + subtype + '" no soportado.' }));
    state.score = function(){ return { correct: 0, total: 0 }; };
    state.detail = function(){ return []; };
  }
  return wrap;
}

function _lpOrderVocabStyles() {
  if (document.getElementById('lego-orderv-styles')) return;
  var st = document.createElement('style');
  st.id = 'lego-orderv-styles';
  st.textContent = '.lp-ov-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:8px 0 6px}.lp-order-bank{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.lp-order-item{padding:7px 12px;border:1px solid var(--border);border-radius:8px;background:var(--white,#fff);cursor:pointer;font:inherit;font-size:14px}.lp-order-item.placed{opacity:.4;cursor:default}.lp-order-slot{padding:9px 12px;border:1px dashed var(--border);border-radius:8px;margin-bottom:6px;cursor:pointer;color:var(--muted)}.lp-order-slot.filled{border-style:solid;color:var(--ink);background:var(--sand)}.lp-vocab-word{padding:7px 12px;border:1px solid var(--border);border-radius:99px;background:var(--white,#fff);cursor:pointer;font:inherit;font-size:14px}.lp-vocab-word.selected{background:var(--coral);color:#fff;border-color:var(--coral)}';
  document.head.appendChild(st);
}

function _lpOrder(content, state, refreshScore) {
  _lpOrderVocabStyles();
  var answers = state.answers;
  var events = content.events || [];
  var wrap = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Ordena los eventos en el orden en que ocurren.';
  wrap.appendChild(instr);
  var slots = [];
  var bankItems = [];
  function fillNext(text, itemEl) {
    for (var si = 0; si < slots.length; si++) {
      if (!slots[si].dataset.filled) {
        slots[si].dataset.filled = text;
        slots[si].textContent = (si+1) + '. ' + text;
        slots[si].classList.add('filled');
        itemEl.classList.add('placed');
        answers['order-' + si] = { answer: text, correct: text === events[si] };
        refreshScore();
        return;
      }
    }
  }
  var bankLabel = document.createElement('div'); bankLabel.className = 'lp-ov-label'; bankLabel.textContent = 'Banco de eventos';
  var bank = document.createElement('div'); bank.className = 'lp-order-bank';
  var shuffled = events.map(function(e){ return e; }).sort(function(){ return Math.random() - 0.5; });
  shuffled.forEach(function(ev){
    var it = document.createElement('button'); it.type = 'button'; it.className = 'lp-order-item'; it.textContent = ev;
    it.addEventListener('click', function(){ if (it.classList.contains('placed')) return; fillNext(ev, it); });
    bankItems.push(it); bank.appendChild(it);
  });
  var slotsLabel = document.createElement('div'); slotsLabel.className = 'lp-ov-label'; slotsLabel.textContent = 'Orden correcto';
  var slotsWrap = document.createElement('div');
  events.forEach(function(ev, i){
    var slot = document.createElement('div'); slot.className = 'lp-order-slot'; slot.textContent = (i+1) + '. (vacio)';
    slot.addEventListener('click', function(){
      if (!slot.dataset.filled) return;
      var text = slot.dataset.filled;
      delete slot.dataset.filled; slot.classList.remove('filled'); slot.textContent = (i+1) + '. (vacio)';
      bankItems.forEach(function(b){ if (b.textContent === text) b.classList.remove('placed'); });
      delete answers['order-' + i]; refreshScore();
    });
    slots.push(slot); slotsWrap.appendChild(slot);
  });
  wrap.appendChild(bankLabel); wrap.appendChild(bank); wrap.appendChild(slotsLabel); wrap.appendChild(slotsWrap);
  state.score = function(){ var t = events.length, c = 0; for (var i = 0; i < events.length; i++) { var a = answers['order-'+i]; if (a && a.correct) c++; } return { correct: c, total: t }; };
  state.detail = function(){ return events.map(function(ev, i){ var a = answers['order-'+i] || {}; return { key:'order-'+i, questionText: 'Posicion ' + (i+1), answer: a.answer || '', isCorrect: a.correct === undefined ? false : a.correct }; }); };
  return wrap;
}

function _lpVocab(content, state, refreshScore) {
  _lpOrderVocabStyles();
  var answers = state.answers;
  var wordList = content.wordList || [];
  var heard = content.wordsHeard || [];
  var wrap = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Marca las palabras que escuchas en el audio.';
  wrap.appendChild(instr);
  var grid = document.createElement('div'); grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
  wordList.forEach(function(w, wi){
    var correct = heard.indexOf(w) !== -1;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'lp-vocab-word'; b.textContent = w;
    b.addEventListener('click', function(){
      b.classList.toggle('selected');
      answers['vocab-'+wi] = { selected: b.classList.contains('selected'), correct: correct, answer: w };
      refreshScore();
    });
    grid.appendChild(b);
  });
  wrap.appendChild(grid);
  state.score = function(){ var t = heard.length, c = 0; wordList.forEach(function(w, wi){ var a = answers['vocab-'+wi]; if (a && a.correct && a.selected) c++; }); return { correct: c, total: t }; };
  state.detail = function(){ var sel = []; wordList.forEach(function(w, wi){ var a = answers['vocab-'+wi]; if (a && a.selected) sel.push(w); }); return [{ key:'vocab', questionText: 'Vocabulario identificado', answer: sel.join(', '), isCorrect: null }]; };
  return wrap;
}

function _lpMatch(content, state, refreshScore) {
  if (!document.getElementById('lego-match-styles')) {
    var mst = document.createElement('style');
    mst.id = 'lego-match-styles';
    mst.textContent = '.lp-match-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}.lp-match-col-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:8px}.lp-match-item{padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;margin-bottom:6px;cursor:pointer;font-size:13px;background:var(--white,#fff)}.lp-match-item.sel{border-color:var(--orange);background:var(--orange-lt)}.lp-match-item.matched{border-color:var(--green);background:var(--green-lt);color:var(--green);cursor:default}.lp-match-item.wrong{border-color:var(--red);background:var(--red-lt)}';
    document.head.appendChild(mst);
  }
  var answers = state.answers;
  var pairs = content.pairs || [];
  var wrap = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Conecta cada elemento con su par correcto.';
  wrap.appendChild(instr);
  if (!pairs.length) { wrap.appendChild(LegoEmpty({ text: 'Sin pares configurados.' })); state.score = function(){ return { correct:0, total:0 }; }; state.detail = function(){ return []; }; return wrap; }
  var grid = document.createElement('div'); grid.className = 'lp-match-grid';
  var colA = document.createElement('div'); var colB = document.createElement('div');
  var la = document.createElement('div'); la.className = 'lp-match-col-label'; la.textContent = 'Columna A'; colA.appendChild(la);
  var lb = document.createElement('div'); lb.className = 'lp-match-col-label'; lb.textContent = 'Columna B'; colB.appendChild(lb);
  var selectedLeft = null;
  var leftEls = [];
  pairs.forEach(function(p, i){
    var el = document.createElement('div'); el.className = 'lp-match-item'; el.textContent = p.left;
    el.addEventListener('click', function(){
      if (el.dataset.matched) return;
      leftEls.forEach(function(le){ if (!le.dataset.matched) le.classList.remove('sel'); });
      selectedLeft = i; el.classList.add('sel');
    });
    leftEls.push(el); colA.appendChild(el);
  });
  var rightItems = pairs.map(function(p, i){ return { text: p.right, idx: i }; }).sort(function(){ return Math.random() - 0.5; });
  rightItems.forEach(function(item){
    var el = document.createElement('div'); el.className = 'lp-match-item'; el.textContent = item.text;
    el.addEventListener('click', function(){
      if (selectedLeft === null || el.dataset.matched) return;
      var leftEl = leftEls[selectedLeft];
      var ok = item.idx === selectedLeft;
      if (ok) {
        leftEl.classList.remove('sel'); leftEl.classList.add('matched'); el.classList.add('matched');
        leftEl.dataset.matched = '1'; el.dataset.matched = '1';
        answers['match-'+selectedLeft] = { correct: true, answer: item.text };
        selectedLeft = null;
      } else {
        var sl = selectedLeft;
        el.classList.add('wrong'); leftEl.classList.add('wrong');
        answers['match-'+sl] = { correct: false, answer: item.text };
        setTimeout(function(){ el.classList.remove('wrong'); leftEls[sl].classList.remove('wrong'); }, 600);
      }
      refreshScore();
    });
    colB.appendChild(el);
  });
  grid.appendChild(colA); grid.appendChild(colB);
  wrap.appendChild(grid);
  state.score = function(){ var t = pairs.length, c = 0; for (var i = 0; i < pairs.length; i++) { var a = answers['match-'+i]; if (a && a.correct) c++; } return { correct: c, total: t }; };
  state.detail = function(){ return pairs.map(function(p, i){ var a = answers['match-'+i] || {}; return { key:'match-'+i, questionText: p.left, answer: a.answer || '', isCorrect: a.correct === undefined ? false : a.correct }; }); };
  return wrap;
}

function _lpMixed(content, activity, state, refreshScore) {
  if (!document.getElementById('lego-mixed-styles')) {
    var mst = document.createElement('style');
    mst.id = 'lego-mixed-styles';
    mst.textContent = '.lp-mixed-section{margin-bottom:24px;padding-bottom:24px;border-bottom:1.5px solid var(--border)}.lp-mixed-section:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0}.lp-mixed-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:12px;display:flex;align-items:center;gap:8px}.lp-mixed-num{background:var(--orange);color:#fff;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}';
    document.head.appendChild(mst);
  }
  var wrap = document.createElement('div');
  var sections = content.sections || [];
  if (content.instructions) { var gi = document.createElement('div'); gi.className = 'lp-instr'; gi.textContent = content.instructions; wrap.appendChild(gi); }
  if (!sections.length) { wrap.appendChild(LegoEmpty({ text: 'Sin secciones.' })); state.score = function(){ return { correct:0, total:0 }; }; state.detail = function(){ return []; }; return wrap; }
  var subStates = [];
  sections.forEach(function(sec, si){
    var secWrap = document.createElement('div'); secWrap.className = 'lp-mixed-section';
    if (sec.title) {
      var t = document.createElement('div'); t.className = 'lp-mixed-title';
      var n = document.createElement('span'); n.className = 'lp-mixed-num'; n.textContent = String(si+1);
      var tt = document.createElement('span'); tt.textContent = sec.title;
      t.appendChild(n); t.appendChild(tt); secWrap.appendChild(t);
    }
    var subState = { answers: {}, score: function(){ return { correct:0, total:0 }; }, detail: function(){ return []; } };
    var node;
    if (sec.type === 'fill-blank' || sec.type === 'drag-drop') node = _lpFillBlank(sec, false, subState, refreshScore);
    else if (sec.type === 'mc' || sec.type === 'truefalse') node = _lpMC(sec, activity, subState, refreshScore);
    else node = LegoEmpty({ text: 'Seccion "' + sec.type + '" no soportada.' });
    secWrap.appendChild(node);
    subStates.push(subState);
    wrap.appendChild(secWrap);
  });
  state.score = function(){ var c = 0, t = 0; subStates.forEach(function(ss){ var s = ss.score(); c += s.correct; t += s.total; }); return { correct: c, total: t }; };
  state.detail = function(){ var d = []; subStates.forEach(function(ss, si){ ss.detail().forEach(function(x){ d.push({ key: 's'+si+'_'+x.key, questionText: x.questionText, answer: x.answer, isCorrect: x.isCorrect }); }); }); return d; };
  return wrap;
}

function _lpDragDrop(content, state, refreshScore) {
  if (!document.getElementById('lego-dnd-styles')) {
    var dst = document.createElement('style');
    dst.id = 'lego-dnd-styles';
    dst.textContent = '.lp-dnd-bank{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}.lp-dnd-word{padding:6px 12px;border:1px solid var(--border);border-radius:8px;background:var(--white,#fff);cursor:grab;font-size:14px;user-select:none;touch-action:none}.lp-dnd-word.sel{outline:2px solid var(--orange)}.lp-dnd-word.used{opacity:.35;pointer-events:none}.lp-dnd-word.dragging{opacity:.4}.lp-dnd-ghost{position:fixed;z-index:9999;pointer-events:none;padding:6px 12px;border:1px solid var(--orange);border-radius:8px;background:var(--white,#fff);font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.18)}.lp-dnd-blank{display:inline-block;min-width:64px;border-bottom:2px solid var(--border);text-align:center;cursor:pointer;margin:0 4px;padding:0 4px;vertical-align:middle}.lp-dnd-blank.over{background:var(--orange-lt,#FDEEE8);outline:2px dashed var(--orange);outline-offset:2px}.lp-dnd-blank.filled-correct{border-color:var(--green);color:var(--green)}.lp-dnd-blank.filled-wrong{border-color:var(--red);color:var(--red)}';
    document.head.appendChild(dst);
  }
  var answers = state.answers;
  var sentences = content.sentences || [];
  var wrap = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Arrastra las palabras a los espacios correctos.';
  wrap.appendChild(instr);
  var allWords = [];
  sentences.forEach(function(s){ if (s.hasBlank && s.blanks) s.blanks.forEach(function(b){ if (b.answer) allWords.push(b.answer); }); });
  var bankWords = allWords.concat(content.distractors || []).sort(function(){ return Math.random() - 0.5; });
  var selected = null;
  var bankEls = [];
  function clearSel(){ bankEls.forEach(function(b){ b.classList.remove('sel'); }); }
  var bank = document.createElement('div'); bank.className = 'lp-dnd-bank';
  var drag = null;
  function blankFromPoint(x, y){
    var t = document.elementFromPoint(x, y);
    while (t && !(t.classList && t.classList.contains('lp-dnd-blank'))) t = t.parentElement;
    return t;
  }
  function onMove(e){
    if (!drag) return;
    var dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;
    if (!drag.moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      drag.moved = true;
      drag.srcEl.classList.add('dragging');
      var g = document.createElement('div'); g.className = 'lp-dnd-ghost'; g.textContent = drag.word;
      document.body.appendChild(g); drag.ghost = g;
    }
    if (drag.moved && drag.ghost){
      drag.ghost.style.left = (e.clientX - 14) + 'px';
      drag.ghost.style.top = (e.clientY - 16) + 'px';
      if (drag.over) drag.over.classList.remove('over');
      var b = blankFromPoint(e.clientX, e.clientY);
      drag.over = b; if (b) b.classList.add('over');
    }
  }
  function onUp(e){
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    if (!drag) return;
    var d = drag; drag = null;
    if (d.moved){
      if (d.ghost) d.ghost.remove();
      d.srcEl.classList.remove('dragging');
      if (d.over) d.over.classList.remove('over');
      var b = blankFromPoint(e.clientX, e.clientY);
      if (b && b._lpPlace) b._lpPlace(d.word, d.srcEl);
      selected = null; clearSel();
    } else {
      if (selected && selected.el === d.srcEl) { selected = null; clearSel(); }
      else { selected = { word: d.word, el: d.srcEl }; clearSel(); d.srcEl.classList.add('sel'); }
    }
  }
  bankWords.forEach(function(w){
    var el = document.createElement('span'); el.className = 'lp-dnd-word'; el.textContent = w;
    el.addEventListener('pointerdown', function(e){
      if (el.classList.contains('used')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      drag = { word: w, srcEl: el, ghost: null, over: null, startX: e.clientX, startY: e.clientY, moved: false };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
    bankEls.push(el); bank.appendChild(el);
  });
  wrap.appendChild(bank);
  sentences.forEach(function(s, si){
    if (!s.hasBlank || !s.parts) { var pr = document.createElement('p'); pr.className = 'lp-sentence'; pr.textContent = s.text || ''; wrap.appendChild(pr); return; }
    var line = document.createElement('div'); line.className = 'lp-sentence';
    s.parts.forEach(function(part, pi){
      var seg = document.createElement('span'); seg.textContent = part; line.appendChild(seg);
      if (pi < s.blanks.length) {
        var blank = s.blanks[pi] || {};
        var key = si + '-' + pi;
        var blankEl = document.createElement('span'); blankEl.className = 'lp-dnd-blank';
        function place(word, srcEl){
          if (!word) return;
          if (blankEl._srcEl) blankEl._srcEl.classList.remove('used');
          blankEl.textContent = word;
          if (srcEl) { srcEl.classList.add('used'); blankEl._srcEl = srcEl; } else { blankEl._srcEl = null; }
          var ok = word.toLowerCase() === (blank.answer || '').trim().toLowerCase();
          blankEl.className = 'lp-dnd-blank ' + (ok ? 'filled-correct' : 'filled-wrong');
          answers[key] = { correct: ok, answer: word };
          refreshScore();
        }
        blankEl._lpPlace = place;
        blankEl.addEventListener('click', function(){ if (selected) { place(selected.word, selected.el); selected = null; clearSel(); } });
        line.appendChild(blankEl);
      }
    });
    wrap.appendChild(line);
  });
  state.score = function(){
    var total = 0, correct = 0;
    sentences.forEach(function(s, si){ if (!s.hasBlank || !s.blanks) return; s.blanks.forEach(function(b, bi){ total++; var a = answers[si+'-'+bi]; if (a && a.correct) correct++; }); });
    return { correct: correct, total: total };
  };
  state.detail = function(){
    var d = [];
    sentences.forEach(function(s, si){ if (!s.hasBlank || !s.blanks) return; s.blanks.forEach(function(b, bi){ var a = answers[si+'-'+bi] || {}; d.push({ key: si+'-'+bi, questionText: (s.parts||[]).join(' ___ '), answer: a.answer || '', isCorrect: !!a.correct }); }); });
    return d;
  };
  return wrap;
}

// -- LegoPassToggle ----------------------------------------
// Ojo de mostrar/ocultar contraseña. Envuelve el input y agrega el botón.
//   LegoPassToggle(document.getElementById('login-pass'))
function LegoPassToggle(input){
  if (!input || input._passToggle) return;
  input._passToggle = true;
  var holder = document.createElement('div');
  holder.style.cssText = 'position:relative';
  if (input.parentElement) input.parentElement.insertBefore(holder, input);
  holder.appendChild(input);
  input.style.paddingRight = '38px';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Mostrar u ocultar la contraseña');
  btn.style.cssText = 'position:absolute;top:50%;right:10px;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);padding:0;display:flex;align-items:center';
  btn.appendChild(LegoIcon('ti-eye'));
  btn.onclick = function(){
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.replaceChildren(LegoIcon(show ? 'ti-eye-off' : 'ti-eye'));
  };
  holder.appendChild(btn);
  return btn;
}

function _lpReviewScoreHeader(saved){
  var graded = (saved||[]).filter(function(s){ return s.isCorrect !== null && s.isCorrect !== undefined; });
  var correct = graded.filter(function(s){ return s.isCorrect; }).length;
  var h = document.createElement('div');
  h.className = 'lp-score';
  h.textContent = correct + ' de ' + graded.length + ' correctas';
  return h;
}
function _lpReviewFillBlank(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr';
  instr.textContent = content.instructions || 'Revision de tus respuestas.';
  wrap.appendChild(instr);
  var idx = 0;
  (content.sentences||[]).forEach(function(s){
    if (!s.hasBlank || !s.parts) {
      var pr = document.createElement('p'); pr.className = 'lp-sentence'; pr.textContent = s.text || ''; wrap.appendChild(pr); return;
    }
    var line = document.createElement('div'); line.className = 'lp-sentence';
    s.parts.forEach(function(part, pi){
      var seg = document.createElement('span'); seg.textContent = part; line.appendChild(seg);
      if (pi < s.blanks.length) {
        var blank = s.blanks[pi] || {};
        var sv = saved[idx] || {}; idx++;
        var span = document.createElement('span');
        span.className = 'lp-input ' + (sv.isCorrect ? 'correct' : 'wrong');
        span.style.cssText = 'display:inline-block;min-width:50px;font-weight:600';
        span.textContent = sv.answer || '(vacio)';
        line.appendChild(span);
        if (!sv.isCorrect && blank.answer) {
          var corr = document.createElement('span');
          corr.style.cssText = 'font-size:11px;color:var(--green);margin:0 5px';
          corr.textContent = blank.answer;
          line.appendChild(corr);
        }
      }
    });
    wrap.appendChild(line);
  });
  return wrap;
}
function _lpReviewMC(content, activity, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var readingText = content.readingText || (activity && activity.reading_text) || '';
  if (readingText) { var rt = document.createElement('div'); rt.className = 'lp-text'; rt.textContent = readingText; wrap.appendChild(rt); }
  var questions = content.questions || [];
  questions.forEach(function(q, qi){
    var sv = saved[qi] || {};
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var qrow = document.createElement('div'); qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(q.num || qi+1);
    var qtext = document.createElement('span'); qtext.style.flex = '1'; qtext.textContent = q.text || q.q || '';
    qrow.appendChild(num); qrow.appendChild(qtext); block.appendChild(qrow);
    if (q.type === 'open') {
      var ta = document.createElement('div'); ta.className = 'lp-open'; ta.style.whiteSpace = 'pre-wrap';
      ta.textContent = sv.answer || '(vacio)';
      block.appendChild(ta);
    } else {
      var opts2 = q.opts || [];
      var correctIdx = q.correct !== undefined ? q.correct : (q.ans || 0);
      var optsWrap = document.createElement('div'); optsWrap.className = 'lp-mc-opts';
      opts2.forEach(function(o, oi){
        var b = document.createElement('div'); b.className = 'lp-mc-opt';
        if (oi === correctIdx) b.className = 'lp-mc-opt correct';
        else if (o === sv.answer) b.className = 'lp-mc-opt wrong';
        b.textContent = o;
        optsWrap.appendChild(b);
      });
      block.appendChild(optsWrap);
    }
    wrap.appendChild(block);
  });
  return wrap;
}
function _lpReviewList(saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  (saved||[]).forEach(function(sv){
    var row = document.createElement('div'); row.className = 'lp-mc-block';
    var q = document.createElement('div'); q.className = 'lp-mc-q'; q.textContent = sv.questionText || '';
    var ok = sv.isCorrect;
    var col = ok ? 'var(--green)' : ((ok === null || ok === undefined) ? 'var(--muted)' : 'var(--red)');
    var a = document.createElement('div');
    a.style.cssText = 'font-size:14px;font-weight:600;color:' + col;
    a.textContent = sv.answer || '(vacio)';
    row.appendChild(q); row.appendChild(a);
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpReview(content, activity, type, saved){
  if (type === 'fill-blank' || type === 'dropdown') return _lpReviewFillBlank(content, saved);
  if (type === 'mc' || type === 'reading') return _lpReviewMC(content, activity, saved);
  return _lpReviewList(saved);
}

function _lpEditable(value, onSave){
  if (!document.getElementById('lego-edit-styles')) {
    var est = document.createElement('style');
    est.id = 'lego-edit-styles';
    est.textContent = '.lp-edit{border-bottom:1px dashed var(--coral);outline:none;cursor:text;padding:0 2px;min-width:24px;display:inline-block}.lp-edit:focus{background:var(--coral-lt,#FDF0E4)}';
    document.head.appendChild(est);
  }
  var s = document.createElement('span');
  s.className = 'lp-edit';
  s.contentEditable = 'true';
  s.spellcheck = false;
  s.textContent = (value === undefined || value === null) ? '' : value;
  s.addEventListener('blur', function(){ if (onSave) onSave(s.textContent); });
  return s;
}
function _lpEditInstr(content, wrap){
  var instr = document.createElement('div'); instr.className = 'lp-instr';
  instr.appendChild(_lpEditable(content.instructions || '', function(v){ content.instructions = v; }));
  wrap.appendChild(instr);
}
function _lpEditFillBlank(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.sentences||[]).forEach(function(s){
    var line = document.createElement('div'); line.className = 'lp-sentence';
    if (!s.hasBlank || !s.parts) {
      line.appendChild(_lpEditable(s.text || '', function(v){ s.text = v; }));
      wrap.appendChild(line); return;
    }
    s.parts.forEach(function(part, pi){
      line.appendChild(_lpEditable(part, function(v){ s.parts[pi] = v; }));
      if (pi < (s.blanks||[]).length) {
        var blank = s.blanks[pi] || {};
        var box = document.createElement('span'); box.className = 'lp-input correct'; box.style.margin = '0 4px';
        box.appendChild(_lpEditable(blank.answer || '', function(v){ blank.answer = v; }));
        line.appendChild(box);
      }
    });
    wrap.appendChild(line);
  });
  if (content.distractors && content.distractors.length) {
    var dl = document.createElement('div'); dl.className = 'lp-instr'; dl.style.marginTop = '12px'; dl.textContent = 'Distractores';
    wrap.appendChild(dl);
    var dbank = document.createElement('div'); dbank.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
    content.distractors.forEach(function(d, di){
      var chip = document.createElement('span'); chip.className = 'lp-input wrong'; chip.style.margin = '2px';
      chip.appendChild(_lpEditable(d, function(v){ content.distractors[di] = v; }));
      dbank.appendChild(chip);
    });
    wrap.appendChild(dbank);
  }
  return wrap;
}
function _lpEditMC(content, activity){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  if (content.readingText !== undefined && content.readingText !== null) {
    var rt = document.createElement('div'); rt.className = 'lp-text';
    rt.appendChild(_lpEditable(content.readingText || '', function(v){ content.readingText = v; }));
    wrap.appendChild(rt);
  }
  (content.questions||[]).forEach(function(q, qi){
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var qrow = document.createElement('div'); qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(qi+1);
    var qt = document.createElement('span'); qt.style.flex = '1';
    qt.appendChild(_lpEditable(q.text || q.q || '', function(v){ q.text = v; }));
    qrow.appendChild(num); qrow.appendChild(qt); block.appendChild(qrow);
    var opts = q.opts || [];
    var correctIdx = q.correct !== undefined ? q.correct : (q.ans || 0);
    var ow = document.createElement('div'); ow.className = 'lp-mc-opts';
    opts.forEach(function(o, oi){
      var b = document.createElement('div'); b.className = 'lp-mc-opt' + (oi === correctIdx ? ' correct' : '');
      b.appendChild(_lpEditable(o, function(v){ q.opts[oi] = v; }));
      ow.appendChild(b);
    });
    block.appendChild(ow);
    wrap.appendChild(block);
  });
  return wrap;
}
function _lpEditMatch(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.pairs||[]).forEach(function(p){
    var row = document.createElement('div'); row.style.cssText = 'display:flex;gap:12px;margin-bottom:8px;align-items:center';
    var left = document.createElement('div'); left.className = 'lp-mc-opt'; left.style.flex = '1';
    left.appendChild(_lpEditable(p.left || '', function(v){ p.left = v; }));
    var right = document.createElement('div'); right.className = 'lp-mc-opt'; right.style.flex = '1';
    right.appendChild(_lpEditable(p.right || '', function(v){ p.right = v; }));
    row.appendChild(left); row.appendChild(right);
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpEditTrueFalse(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.statements||[]).forEach(function(s){
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var row = document.createElement('div'); row.className = 'lp-mc-q';
    row.appendChild(_lpEditable(s.text || '', function(v){ s.text = v; }));
    block.appendChild(row);
    var tag = document.createElement('span'); tag.className = 'lp-mc-opt' + (s.correct ? ' correct' : ' wrong'); tag.style.display = 'inline-block';
    tag.textContent = s.correct ? 'Verdadero' : 'Falso';
    block.appendChild(tag);
    wrap.appendChild(block);
  });
  return wrap;
}
function _lpEditOrder(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.events||[]).forEach(function(ev, i){
    var row = document.createElement('div'); row.className = 'lp-sentence';
    row.appendChild(document.createTextNode((i+1) + '. '));
    row.appendChild(_lpEditable(ev, function(v){ content.events[i] = v; }));
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpEditVocab(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  var grid = document.createElement('div'); grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
  (content.wordList||[]).forEach(function(w, i){
    var heard = (content.wordsHeard || []).indexOf(w) !== -1;
    var chip = document.createElement('span'); chip.className = 'lp-mc-opt' + (heard ? ' correct' : '');
    chip.appendChild(_lpEditable(w, function(v){ content.wordList[i] = v; }));
    grid.appendChild(chip);
  });
  wrap.appendChild(grid);
  return wrap;
}
function _lpEditAudio(content, activity){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  var sub = content.audioType || content.subtype || 'comprehension';
  if (sub === 'comprehension' || sub === 'mc') wrap.appendChild(_lpEditMC(content, activity));
  else if (sub === 'fillblank') wrap.appendChild(_lpEditFillBlank(content));
  else if (sub === 'truefalse') wrap.appendChild(_lpEditTrueFalse(content));
  else if (sub === 'order') wrap.appendChild(_lpEditOrder(content));
  else if (sub === 'vocab') wrap.appendChild(_lpEditVocab(content));
  else { var n = document.createElement('div'); n.className = 'lp-instr'; n.textContent = 'Subtipo de audio sin edicion inline.'; wrap.appendChild(n); }
  return wrap;
}
function _lpEditMixed(content, activity){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.sections||[]).forEach(function(sec, si){
    var secWrap = document.createElement('div'); secWrap.style.cssText = 'margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border)';
    var t = document.createElement('div'); t.className = 'lp-instr';
    t.appendChild(document.createTextNode((si+1) + '. '));
    t.appendChild(_lpEditable(sec.title || '', function(v){ sec.title = v; }));
    secWrap.appendChild(t);
    if (sec.type === 'mc' || sec.type === 'truefalse') secWrap.appendChild(_lpEditMC(sec, activity));
    else secWrap.appendChild(_lpEditFillBlank(sec));
    wrap.appendChild(secWrap);
  });
  return wrap;
}
function _lpEdit(content, activity, type){
  if (type === 'mc' || type === 'reading') return _lpEditMC(content, activity);
  if (type === 'match') return _lpEditMatch(content);
  if (type === 'mixed') return _lpEditMixed(content, activity);
  if (type === 'audio') return _lpEditAudio(content, activity);
  return _lpEditFillBlank(content);
}
