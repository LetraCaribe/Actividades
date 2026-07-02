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
    '.lego-inner-panel{padding:12px;}.lego-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:1000;}.lego-modal{background:var(--white);border-radius:var(--r);width:90%;max-width:560px;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column;}.lego-modal-header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);}.lego-modal-m0{flex-shrink:0;}.lego-modal-m1{flex:1;font-size:16px;font-weight:600;color:var(--ink);text-align:center;}.lego-modal-m6{flex-shrink:0;}.lego-modal-m2{font-size:13px;color:var(--muted);padding:10px 20px;border-bottom:1px solid var(--border);text-align:center;}.lego-modal-m3{padding:20px;}.lego-modal-m4{padding:0 20px 16px;}.lego-modal-actions{display:flex;gap:8px;padding:14px 20px;border-top:1px solid var(--border);}.lego-modal-m5{flex:1;}.lego-modal-m7{flex:1;}.lego-modal-footer{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-top:1px solid var(--border);font-size:12px;color:var(--muted);}.lego-modal-m8,.lego-modal-m9,.lego-modal-m10{}.lego-modal--tall{height:90vh}.lego-modal--tall .lego-modal-m3{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}.lego-modal--wide{max-width:1100px}'
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
  if (!LegoModal._stack) LegoModal._stack = [];
  LegoModal._stack.push(overlay);

  LegoModal.close = function() {
    var ov = (LegoModal._stack && LegoModal._stack.length) ? LegoModal._stack.pop() : overlay;
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
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

// -- LegoLibraryMaterial ------------------------------------
// Card sellada para materiales de biblioteca. Reusa LegoCard + LegoChip.
//   LegoLibraryMaterial(item, { grammarName:'Ser/estar', onRead:fn, onEdit:fn, onDelete:fn })
function LegoLibraryMaterial(item, opts) {
  item = item || {};
  opts = opts || {};

  var grammarName = opts.grammarName || '';
  if (!grammarName && item.grammar_categories && item.grammar_categories.name) {
    grammarName = item.grammar_categories.name;
  }

  function action(label, fn, danger) {
    if (typeof fn !== 'function') return '';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm';
    btn.textContent = label;
    if (danger) btn.style.color = 'var(--red)';
    btn.onclick = function() { fn(item); };
    return btn;
  }

  return LegoCard({
    L2: item.title || 'Material sin titulo',
    L3: item.description || '',
    L4: LegoChip(item.level || 'A1', 'level'),
    L5: grammarName ? LegoChip(grammarName, 'cat') : '',
    L8: action('Leer', opts.onRead, false),
    L9: action('Editar', opts.onEdit, false),
    L10: action('Eliminar', opts.onDelete, true)
  });
}


// -- LegoPdfViewer ------------------------------------------
// Visor especializado para PDFs de Google Drive dentro de Biblioteca.
//   LegoPdfViewer({ title, driveUrl, previewUrl }) -> nodo DOM
function LegoPdfViewer(section, opts) {
  section = section || {};
  opts = opts || {};

  if (!document.getElementById('lego-pdf-viewer-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-pdf-viewer-styles';
    st.textContent = '.lego-pdf-reader{position:fixed;inset:0;z-index:2000;background:#1C1A17;display:flex;flex-direction:column}.lego-pdf-reader__bar{height:58px;display:flex;align-items:center;gap:10px;padding:0 18px;background:var(--white);border-bottom:1px solid var(--border);flex-shrink:0}.lego-pdf-reader__title{font-size:16px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lego-pdf-reader__spacer{flex:1}.lego-pdf-reader__frame{width:100%;height:calc(100vh - 58px);border:0;background:#1C1A17;display:block}.lego-pdf-inline{display:flex;flex-direction:column;gap:10px;min-height:0;flex:1}.lego-pdf-inline__frame{width:100%;flex:1;min-height:520px;border:1px solid var(--border);border-radius:var(--r);background:var(--sand)}.lego-pdf-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.lego-pdf-hint{font-size:12px;color:var(--muted);margin-left:auto}@media(max-width:720px){.lego-pdf-reader__bar{height:54px;padding:0 10px}.lego-pdf-reader__title{font-size:14px}.lego-pdf-reader__frame{height:calc(100vh - 54px)}.lego-pdf-hint{display:none}}';
    document.head.appendChild(st);
  }

  var previewUrl = section.previewUrl || '';
  var driveUrl = section.driveUrl || previewUrl;

  function addActions(parent) {
    var actions = document.createElement('div');
    actions.className = 'lego-pdf-actions';
    if (driveUrl) {
      var openBtn = document.createElement('a');
      openBtn.className = 'btn btn-coral';
      openBtn.href = driveUrl;
      openBtn.target = '_blank';
      openBtn.rel = 'noopener';
      openBtn.textContent = 'Abrir en Drive';
      actions.appendChild(openBtn);
    }
    if (previewUrl) {
      var previewBtn = document.createElement('a');
      previewBtn.className = 'btn';
      previewBtn.href = previewUrl;
      previewBtn.target = '_blank';
      previewBtn.rel = 'noopener';
      previewBtn.textContent = 'Abrir preview';
      actions.appendChild(previewBtn);
    }
    parent.appendChild(actions);
  }

  if (opts.fullscreen) {
    var reader = document.createElement('div');
    reader.className = 'lego-pdf-reader';

    var bar = document.createElement('div');
    bar.className = 'lego-pdf-reader__bar';

    var title = document.createElement('div');
    title.className = 'lego-pdf-reader__title';
    title.textContent = opts.title || section.title || 'PDF';
    bar.appendChild(title);

    var spacer = document.createElement('div');
    spacer.className = 'lego-pdf-reader__spacer';
    bar.appendChild(spacer);

    if (driveUrl) {
      var driveBtn = document.createElement('a');
      driveBtn.className = 'btn btn-sm';
      driveBtn.href = driveUrl;
      driveBtn.target = '_blank';
      driveBtn.rel = 'noopener';
      driveBtn.textContent = 'Drive';
      bar.appendChild(driveBtn);
    }

    var closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-sm';
    closeBtn.type = 'button';
    closeBtn.textContent = 'Cerrar';
    closeBtn.onclick = function() { if (reader.parentNode) reader.parentNode.removeChild(reader); };
    bar.appendChild(closeBtn);
    reader.appendChild(bar);

    if (previewUrl) {
      var fullFrame = document.createElement('iframe');
      fullFrame.className = 'lego-pdf-reader__frame';
      fullFrame.src = previewUrl;
      fullFrame.title = section.title || 'PDF de Google Drive';
      fullFrame.loading = 'lazy';
      fullFrame.allow = 'autoplay';
      reader.appendChild(fullFrame);
    } else {
      reader.appendChild(LegoEmpty({ text: 'Este PDF no tiene enlace de preview.' }));
    }

    document.body.appendChild(reader);
    return reader;
  }

  var wrap = document.createElement('div');
  wrap.className = 'lego-pdf-inline';

  if (previewUrl) {
    var frame = document.createElement('iframe');
    frame.className = 'lego-pdf-inline__frame';
    frame.src = previewUrl;
    frame.title = section.title || 'PDF de Google Drive';
    frame.loading = 'lazy';
    frame.allow = 'autoplay';
    wrap.appendChild(frame);
  } else {
    wrap.appendChild(LegoEmpty({ text: 'Este PDF no tiene enlace de preview.' }));
  }

  addActions(wrap);
  var hint = document.createElement('span');
  hint.className = 'lego-pdf-hint';
  hint.textContent = 'Si no carga, revisa que Drive permita ver con el enlace.';
  wrap.lastChild.appendChild(hint);
  return wrap;
}


// -- LegoLibraryViewer --------------------------------------
// Visor de un material de biblioteca dentro de un LegoModal. Sellado con textContent.
// Reusado en index (estudiante lee) y admin (preview del profesor).
//   LegoLibraryViewer(item)  // item: { title, level, content:{sections:[]}, grammar_categories:{name} | grammarName }
function _llpImgSrc(url) {
  url = (url || '').trim();
  var m = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  if (m && m[1]) return 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w1200';
  return url;
}

function LegoLibraryViewer(item) {
  item = item || {};
  var content = item.content || {};
  var sections = (content && content.sections) || [];
  var hasPdfDrive = sections.some(function(section) { return section && section.type === 'pdf-drive'; });
  if (hasPdfDrive) {
    var pdfSection = sections.find(function(section) { return section && section.type === 'pdf-drive'; });
    return LegoPdfViewer(pdfSection, { fullscreen: true, title: item.title || (pdfSection && pdfSection.title) || 'PDF' });
  }

  if (!document.getElementById('lego-libpage-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-libpage-styles';
    st.textContent = [
      '.lego-libpage{font-family:Arial,Helvetica,sans-serif;color:#1C1A17;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-hero{background:linear-gradient(135deg,#D4522A,#A83E1E 60%,#B54D07);padding:24px 28px;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-kick{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;opacity:.9}',
      '.llp-title{font-family:Georgia,"Times New Roman",serif;font-size:36px;line-height:1.05;margin:6px 0 8px}',
      '.llp-sub{font-size:13.5px;line-height:1.5;opacity:.93;max-width:560px;margin:0}',
      '.llp-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}',
      '.llp-chip{background:rgba(255,255,255,.92);color:#A83E1E;border-radius:999px;font-size:11px;font-weight:800;padding:5px 11px}',
      '.llp-body{padding:22px 28px 26px}',
      '.llp-h{font-family:Georgia,"Times New Roman",serif;font-size:18px;color:#1C1A17;margin:18px 0 8px}',
      '.llp-body>.llp-h:first-child{margin-top:0}',
      '.llp-p{font-size:14px;line-height:1.65;color:#4A4540;margin:0 0 12px;white-space:pre-wrap;background:linear-gradient(180deg,#fff,#F5F0E8);border:1px solid #E0DAD2;border-radius:12px;padding:12px 14px;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-ex{font-size:14px;line-height:1.6;color:#4A4540;font-style:italic;background:linear-gradient(180deg,#fff,#F5F0E8);border:1px solid #E0DAD2;border-radius:12px;padding:12px 14px;margin:0 0 12px;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-table{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px;margin:0 0 12px}',
      '.llp-table td{padding:9px 12px;background:linear-gradient(180deg,#fff,#F5F0E8);border:1px solid #E0DAD2;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-table tr:first-child td{background:#A83E1E;color:#fff;font-weight:700}',
      '.llp-table tr:not(:first-child) td.llp-c0{background:linear-gradient(180deg,#fff,#E4F5E8)}.llp-table tr:not(:first-child) td.llp-c1{background:linear-gradient(180deg,#fff,#E4F2F4)}.llp-table tr:not(:first-child) td.llp-c2{background:linear-gradient(180deg,#fff,#F8EBC5)}.llp-table tr:not(:first-child) td.llp-c3{background:linear-gradient(180deg,#fff,#E6F5FB)}.llp-table tr:not(:first-child) td.llp-c4{background:linear-gradient(180deg,#fff,#FBE8FA)}',
      '.llp-conj{display:flex;flex-direction:column;gap:8px;margin:0 0 14px}.llp-conj-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.llp-conj-p{border-radius:11px;padding:9px 12px;text-align:center;font-weight:700;font-size:14px;background:linear-gradient(180deg,#fff,#E4F5E8);border:1px solid #E0DAD2;box-shadow:0 6px 14px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-conj-f{border-radius:11px;padding:9px 12px;text-align:center;font-weight:800;font-size:15px;color:#C41E1E;background:linear-gradient(180deg,#fff,#FDF0E4);border:1px solid #E0DAD2;box-shadow:0 6px 14px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-vcards{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:0 0 14px}.llp-vcard{border-radius:16px;padding:14px;text-align:center;border:2px solid #E0DAD2;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-vc0{border-color:#E8670A;background:linear-gradient(180deg,#fff,#FDF0E4)}.llp-vc1{border-color:#1E6B72;background:linear-gradient(180deg,#fff,#E4F2F4)}.llp-vc2{border-color:#7AB010;background:linear-gradient(180deg,#fff,#F0F7DC)}.llp-vc3{border-color:#C49A2A;background:linear-gradient(180deg,#fff,#F8EBC5)}.llp-vcard-name{font-weight:800;font-size:16px;text-transform:uppercase;letter-spacing:.02em;color:#1C1A17;margin-bottom:6px}.llp-vcard-ex{font-size:13px;color:#4A4540;line-height:1.35}',
      '.llp-formula{background:linear-gradient(180deg,#fff,#FBE8FA);border:2px solid #EFA7E9;border-radius:16px;padding:14px 16px;text-align:center;font-size:18px;font-weight:800;line-height:1.4;color:#1C1A17;box-shadow:0 8px 18px rgba(28,26,23,.05);margin:0 0 10px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-formula .hi{color:#C41E1E}.llp-tokens{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin:0 0 14px}.llp-token{border-radius:10px;padding:6px 11px;font-size:13px;font-weight:800;-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-tk0{background:linear-gradient(180deg,#fff,#FEECEC);color:#C41E1E;border:1px solid rgba(196,30,30,.18)}.llp-tk1{background:linear-gradient(180deg,#fff,#F8EBC5);color:#854F0B;border:1px solid rgba(196,154,42,.22)}.llp-tk2{background:linear-gradient(180deg,#fff,#E6F5FB);color:#185FA5;border:1px solid rgba(145,211,240,.45)}.llp-tk3{background:linear-gradient(180deg,#fff,#E4F5E8);color:#1A7A2A;border:1px solid rgba(26,122,42,.2)}.llp-tk4{background:linear-gradient(180deg,#fff,#E4F2F4);color:#0F6E56;border:1px solid rgba(30,107,114,.2)}',
      '.llp-excards{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin:0 0 14px}.llp-excard{border:2px solid #E0DAD2;border-radius:14px;overflow:hidden;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-excard-h{padding:11px 14px;font-family:Georgia,"Times New Roman",serif;font-size:15px;font-weight:700;border-bottom:1px solid rgba(28,26,23,.08);color:#1C1A17}.llp-exc0{border-color:#E8670A;background:linear-gradient(180deg,#fff,#FDF0E4)}.llp-exc1{border-color:#1E6B72;background:linear-gradient(180deg,#fff,#E4F2F4)}.llp-exc2{border-color:#7AB010;background:linear-gradient(180deg,#fff,#F0F7DC)}.llp-exc3{border-color:#C49A2A;background:linear-gradient(180deg,#fff,#F8EBC5)}.llp-excard-list{margin:0;padding:12px 14px 14px 30px}.llp-excard-list li{font-size:13px;line-height:1.45;color:#4A4540;margin:0 0 8px}.llp-excard-list li:last-child{margin-bottom:0}',
      '.llp-table td:first-child{border-radius:10px 0 0 10px}',
      '.llp-table td:last-child{border-radius:0 10px 10px 0}',
      '.llp-img{max-width:100%;border-radius:12px;margin:6px 0;display:block}',
      '.llp-cap{font-size:12px;color:#8C8479;text-align:center;margin:0 0 12px}',
      '.llp-foot{display:flex;justify-content:space-between;color:#8C8479;font-size:11px;border-top:1px solid #E0DAD2;padding-top:14px;margin-top:20px}',
      '.llp-foot b{color:#A83E1E}',
      '@media print{body.printing-lib>*:not(.lego-modal-overlay){display:none!important}body.printing-lib .lego-modal-overlay{position:static!important;background:#fff!important;padding:0!important;display:block!important}body.printing-lib .lego-modal{box-shadow:none!important;max-width:none!important;width:100%!important;max-height:none!important;border:0!important;border-radius:0!important}body.printing-lib .lego-modal-header,body.printing-lib .lego-modal-actions{display:none!important}body.printing-lib .lego-modal-m3{padding:0!important;overflow:visible!important}@page{size:letter;margin:0.4in}}'
    ].join('');
    document.head.appendChild(st);
  }

  var page = document.createElement('div');
  page.className = 'lego-libpage';

  // hero
  var hero = document.createElement('div');
  hero.className = 'llp-hero';
  var kick = document.createElement('div');
  kick.className = 'llp-kick';
  kick.textContent = 'Letra Caribe Language School';
  hero.appendChild(kick);
  var title = document.createElement('div');
  title.className = 'llp-title';
  title.textContent = item.title || 'Material';
  hero.appendChild(title);
  if (item.description) {
    var sub = document.createElement('div');
    sub.className = 'llp-sub';
    sub.textContent = item.description;
    hero.appendChild(sub);
  }
  var chips = document.createElement('div');
  chips.className = 'llp-chips';
  var lvlChip = document.createElement('span');
  lvlChip.className = 'llp-chip';
  lvlChip.textContent = item.level || 'A1';
  chips.appendChild(lvlChip);
  var gramName = (item.grammar_categories && item.grammar_categories.name) || item.grammarName || '';
  if (gramName) {
    var catChip = document.createElement('span');
    catChip.className = 'llp-chip';
    catChip.textContent = gramName;
    chips.appendChild(catChip);
  }
  hero.appendChild(chips);
  page.appendChild(hero);

  // body
  var body = document.createElement('div');
  body.className = 'llp-body';

  function heading(txt) {
    var h = document.createElement('div');
    h.className = 'llp-h';
    h.textContent = txt;
    return h;
  }

  if (!sections.length) {
    body.appendChild(LegoEmpty({ text: 'Este material no tiene contenido todavia.' }));
  }

  sections.forEach(function(section) {
    if (section.type === 'text') {
      if (section.title) body.appendChild(heading(section.title));
      var p = document.createElement('p');
      p.className = 'llp-p';
      p.textContent = section.body || '';
      body.appendChild(p);
    } else if (section.type === 'table') {
      if (section.title) body.appendChild(heading(section.title));
      var table = document.createElement('table');
      table.className = 'llp-table';
      (section.rows || []).forEach(function(rowArr, rIdx) {
        var tr = document.createElement('tr');
        (Array.isArray(rowArr) ? rowArr : Object.values(rowArr || {})).forEach(function(val, cIdx) {
          var td = document.createElement('td');
          td.textContent = (val === null || val === undefined) ? '' : val;
          if (rIdx > 0) td.className = 'llp-c' + (cIdx % 5);
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      body.appendChild(table);
    } else if (section.type === 'exercise') {
      if (section.title) body.appendChild(heading(section.title));
      var ex = document.createElement('p');
      ex.className = 'llp-ex';
      ex.textContent = section.text || '';
      body.appendChild(ex);
    } else if (section.type === 'conjugation') {
      if (section.title) body.appendChild(heading(section.title));
      var cj = document.createElement('div');
      cj.className = 'llp-conj';
      (section.rows || []).forEach(function(pair) {
        var cr = document.createElement('div');
        cr.className = 'llp-conj-row';
        var cp = document.createElement('div');
        cp.className = 'llp-conj-p';
        cp.textContent = (pair && pair[0]) || '';
        var cf = document.createElement('div');
        cf.className = 'llp-conj-f';
        cf.textContent = (pair && pair[1]) || '';
        cr.appendChild(cp); cr.appendChild(cf);
        cj.appendChild(cr);
      });
      body.appendChild(cj);
    } else if (section.type === 'verb-cards') {
      if (section.title) body.appendChild(heading(section.title));
      var vc = document.createElement('div');
      vc.className = 'llp-vcards';
      (section.rows || []).forEach(function(pair, i) {
        var card = document.createElement('div');
        card.className = 'llp-vcard llp-vc' + (i % 4);
        var nm = document.createElement('div');
        nm.className = 'llp-vcard-name';
        nm.textContent = (pair && pair[0]) || '';
        var ex = document.createElement('div');
        ex.className = 'llp-vcard-ex';
        ex.textContent = (pair && pair[1]) || '';
        card.appendChild(nm); card.appendChild(ex);
        vc.appendChild(card);
      });
      body.appendChild(vc);
    } else if (section.type === 'formula') {
      if (section.title) body.appendChild(heading(section.title));
      if (section.formula) {
        var fb = document.createElement('div');
        fb.className = 'llp-formula';
        String(section.formula).split('*').forEach(function(seg, i) {
          if (seg === '') return;
          if (i % 2 === 1) {
            var hi = document.createElement('span');
            hi.className = 'hi';
            hi.textContent = seg;
            fb.appendChild(hi);
          } else {
            fb.appendChild(document.createTextNode(seg));
          }
        });
        body.appendChild(fb);
      }
      if (section.tokens && section.tokens.length) {
        var tkRow = document.createElement('div');
        tkRow.className = 'llp-tokens';
        section.tokens.forEach(function(tk, i) {
          if (!tk) return;
          var sp = document.createElement('span');
          sp.className = 'llp-token llp-tk' + (i % 5);
          sp.textContent = tk;
          tkRow.appendChild(sp);
        });
        body.appendChild(tkRow);
      }
    } else if (section.type === 'examples') {
      if (section.title) body.appendChild(heading(section.title));
      var eg = document.createElement('div');
      eg.className = 'llp-excards';
      (section.cards || []).forEach(function(card, ci) {
        var c = document.createElement('div');
        c.className = 'llp-excard llp-exc' + (ci % 4);
        var h = document.createElement('div');
        h.className = 'llp-excard-h';
        h.textContent = (card && card.heading) || '';
        c.appendChild(h);
        var ol = document.createElement('ol');
        ol.className = 'llp-excard-list';
        ((card && card.items) || []).forEach(function(it) {
          if (it === '' || it == null) return;
          var li = document.createElement('li');
          li.textContent = it;
          ol.appendChild(li);
        });
        c.appendChild(ol);
        eg.appendChild(c);
      });
      body.appendChild(eg);
    } else if (section.type === 'image') {
      if (section.url) {
        var img = document.createElement('img');
        img.className = 'llp-img';
        img.src = _llpImgSrc(section.url);
        img.alt = section.caption || '';
        body.appendChild(img);
      }
      if (section.caption) {
        var cap = document.createElement('p');
        cap.className = 'llp-cap';
        cap.textContent = section.caption;
        body.appendChild(cap);
      }
    }
  });

  var foot = document.createElement('div');
  foot.className = 'llp-foot';
  var fb = document.createElement('b');
  fb.textContent = 'Letra Caribe';
  var fs = document.createElement('span');
  fs.textContent = item.title || '';
  foot.appendChild(fb);
  foot.appendChild(fs);
  body.appendChild(foot);
  page.appendChild(body);

  // botones
  var xBtn = document.createElement('button');
  xBtn.className = 'btn';
  xBtn.style.cssText = 'background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)';
  xBtn.appendChild(LegoIcon('ti-x'));
  xBtn.onclick = function() { if (window.LegoModal && LegoModal.close) LegoModal.close(); };

  var btnPrint = document.createElement('button');
  btnPrint.className = 'btn btn-coral';
  btnPrint.textContent = 'Imprimir / PDF';
  btnPrint.onclick = function() {
    document.body.classList.add('printing-lib');
    window.print();
    document.body.classList.remove('printing-lib');
  };

  var cerrar = document.createElement('button');
  cerrar.className = 'btn';
  cerrar.textContent = 'Cerrar';
  cerrar.onclick = function() { if (window.LegoModal && LegoModal.close) LegoModal.close(); };

  var overlay = LegoModal({ M6: xBtn, M3: page, M5: btnPrint, M7: cerrar });
  var m3 = overlay.querySelector('.lego-modal-m3');
  if (m3) m3.style.padding = '0';
  var m = overlay.querySelector('.lego-modal');
  if (m) m.style.maxWidth = '760px';
  return overlay;
}

// -- LegoLibraryFilters -------------------------------------
// Barra de filtros para biblioteca: busqueda + nivel + categoria. Compartida admin/index.
//   LegoLibraryFilters({ items, catName, onFilter })  catName(item)->string ; onFilter(filtered)
function LegoLibraryFilters(opts) {
  opts = opts || {};
  var items = opts.items || [];
  var catName = opts.catName || function(it){ return (it.grammar_categories && it.grammar_categories.name) || ''; };
  var onFilter = opts.onFilter || function(){};

  var ctrlCss = 'padding:8px 10px;border:1px solid var(--border);border-radius:var(--r);font-size:13px;font-family:inherit;background:var(--white);color:var(--ink)';

  var bar = document.createElement('div');
  bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px';

  var search = document.createElement('input');
  search.type = 'text';
  search.placeholder = 'Buscar material...';
  search.style.cssText = 'flex:1;min-width:160px;' + ctrlCss;

  var levelOpts = [{ value:'', label:'Todos los niveles' }].concat(['A1','A2','B1','B2','C1'].map(function(l){ return { value:l, label:l }; }));
  var levelSel = LegoSelect({ options: levelOpts });
  levelSel.style.cssText = ctrlCss + ';min-width:130px';

  var cats = [];
  items.forEach(function(it){ var n = catName(it); if (n && cats.indexOf(n) === -1) cats.push(n); });
  cats.sort();
  var catOpts = [{ value:'', label:'Todas las categorias' }].concat(cats.map(function(c){ return { value:c, label:c }; }));
  var catSel = LegoSelect({ options: catOpts });
  catSel.style.cssText = ctrlCss + ';min-width:150px';

  function apply() {
    var q = (search.value || '').toLowerCase();
    var lvl = levelSel.value;
    var cat = catSel.value;
    var filtered = items.filter(function(it){
      var mQ = !q || ((it.title || '').toLowerCase().indexOf(q) !== -1) || ((it.description || '').toLowerCase().indexOf(q) !== -1);
      var mL = !lvl || it.level === lvl;
      var mC = !cat || catName(it) === cat;
      return mQ && mL && mC;
    });
    onFilter(filtered);
  }
  search.addEventListener('input', apply);
  levelSel.addEventListener('change', apply);
  catSel.addEventListener('change', apply);

  bar.appendChild(search); bar.appendChild(levelSel); bar.appendChild(catSel);
  return bar;
}

// -- LegoActionGrid -----------------------------------------
// Agrupa botones de accion en una grilla compacta. No crea botones: ordena nodos existentes.
//   LegoActionGrid([btnAsignar, btnEliminar, btnVer, btnEditar])
function LegoActionGrid(actions, opts) {
  opts = opts || {};
  if (!document.getElementById('lego-action-grid-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-action-grid-styles';
    st.textContent = '.lego-action-grid{display:grid;grid-template-columns:repeat(2,auto);gap:6px;align-items:center;justify-content:end}.lego-action-grid .btn{width:38px;height:32px;justify-content:center;padding:0}.lego-action-grid .btn .ti{font-size:15px}';
    document.head.appendChild(st);
  }
  var grid = document.createElement('div');
  grid.className = 'lego-action-grid';
  if (opts.className) grid.classList.add(opts.className);
  (actions || []).forEach(function(action) {
    if (action instanceof HTMLElement) grid.appendChild(action);
  });
  return grid;
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
  var feedback = opts.feedback !== false;
  if (!document.getElementById('lego-player-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-player-styles';
    st.textContent = '.lego-player{font-size:15px;height:100%;display:flex;flex-direction:column;min-height:0}.lp-instr{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:14px}.lp-legend{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;font-size:11px;font-weight:500}.lp-sentence{font-family:var(--serif,serif);font-size:15px;line-height:2.2;color:var(--ink);margin-bottom:10px}.lp-input{border:none;border-bottom:2px solid var(--border);background:transparent;font-family:inherit;font-size:15px;text-align:center;min-width:70px;outline:none;padding:2px 4px}.lp-input.correct{border-color:var(--green);color:var(--green)}.lp-input.tilde{border-color:#DAA520;color:#DAA520}.lp-input.wrong{border-color:var(--red);color:var(--red)}.lp-fb{font-size:11px;margin-top:2px;min-height:13px}.lp-score{font-weight:700;margin-bottom:12px;color:var(--ink-soft);flex-shrink:0}.lp-text{font-family:var(--serif,serif);font-size:15px;line-height:1.8;color:var(--ink);margin-bottom:14px}.lp-mc-block{margin-bottom:16px}.lp-mc-q{display:flex;gap:8px;font-weight:600;margin-bottom:8px;align-items:flex-start}.lp-mc-num{background:var(--coral);color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}.lp-mc-opts{display:flex;flex-direction:column;gap:6px}.lp-mc-opt{text-align:left;padding:9px 12px;border:1px solid var(--border);border-radius:8px;background:var(--white,#fff);cursor:pointer;font:inherit;font-size:14px}.lp-mc-opt:disabled{cursor:default}.lp-mc-opt.correct{background:var(--green-lt);border-color:var(--green);color:var(--green)}.lp-mc-opt.wrong{background:var(--red-lt);border-color:var(--red);color:var(--red)}.lp-mc-fb{font-size:12px;margin-top:6px;min-height:14px}.lp-open{width:100%;border:1px solid var(--border);border-radius:8px;padding:8px;font:inherit;font-size:14px}.lp-body{flex:1 1 auto;min-height:0;overflow:auto}.lp-nofeedback .lp-input.correct,.lp-nofeedback .lp-input.wrong,.lp-nofeedback .lp-input.tilde{border-color:var(--border)!important;color:var(--ink)!important}.lp-nofeedback .lp-mc-opt.correct,.lp-nofeedback .lp-mc-opt.wrong{background:var(--white,#fff)!important;border-color:var(--border)!important;color:var(--ink)!important}.lp-nofeedback .lp-fb,.lp-nofeedback .lp-mc-fb,.lp-nofeedback .lp-legend{display:none!important}.lp-mc-opt.lp-picked{background:var(--sand);border-color:var(--coral);color:var(--ink)}.lp-input.lp-picked{border-color:var(--coral)}';
    document.head.appendChild(st);
  }
  var content = {};
  try { content = typeof activity.content === 'string' ? JSON.parse(activity.content) : (activity.content || {}); } catch(e) {}
  var type = activity.type || content.type || 'mc';
  var state = { answers: {}, score: function(){ return { correct:0, total:0 }; }, detail: function(){ return []; } };
  state.feedback = feedback;
  var root = document.createElement('div');
  root.className = 'lego-player';
  if (!feedback) root.classList.add('lp-nofeedback');
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
  if (!feedback) scoreEl.style.display = 'none';
  var lpBody = document.createElement('div'); lpBody.className = 'lp-body'; lpBody.appendChild(body); root.appendChild(lpBody);
  if (supported) refreshScore();

  if (mode === 'play' && supported) {
    var submit = document.createElement('button');
    submit.className = 'btn btn-coral';
    submit.style.marginTop = '16px'; submit.style.flexShrink = '0';
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

function _lpSplit(stim, qs){
  if (!document.getElementById('lego-split-styles')) {
    var sp = document.createElement('style'); sp.id = 'lego-split-styles';
    sp.textContent = '.lp-split-c{container-type:inline-size;height:100%;min-height:0}.lp-split{display:flex;flex-direction:column;gap:10px;height:100%;min-height:0}.lp-split-stim{flex:0 0 auto;overflow:auto;max-height:45%}.lp-split-qs{flex:1 1 auto;min-height:0;overflow:auto}@container (min-width:600px){.lp-split{flex-direction:row;align-items:stretch}.lp-split-stim{flex:0 0 42%;max-height:none}}';
    document.head.appendChild(sp);
  }
  var c = document.createElement('div'); c.className = 'lp-split-c';
  var box = document.createElement('div'); box.className = 'lp-split';
  var a = document.createElement('div'); a.className = 'lp-split-stim'; a.appendChild(stim);
  var b = document.createElement('div'); b.className = 'lp-split-qs'; b.appendChild(qs);
  box.appendChild(a); box.appendChild(b);
  c.appendChild(box);
  return c;
}
function _lpMC(content, activity, state, refreshScore) {
  var answers = state.answers;
  var wrap = document.createElement('div');
  var readingText = content.readingText || (activity && activity.reading_text) || '';
  var rt = null;
  if (readingText) { rt = document.createElement('div'); rt.className = 'lp-text'; rt.textContent = readingText; }
  var qBox = readingText ? document.createElement('div') : wrap;
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
          btns.forEach(function(bb, i){ bb.disabled = true; if (state.feedback === false) { if (i === oi) bb.classList.add('lp-picked'); } else if (i === correctIdx) bb.classList.add('correct'); else if (i === oi) bb.classList.add('wrong'); });
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
    qBox.appendChild(block);
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
  if (readingText) return _lpSplit(rt, qBox);
  return wrap;
}

function _lpAudioControls(content) {
  var audioUrl = content.audioUrl || content.audio_url || '';
  var youtubeUrl = content.youtubeUrl || content.youtube_url || '';
  var title = content.audioTitle || content.title || 'Audio';
  var isVideo = !!youtubeUrl || !!content.isVideo;
  if (youtubeUrl) {
    var ytId = (youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]{11})/) || [])[1] || '';
    if (ytId) {
      var yt = document.createElement('div');
      yt.style.cssText = 'width:100%;aspect-ratio:16/9;max-height:46vh;overflow:hidden;border-radius:10px;background:#000';
      var ifr = document.createElement('iframe');
      ifr.src = 'https://www.youtube.com/embed/' + ytId;
      ifr.style.cssText = 'width:100%;height:100%;border:0';
      ifr.allowFullscreen = true;
      yt.appendChild(ifr);
      return yt;
    }
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
      difr.setAttribute('allow', 'autoplay');
      if (isVideo) {
        dv.style.cssText = 'width:100%;aspect-ratio:16/9;max-height:46vh;overflow:hidden;border-radius:10px;background:#000';
        difr.style.cssText = 'width:100%;height:100%;border:0';
      } else {
        difr.style.cssText = 'width:100%;height:80px;border:0;border-radius:10px';
      }
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
        btns.forEach(function(bb, i){ bb.disabled = true; var bv = (i === 0); if (state.feedback === false) { if (bv === val) bb.classList.add('lp-picked'); } else if (bv === s.correct) bb.classList.add('correct'); else if (bv === val) bb.classList.add('wrong'); });
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
  var stim = _lpAudioControls(content);
  var qs = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Escucha el audio y responde.';
  qs.appendChild(instr);
  var subtype = content.audioType || content.subtype || 'comprehension';
  if (subtype === 'comprehension' || subtype === 'mc') {
    qs.appendChild(_lpMC(content, activity, state, refreshScore));
  } else if (subtype === 'fillblank') {
    qs.appendChild(_lpFillBlank(content, false, state, refreshScore));
  } else if (subtype === 'dictation') {
    var ta = document.createElement('textarea'); ta.className = 'lp-open'; ta.rows = 6; ta.placeholder = 'Escribe lo que escuchas...';
    ta.addEventListener('input', function(){ state.answers['open-0'] = { open: true, answer: ta.value.trim() }; });
    qs.appendChild(ta);
    state.score = function(){ return { correct: 0, total: 0 }; };
    state.detail = function(){ var a = state.answers['open-0'] || {}; return [{ key:'dictation', questionText: 'Dictado', answer: a.answer || '', isCorrect: null }]; };
  } else if (subtype === 'truefalse') {
    qs.appendChild(_lpTrueFalse(content, state, refreshScore));
  } else if (subtype === 'order') {
    qs.appendChild(_lpOrder(content, state, refreshScore));
  } else if (subtype === 'vocab') {
    qs.appendChild(_lpVocab(content, state, refreshScore));
  } else {
    qs.appendChild(LegoEmpty({ text: 'Subtipo de audio no soportado.' }));
    state.score = function(){ return { correct: 0, total: 0 }; };
    state.detail = function(){ return []; };
  }
  var isVideoLayout = !!(content.youtubeUrl || content.youtube_url) || !!content.isVideo;
  if (isVideoLayout) {
    if (!document.getElementById('lego-vsplit-styles')) {
      var vsp = document.createElement('style'); vsp.id = 'lego-vsplit-styles';
      vsp.textContent = '.lp-vsplit-c{container-type:inline-size;height:100%;min-height:0}.lp-vsplit{display:flex;flex-direction:column;gap:12px;height:100%;min-height:0}.lp-vsplit-stim{flex:0 0 auto}.lp-vsplit-qs{flex:1 1 auto;min-height:0;overflow:auto}@container (min-width:600px){.lp-vsplit{flex-direction:row;align-items:stretch}.lp-vsplit-stim{flex:0 0 55%;align-self:flex-start}.lp-vsplit-qs{height:100%}}';
      document.head.appendChild(vsp);
    }
    var vc = document.createElement('div'); vc.className = 'lp-vsplit-c';
    var vbox = document.createElement('div'); vbox.className = 'lp-vsplit';
    var va = document.createElement('div'); va.className = 'lp-vsplit-stim'; va.appendChild(stim);
    var vb = document.createElement('div'); vb.className = 'lp-vsplit-qs'; vb.appendChild(qs);
    vbox.appendChild(va); vbox.appendChild(vb);
    vc.appendChild(vbox);
    return vc;
  }
  return _lpSplit(stim, qs);
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
    dst.textContent = '.lp-dnd-bank{position:sticky;top:0;z-index:4;display:flex;flex-wrap:wrap;gap:6px;max-height:132px;overflow:auto;margin:0 0 16px;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--white,#fff);box-shadow:0 6px 16px rgba(0,0,0,.08);overscroll-behavior:contain}.lp-dnd-word{padding:6px 12px;border:1px solid var(--border);border-radius:8px;background:var(--white,#fff);cursor:grab;font-size:14px;user-select:none;touch-action:none}.lp-dnd-word.sel{outline:2px solid var(--orange)}.lp-dnd-word.used{opacity:.35;pointer-events:none}.lp-dnd-word.dragging{opacity:.4}.lp-dnd-ghost{position:fixed;z-index:9999;pointer-events:none;padding:6px 12px;border:1px solid var(--orange);border-radius:8px;background:var(--white,#fff);font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.18)}.lp-dnd-blank{display:inline-block;min-width:88px;border:1.5px dashed var(--border);border-radius:8px;text-align:center;cursor:pointer;margin:0 4px;padding:8px 12px;vertical-align:middle}.lp-dnd-blank.over{background:var(--orange-lt,#FDEEE8);outline:2px dashed var(--orange);outline-offset:2px}.lp-dnd-blank.filled-correct{border-color:var(--green);color:var(--green)}.lp-dnd-blank.filled-wrong{border-color:var(--red);color:var(--red)}';
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
function _lpReviewMixed(content, activity, saved){
  // Reusa los estilos .lp-mixed-* que _lpMixed inyecta (LegoPlayer construye el body de juego antes de sustituirlo por review).
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  if (content.instructions) { var gi = document.createElement('div'); gi.className = 'lp-instr'; gi.textContent = content.instructions; wrap.appendChild(gi); }
  var offset = 0;
  (content.sections||[]).forEach(function(sec, si){
    var secWrap = document.createElement('div'); secWrap.className = 'lp-mixed-section';
    if (sec.title) {
      var t = document.createElement('div'); t.className = 'lp-mixed-title';
      var n = document.createElement('span'); n.className = 'lp-mixed-num'; n.textContent = String(si+1);
      var tt = document.createElement('span'); tt.textContent = sec.title;
      t.appendChild(n); t.appendChild(tt); secWrap.appendChild(t);
    }
    var node, count = 0;
    if (sec.type === 'fill-blank' || sec.type === 'drag-drop') {
      (sec.sentences||[]).forEach(function(s){ if (s.hasBlank && s.blanks) count += s.blanks.length; });
      node = _lpReviewFillBlank(sec, saved.slice(offset, offset + count));
    } else if (sec.type === 'mc' || sec.type === 'truefalse') {
      count = (sec.questions||[]).length;
      node = _lpReviewMC(sec, activity, saved.slice(offset, offset + count));
    } else {
      node = LegoEmpty({ text: 'Seccion "' + sec.type + '" no soportada.' });
    }
    offset += count;
    secWrap.appendChild(node);
    wrap.appendChild(secWrap);
  });
  return wrap;
}
function _lpReviewDragDrop(content, saved){
  // Reusa los estilos .lp-dnd-* que _lpDragDrop inyecta (LegoPlayer construye el body de juego antes de sustituirlo por review).
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
        var box = document.createElement('span');
        box.className = 'lp-dnd-blank ' + (sv.isCorrect ? 'filled-correct' : 'filled-wrong');
        box.style.cursor = 'default';
        box.textContent = sv.answer || '(vacio)';
        line.appendChild(box);
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
function _lpReviewMatch(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr';
  instr.textContent = content.instructions || 'Revision de tus respuestas.';
  wrap.appendChild(instr);
  (content.pairs||[]).forEach(function(p, i){
    var sv = saved[i] || {};
    var row = document.createElement('div'); row.className = 'lp-sentence';
    row.style.cssText = 'display:flex;gap:8px;align-items:baseline;flex-wrap:wrap';
    var l = document.createElement('span'); l.style.fontWeight = '600'; l.textContent = p.left || '';
    var ar = document.createElement('span'); ar.style.color = 'var(--muted)'; ar.textContent = '->';
    var a = document.createElement('span');
    a.style.cssText = 'font-weight:600;color:' + (sv.isCorrect ? 'var(--green)' : 'var(--red)');
    a.textContent = sv.answer || '(vacio)';
    row.appendChild(l); row.appendChild(ar); row.appendChild(a);
    if (!sv.isCorrect && p.right) {
      var corr = document.createElement('span');
      corr.style.cssText = 'font-size:11px;color:var(--green)';
      corr.textContent = p.right;
      row.appendChild(corr);
    }
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpReviewTrueFalse(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  (content.statements||[]).forEach(function(s, si){
    var sv = saved[si] || {};
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var qrow = document.createElement('div'); qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(si+1);
    var txt = document.createElement('span'); txt.style.flex = '1'; txt.textContent = s.text || '';
    qrow.appendChild(num); qrow.appendChild(txt); block.appendChild(qrow);
    var a = document.createElement('div');
    a.style.cssText = 'font-size:14px;font-weight:600;color:' + (sv.isCorrect ? 'var(--green)' : 'var(--red)');
    a.textContent = sv.answer || '(vacio)';
    block.appendChild(a);
    if (!sv.isCorrect) {
      var corr = document.createElement('div');
      corr.style.cssText = 'font-size:11px;color:var(--green)';
      corr.textContent = s.correct ? 'Verdadero' : 'Falso';
      block.appendChild(corr);
    }
    wrap.appendChild(block);
  });
  return wrap;
}
function _lpReviewOrder(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  (content.events||[]).forEach(function(ev, i){
    var sv = saved[i] || {};
    var line = document.createElement('div'); line.className = 'lp-sentence';
    var a = document.createElement('span');
    a.style.cssText = 'font-weight:600;color:' + (sv.isCorrect ? 'var(--green)' : 'var(--red)');
    a.textContent = (i+1) + '. ' + (sv.answer || '(vacio)');
    line.appendChild(a);
    if (!sv.isCorrect && ev) {
      var corr = document.createElement('span');
      corr.style.cssText = 'font-size:11px;color:var(--green);margin:0 6px';
      corr.textContent = ev;
      line.appendChild(corr);
    }
    wrap.appendChild(line);
  });
  return wrap;
}
function _lpReviewVocab(content, saved){
  var wrap = document.createElement('div');
  var sv = saved[0] || {};
  var lbl = document.createElement('div'); lbl.className = 'lp-instr'; lbl.textContent = 'Vocabulario identificado';
  wrap.appendChild(lbl);
  var a = document.createElement('div');
  a.style.cssText = 'font-size:14px;font-weight:600;margin-bottom:10px';
  a.textContent = sv.answer || '(nada seleccionado)';
  wrap.appendChild(a);
  var heard = content.wordsHeard || [];
  if (heard.length) {
    var lbl2 = document.createElement('div'); lbl2.className = 'lp-instr'; lbl2.textContent = 'Palabras del audio';
    wrap.appendChild(lbl2);
    var h = document.createElement('div');
    h.style.cssText = 'font-size:13px;color:var(--green)';
    h.textContent = heard.join(', ');
    wrap.appendChild(h);
  }
  return wrap;
}
function _lpReviewAudio(content, activity, saved){
  var stim = _lpAudioControls(content);
  var qs = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr';
  instr.textContent = content.instructions || 'Revision de tus respuestas.';
  qs.appendChild(instr);
  var subtype = content.audioType || content.subtype || 'comprehension';
  if (subtype === 'comprehension' || subtype === 'mc') qs.appendChild(_lpReviewMC(content, activity, saved));
  else if (subtype === 'fillblank') qs.appendChild(_lpReviewFillBlank(content, saved));
  else if (subtype === 'truefalse') qs.appendChild(_lpReviewTrueFalse(content, saved));
  else if (subtype === 'order') qs.appendChild(_lpReviewOrder(content, saved));
  else if (subtype === 'vocab') qs.appendChild(_lpReviewVocab(content, saved));
  else qs.appendChild(_lpReviewList(saved));
  var isVideoLayout = !!(content.youtubeUrl || content.youtube_url) || !!content.isVideo;
  if (isVideoLayout) {
    var vc = document.createElement('div'); vc.className = 'lp-vsplit-c';
    var vbox = document.createElement('div'); vbox.className = 'lp-vsplit';
    var va = document.createElement('div'); va.className = 'lp-vsplit-stim'; va.appendChild(stim);
    var vb = document.createElement('div'); vb.className = 'lp-vsplit-qs'; vb.appendChild(qs);
    vbox.appendChild(va); vbox.appendChild(vb);
    vc.appendChild(vbox);
    return vc;
  }
  return _lpSplit(stim, qs);
}

function _lpReview(content, activity, type, saved){
  if (type === 'fill-blank' || type === 'dropdown') return _lpReviewFillBlank(content, saved);
  if (type === 'mc' || type === 'reading') return _lpReviewMC(content, activity, saved);
  if (type === 'audio') return _lpReviewAudio(content, activity, saved);
  if (type === 'match') return _lpReviewMatch(content, saved);
  if (type === 'drag-drop') return _lpReviewDragDrop(content, saved);
  if (type === 'mixed') return _lpReviewMixed(content, activity, saved);
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
